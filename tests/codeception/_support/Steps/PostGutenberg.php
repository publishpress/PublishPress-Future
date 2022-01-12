<?php

namespace Steps;

use function sq;

trait PostGutenberg
{
    /**
     * @Then I see the component panel :text
     */
    public function iSeeComponentPanelText($text)
    {
        $this->see($text, '.components-panel .post-expirator-panel');
    }

    /**
     * @Then the checkbox Enable Post Expiration is deactivated on the component panel
     */
    public function checkboxEnablePostExpirationIsDeactivatedOnComponentPanel()
    {
        $status = $this->executeJS('return wp.data.select(\'core/editor\').getEditedPostAttribute(\'meta\')[\'_expiration-date-status\']');

        $this->assertEmpty($status, 'The value of the post meta _expiration-date-status should be empty');
    }

    /**
     * @Then the checkbox Enable Post Expiration is activated on the component panel
     */
    public function checkboxEnablePostExpirationIsActivatedOnComponentPanel()
    {
        $status = $this->executeJS('return wp.data.select(\'core/editor\').getEditedPostAttribute(\'meta\')[\'_expiration-date-status\']');

        $this->assertEquals("saved", $status, 'The value of the post meta _expiration-date-status should be "saved"');
    }

    /**
     * @When I am adding a new post with title :title on Gutenberg
     */
    public function iAmAddingANewPostWithTitleOnGutenberg($title)
    {
        $this->iAmAddingANewPost();
        $this->executeJS('wp.data.dispatch(\'core/editor\').editPost({title: \'' . $title . '\'})');
    }

    /**
     * @When  I check the Enable Post Expiration checkbox on Gutenberg
     */
    public function iCheckTheEnablePostExpirationCheckboxOnGutenberg()
    {
        $this->executeJS('wp.data.dispatch(\'core/editor\').editPost({meta: {\'_expiration-date-status\': \'saved\'}});');
    }

    /**
     * @When  I uncheck the Enable Post Expiration checkbox on Gutenberg
     */
    public function iUncheckTheEnablePostExpirationCheckboxOnGutenberg()
    {
        $this->executeJS('wp.data.dispatch(\'core/editor\').editPost({meta: {\'_expiration-date-status\': \'\'}});');
    }

    /**
     * @When I save the post on Gutenberg
     */
    public function iSaveThePostOnGutenberg()
    {
        $this->executeJS('wp.data.dispatch(\'core/editor\').savePost()');
        // We need to wait until the post is saved
        $this->wait(2);
    }
}
