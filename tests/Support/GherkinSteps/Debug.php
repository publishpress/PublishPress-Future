<?php

namespace Tests\Support\GherkinSteps;

trait Debug
{
    /**
     * @Given I make screenshot :name
     * @When I make screenshot :name
     * @Then I make screenshot :name
     */
    public function iMakeScreenshot($name)
    {
        $this->makeScreenshot($name);
    }
}
