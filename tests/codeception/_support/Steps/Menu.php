<?php

namespace Steps;

trait Menu
{
    /**
     * @Then I see the Future admin menu on the sidebar
     */
    public function iSeeFutureAdminMenu()
    {
        $this->seeInSource('Future', '#toplevel_page_publishpress-future');
    }

    /**
     * @When I am on the admin home page
     */
    public function iAmOnAdminHomePage()
    {
        $this->amOnAdminPage('/');
    }
}
