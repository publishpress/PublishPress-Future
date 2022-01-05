<?php

namespace Steps;

use function sq;

trait PostClassicEditor
{
    /**
     * @Then I see the metabox :title
     */
    public function iSeeMetabox($title)
    {
        $this->see($title, '.postbox-header h2');
    }
}
