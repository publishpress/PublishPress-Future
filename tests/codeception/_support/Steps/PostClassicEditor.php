<?php

namespace Steps;

use function sq;

trait PostClassicEditor
{
    /**
     * @Given I see the metabox :title
     */
    public function iSeeMetabox($title)
    {
        $this->see($title, '.postbox-header h2');
    }

    /**
     * @Then the checkbox Enable Post Expiration is deactivated on the metabox
     */
    public function checkboxEnablePostExpirationIsDeactivatedOnMetabox()
    {
        $this->seeElement('#expirationdatediv input#enable-expirationdate');
        $this->dontSeeCheckboxIsChecked('#expirationdatediv input#enable-expirationdate');
    }

    /**
     * @Then the checkbox Enable Post Expiration is activated on the metabox
     */
    public function checkboxEnablePostExpirationIsAactivatedOnMetabox()
    {
        $this->seeElement('#expirationdatediv input#enable-expirationdate');
        $this->seeCheckboxIsChecked('#expirationdatediv input#enable-expirationdate');
    }
}
