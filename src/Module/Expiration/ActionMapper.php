<?php

namespace PublishPressFuture\Module\Expiration;

use PublishPressFuture\Module\Expiration\Action\DeletePost;
use PublishPressFuture\Module\Expiration\Action\PostCategoryAdd;
use PublishPressFuture\Module\Expiration\Action\PostCategoryRemove;
use PublishPressFuture\Module\Expiration\Action\PostCategorySet;
use PublishPressFuture\Module\Expiration\Action\PostStatusToDraft;
use PublishPressFuture\Module\Expiration\Action\PostStatusToPrivate;
use PublishPressFuture\Module\Expiration\Action\PostStatusToTrash;
use PublishPressFuture\Module\Expiration\Action\StickPost;
use PublishPressFuture\Module\Expiration\Action\UnstickPost;
use PublishPressFuture\Module\Expiration\Exception\UndefinedActionException;

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
