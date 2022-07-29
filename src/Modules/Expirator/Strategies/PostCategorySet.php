<?php

namespace PublishPressFuture\Modules\Expirator\Strategies;

use PublishPressFuture\Modules\Expirator\ExpirableActionInterface;

use function ray;

class PostCategorySet implements ExpirableActionInterface
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
