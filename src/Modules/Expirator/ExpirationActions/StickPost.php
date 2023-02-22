<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class StickPost implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.stick_post';

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

        return __('Post has been added to stickies list.', 'post-expirator');
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $result = $this->postModel->stick();

        $this->log['success'] = $result;

        return $result;
    }
}
