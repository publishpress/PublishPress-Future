<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\ExpirationActions\DeletePost;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostCategoryAdd;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostCategoryRemove;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostCategoryRemoveAll;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostCategorySet;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostStatusToDraft;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostStatusToPrivate;
use PublishPress\Future\Modules\Expirator\ExpirationActions\PostStatusToTrash;
use PublishPress\Future\Modules\Expirator\ExpirationActions\StickPost;
use PublishPress\Future\Modules\Expirator\ExpirationActions\UnstickPost;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class ExpirationActionsModel
{
    const ACTION_NAME_ATTRIBUTE = 'name';

    const ACTION_LABEL_ATTRIBUTE = 'label';

    /**
     * @var \PublishPress\Future\Core\HookableInterface
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
                ExpirationActionsAbstract::POST_CATEGORY_SET => PostCategorySet::getLabel($postType),
                ExpirationActionsAbstract::POST_CATEGORY_ADD => PostCategoryAdd::getLabel($postType),
                ExpirationActionsAbstract::POST_CATEGORY_REMOVE => PostCategoryRemove::getLabel($postType),
                ExpirationActionsAbstract::POST_CATEGORY_REMOVE_ALL => PostCategoryRemoveAll::getLabel($postType),
            ];

            $this->actions[$postType] = $this->hooks->applyFilters(
                HooksAbstract::FILTER_EXPIRATION_ACTIONS,
                $actions,
                $postType
            );

            $this->actions[$postType] = $this->sortActions($this->actions[$postType]);
        }

        return $this->actions[$postType];
    }

    private function sortActions($actions)
    {
        $sortedActions = [];

        foreach ($actions as $name => $label) {
            $sortedActions[$name] = $label;
        }

        asort($sortedActions);

        return $sortedActions;
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
        $container = Container::getInstance();
        $postTypesModel = new PostTypesModel($container);

        $postTypes = array_values($postTypesModel->getPostTypes());

        $actions = [];

        foreach ($postTypes as $postType) {
            $actions[$postType] = $this->getActionsAsOptions($postType);
        }

        return $actions;
    }

    public function getLabelForAction($actionName, $postType = '')
    {
        $actions = $this->getActions($postType);

        return isset($actions[$actionName]) ? $actions[$actionName] : '';
    }
}
