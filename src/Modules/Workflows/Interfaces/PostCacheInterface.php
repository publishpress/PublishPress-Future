<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostCacheInterface
{
    public function setup(): void;

    public function getPermalink(int $postId): ?array;

    public function getCachedPosts(int $postId): ?array;
}
