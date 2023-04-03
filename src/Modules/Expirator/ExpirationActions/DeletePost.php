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
            return sprintf(
                __('%s was not deleted.', 'post-expirator'),
                $this->postModel->getPostTypeSingularLabel()
            );
        }

        return sprintf(
            __('%s has been successfully deleted.', 'post-expirator'),
            $this->postModel->getPostTypeSingularLabel()
        );
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

    public static function getLabel(): string
    {
        return __('Delete', 'post-expirator');
    }
}
