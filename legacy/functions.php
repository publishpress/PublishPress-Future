<?php

/**
 * This file provides access to all legacy functions that are now deprecated.
 */

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Migrations\V30000ActionArgsSchema;
use PublishPress\Future\Modules\Expirator\Migrations\V30000ReplaceFooterPlaceholders;
use PublishPress\Future\Modules\Expirator\Migrations\V30000WPCronToActionsScheduler;
use PublishPress\Future\Modules\Expirator\Migrations\V30001RestorePostMeta;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');


/**
 * Returns the post types that are supported.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_get_post_types()
{
    $post_types = get_post_types(array('public' => true));
    $post_types = array_merge(
        $post_types,
        get_post_types(array(
            'public' => false,
            'show_ui' => true,
            '_builtin' => false
        ))
    );

    // in case some post types should not be supported.
    $unset_post_types = apply_filters('postexpirator_unset_post_types', array('attachment'));
    if ($unset_post_types) {
        foreach ($unset_post_types as $type) {
            unset($post_types[$type]);
        }
    }

    return $post_types;
}

function postexpirator_set_default_meta_for_post($postId, $post, $update)
{
    if ($update) {
        return;
    }

    $container = Container::getInstance();
    $defaultDataModelFactory = $container->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
    $defaultDataModel = $defaultDataModelFactory->create($post->post_type);

    if (! $defaultDataModel->isAutoEnabled()) {
        return;
    }

    $defaultExpire = $defaultDataModel->getActionDateParts();

    if (empty($defaultExpire['ts'])) {
        return;
    }

    $opts = [
        'expireType' => $defaultDataModel->getAction(),
        'category' => $defaultDataModel->getTerms(),
        'categoryTaxonomy' => (string)$defaultDataModel->getTaxonomy(),
    ];

    do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $defaultExpire['ts'], $opts);
}

/**
 * PublishPress Future Activation/Upgrade
 *
 * @internal
 *
 * @access private
 */
function postexpirator_upgrade()
{
    $container = Container::getInstance();

    // Check for current version, if not exists, run activation
    $version = get_option('postexpiratorVersion');

    if ($version === false) {
        $container->get(ServicesAbstract::HOOKS)->doAction(V30000ActionArgsSchema::HOOK);
    } else {
        if (version_compare($version, '1.6.1') === -1) {
            update_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
        }

        if (version_compare($version, '2.0.0-rc1') === -1) {
            global $wpdb;

            // Schedule Events/Migrate Config
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
            $results = $wpdb->get_results(
                $wpdb->prepare(
                    'select post_id, meta_value from ' . $wpdb->postmeta . ' as postmeta, ' . $wpdb->posts . ' as posts where postmeta.post_id = posts.ID AND postmeta.meta_key = %s AND postmeta.meta_value >= %d',
                    'expiration-date',
                    time()
                )
            );

            foreach ($results as $result) {
                $opts = [];
                $posttype = get_post_type($result->post_id);
                if ($posttype === 'page') {
                    $opts['expireType'] = strtolower(get_option('expirationdateExpiredPageStatus', 'Draft'));
                } else {
                    $opts['expireType'] = strtolower(get_option('expirationdateExpiredPostStatus', 'Draft'));
                }

                $cat = get_post_meta($result->post_id, PostMetaAbstract::EXPIRATION_TERMS, true);
                if ((isset($cat) && ! empty($cat))) {
                    $opts['category'] = $cat;
                    $opts['expireType'] = 'category';
                }

                do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $result->post_id, $result->meta_value, $opts);
            }

            // update meta key to new format
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
            $wpdb->query(
                $wpdb->prepare(
                    "UPDATE $wpdb->postmeta SET meta_key = %s WHERE meta_key = %s",
                    PostMetaAbstract::EXPIRATION_TIMESTAMP,
                    'expiration-date'
                )
            );

            // migrate defaults
            $pagedefault = get_option('expirationdateExpiredPageStatus');
            $postdefault = get_option('expirationdateExpiredPostStatus');
            if ($pagedefault) {
                update_option('expirationdateDefaultsPage', array('expireType' => $pagedefault));
            }
            if ($postdefault) {
                update_option('expirationdateDefaultsPost', array('expireType' => $postdefault));
            }

            delete_option('expirationdateCronSchedule');
            delete_option('expirationdateAutoEnabled');
            delete_option('expirationdateExpiredPageStatus');
            delete_option('expirationdateExpiredPostStatus');
        }

        if (version_compare($version, '2.0.1') === -1) {
            // Forgot to do this in 2.0.0
            if (is_multisite()) {
                global $current_blog;
                wp_clear_scheduled_hook('expirationdate_delete_' . $current_blog->blog_id);
            } else {
                wp_clear_scheduled_hook('expirationdate_delete');
            }
        }

        if (version_compare($version, '3.0.0') === -1) {
            // TODO: DB migration should probably check a database version option and not the plugin version.
            $container->get(ServicesAbstract::HOOKS)->doAction(V30000ActionArgsSchema::HOOK);
            $container->get(ServicesAbstract::HOOKS)->doAction(V30000ReplaceFooterPlaceholders::HOOK);
            $container->get(ServicesAbstract::CRON)->enqueueAsyncAction(V30000WPCronToActionsScheduler::HOOK, [], true);
        }

        if (version_compare($version, '3.0.1') === -1) {
            if (! get_option('pp_future_V30001RestorePostMeta')) {
                $container->get(ServicesAbstract::CRON)->enqueueAsyncAction(V30001RestorePostMeta::HOOK, [], true);

                update_option('pp_future_V30001RestorePostMeta', true);
            }
        }
    }

    $currentVersion = $container->get(ServicesAbstract::PLUGIN_VERSION);
    if ($version !== $currentVersion) {
        update_option('postexpiratorVersion', $currentVersion);
    }
}

add_action('admin_init', 'postexpirator_upgrade', 99);
