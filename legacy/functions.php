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
