<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpirationHooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Settings\HooksAbstract;
use PublishPress\FuturePro\Domain\ExpirationActions\PostStatusToCustomStatus;
use PublishPress\FuturePro\Models\CustomStatusesModel;
use PublishPress\FuturePro\Models\SettingsModel;

use function __;

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

    public function __construct(
        HooksFacade $hooks,
        CustomStatusesModel $modelCustomStatuses,
        SettingsModel $settingsModel
    ) {
        $this->hooks = $hooks;
        $this->modelCustomStatuses = $modelCustomStatuses;
        $this->settingsModel = $settingsModel;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            ExpirationHooksAbstract::FILTER_EXPIRATION_STATUSES,
            [$this, 'filterExpirationStatuses'],
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
}
