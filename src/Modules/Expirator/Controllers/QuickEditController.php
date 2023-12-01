<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Display;
use PostExpirator_Facade;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;

defined('ABSPATH') or die('Direct access not allowed.');

class QuickEditController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade
     */
    private $sanitization;

    /**
     * @var \Closure
     */
    private $currentUserModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\RequestFacade
     */
    private $request;

    /**
     * @param HookableInterface $hooksFacade
     * @param callable $expirablePostModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade $sanitization
     * @param \Closure $currentUserModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\RequestFacade $request
     */
    public function __construct(
        HookableInterface $hooksFacade,
        $expirablePostModelFactory,
        $sanitization,
        $currentUserModelFactory,
        $request
    ) {
        $this->hooks = $hooksFacade;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->sanitization = $sanitization;
        $this->currentUserModelFactory = $currentUserModelFactory;
        $this->request = $request;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_QUICK_EDIT_CUSTOM_BOX,
            [$this, 'registerQuickEditCustomBox'],
            10,
            2
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'processQuickEditUpdate']
        );
    }

    public function registerQuickEditCustomBox($columnName, $postType)
    {
        $facade = PostExpirator_Facade::getInstance();

        if (
            ($columnName !== 'expirationdate')
            || (! $facade->current_user_can_expire_posts())
        ) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $defaults = $settingsFacade->getPostTypeDefaults($postType);
        $taxonomy = isset($defaults['taxonomy']) ? $defaults['taxonomy'] : '';
        $label = '';

        // if settings have not been configured and this is the default post type
        if (empty($taxonomy) && 'post' === $postType) {
            $taxonomy = 'category';
        }

        if (! empty($taxonomy)) {
            $tax_object = get_taxonomy($taxonomy);
            $label = $tax_object ? $tax_object->label : '';
        }

        PostExpirator_Display::getInstance()->render_template('quick-edit', array(
            'post_type' => $postType,
            'taxonomy' => $taxonomy,
            'tax_label' => $label
        ));
    }

    public function processQuickEditUpdate($postId)
    {
        // Don't run if this is an auto save
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Don't update data if the function is called for saving revision.
        $posttype = get_post_type((int)$postId);
        if ($posttype === 'revision') {
            return;
        }

        // Do not process Bulk edit here. It is processed on the function "postexpirator_date_save_bulk_edit"
        if (isset($_GET['future_action_view']) && $_GET['future_action_view'] === 'bulk-edit') {
            return;
        }

        $currentUserModelFactory = Container::getInstance()->get(ServicesAbstract::CURRENT_USER_MODEL_FACTORY);
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        // Don't run if was triggered by block editor. It is processed on the method "ExpirationController::handleRestAPIInit".
        if (empty($_POST['future_action_view'])) {
            return;
        }


        check_ajax_referer('__future_action', '_future_action_nonce');

        // Classic editor, quick edit
        $shouldSchedule = isset($_POST['future_action_enabled']) && $_POST['future_action_enabled'] === '1';

        if ($shouldSchedule) {
            $opts = [
                'expireType' => sanitize_text_field($_POST['future_action_action']),
                'category' => sanitize_text_field($_POST['future_action_terms']),
                'categoryTaxonomy' => sanitize_text_field($_POST['future_action_taxonomy']),
            ];

            if (! empty($opts['category'])) {
                $taxonomiesModelFactory = Container::getInstance()->get(ServicesAbstract::TAXONOMIES_MODEL_FACTORY);
                $taxonomiesModel = $taxonomiesModelFactory();

                $opts['category'] = $taxonomiesModel->normalizeTermsCreatingIfNecessary(
                    $opts['categoryTaxonomy'],
                    explode(',', $opts['category'])
                );
            }

            $date = strtotime(sanitize_text_field($_POST['future_action_date']));

            do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $date, $opts);

            return;
        }

        do_action(ExpiratorHooks::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);
    }
}
