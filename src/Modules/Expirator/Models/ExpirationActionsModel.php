<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Modules\Expirator\ExpirationActions\DeletePost;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategoryAdd;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategoryRemove;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategorySet;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToPrivate;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToTrash;
use PublishPressFuture\Modules\Expirator\ExpirationActions\StickPost;
use PublishPressFuture\Modules\Expirator\ExpirationActions\UnstickPost;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract;

class ExpirationActionsModel
{
    const ACTION_NAME_ATTRIBUTE = 'name';

    const ACTION_LABEL_ATTRIBUTE = 'label';

    /**
     * @var \PublishPressFuture\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $actions = [];

    /**
     * @var array
     */
    private $actionsAsOptions = [];

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    /**
     * @return string[]
     */
    public function getActions($postType = '')
    {
        if (! isset($this->actions[$postType])) {
            $actions = [
                ExpirationActionsAbstract::POST_STATUS_TO_DRAFT => PostStatusToDraft::getLabel(),
                ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE => PostStatusToPrivate::getLabel(),
                ExpirationActionsAbstract::POST_STATUS_TO_TRASH => PostStatusToTrash::getLabel(),
                ExpirationActionsAbstract::DELETE_POST => DeletePost::getLabel(),
                ExpirationActionsAbstract::STICK_POST => StickPost::getLabel(),
                ExpirationActionsAbstract::UNSTICK_POST => UnstickPost::getLabel(),
                ExpirationActionsAbstract::POST_CATEGORY_SET => PostCategorySet::getLabel(),
                ExpirationActionsAbstract::POST_CATEGORY_ADD => PostCategoryAdd::getLabel(),
                ExpirationActionsAbstract::POST_CATEGORY_REMOVE => PostCategoryRemove::getLabel(),
            ];

            $this->actions[$postType] = $this->hooks->applyFilters(
                HooksAbstract::FILTER_EXPIRATION_ACTIONS,
                $actions,
                $postType
            );
        }

        return $this->actions[$postType];
    }

    public function getActionsAsOptions($postType = '')
    {
        if (! isset($this->actionsAsOptions[$postType])) {
            $options = [];

            $actions = $this->getActions($postType);

            foreach ($actions as $name => $label) {
                $options[] = [
                    'value' => $name,
                    'label' => $label,
                ];
            }

            $this->actionsAsOptions[$postType] = $options;
        }

        return $this->actionsAsOptions[$postType];
    }

    public function getActionsAsOptionsForAllPostTypes()
    {
        $postTypes = array_values(postexpirator_get_post_types());

        $actions = [];

        foreach ($postTypes as $postType) {
            $actions[$postType] = $this->getActionsAsOptions($postType);
        }

        return $actions;
    }

    public function getLabelForAction($actionName)
    {
        $actions = $this->getActions();

        return $actions[$actionName] ?? '';
    }
}
