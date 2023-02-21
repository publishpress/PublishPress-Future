<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Controllers;

use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpirationHooksAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuturePro\Domain\ExpirationActions\PostStatusToCustomStatus;
use PublishPressFuturePro\Models\CustomStatusesModel;

use PublishPressFuturePro\Models\SettingsModel;

use function __;

class CustomStatusesController implements ModuleInterface
{
    public const ACTION_PREFIX = 'custom_status_';

    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var \PublishPressFuturePro\Models\CustomStatusesModel
     */
    private $modelCustomStatuses;

    /**
     * @var \PublishPressFuturePro\Models\SettingsModel
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
    public function filterExpirationActions(array $actions, string $postType = ''): array
    {
        $customStatuses = $this->modelCustomStatuses->getSelectedStatusesForPostTypeAsOptions($postType);

        foreach ($customStatuses as $status => $statusObject) {
            $actions[self::ACTION_PREFIX . $status] = __(
                'Custom status: ',
                'publishpress-future-pro'
            ) . $statusObject['label'];
        }

        return $actions;
    }

    public function filterExpirationActionFactory(
        $action,
        string $actionName,
        ExpirablePostModel $postModel
    ): ExpirationActionInterface {
        if (preg_match('/^' . self::ACTION_PREFIX . '/', $actionName)) {
            return new PostStatusToCustomStatus($this->modelCustomStatuses, $postModel);
        }

        return $action;
    }
}
