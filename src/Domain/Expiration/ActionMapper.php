<?php

namespace PublishPressFuture\Domain\Expiration;

use PublishPressFuture\Domain\Expiration\Action\DeletePost;
use PublishPressFuture\Domain\Expiration\Action\PostCategoryAdd;
use PublishPressFuture\Domain\Expiration\Action\PostCategoryRemove;
use PublishPressFuture\Domain\Expiration\Action\PostCategorySet;
use PublishPressFuture\Domain\Expiration\Action\PostStatusToDraft;
use PublishPressFuture\Domain\Expiration\Action\PostStatusToPrivate;
use PublishPressFuture\Domain\Expiration\Action\PostStatusToTrash;
use PublishPressFuture\Domain\Expiration\Action\StickPost;
use PublishPressFuture\Domain\Expiration\Action\UnstickPost;
use PublishPressFuture\Domain\Expiration\Exception\UndefinedActionException;

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
