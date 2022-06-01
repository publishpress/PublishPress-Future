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
        return $this->havePostInDatabase(
            [
                'post_name' => sq($postSlug),
            ]
        );
    }

    /**
     * @Given posts :postSlugs exist
     */
    public function postsExist($postSlugs)
    {
        $postSlugs = explode(',', $postSlugs);
        $postSlugs = array_map('trim', $postSlugs);

        foreach ($postSlugs as $postSlug) {
            $this->postExists($postSlug);
        }
    }

    /**
     * @When I am adding a new post
     */
    public function iAmAddingANewPost()
    {
        $this->amOnAdminPage('post-new.php');
    }

    /**
     * @When I am on the list of posts
     */
    public function iAmOnListOfPosts()
    {
        $this->amOnAdminPage('edit.php');
    }

    /**
     * @When I am adding a new post with title :title
     */
    public function iAmAddingANewPostWithTitle($title)
    {
        $this->iAmAddingANewPost();
        $this->fillField('#title', sq($title));
    }

    private function getPostIdFromSlug($postSlug)
    {
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

        return $postId;
    }

    /**
     * @Given I am editing post :postSlug
     * @When I am editing post :postSlug
     */
    public function iAmEditingPost($postSlug)
    {
        $postId = $this->getPostIdFromSlug(sq($postSlug));

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

    /**
     * @Given post :postSlug has metadata :metadataKey as :metadataValue
     */
    public function postHasMetadata($postSlug, $metadataKey, $metadataValue)
    {
        $postId = $this->getPostIdFromSlug(sq($postSlug));

        $this->havePostmetaInDatabase($postId, $metadataKey, $metadataValue);
    }

    /**
     * @When I click on the quick edit action for :postSlug
     */
    public function iClickOnTheQuickEditActionFor($postSlug)
    {
        $postId = $this->getPostIdFromSlug(sq($postSlug));

        $this->moveMouseOver('#post-' . $postId, 60, 30);
        $this->click('#post-' . $postId . ' button.editinline');
    }

   /**
    * @Then I see the checkbox to enable post expiration
    */
    public function iSeeTheCheckboxToEnablePostExpiration()
    {
        $this->seeElement('fieldset.post-expirator-quickedit');
        $this->see('Enable Post Expiration', 'fieldset.post-expirator-quickedit label span');
    }
}
