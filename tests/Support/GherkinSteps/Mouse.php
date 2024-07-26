<?php

namespace Tests\Support\GherkinSteps;

trait Mouse
{
    /**
     * @When I click :arg1
     */
    public function iClick($arg1)
    {
        $this->click($arg1);
    }
}
