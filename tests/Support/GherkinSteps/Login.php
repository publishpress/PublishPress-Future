<?php

namespace Tests\Support\GherkinSteps;

trait Login
{
    /**
     * @Given I am logged in as administrator
     */
    public function iAmLoggedInAsAdministrator()
    {
        $this->loginAsAdmin();
    }
}
