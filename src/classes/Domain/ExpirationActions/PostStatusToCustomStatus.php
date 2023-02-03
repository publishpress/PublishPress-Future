<?php

namespace PublishPressFuturePro\Domain\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

use function __;

class PostStatusToCustomStatus implements ExpirationActionInterface
{
    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    public function __construct(ExpirablePostModel $postModel, ErrorFacade $errorFacade)
    {
        $this->postModel = $postModel;
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
        return $this->postModel->setPostStatus($this->postModel->getExpirationType());
    }
}
