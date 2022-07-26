<?php

namespace PublishPressFuture\Domain\PostExpiration\Strategies;

use PublishPressFuture\Domain\PostExpiration\Interfaces\ExecutableInterface;

use function ray;

class ExpireAddingPostCategory implements ExecutableInterface
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
