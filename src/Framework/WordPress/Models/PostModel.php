<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Models;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
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
     * @var \Closure
     */
    protected $termModelFactory;

    /**
     * @param int|\WP_Post $post
     * @param \Closure $termModelFactory
     */
    public function __construct($post, $termModelFactory)
    {
        if (is_object($post)) {
            $this->postInstance = $post;
            $this->postId = $post->ID;
        }

        if (is_numeric($post)) {
            $this->postId = (int)$post;
        }

        $this->termModelFactory = $termModelFactory;
    }

    /**
     * @param string $newPostStatus
     *
     * @return bool
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function setPostStatus($newPostStatus)
    {
        $post = $this->getPostInstance();

        return $this->update(
            [
                'post_status' => $newPostStatus,
            ]
        );
    }

    /**
     * @param array $data
     *
     * @return bool
     */
    public function update($data)
    {
        $data = array_merge(
            ['ID' => $this->getPostId()],
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
        return add_post_meta($this->getPostId(), $metaKey, $metaValue);
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
                $this->getPostId(),
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
                $this->getPostId(),
                \sanitize_key($key)
            );
        };

        // TODO: Replace array_walk with foreach.
        array_walk($metaKey, $callback);
    }

    public function getMeta($metaKey, $single = false)
    {
        return get_post_meta($this->getPostId(), $metaKey, $single);
    }

    /**
     * @return bool
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function postExists()
    {
        $instance = $this->getPostInstance();

        return is_object($instance);
    }

    /**
     * @return WP_Post
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    private function getPostInstance()
    {
        if (empty($this->postInstance)) {
            $this->postInstance = \get_post($this->getPostId());

            if (! is_object($this->postInstance) || is_wp_error($this->postInstance)) {
                throw new NonexistentPostException();
            }
        }

        return $this->postInstance;
    }

    public function getPostType()
    {
        return get_post_type($this->getPostId());
    }

    public function getTitle()
    {
        return get_the_title($this->getPostId());
    }

    public function getPermalink()
    {
        return get_post_permalink($this->getPostId());
    }

    public function getPostId()
    {
        return $this->postId;
    }

    public function getTerms($taxonomy = 'post_tag', $args = [])
    {
        $terms = wp_get_post_terms($this->getPostId(), $taxonomy, $args);
        $termModelFactory = $this->termModelFactory;

        foreach ($terms as &$term) {
            $term = $termModelFactory($term);
        }

        return $terms;
    }

    public function getTermNames($taxonomy = 'post_tag', $args = [])
    {
        $terms = $this->getTerms($taxonomy, $args);

        foreach ($terms as &$term) {
            $term = $term->getName();
        }

        return $terms;
    }

    public function getTermIDs($taxonomy = 'post_tag', $args = [])
    {
        $terms = $this->getTerms($taxonomy, $args);

        foreach ($terms as &$term) {
            $term = $term->getTermID();
        }

        return $terms;
    }

    public function appendTerms($termIDs, $taxonomy)
    {
        return wp_set_object_terms($this->getPostId(), $termIDs, $taxonomy, true);
    }

    public function setTerms($termIDs, $taxonomy)
    {
        return wp_set_object_terms($this->getPostId(), $termIDs, $taxonomy, false);
    }

    public function delete()
    {
        return wp_delete_post($this->getPostId()) !== false;
    }

    public function stick()
    {
        stick_post($this->getPostId());

        return true;
    }

    public function unstick()
    {
        unstick_post($this->getPostId());

        return true;
    }
}
