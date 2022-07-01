<?php

namespace Steps;

use PostExpirator_Util;
use DateTime;
use Exception;

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
                'post_title' => sq($postSlug),
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
     * @When I am adding a new :postType post
     */
    public function iAmAddingANewCustomPost($postType)
    {
        $this->amOnAdminPage('post-new.php?post_type=' . $postType);
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

        if (empty($posts)) {
            throw new Exception("Post not found with slug $postSlug");
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
     * @Given I check the Enable Post Expiration checkbox
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
        $this->executeJs('document.getElementById(\'publish\').scrollIntoView()');
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

    /**
     * @When I bulk edit the posts :postSlugs
     */
    public function iBulkEditThePosts($postSlugs)
    {
        $postSlugs = explode(',', $postSlugs);
        $postSlugs = array_map('trim', $postSlugs);

        foreach ($postSlugs as $postSlug) {
            $postId = $this->getPostIdFromSlug(sq($postSlug));

            $this->checkOption('#cb-select-' . $postId);
        }

        $this->selectOption('#bulk-action-selector-top', 'edit');
        $this->click('#doaction');
    }

    /**
     * @Then I see the fields to change post expiration on bulk edit panel
     */
    public function iSeeTheFieldsToChangePostExpirationOnBulkEditPanel()
    {
        $this->seeElement('.post-expirator-quickedit [name="expirationdate_status"]');
    }

   /**
    * @When I set the expiration option to Change on posts
    */
    public function iSetTheExpirationOptionToChangeOnPosts()
    {
        $this->selectOption('select[name="expirationdate_status"]', 'change-only');
    }

    /**
    * @When I set the expiration option to Add to posts
    */
    public function iSetTheExpirationOptionToAddToPosts()
    {
        $this->selectOption('select[name="expirationdate_status"]', 'add-only');
    }

    /**
    * @When I set the expiration option to Change and Add to posts
    */
    public function iSetTheExpirationOptionToChangeAndAddToPosts()
    {
        $this->selectOption('select[name="expirationdate_status"]', 'change-add');
    }

    /**
    * @When I set the expiration option to Remove from posts
    */
    public function iSetTheExpirationOptionToRemoveFromPosts()
    {
        $this->selectOption('select[name="expirationdate_status"]', 'remove-only');
    }

   /**
    * @When I set the day of expiration to tomorrow at noon
    */
    public function iSetTheDayOfExpirationToTomorrow()
    {
        $tomorrowDate = $this->getTomorrowDateAtNoon();

        $this->selectOption('select[name="expirationdate_month"]', $tomorrowDate->format('m'));
        $this->fillField('input[name="expirationdate_day"]', $tomorrowDate->format('d'));
        $this->fillField('input[name="expirationdate_year"]', $tomorrowDate->format('Y'));
        $this->fillField('input[name="expirationdate_hour"]', $tomorrowDate->format('h'));
        $this->fillField('input[name="expirationdate_minute"]', $tomorrowDate->format('i'));
    }

    /**
     * @When I set the day of expiration to tomorrow at noon on classic editor
     *
     * @return void
     */
    public function iSetTheDayOfExpirationToTomorrowOnClassicEditor()
    {
        $tomorrowDate = $this->getTomorrowDateAtNoon();

        $this->selectOption('select[name="expirationdate_month"]', $tomorrowDate->format('m'));
        $this->fillField('input[name="expirationdate_day"]', $tomorrowDate->format('d'));
        $this->selectOption('select[name="expirationdate_year"]', $tomorrowDate->format('Y'));
        $this->selectOption('select[name="expirationdate_hour"]', $tomorrowDate->format('h'));
        $this->fillField('input[name="expirationdate_minute"]', $tomorrowDate->format('i'));
    }

   /**
    * @When I click on Update
    */
    public function iClickOnUpdate()
    {
        $this->click('#bulk_edit');
    }

   /**
    * @Then I see the posts :postSlugs shows Never on the Expires column
    * @Then I see the post :postSlugs shows Never on the Expires column
    */
    public function iSeeThePostsShowsNeverOnTheExpiresColumn($postSlugs)
    {
        $postSlugs = explode(',', $postSlugs);
        $postSlugs = array_map('trim', $postSlugs);

        foreach ($postSlugs as $postSlug) {
            $postId = $this->getPostIdFromSlug(sq($postSlug));

            $this->see('Never', 'tr#post-' . $postId . ' .post-expire-col');
        }
    }

    /**
     * @Given posts :postSlugs are set to expire in seven days at noon as Draft
     * @Given post :postSlugs is set to expire in seven days at noon as Draft
     */
    public function postsSetToExpireNextMonthAsDraft($postSlugs)
    {
        $postSlugs = explode(',', $postSlugs);
        $postSlugs = array_map('trim', $postSlugs);

        $nextWeekDate = $this->getNextWeekDateAtNoon();

        foreach ($postSlugs as $postSlug) {
            $postId = $this->getPostIdFromSlug(sq($postSlug));

            $unixTime = $nextWeekDate->format('U');
            $this->havePostmetaInDatabase($postId, '_expiration-date-status', 'saved');
            $this->havePostmetaInDatabase($postId, '_expiration-date', $unixTime);
            $this->havePostmetaInDatabase($postId, '_expiration-date-type', 'draft');
            $opts = [
                'expireType' => 'draft',
                'category' => null,
                'categoryTaxonomy' => '',
                'enabled' => true,
            ];
            $this->havePostmetaInDatabase($postId, '_expiration-date-options', serialize($opts));

            postexpirator_schedule_event($postId, $unixTime, $opts);
        }
    }

    private function getTomorrowDateAtNoon()
    {
        $tomorrowDate = new DateTime();
        $tomorrowDate->modify('+1 day');
        $tomorrowDate->setTime(12, 0, 0);

        return $tomorrowDate;
    }

    private function getNextWeekDateAtNoon()
    {
        $nextWeekDate = new DateTime();
        $nextWeekDate->modify('+7 day');
        $nextWeekDate->setTime(12, 0, 0);

        return $nextWeekDate;
    }

    /**
     * @Then I see the posts :postSlugs will expire tomorrow at noon
     * @Then I see the post :postSlugs will expire tomorrow at noon
     */
    public function iSeeThePostsWillExpireTomorrowAtNoon($postSlugs)
    {
        $tomorrowDate = $this->getTomorrowDateAtNoon();

        $format = get_option('date_format') . ' ' . get_option('time_format');
        $dateString = PostExpirator_Util::get_wp_date($format, $tomorrowDate->format('U'));

        $postSlugs = explode(',', $postSlugs);
        $postSlugs = array_map('trim', $postSlugs);

        foreach ($postSlugs as $postSlug) {
            $postId = $this->getPostIdFromSlug(sq($postSlug));

            $this->see($dateString, 'tr#post-' . $postId . ' .post-expire-col');
        }
    }

    /**
     * @Then I see the posts :postSlugs will expire in seven days at noon
     * @Then I see the post :postSlugs will expire in seven days at noon
     */
    public function iSeeThePostsWillExpireInSevenDaysAtNoon($postSlugs)
    {
        $nextWeekDate = $this->getNextWeekDateAtNoon();

        $format = get_option('date_format') . ' ' . get_option('time_format');
        $dateString = PostExpirator_Util::get_wp_date($format, $nextWeekDate->format('U'));

        $postSlugs = explode(',', $postSlugs);
        $postSlugs = array_map('trim', $postSlugs);

        foreach ($postSlugs as $postSlug) {
            $postId = $this->getPostIdFromSlug(sq($postSlug));

            $this->see($dateString, 'tr#post-' . $postId . ' .post-expire-col');
        }
    }

     /**
     * @When I view the post :postSlug
     */
    public function iViewThePost($postSlug)
    {
        $this->amOnPage(sq($postSlug));
    }

    /**
     * @Then I see the expiration date in the post footer
     */
    public function iSeeTheExpirationDateInThePostFooter()
    {
        $this->see('Post expires at ', '.entry-content p');
    }

    /**
     * @Then I don't see the expiration date in the post footer
     */
    public function iDontSeeTheExpirationDateInThePostFooter()
    {
        $this->dontSee('Post expires at ', '.entry-content p');
    }
}
