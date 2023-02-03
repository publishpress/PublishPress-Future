<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class UnstickPost implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.unstick_post';

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
        return ExpirationActionsAbstract::STICK_POST;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        return __('Post has been removed from stickies list.', 'post-expirator');
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
        return $this->postModel->unstick();
    }
}
