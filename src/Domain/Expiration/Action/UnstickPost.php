<?php

namespace PublishPressFuture\Domain\Expiration\Action;

use PublishPressFuture\Domain\Expiration\ExecutableInterface;

use function ray;

class UnstickPost implements ExecutableInterface
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
