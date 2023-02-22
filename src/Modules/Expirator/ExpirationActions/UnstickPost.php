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
     * @var array
     */
    private $log = [];

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
        if (empty($this->log) || ! $this->log['success']) {
            return __('Post didn\'t change.', 'post-expirator');
        }

        return __('Post has been removed from stickies list.', 'post-expirator');
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $result = $this->postModel->unstick();

        $this->log['success'] = $result;

        return $result;
    }
}
