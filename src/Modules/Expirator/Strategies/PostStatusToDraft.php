<?php

namespace PublishPressFuture\Modules\Expirator\Strategies;

use PublishPressFuture\Modules\Expirator\ExecutableInterface;

use function ray;

class PostStatusToDraft implements ExecutableInterface
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
