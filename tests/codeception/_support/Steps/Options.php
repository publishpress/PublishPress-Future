<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace Steps;

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
