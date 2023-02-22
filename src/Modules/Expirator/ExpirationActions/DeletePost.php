<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class DeletePost implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.delete_post';

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
        return ExpirationActionsAbstract::DELETE_POST;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        if (empty($this->log) || ! $this->log['success']) {
            return __('Post was not deleted.', 'post-expirator');
        }

        return __('Post has been successfully deleted.', 'post-expirator');
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $result = $this->postModel->delete();

        $this->log['success'] = $result;

        return $result;
    }
}
