<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Caches;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\PostCacheInterface;

use function get_permalink;

class PostCache implements PostCacheInterface
{
    private array $postCache = [];
    private array $permalinkCache = [];

    private HookableInterface $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(): void
    {
        $this->hooks->addAction(HooksAbstract::ACTION_PRE_POST_UPDATE, [$this, 'cachePermalink'], 15);
        $this->hooks->addAction(HooksAbstract::ACTION_POST_UPDATED, [$this, 'cachePosts'], 15, 3);
    }

    /**
     * Cache the permalink of the post when it is updated because
     * the post revolver will always return the new permalink of the post.
     * We use this to make sure the post before results the old permalink.
     */
    public function cachePermalink(int $postId): void
    {
        $this->permalinkCache[$postId] = [
            'postBefore' => get_permalink($postId),
            'postAfter' => null,
        ];
    }

    public function cachePosts(int $postId, \WP_Post $postAfter, \WP_Post $postBefore): void
    {
        $this->postCache[$postId] = [
            'postAfter' => $postAfter,
            'postBefore' => $postBefore,
        ];

        $this->permalinkCache[$postId]['postAfter'] = get_permalink($postId);
    }

    public function getCachedPermalink(int $postId): ?array
    {
        return $this->permalinkCache[$postId] ?? null;
    }

    public function getCachedPosts(int $postId): ?array
    {
        return $this->postCache[$postId] ?? null;
    }
}
