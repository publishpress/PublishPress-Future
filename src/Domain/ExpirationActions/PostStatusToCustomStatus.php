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

    /**
     * @var ErrorFacade
     */
    private $error;

    /**
     * @param ExpirablePostModel $postModel
     * @param ErrorFacade $errorFacade
     */
    public function __construct($postModel, $errorFacade)
    {
        $this->postModel = $postModel;
        $this->error = $errorFacade;
    }

    public function __toString()
    {
        return ExpirationActionsAbstract::POST_STATUS_TO_DRAFT;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        return sprintf(
            __('Post status has been successfully changed to "%s".', 'post-expirator'),
            'draft'
        );
    }

    /**
     * @inheritDoc
     */
    public function getExpirationLog()
    {
        return [];
    }

    /**
     * @inheritDoc
     * @throws NonexistentPostException
     */
    public function execute()
    {
        return $this->postModel->setPostStatus($this->postModel->getExpirationType());
    }
}
