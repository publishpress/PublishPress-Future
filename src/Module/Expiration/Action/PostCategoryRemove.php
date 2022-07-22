<?php

namespace PublishPressFuture\Module\Expiration\Action;

use PublishPressFuture\Module\Expiration\ExecutableInterface;

class PostCategoryRemove implements ExecutableInterface
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
        \ray(__METHOD__);
    }
}
