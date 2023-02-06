<?php

namespace PublishPressFuturePro\Domain\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuturePro\Models\CustomStatusesModel;
use PublishPressFuturePro\Modules\CustomStatusesModule;

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
        return sprintf(
            __('Post status has been successfully changed to "%s".', 'post-expirator'),
            'draft'
        );
    }


    /**
     * @return array<string>
     */
    public function getExpirationLog(): array
    {
        return [];
    }

    /**
     * @inheritDoc
     * @throws NonexistentPostException
     */
    public function execute(): bool
    {
        $newPostStatus = str_replace(
            CustomStatusesModule::ACTION_PREFIX,
            '',
            $this->postModel->getExpirationType()
        );

        $customStatuses = $this->customStatusesModel->getCustomStatuses();

        if (! isset($customStatuses[$newPostStatus])) {
            return false;
        }

        return $this->postModel->setPostStatus($newPostStatus);
    }
}
