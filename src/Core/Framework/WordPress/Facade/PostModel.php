<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\Framework\WordPress\Facade;

use WP_Post;

class PostModel
{
    /**
     * @var int
     */
    private $postId;
    /**
     * @var WP_Post
     */
    private $postInstance;

    /**
     * @var \PublishPressFuture\Modules\Debug\Debug
     */
    private $debug;

    public function __construct($postId, $debug)
    {
        $this->postId = (int)$postId;
        $this->debug = $debug;
    }

    /**
     * @param string $newPostStatus
     *
     * @return bool
     */
    public function setPostStatus($newPostStatus)
    {
        $post = $this->getPostInstance();

        $updated = $this->update(
            [
                'post_status' => $newPostStatus,
            ]
        );

        wp_transition_post_status($newPostStatus, $post->post_status, $post);

        return $updated;
    }

    /**
     * @param array $data
     *
     * @return bool
     */
    public function update($data)
    {
        $data = array_merge(
            ['ID' => $this->postId],
            $data
        );

        return \wp_update_post($data) > 0;
    }

    /**
     * @param string $metaKey
     * @param mixed $metaValue
     * @return false|int
     */
    public function addMeta($metaKey, $metaValue = null)
    {
        return add_post_meta($this->postId, $metaKey, $metaValue);
    }

    /**
     * @param string|array $metaKey
     * @param mixed $metaValue
     * @return void
     */
    public function updateMeta($metaKey, $metaValue = null)
    {
        if (! is_array($metaKey)) {
            $metaKey = [$metaKey => $metaValue];
        }

        $callback = function ($value, $key) {
            \update_post_meta(
                $this->postId,
                \sanitize_key($key),
                $value
            );
        };

        // TODO: Replace array_walk with foreach.
        array_walk($metaKey, $callback);
    }

    /**
     * @param string|array $metaKey
     * @return void
     */
    public function deleteMeta($metaKey)
    {
        if (! is_array($metaKey)) {
            $metaKey = [$metaKey];
        }

        $callback = function ($key) {
            \delete_post_meta(
                $this->postId,
                \sanitize_key($key)
            );
        };

        // TODO: Replace array_walk with foreach.
        array_walk($metaKey, $callback);
    }

    public function getMeta($metaKey, $single = false)
    {
        return get_post_meta($this->postId, $metaKey, $single);
    }

    /**
     * @return bool
     */
    public function postExists()
    {
        $instance = $this->getPostInstance();

        return is_object($instance);
    }

    /**
     * @return WP_Post
     */
    private function getPostInstance()
    {
        if (empty($this->postInstance)) {
            $this->postInstance = \get_post($this->postId);
        }

        return $this->postInstance;
    }

    public function getType()
    {
        return get_post_type($this->postId);
    }

    public function getTitle()
    {
        return get_the_title($this->postId);
    }

    public function getPermalink()
    {
        return get_post_permalink($this->postId);
    }
}
