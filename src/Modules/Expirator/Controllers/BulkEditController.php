<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\Strategies\BulkEditAddOnly;
use PublishPress\Future\Modules\Expirator\Strategies\BulkEditChangeAdd;
use PublishPress\Future\Modules\Expirator\Strategies\BulkEditChangeOnly;
use PublishPress\Future\Modules\Expirator\Strategies\BulkEditRemoveOnly;

defined('ABSPATH') or die('Direct access not allowed.');

class BulkEditController implements InitializableInterface
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
            HooksAbstract::ACTION_ADMIN_INIT,
            [$this, 'processBulkEditUpdate']
        );
    }

    public function processBulkEditUpdate()
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        $doAction = isset($_GET['action']) ? $this->sanitization->sanitizeKey($_GET['action']) : '';

        if (
            ('edit' !== $doAction)
            || (! isset($_REQUEST['future_action_bulk_view']))
            || ($_REQUEST['future_action_bulk_view'] !== 'bulk-edit')
            || (! isset($_REQUEST['future_action_bulk_change_action']))
            || ($this->sanitization->sanitizeKey($_REQUEST['future_action_bulk_change_action']) === 'no-change')
        ) {
            return;
        }

        $currentUserModelFactory = $this->currentUserModelFactory;
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        $this->request->checkAdminReferer('bulk-posts');

        $this->saveBulkEditData();
        // phpcs:enable
    }

    private function updateScheduleForPostFromBulkEditData(ExpirablePostModel $postModel)
    {
        $opts = [
            'expireType' => $this->sanitization->sanitizeTextField($_REQUEST['future_action_bulk_action']),
            'category' => $this->sanitization->sanitizeTextField($_REQUEST['future_action_bulk_terms']),
            'categoryTaxonomy' => $this->sanitization->sanitizeTextField($_REQUEST['future_action_bulk_taxonomy']),
        ];

        if (! empty($opts['category'])) {
            // TODO: Use DI here.
            $taxonomiesModelFactory = Container::getInstance()->get(ServicesAbstract::TAXONOMIES_MODEL_FACTORY);
            $taxonomiesModel = $taxonomiesModelFactory();

            $opts['category'] = $taxonomiesModel->normalizeTermsCreatingIfNecessary(
                $opts['categoryTaxonomy'],
                explode(',', $opts['category'])
            );
        }

        if (empty($opts['categoryTaxonomy'])) {
            $opts['category'] = [];
        }

        $date = strtotime(sanitize_text_field($_REQUEST['future_action_bulk_date']));

        $this->hooks->doAction(
            HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION,
            $postModel->getPostId(),
            $date,
            $opts
        );
    }

    private function changeStrategyChangeOnly(ExpirablePostModel $postModel)
    {
        if ($postModel->isExpirationEnabled()) {
            $this->updateScheduleForPostFromBulkEditData($postModel);
        }
    }

    private function changeStrategyAddOnly(ExpirablePostModel $postModel)
    {
        if (! $postModel->isExpirationEnabled()) {
            $this->updateScheduleForPostFromBulkEditData($postModel);
        }
    }

    private function changeStrategyChangeAdd(ExpirablePostModel $postModel)
    {
        $this->updateScheduleForPostFromBulkEditData($postModel);
    }

    private function changeStrategyRemoveOnly(ExpirablePostModel $postModel)
    {
        if ($postModel->isExpirationEnabled()) {
            $this->hooks->doAction(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $postModel->getPostId());
        }
    }

    private function saveBulkEditData()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.InputNotValidated
        $changeStrategy = $this->sanitization->sanitizeKey($_REQUEST['future_action_bulk_change_action']);
        $validStrategies = ['change-only', 'add-only', 'change-add', 'remove-only'];

        if (! in_array($changeStrategy, $validStrategies)) {
            return;
        }

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.NonceVerification.Recommended
        $postIds = array_map('intval', (array)$_REQUEST['post']);

        if (empty($postIds)) {
            return;
        }

        $postModelFactory = $this->expirablePostModelFactory;

        foreach ($postIds as $postId) {
            $postId = (int)$postId;

            $postModel = $postModelFactory($postId);

            if (empty($postModel)) {
                continue;
            }

            switch ($changeStrategy) {
                case 'change-only':
                    $this->changeStrategyChangeOnly($postModel);
                    break;
                case 'add-only':
                    $this->changeStrategyAddOnly($postModel);
                    break;
                case 'change-add':
                    $this->changeStrategyChangeAdd($postModel);
                    break;
                case 'remove-only':
                    $this->changeStrategyRemoveOnly($postModel);
                    break;
            }
        }
    }
}
