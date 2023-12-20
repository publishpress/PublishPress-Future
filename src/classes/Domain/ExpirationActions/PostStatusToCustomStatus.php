<?php

namespace PublishPress\FuturePro\Domain\ExpirationActions;

use PublishPress\Future\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\FuturePro\Controllers\CustomStatusesController;
use PublishPress\FuturePro\Models\CustomStatusesModel;

use function __;

defined('ABSPATH') or die('No direct script access allowed.');

class PostStatusToCustomStatus implements ExpirationActionInterface
{
    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @var CustomStatusesModel
     */
    private $customStatusesModel;

    /**
     * @var array
     */
    private $log = [];

    public function __construct(CustomStatusesModel $customStatusesModel, ExpirablePostModel $postModel)
    {
        $this->postModel = $postModel;
        $this->customStatusesModel = $customStatusesModel;
    }

    private function getCustomStatusLabel()
    {
        $postStatus = $this->getPostStatusFromExpirationType();
        $postStatusObj = $this->customStatusesModel->getStatusObject($postStatus);

        if (! is_object($postStatusObj) || is_wp_error($postStatusObj)) {
            return $postStatus;
        }

        return $postStatusObj->label;
    }

    private function getPostStatusFromExpirationType()
    {
        $expirationType = $this->postModel->getExpirationType();

        return str_replace(CustomStatusesController::ACTION_PREFIX, '', $expirationType);
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getDynamicLabel();
    }

    /**
     * @return string
     */
    public function getNotificationText()
    {
        if (empty($this->log) || ! $this->log['success']) {
            return __('Post status didn\'t change.', 'post-expirator');
        }

        return sprintf(
            __('Post status has been successfully changed to "%s".', 'post-expirator'),
            $this->log['new_status']
        );
    }

    /**
     * @inheritDoc
     * @throws NonexistentPostException
     * @return bool
     */
    public function execute()
    {
        $newPostStatus = $this->getPostStatusFromExpirationType();

        $customStatuses = $this->customStatusesModel->getCustomStatuses();

        if (! isset($customStatuses[$newPostStatus])) {
            $this->log['success'] = false;

            return false;
        }

        $result = $this->postModel->setPostStatus($newPostStatus);

        $this->log = [
            'success' => $result,
            'new_status' => $newPostStatus,
        ];

        return $result;
    }

    public static function getLabel()
    {
        return __('Change post status to custom status', 'publishpress-future-pro');
    }

    /**
     * @inheritDoc
     */
    public function getDynamicLabel()
    {
        return sprintf(
            __('Change post status to %s', 'publishpress-future-pro'),
            $this->getCustomStatusLabel()
        );
    }
}
