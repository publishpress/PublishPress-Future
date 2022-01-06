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
    public function checkboxEnablePostExpirationIsDeactivated()
    {
        $this->seeElement('#expirationdatediv input#enable-expirationdate');
        $this->dontSeeCheckboxIsChecked('#expirationdatediv input#enable-expirationdate');
    }

    /**
     * @Then the checkbox Enable Post Expiration is activated on the metabox
     */
    public function checkboxEnablePostExpirationIsAactivated()
    {
        $this->seeElement('#expirationdatediv input#enable-expirationdate');
        $this->seeCheckboxIsChecked('#expirationdatediv input#enable-expirationdate');
    }

    /**
     * @When I check the Enable Post Expiration checkbox
     */
    public function iCheckTheEnablePostExpirationCheckbox()
    {
        $this->checkOption('Enable Post Expiration');
    }

    /**
     * @When I uncheck the Enable Post Expiration checkbox
     */
    public function iUncheckTheEnablePostExpirationCheckbox()
    {
        $this->uncheckOption('Enable Post Expiration');
    }

    /**
     * @When I save the post
     */
    public function iSaveThePost()
    {
        $this->click('#publish');
    }
}
