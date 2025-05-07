<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostCacheInterface
{
    public function setup(): void;

    /**
     * Retrieves the cached posts and permalinks for a given post ID.
     *
     * This method returns an array containing both before and after states of the post and its permalink.
     *
     * @param int $postId The ID of the post to retrieve cached data for.
     *
     * @return array|null The cached data or null if the cache does not exist.
     */
    public function getCacheForPostId(int $postId): ?array;
}
