<?php

namespace PublishPressFuturePro\Domain\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuturePro\Controllers\CustomStatusesController;
use PublishPressFuturePro\Models\CustomStatusesModel;

use function __;

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

    public function __toString(): string
    {
        return ExpirationActionsAbstract::POST_STATUS_TO_DRAFT;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText(): string
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
     */
    public function execute(): bool
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
