<?php

namespace PublishPressFuture\Modules\PostExpirator;

use PublishPressFuture\Modules\PostExpirator\Exceptions\UndefinedActionException;
use PublishPressFuture\Modules\PostExpirator\Interfaces\ActionMapperInterface;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostCategoryAdd;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostStatusToDraft;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostStatusToPrivate;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostStatusToTrash;
use PublishPressFuture\Modules\PostExpirator\Strategies\DeletePost;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostCategoryRemove;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostCategorySet;
use PublishPressFuture\Modules\PostExpirator\Strategies\StickPost;
use PublishPressFuture\Modules\PostExpirator\Strategies\UnstickPost;

class ActionMapper implements ActionMapperInterface
{
    /**
     * @param array
     */
    private $actionClassesMap;

    public function __construct()
    {
        $this->actionClassesMap = [
            ActionsAbstract::POST_STATUS_TO_DRAFT => PostStatusToDraft::class,
            ActionsAbstract::POST_STATUS_TO_PRIVATE => PostStatusToPrivate::class,
            ActionsAbstract::POST_STATUS_TO_TRASH => PostStatusToTrash::class,
            ActionsAbstract::DELETE_POST => DeletePost::class,
            ActionsAbstract::STICK_POST => StickPost::class,
            ActionsAbstract::UNSTICK_POST => UnstickPost::class,
            ActionsAbstract::POST_CATEGORY_SET => PostCategorySet::class,
            ActionsAbstract::POST_CATEGORY_ADD => PostCategoryAdd::class,
            ActionsAbstract::POST_CATEGORY_REMOVE => PostCategoryRemove::class,
        ];
    }

    /**
     * @param string $actionName
     *
     * @return string
     *
     * @throws UndefinedActionException
     */
    public function map($actionName)
    {
        if (! isset($this->actionClassesMap[$actionName])) {
            throw new UndefinedActionException();
        }

        return $this->actionClassesMap[$actionName];
    }
}
