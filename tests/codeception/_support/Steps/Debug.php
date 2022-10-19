<?php

namespace Steps;

trait Debug
{
    /**
     * @Given I wait :time seconds
     * @When I wait :time seconds
     * @Then I wait :time seconds
     */
    public function iWait($time)
    {
        $this->wait((int)$time);
    }

    /**
     * @Given I take a screenshot
     * @When I take a screenshot
     * @Then I take a screenshot
     */
    public function iTakeScreenshot()
    {
        $this->makeScreenshot();
    }

    /**
     * @Given I take a screenshot named :name
     * @When I take a screenshot named :name
     * @Then I take a screenshot named :name
     */
    public function iTakeScreenshotNamed($name)
    {
        $this->makeScreenshot($name);
    }
}
