<?php

namespace PublishPressFuturePro\Domain\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuturePro\Controllers\CustomStatusesController;
use PublishPressFuturePro\Models\CustomStatusesModel;

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

    /**
     * @return string
     */
    public function __toString()
    {
        return ExpirationActionsAbstract::POST_STATUS_TO_DRAFT;
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
}
