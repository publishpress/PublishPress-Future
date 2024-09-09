<?php
/**
 * Copyright (c) 2024, Ramble Ventures
 */

namespace Tests\Support\GherkinSteps;

trait Options
{
    /**
     * @Given I have option :optionName as :optionValue
     */
    public function iHaveOptionAs($optionName, $optionValue)
    {
        $this->haveOptionInDatabase($optionName, $optionValue);
    }
}
