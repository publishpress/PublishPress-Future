<?php

namespace Steps;

trait Settings
{
    /**
     * @Given expiration metabox is enabled for :postType
     */
     public function expirationMetaboxIsEnabledForPostType($postType)
     {
        $this->haveOptionInDatabase(
            'expirationdateDefaults' . strtoupper($postType),
            [
                'expireType' => 'draft',
                'autoEnable' => '0',
                'activeMetaBox' => 'active',
                'emailnotification' => '',
                'default-expire-type' => '',
                'default-custom-date' => '',
            ]
        );
     }
     * @Given default expiration is not activated for :postType
     */
    public function defaultExpirationNotActivatedForPostType($postType)
    {
        $this->amOnAdminPage('admin.php?page=publishpress-future&tab=defaults');
        $this->checkOption('#expirationdate_autoenable-false-' . $postType);
        $this->click('Save Changes');
    }

    /**
     * @Given default expiration is activated for :postType
     */
    public function defaultExpirationActivatedForPostType($postType)
    {
        $this->amOnAdminPage('admin.php?page=publishpress-future&tab=defaults');
        $this->checkOption('#expirationdate_autoenable-true-' . $postType);
        $this->click('Save Changes');
    }

    /**
     * @Given I am on the settings page in the Post Types tab
     */
    public function iAmOnTheSettingsPageInThePostTypesTab()
    {
        $this->amOnAdminPage('admin.php?page=publishpress-future&tab=defaults');
    }

   /**
    * @When I change the default taxonomy to :arg1 for :arg2
    */
    public function iChangeTheDefaultTaxonomyToFor($arg1, $arg2)
    {
        $this->selectOption('#expirationdate_taxonomy-' . strtolower($arg2), $arg1);
    }

   /**
    * @When I save the changes
    */
    public function iSaveTheChanges()
    {
        $this->click('Save Changes');
    }

   /**
    * @Then I see the taxonomy :arg1 as the default one for :arg2
    */
    public function iSeeTheTaxonomyAsTheDefaultOneFor($arg1, $arg2)
    {
        $this->seeOptionIsSelected('#expirationdate_taxonomy-' . strtolower($arg2), $arg1);
    }

}
