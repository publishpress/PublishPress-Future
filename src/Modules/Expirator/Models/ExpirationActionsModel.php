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

    const ACTION_CLASS_ATTRIBUTE = 'class';

    /**
     * @var \PublishPressFuture\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $actions;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    /**
     * @return string[]
     */
    public function getActions()
    {
        if (empty($this->actions)) {
            $actions = [
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_STATUS_TO_DRAFT,
                    self::ACTION_LABEL_ATTRIBUTE => __('Draft', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => PostStatusToDraft::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE,
                    self::ACTION_LABEL_ATTRIBUTE => __('Private', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => PostStatusToPrivate::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_STATUS_TO_TRASH,
                    self::ACTION_LABEL_ATTRIBUTE => __('Trash', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => PostStatusToTrash::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::DELETE_POST,
                    self::ACTION_LABEL_ATTRIBUTE => __('Delete', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => DeletePost::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::STICK_POST,
                    self::ACTION_LABEL_ATTRIBUTE => __('Stick', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => StickPost::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::UNSTICK_POST,
                    self::ACTION_LABEL_ATTRIBUTE => __('Unstick', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => UnstickPost::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_CATEGORY_SET,
                    self::ACTION_LABEL_ATTRIBUTE => __('Taxonomy: Replace', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => PostCategorySet::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_CATEGORY_ADD,
                    self::ACTION_LABEL_ATTRIBUTE => __('Taxonomy: Add', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => PostCategoryAdd::class,
                ],
                [
                    self::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_CATEGORY_REMOVE,
                    self::ACTION_LABEL_ATTRIBUTE => __('Taxonomy: Remove', 'post-expirator'),
                    self::ACTION_CLASS_ATTRIBUTE => PostCategoryRemove::class,
                ],
            ];

            $this->actions = $this->hooks->applyFilters(
                HooksAbstract::FILTER_EXPIRATION_ACTIONS,
                $actions
            );
        }

        return $this->actions;
    }

    public function getActionsAsOptions()
    {
        $options = [];

        $actions = $this->getActions();

        foreach ($actions as $action) {
            $options[] = [
                'value' => $action[self::ACTION_NAME_ATTRIBUTE],
                'label' => $action[self::ACTION_LABEL_ATTRIBUTE],
            ];
        }

        return $options;
    }
}
