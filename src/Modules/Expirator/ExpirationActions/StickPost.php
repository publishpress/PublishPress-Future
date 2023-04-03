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
            return sprintf(
                __('%s didn\'t change.', 'post-expirator'),
                $this->postModel->getPostTypeSingularLabel()
            );
        }

        return sprintf(
            __('%s has been added to stickies list.', 'post-expirator'),
            $this->postModel->getPostTypeSingularLabel()
        );
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

    public static function getLabel(): string
    {
        return __('Stick', 'post-expirator');
    }
}
