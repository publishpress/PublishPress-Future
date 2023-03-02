<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

use PublishPressFuture\Core\HookableInterface;
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
                ExpirationActionsAbstract::POST_STATUS_TO_DRAFT => __('Draft', 'post-expirator'),
                ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE => __('Private', 'post-expirator'),
                ExpirationActionsAbstract::POST_STATUS_TO_TRASH => __('Trash', 'post-expirator'),
                ExpirationActionsAbstract::DELETE_POST => __('Delete', 'post-expirator'),
                ExpirationActionsAbstract::STICK_POST => __('Stick', 'post-expirator'),
                ExpirationActionsAbstract::UNSTICK_POST => __('Unstick', 'post-expirator'),
                ExpirationActionsAbstract::POST_CATEGORY_SET => __('Taxonomy: Replace', 'post-expirator'),
                ExpirationActionsAbstract::POST_CATEGORY_ADD => __('Taxonomy: Add', 'post-expirator'),
                ExpirationActionsAbstract::POST_CATEGORY_REMOVE => __('Taxonomy: Remove', 'post-expirator'),
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
}
