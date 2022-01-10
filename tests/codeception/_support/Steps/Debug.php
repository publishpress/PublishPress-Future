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
}
