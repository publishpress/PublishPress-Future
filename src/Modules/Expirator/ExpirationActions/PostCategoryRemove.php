<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;

use function ray;

class PostCategoryRemove implements ExpirationActionInterface
{
    /**
     * @var int
     */
    private $postId;

    /**
     * @param int $postId
     */
    public function __construct($postId)
    {
        $this->postId = $postId;
    }

    public function execute()
    {
        ray(__METHOD__);
    }
}
