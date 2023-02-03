<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class PostStatusToDraft implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.post_status_to_draft';

    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @param ExpirablePostModel $postModel
     */
    public function __construct($postModel)
    {
        $this->postModel = $postModel;
    }

    public function __toString()
    {
        return ExpirationActionsAbstract::POST_STATUS_TO_DRAFT;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        return sprintf(
            __('Post status has been successfully changed to "%s".', 'post-expirator'),
            'draft'
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
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function execute()
    {
        return $this->postModel->setPostStatus('draft');
    }
}
