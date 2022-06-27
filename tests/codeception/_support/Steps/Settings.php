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

     /**
     * @Given expiration metabox is disabled for :postType
     */
    public function expirationMetaboxIsDisabledForPostType($postType)
    {
       $this->haveOptionInDatabase(
           'expirationdateDefaults' . strtoupper($postType),
           [
               'expireType' => 'draft',
               'autoEnable' => '0',
               'activeMetaBox' => 'inactive',
               'emailnotification' => '',
               'default-expire-type' => '',
               'default-custom-date' => '',
           ]
       );
    }

    /**
     * @Given default expiration is not activated for :postType
     */
    public function defaultExpirationNotActivatedForPostType($postType)
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

    /**
     * @Given default expiration is activated for :postType
     */
    public function defaultExpirationActivatedForPostType($postType)
    {
        $this->haveOptionInDatabase(
            'expirationdateDefaults' . strtoupper($postType),
            [
                'expireType' => 'draft',
                'autoEnable' => '1',
                'activeMetaBox' => 'active',
                'emailnotification' => '',
                'default-expire-type' => '',
                'default-custom-date' => '',
            ]
        );
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

    /**
     * @When I set Active field as inactive for :arg1
     */
    public function iSetActiveFieldAsInactiveFor($arg1)
    {
        $this->selectOption('input[name="expirationdate_activemeta-'  . strtolower($arg1) . '"]', 'inactive');
    }

   /**
    * @Then I see the field Active has value inactive for :arg1
    * @When I see the field Active has value inactive for :arg1
    */
    public function iSeeTheFieldActiveHasValueInactiveFor($arg1)
    {
        $this->seeOptionIsSelected('input[name="expirationdate_activemeta-'  . strtolower($arg1) . '"]', 'Inactive');
    }

   /**
    * @When set Active field as active for :arg1
    */
    public function setActiveFieldAsActiveFor($arg1)
    {
        $this->selectOption('input[name="expirationdate_activemeta-'  . strtolower($arg1) . '"]', 'active');
    }

   /**
    * @Then I see the field Active has value active for :arg1
    * @When I see the field Active has value active for :arg1
    */
    public function iSeeTheFieldActiveHasValueActiveFor($arg1)
    {
        $this->seeOptionIsSelected('input[name="expirationdate_activemeta-'  . strtolower($arg1) . '"]', 'Active');
    }
}
