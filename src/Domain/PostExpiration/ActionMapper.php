<?php

namespace PublishPressFuture\Domain\PostExpiration;

use PublishPressFuture\Domain\PostExpiration\Exceptions\UndefinedActionException;
use PublishPressFuture\Domain\PostExpiration\Interfaces\ActionMapperInterface;
use PublishPressFuture\Domain\PostExpiration\Strategies\PostCategoryAdd;
use PublishPressFuture\Domain\PostExpiration\Strategies\PostStatusToDraft;
use PublishPressFuture\Domain\PostExpiration\Strategies\PostStatusToPrivate;
use PublishPressFuture\Domain\PostExpiration\Strategies\PostStatusToTrash;
use PublishPressFuture\Domain\PostExpiration\Strategies\DeletePost;
use PublishPressFuture\Domain\PostExpiration\Strategies\PostCategoryRemove;
use PublishPressFuture\Domain\PostExpiration\Strategies\PostCategorySet;
use PublishPressFuture\Domain\PostExpiration\Strategies\StickPost;
use PublishPressFuture\Domain\PostExpiration\Strategies\UnstickPost;

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
