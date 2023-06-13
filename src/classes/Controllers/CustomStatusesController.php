<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpirationHooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\FuturePro\Domain\ExpirationActions\PostStatusToCustomStatus;
use PublishPress\FuturePro\Models\CustomStatusesModel;
use PublishPress\FuturePro\Models\SettingsModel;

use function __;

defined('ABSPATH') or die('No direct script access allowed.');

class CustomStatusesController implements ModuleInterface
{
    const ACTION_PREFIX = 'custom_status_';

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

    public function __construct(HooksFacade $hooks, CustomStatusesModel $modelCustomStatuses, SettingsModel $settingsModel)
    {
        $this->hooks = $hooks;
        $this->modelCustomStatuses = $modelCustomStatuses;
        $this->settingsModel = $settingsModel;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            ExpirationHooksAbstract::FILTER_EXPIRATION_ACTIONS,
            [$this, 'filterExpirationActions'],
            10,
            2
        );

        $this->hooks->addFilter(
            ExpirationHooksAbstract::FILTER_EXPIRATION_ACTION_FACTORY,
            [$this, 'filterExpirationActionFactory'],
            10,
            3
        );
    }

    /**
     * @param string[] $actions
     * @param string $postType
     * @return string[]
     */
    public function filterExpirationActions($actions, $postType = '')
    {
        $customStatuses = $this->modelCustomStatuses->getCustomStatusesAsOptions();

        if (empty($postType)) {
            $selectedCustomStatuses = array_map(function ($item) {
                return $item['value'];
            }, $customStatuses);
        } else {
            $selectedCustomStatuses = $this->settingsModel->getEnabledCustomStatusesForPostType($postType);
        }

        foreach ($customStatuses as $customStatus) {
            if (! empty($postType) && ! in_array($customStatus['value'], $selectedCustomStatuses)) {
                continue;
            }

            $actions[self::ACTION_PREFIX . $customStatus['value']] = esc_html__(
                'Change status to ',
                'publishpress-future-pro'
            ) . $customStatus['label'];
        }

        return $actions;
    }

    /**
     * @param $action
     * @param string $actionName
     * @param \PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel $postModel
     * @return \PublishPress\FuturePro\Domain\ExpirationActions\PostStatusToCustomStatus
     */
    public function filterExpirationActionFactory(
        $action,
        $actionName,
        ExpirablePostModel $postModel
    ) {
        if (preg_match('/^' . self::ACTION_PREFIX . '/', $actionName)) {
            return new PostStatusToCustomStatus($this->modelCustomStatuses, $postModel);
        }

        return $action;
    }
}
