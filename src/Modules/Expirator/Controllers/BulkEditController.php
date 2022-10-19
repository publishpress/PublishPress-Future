<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Modules\Expirator\HooksAbstract;

class BulkEditController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var callable
     */
    private $expirablePostModelFactory;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\SanitizationFacade
     */
    private $sanitization;

    /**
     * @var callable
     */
    private $currentUserModelFactory;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\RequestFacade
     */
    private $request;

    /**
     * @param HookableInterface $hooksFacade
     * @param callable $expirablePostModelFactory
     * @param \PublishPressFuture\Framework\WordPress\Facade\SanitizationFacade $sanitization
     * @param callable $currentUserModelFactory
     * @param \PublishPressFuture\Framework\WordPress\Facade\RequestFacade $request
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
            HooksAbstract::ACTION_ADMIN_INIT,
            [$this, 'onAdminInit']
        );
    }

    public function onAdminInit()
    {
        $doAction = isset($_GET['action']) ? $this->sanitization->sanitizeKey($_GET['action']) : '';
        if ('edit' !== $doAction) {
            return;
        }

        if (! isset($_REQUEST['postexpirator_view'])) {
            return;
        }

        if ($_REQUEST['postexpirator_view'] !== 'bulk-edit') {
            return;
        }

        if (! isset($_REQUEST['expirationdate_status'])) {
            return;
        }

        if ($this->sanitization->sanitizeKey($_REQUEST['expirationdate_status']) === 'no-change') {
            return;
        }

        $currentUserModelFactory = $this->currentUserModelFactory;
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        $this->request->checkAdminReferer('bulk-posts');

        $this->saveBulkEditData();
    }

    private function saveBulkEditData()
    {
        $status = $this->sanitization->sanitizeKey($_REQUEST['expirationdate_status']);
        $validStatuses = ['change-only', 'add-only', 'change-add', 'remove-only'];

        if (! in_array($status, $validStatuses)) {
            return;
        }

        $postIds = array_map('intval', (array)$_REQUEST['post']);

        if (empty($postIds)) {
            return;
        }

        // Post model for the first post
        $postModelFactory = $this->expirablePostModelFactory;
        $postModel = $postModelFactory($postIds[0]);


    }
}
