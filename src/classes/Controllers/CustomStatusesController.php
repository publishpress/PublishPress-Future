<?php

/**
 * Copyright (c) 2024 Ramble Ventures
 */

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpirationHooksAbstract;
use PublishPress\FuturePro\Models\CustomStatusesModel;
use PublishPress\FuturePro\Models\SettingsModel;
use PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel;

defined('ABSPATH') or die('No direct script access allowed.');

class CustomStatusesController implements ModuleInterface
{
    public const ACTION_PREFIX = 'custom_status_';

    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var \PublishPress\FuturePro\Models\CustomStatusesModel
     */
    private $modelCustomStatuses;

    /**
     * @var \PublishPress\FuturePro\Models\SettingsModel
     */
    private $settingsModel;

    /**
     * @var ExpirationActionsModel
     */
    private $expirationActionsModel;

    /**
     * @var \Closure
     */
    private $postModelFactory;

    public function __construct(
        HooksFacade $hooks,
        CustomStatusesModel $modelCustomStatuses,
        SettingsModel $settingsModel,
        \Closure $postModelFactory,
        ExpirationActionsModel $expirationActionsModel
    ) {
        $this->hooks = $hooks;
        $this->modelCustomStatuses = $modelCustomStatuses;
        $this->settingsModel = $settingsModel;
        $this->postModelFactory = $postModelFactory;
        $this->expirationActionsModel = $expirationActionsModel;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            ExpirationHooksAbstract::FILTER_EXPIRATION_STATUSES,
            [$this, 'filterExpirationStatuses'],
            10,
            2
        );

        $this->hooks->addFilter(
            ExpirationHooksAbstract::FILTER_PREPARE_POST_EXPIRATION_OPTS,
            [$this, 'preparePostExpirationOpts'],
            10,
            2
        );
    }

    /**
     * @param string[] $statuses
     * @param string $postType
     * @return string[]
     */
    public function filterExpirationStatuses($statuses, $postType = '')
    {
        $customStatuses = $this->modelCustomStatuses->getCustomStatuses();

        if (empty($postType)) {
            $selectedCustomStatuses = array_keys($customStatuses);
        } else {
            $selectedCustomStatuses = $this->settingsModel->getEnabledCustomStatusesForPostType($postType);
        }

        foreach ($customStatuses as $customStatus => $customStatusObj) {
            if (! empty($postType) && ! in_array($customStatus, $selectedCustomStatuses)) {
                continue;
            }

            $statuses[$customStatus] = $customStatusObj->label;
        }

        return $statuses;
    }

    public function preparePostExpirationOpts(array $opts, int $postId): array
    {
        // Add backward compatibility with the old custom status expiration type
        if (isset($opts['expireType']) && str_contains($opts['expireType'], self::ACTION_PREFIX)) {
            $customStatus = str_replace(self::ACTION_PREFIX, '', $opts['expireType']);

            $postModel = $this->postModelFactory->__invoke($postId);

            $opts['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $opts['newStatus'] = $customStatus;
            $opts['actionLabel'] = $this->expirationActionsModel->getLabelForAction(
                $opts['expireType'],
                $postModel->getPostType()
            );
        }

        return $opts;
    }
}
