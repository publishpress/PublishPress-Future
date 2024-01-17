<?php

namespace PublishPress\Future\Modules\Expirator\ExpirationActions;

use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;

defined('ABSPATH') or die('Direct access not allowed.');

class PostStatusToTrash implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.post_status_to_trash';

    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @var array
     */
    private $log = [];

    /**
     * @var string
     */
    private $oldPostStatus;

    /**
     * @param ExpirablePostModel $postModel
     */
    public function __construct($postModel)
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
        if (empty($this->log) || ! $this->log['success']) {
            return __('Status didn\'t change.', 'post-expirator');
        }

        $oldPostStatus = get_post_status_object($this->oldPostStatus);
        $newPostStatus = get_post_status_object('trash');

        return sprintf(
            __('Status has been successfully changed from "%s" to "%s".', 'post-expirator'),
            $oldPostStatus->label,
            $newPostStatus->label
        );
    }

    /**
     * @inheritDoc
     * @throws \PublishPress\Future\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function execute()
    {
        $this->oldPostStatus = $this->postModel->getPostStatus();

        $result = $this->postModel->trash();

        $this->log['success'] = $result;

        return $result;
    }

    /**
     * @return string
     */
    public static function getLabel(string $postType = ''): string
    {
        $newPostStatus = get_post_status_object('trash');

        return sprintf(
            __('Change status to %s', 'post-expirator'),
            $newPostStatus->label
        );
    }

    public function getDynamicLabel($postType = '')
    {
        return self::getLabel($postType);
    }
}
