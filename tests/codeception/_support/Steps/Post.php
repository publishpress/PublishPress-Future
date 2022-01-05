<?php

namespace Steps;

use function sq;

trait Post
{
    /**
     * @Given post :postSlug exists
     */
    public function postExists($postSlug)
    {
        $this->factory('Creating new post')->post->create(
            [
                'post_name' => sq($postSlug),
            ]
        );
    }

    /**
     * @Given I am editing post :postSlug
     */
    public function iAmEditingPost($postSlug)
    {
        $postSlug = sq($postSlug);

        $args = [
            'name' => $postSlug,
            'post_type' => 'post',
            'post_status' => 'publish',
            'numberposts' => 1
        ];

        $postId = null;
        $posts = get_posts($args);
        if (! empty($posts)) {
            $postId = $posts[0]->ID;
        }

        if (! empty($postId)) {
            $this->amOnAdminPage("post.php?post=$postId&action=edit");
        }
    }

    /**
     * @Then I see :text
     */
    public function iSeeText($text)
    {
        $this->see($text);
    }
}
