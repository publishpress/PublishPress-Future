<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostCacheInterface
{
    public function setup(): void;

    public function getCachedPermalink(int $postId): ?array;

    public function getCachedPosts(int $postId): ?array;
}
