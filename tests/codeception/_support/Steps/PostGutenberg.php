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
}
