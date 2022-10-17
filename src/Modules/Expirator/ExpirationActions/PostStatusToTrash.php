<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;

class PostStatusToTrash implements ExpirationActionInterface
{
    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @param ExpirablePostModel $postModel
     * @param \PublishPressFuture\Framework\WordPress\Facade\ErrorFacade $errorFacade
     */
    public function __construct($postModel, $errorFacade)
    {
        $this->postModel = $postModel;
    }

    public function __toString()
    {
        return ExpirationActionsAbstract::POST_STATUS_TO_TRASH;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        return sprintf(
            __('Post status has been successfully changed to "%s".', 'post-expirator'),
            'trash'
        );
    }

    /**
     * @inheritDoc
     */
    public function getExpirationLog()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        return $this->postModel->setPostStatus('trash');
    }
}
