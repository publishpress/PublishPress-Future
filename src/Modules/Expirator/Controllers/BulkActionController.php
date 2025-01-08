<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;
use PublishPress\Future\Modules\Expirator\Models\CurrentUserModel;

defined('ABSPATH') or die('Direct access not allowed.');

class BulkActionController implements InitializableInterface
{
    public const BULK_ACTION_SYNC = 'sync_scheduler_with_post_meta';

    public const NOTICE_SUCCESS = 'publishpress-future-posts-synced';

    public const NOTICE_NO_POSTS_SELECTED = 'publishpress-future-no-posts-selected';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var NoticeFacade
     */
    private $notices;

    /**
     * @var CurrentUserModel
     */
    private $currentUserModel;

    /**
     * @param HookableInterface $hooksFacade
     * @param callable $expirablePostModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\NoticeFacade $notices
     * @param \Closure $currentUserModelFactory
     */
    public function __construct(
        HookableInterface $hooksFacade,
        $expirablePostModelFactory,
        $notices,
        \Closure $currentUserModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->notices = $notices;
        $this->currentUserModel = $currentUserModelFactory();
    }

    public function initialize()
    {
        if (! $this->currentUserModel->userCanExpirePosts()) {
            return;
        }

        $this->addHooks();
        $this->registerNotices();
    }

    private function addHooks()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_SYNC_SCHEDULER_WITH_POST_META,
            [$this, 'syncSchedulerWithPostMeta']
        );

        $container = \PublishPress\Future\Core\DI\Container::getInstance();
        $postTypes = new PostTypesModel($container);
        $activatedPostTypes = $postTypes->getActivatedPostTypes();

        foreach ($activatedPostTypes as $postType) {
            $this->hooks->addAction(
                'bulk_actions-edit-' . $postType,
                [$this, 'filterBulkActions']
            );
        }
    }

    private function registerNotices()
    {
        $this->notices->registerErrorNotice(
            self::NOTICE_NO_POSTS_SELECTED,
            __('No posts selected. Unable to sync Future Actions.', 'post-expirator')
        );

        $this->notices->registerSuccessNotice(
            self::NOTICE_SUCCESS,
            __('Future Actions successfully synced with Post Metadata.', 'post-expirator')
        );
    }

    public function filterBulkActions($actions)
    {
        $postType = get_post_type();
        $displayTheOption = $this->hooks->applyFilters(HooksAbstract::FILTER_DISPLAY_BULK_ACTION_SYNC, false, $postType);

        if ($displayTheOption) {
            $actions[self::BULK_ACTION_SYNC] = __('Update Future Actions from Post Metadata', 'post-expirator');
        }

        return $actions;
    }

    private function getSelectedPostsFromRequest(): array
    {
        return array_filter(
            $_REQUEST['post'] ?? [], // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            'intval'
        );
    }

    public function syncSchedulerWithPostMeta()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (! isset($_REQUEST['action']) || $_REQUEST['action'] !== self::BULK_ACTION_SYNC) {
            return;
        }

        $postIds = $this->getSelectedPostsFromRequest();

        if (empty($postIds)) {
            $this->notices->redirectShowingNotice(self::NOTICE_NO_POSTS_SELECTED);
        }

        $expirablePostModelFactory = $this->expirablePostModelFactory;
        foreach ($postIds as $postId) {
            $postModel = $expirablePostModelFactory($postId);

            $postModel->syncScheduleWithPostMeta();
        }

        $this->notices->redirectShowingNotice(self::NOTICE_SUCCESS);
    }
}
