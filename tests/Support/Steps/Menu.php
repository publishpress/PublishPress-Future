<?php

namespace Steps;

trait Menu
{
    /**
     * @Then I see the admin menu Future on the sidebar
     */
    public function iSeeFutureAdminMenu()
    {
        $this->see('Future', '#toplevel_page_publishpress-future');
    }

    /**
     * @Then I don't see the admin menu Future on the sidebar
     */
    public function iDontSeeFutureAdminMenu()
    {
        $this->dontSee('Future', '#toplevel_page_publishpress-future');
    }

    /**
     * @When I am on the admin home page
     */
    public function iAmOnAdminHomePage()
    {
        $this->amOnAdminPage('/');
    }
}
