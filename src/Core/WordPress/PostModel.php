<?php

namespace PublishPressFuture\Core\WordPress;

use WP_Post;

class PostModel
{
    /**
     * @var int
     */
    private $postId;

    public function __construct($postId)
    {
        $this->postId = (int)$postId;
    }

    /**
     * @var WP_Post
     */
    private $postInstance;

    /**
     * @return WP_Post
     */
    private function getPostInstance()
    {
        if (empty($this->postInstance)) {
            $this->postInstance = get_post($this->postId);
        }

        return $this->postInstance;
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

        return wp_update_post($data) > 0;
    }

    /**
     * @param string $newPostStatus
     *
     * @return bool
     */
    public function setPostStatus($newPostStatus)
    {
        return $this->update(
            [
                'post_status' => $newPostStatus,
            ]
        );
    }
}
