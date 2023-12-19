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

    private function getPostTypeFromPostModel()
    {
        return $this->customStatusesModel->getStatusObject($this->postModel->getExpirationType());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        $postType = $this->getPostTypeFromPostModel();

        return $postType->name;
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
        $newPostStatus = str_replace(
            CustomStatusesController::ACTION_PREFIX,
            '',
            $this->postModel->getExpirationType()
        );

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
        $expirationType = $this->postModel->getExpirationType();
        $postStatus = str_replace(CustomStatusesController::ACTION_PREFIX, '', $expirationType);

        $postStatusObject = get_post_status_object($postStatus);

        return sprintf(
            __('Change post status to %s', 'publishpress-future-pro'),
            $postStatusObject->label
        );
    }
}
