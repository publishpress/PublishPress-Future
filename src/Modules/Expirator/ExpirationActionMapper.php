<?php

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\ExpirationActions\DeletePost;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategoryAdd;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategoryRemove;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategorySet;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToPrivate;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToTrash;
use PublishPressFuture\Modules\Expirator\ExpirationActions\StickPost;
use PublishPressFuture\Modules\Expirator\ExpirationActions\UnstickPost;
use PublishPressFuture\Modules\Expirator\Interfaces\ActionMapperInterface;

class ExpirationActionMapper implements ActionMapperInterface
{
    /**
     * @param array
     */
    private $actionClassesMap;

    public function __construct()
    {
        $this->actionClassesMap = [
            ExpirationActionsAbstract::POST_STATUS_TO_DRAFT => PostStatusToDraft::class,
            ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE => PostStatusToPrivate::class,
            ExpirationActionsAbstract::POST_STATUS_TO_TRASH => PostStatusToTrash::class,
            ExpirationActionsAbstract::DELETE_POST => DeletePost::class,
            ExpirationActionsAbstract::STICK_POST => StickPost::class,
            ExpirationActionsAbstract::UNSTICK_POST => UnstickPost::class,
            ExpirationActionsAbstract::POST_CATEGORY_SET => PostCategorySet::class,
            ExpirationActionsAbstract::POST_CATEGORY_ADD => PostCategoryAdd::class,
            ExpirationActionsAbstract::POST_CATEGORY_REMOVE => PostCategoryRemove::class,
        ];
    }

    /**
     * @param string $actionName
     *
     * @return string
     *
     * @throws NonexistentPostException
     */
    public function map($actionName)
    {
        if (! isset($this->actionClassesMap[$actionName])) {
            throw new NonexistentPostException();
        }

        return $this->actionClassesMap[$actionName];
    }
}
