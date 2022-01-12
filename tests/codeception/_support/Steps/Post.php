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
        $this->havePostInDatabase(
            [
                'post_name' => sq($postSlug),
            ]
        );
    }

    /**
     * @When I am adding a new post
     */
    public function iAmAddingANewPost()
    {
        $this->amOnAdminPage('post-new.php');
    }

    /**
     * @When I am adding a new post with title :title
     */
    public function iAmAddingANewPostWithTitle($title)
    {
        $this->iAmAddingANewPost();
        $this->fillField('#title', sq($title));
    }

    /**
     * @Given I am editing post :postSlug
     * @When I am editing post :postSlug
     */
    public function iAmEditingPost($postSlug)
    {
        $postSlug = sq($postSlug);

        $args = [
            'name' => $postSlug,
            'post_type' => 'post',
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


    /**
     * @When I check the Enable Post Expiration checkbox
     */
    public function iCheckTheEnablePostExpirationCheckbox()
    {
        $this->checkOption('Enable Post Expiration');
    }

    /**
     * @When I uncheck the Enable Post Expiration checkbox
     */
    public function iUncheckTheEnablePostExpirationCheckbox()
    {
        $this->uncheckOption('Enable Post Expiration');
    }

    /**
     * @When I save the post
     */
    public function iSaveThePost()
    {
        $this->click('#publish');
    }

    /**
     * @When I refresh the page
     */
    public function iRefreshThePage()
    {
        $this->executeJs('location.reload()');
    }
}
