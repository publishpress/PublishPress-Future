<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\Framework\WordPress\Facade;

class PostModelFactory
{
    /**
     * @var \PublishPressFuture\Modules\Debug\Debug
     */
    private $debug;

    public function __construct($debug)
    {
        $this->debug = $debug;
    }

    /**
     * @param $postId
     * @return \PublishPressFuture\Core\Framework\WordPress\Facade\PostModel
     */
    public function getPostModel($postId)
    {
        return new PostModel(
            $postId,
            $this->debug
        );
    }
}
