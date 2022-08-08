<?php

namespace PublishPressFuture\Modules\Expirator\Actions;

use PublishPressFuture\Core\Framework\WordPress\Facade\PostModel;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirableActionInterface;

class PostStatusToDraft implements ExpirableActionInterface
{
    const EXPIRATION_TYPE = 'draft';

    /**
     * @var int
     */
    private $postId;

    /**
     * @var PostModel
     */
    private $model;

    /**
     * @var \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory
     */
    private $postModelFactory;

    /**
     * @var \PublishPressFuture\Modules\Debug\Debug
     */
    private $debug;

    /**
     * @var array
     */
    private $expirationData;

    /**
     * @param int $postId
     * @param \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory $postModelFactory
     * @param \PublishPressFuture\Modules\Debug\Debug $debug
     * @param array $expirationData
     */
    public function __construct($postId, $postModelFactory, $debug, $expirationData)
    {
        $this->postId = $postId;
        $this->postModelFactory = $postModelFactory;
        $this->debug = $debug;
        $this->expirationData = $expirationData;

        $this->model = $this->getPostModel();
    }

    private function getPostModel()
    {
        return $this->postModelFactory->getPostModel($this->postId);
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        return sprintf(
            __(
                '%1$s (%2$s) has expired at %3$s. Post status has been successfully changed to "%4$s".',
                'post-expirator'
            ),
            '##POSTTITLE##',
            '##POSTLINK##',
            '##EXPIRATIONDATE##',
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
     */
    public function execute()
    {
        return $this->model->setPostStatus('draft');
    }
}
