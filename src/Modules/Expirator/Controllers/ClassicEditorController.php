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

class ClassicEditorController implements InitializableInterface
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
            CoreHooksAbstract::ACTION_ADD_META_BOX,
            [$this, 'registerClassicEditorMetabox'],
            10,
            2
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'processMetaboxUpdate']
        );
    }

    public function registerClassicEditorMetabox($columnName, $postType)
    {
        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $post_types = postexpirator_get_post_types();
        foreach ($post_types as $type) {
            $defaults = $settingsFacade->getPostTypeDefaults($type);

            // if settings are not configured, show the metabox by default only for posts and pages
            if (
                (
                    ! isset($defaults['activeMetaBox'])
                    && in_array($type, ['post', 'page'], true)
                )
                || (
                    is_array($defaults)
                    && (in_array((string)$defaults['activeMetaBox'], ['active', '1'], true))
                )
            ) {
                add_meta_box(
                    'expirationdatediv',
                    __('PublishPress Future', 'post-expirator'),
                    [$this, 'renderClassicEditorMetabox'],
                    $type,
                    'side',
                    'core',
                    array('__back_compat_meta_box' => PostExpirator_Facade::show_gutenberg_metabox())
                );
            }
        }
    }

    public function renderClassicEditorMetabox($post)
    {
        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($post->ID);

        $isEnabled = $postModel->isExpirationEnabled();

        $data = [];

        if ('auto-draft' === $post->post_status && ! $isEnabled) {
            $data = [
                'enabled' => false,
                'date' => 0,
                'action' => '',
                'terms' => [],
                'taxonomy' => ''
            ];
        } else {
            $data = [
                'enabled' => $postModel->isExpirationEnabled(),
                'date' => $postModel->getExpirationDateString(false),
                'action' => $postModel->getExpirationType(),
                'terms' => $postModel->getExpirationCategoryIDs(),
                'taxonomy' => $postModel->getExpirationTaxonomy()
            ];
        }

        PostExpirator_Display::getInstance()->render_template(
            'classic-editor', [
                'post' => $post,
                'enabled' => $data['enabled'],
                'action' => $data['action'],
                'date' => $data['date'],
                'terms' => $data['terms'],
                'taxonomy' => $data['taxonomy']
            ]
        );
    }

    public function processMetaboxUpdate($postId)
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

        if (empty($_POST['future_action_view']) || $_POST['future_action_view'] !== 'classic-editor') {
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
