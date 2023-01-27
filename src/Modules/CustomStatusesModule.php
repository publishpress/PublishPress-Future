<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Modules;

use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpirationHooksAbstract;
use PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel;
use PublishPressFuturePro\Domain\ExpirationActions\PostStatusToCustomStatus;

use function __;

class CustomStatusesModule implements ModuleInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var \PublishPressFuturePro\Models\CustomStatusesModel
     */
    private $modelCustomStatuses;

    public function __construct(HooksFacade $hooks, $modelCustomStatuses)
    {
        $this->hooks = $hooks;
        $this->modelCustomStatuses = $modelCustomStatuses;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            ExpirationHooksAbstract::FILTER_EXPIRATION_ACTIONS,
            [$this, 'filterExpirationActions']
        );
    }

    public function filterExpirationActions($actions)
    {
        $customStatuses = $this->modelCustomStatuses->getCustomStatuses();

        foreach ($customStatuses as $status => $statusObject) {
            $actions[] = [
                ExpirationActionsModel::ACTION_NAME_ATTRIBUTE => $status,
                ExpirationActionsModel::ACTION_LABEL_ATTRIBUTE => __(
                        'Custom status: ',
                        'publishpress-future-pro'
                    ) . $statusObject->label,
                ExpirationActionsModel::ACTION_CLASS_ATTRIBUTE => PostStatusToCustomStatus::class
            ];
        }

        return $actions;
    }
}
