<?php

namespace PublishPressFuture\Domain\PostExpiration;

use PublishPressFuture\Domain\PostExpiration\Exceptions\UndefinedActionException;
use PublishPressFuture\Domain\PostExpiration\Interfaces\ActionMapperInterface;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireAddingPostCategory;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireChangingPostStatusToDraft;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireChangingPostStatusToPrivate;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireChangingPostStatusToTrash;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireDeletingPost;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireRemovingPostCategory;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireSettingPostCategory;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireStickingPost;
use PublishPressFuture\Domain\PostExpiration\Strategies\ExpireUnstickingPost;

class ActionMapper implements ActionMapperInterface
{
    /**
     * @param array
     */
    private $actionClassesMap;

    public function __construct()
    {
        $this->actionClassesMap = [
            ActionsAbstract::POST_STATUS_TO_DRAFT => ExpireChangingPostStatusToDraft::class,
            ActionsAbstract::POST_STATUS_TO_PRIVATE => ExpireChangingPostStatusToPrivate::class,
            ActionsAbstract::POST_STATUS_TO_TRASH => ExpireChangingPostStatusToTrash::class,
            ActionsAbstract::DELETE_POST => ExpireDeletingPost::class,
            ActionsAbstract::STICK_POST => ExpireStickingPost::class,
            ActionsAbstract::UNSTICK_POST => ExpireUnstickingPost::class,
            ActionsAbstract::POST_CATEGORY_SET => ExpireSettingPostCategory::class,
            ActionsAbstract::POST_CATEGORY_ADD => ExpireAddingPostCategory::class,
            ActionsAbstract::POST_CATEGORY_REMOVE => ExpireRemovingPostCategory::class,
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
