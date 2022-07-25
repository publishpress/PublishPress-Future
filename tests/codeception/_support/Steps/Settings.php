<?php

namespace Steps;

use PostExpirator_Util;

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
     * @Given I am on the settings page in the Display tab
     */
    public function iAmOnTheSettingsPageInTheDisplayTab()
    {
        $this->amOnAdminPage('admin.php?page=publishpress-future&tab=display');
    }

    /**
     * @Given I am on the settings page in the Defaults tab
     */
    public function iAmOnTheSettingsPageInTheDefaultsTab()
    {
        $this->amOnAdminPage('admin.php?page=publishpress-future&tab=general');
    }

   /**
    * @When /I change the default taxonomy to ([a-z_0-9]+) for ([a-z_0-9]+)/
    */
    public function iChangeTheDefaultTaxonomyToFor($taxonomy, $postType)
    {
        $this->selectOption('#expirationdate_taxonomy-' . $postType, $taxonomy);
    }

   /**
    * @When I save the changes
    */
    public function iSaveTheChanges()
    {
        $this->click('Save Changes');
    }

   /**
    * @Then /I see the taxonomy ([a-z_0-9]+) as the default one for ([a-z_0-9]+)/
    */
    public function iSeeTheTaxonomyAsTheDefaultOneFor($taxonomy, $postType)
    {
        $this->seeOptionIsSelected('#expirationdate_taxonomy-' . $postType, $taxonomy);
    }

    /**
     * @When /I set Active field as (inactive|active) for ([a-z_0-9]+)/
     */
    public function iSetActiveFieldFor($value, $postType)
    {
        $this->selectOption('input[name="expirationdate_activemeta-'  . $postType . '"]', $value);
    }

   /**
    * @When /I see the field Active has value (inactive|active) for ([a-z_0-9]+)/
    */
    public function iSeeTheFieldActiveHasValueFor($value, $postType)
    {
        $this->seeOptionIsSelected('input[name="expirationdate_activemeta-'  . $postType . '"]', ucfirst($value));
    }

    /**
     * @When I enable auto-enable for :post
     */
    public function iEnableAutoenableForPost($postType)
    {
        $this->click("#expirationdate_autoenable-true-{$postType}");
    }

    /**
     * @When I disable auto-enable for :post
     */
    public function iDisableAutoenableForPost($postType)
    {
        $this->click("#expirationdate_autoenable-false-{$postType}");
        // $this->wait(30);
    }

   /**
    * @Then I see auto-enable is selected for :postType
    */
    public function iSeeAutoenableIsSelectedForPost($postType)
    {
        $this->seeOptionIsSelected("input[name=expirationdate_autoenable-{$postType}]", 'Enabled');
    }

    /**
    * @Then I see auto-enable is not selected for :postType
    */
    public function iSeeAutoenableIsNotSelectedForPost($postType)
    {
        $this->seeOptionIsSelected("input[name=expirationdate_autoenable-{$postType}]", 'Disabled');
    }

    /**
     * @When I set How To Expire as :value for :postType
     */
    public function iSetHowToExpireAsDeleteForPost($value, $postType)
    {
        $this->selectOption('#expirationdate_expiretype-' . $postType, $value);
    }

    /**
     * @Then I see the field How to Expire has value :value for :postType
     */
    public function iSeeTheFieldHowToExpireHasValueFor($value, $postType)
    {
        $this->seeOptionIsSelected('#expirationdate_expiretype-' . $postType, $value);
    }

    /**
     * @When I set Auto-Enable as :value for :postType
     */
    public function iSetAutoEnableAsFor($value, $postType)
    {
        if ($value === 'Enable') {
            $this->click("#expirationdate_autoenable-true-{$postType}");
        } else {
            $this->click("#expirationdate_autoenable-false-{$postType}");
        }
    }

   /**
    * @Then I see the field Auto-Enable has value :value for :postType
    */
    public function iSeeTheFieldAutoEnableHasValueFor($value, $postType)
    {
        $this->seeOptionIsSelected("input[name=expirationdate_autoenable-{$postType}]", $value);
    }

    /**
     * @When I set Taxonomy as :value for :postType
     */
    public function iSetTaxonomyAsFor($value, $postType)
    {
        $this->selectOption('#expirationdate_taxonomy-' . $postType, $value);
    }

   /**
    * @Then I see the field Taxonomy has value :value for :postType
    */
    public function iSeeTheFieldTaxonomyHasValueFor($value, $postType)
    {
        $this->seeOptionIsSelected("#expirationdate_taxonomy-" . $postType, $value);
    }

    /**
     * @When I set Who to Notify as :value for :postType
     */
    public function iSetWhoToNotifyAsFor($value, $postType)
    {
        $this->fillField('#expirationdate_emailnotification-' . $postType, $value);
    }

   /**
    * @Then I see the field Who to Notify has value :value for :postType
    */
    public function iSeeTheFieldWhoToNotifyHasValueFor($value, $postType)
    {
        $this->seeInField('#expirationdate_emailnotification-' . $postType, $value);
    }

    /**
     * @When I set Default Date as :value for :postType
     */
    public function iSetDefaultDateAsFor($value, $postType)
    {
        $value = explode(':', $value);

        $this->selectOption('#expired-default-date-' . $postType, $value[0]);

        if ($value[0] === 'Custom') {
            $this->fillField('#expired-custom-date-' . $postType, $value[1]);
        }
    }

   /**
    * @Then I see the field Default Date has value :value for :postType
    */
    public function iSeeTheFieldDefaultDateHasValueFor($value, $postType)
    {
        $value = explode(':', $value);

        $this->seeOptionIsSelected("#expired-default-date-" . $postType, $value[0]);

        if ($value[0] === 'Custom') {
            $this->seeInField('#expired-custom-date-' . $postType, $value[1]);
        }
    }

    /**
     * @When /I (enable|disable) Show in post footer/
     */
    public function iEnableDisableShowInPostFooter($value)
    {
        $value = $value === 'enable' ? 'true' : 'false';

        $this->click('#expired-display-footer-' . $value);
    }

    /**
     * @When I fill Footer Contents with :value
     */
    public function iFillFooterContentsWith($value)
    {
        $this->fillField('#expired-footer-contents', $value);
    }


    /**
     * @Then I see the expiration date in the post footer
     */
    public function iSeeTheExpirationDateInThePostFooter()
    {
        $this->see('Post expires at ', '.entry-content p');
    }

    /**
     * @Then I don't see the expiration date in the post footer
     */
    public function iDontSeeTheExpirationDateInThePostFooter()
    {
        $this->dontSee('Post expires at ', '.entry-content p');
    }

    /**
     * @Then I see the custom footer content :customContent
     */
    public function iSeeTheCustomFooterContent($customContent)
    {
        $this->see($customContent, '.entry-content p');
    }

    /**
     * @Then I see the expiration full date in the footer content
     */
    public function iSeeTheFullDateInTheFooterContent()
    {
        global $currentExpirationDate;

        $dateFormat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
        $timeFormat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);

        $fullDate = PostExpirator_Util::get_wp_date("$dateFormat $timeFormat", $currentExpirationDate->getTimestamp());

        $this->see($fullDate, '.entry-content p');
    }

    /**
     * @Then I see the expiration date in the footer content
     */
    public function iSeeTheDateInTheFooterContent()
    {
        global $currentExpirationDate;

        $dateFormat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);

        $date = PostExpirator_Util::get_wp_date($dateFormat, $currentExpirationDate->getTimestamp());

        $this->see($date, '.entry-content p');
    }

     /**
     * @Then I see the expiration time in the footer content
     */
    public function iSeeTheTimeInTheFooterContent()
    {
        global $currentExpirationDate;

        $timeFormat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);

        $time = PostExpirator_Util::get_wp_date($timeFormat, $currentExpirationDate->getTimestamp());

        $this->see($time, '.entry-content p');
    }

    /**
     * @When I fill the Footer Style with :customStyle
     */
    public function iFillTheFooterStyleWith($customStyle)
    {
        $this->fillField('#expired-footer-style', $customStyle);
    }

   /**
    * @Then I see the custom footer content :content with style :style
    */
    public function iSeeTheCustomFooterConstentWithStyle($content, $style)
    {
        $this->seeInSource('<p style="' . $style . '">' . $content . '</p>');
    }

    /**
    * @Then I see the preview with style :style
    */
    public function iSeeThePreviewWithStyle($style)
    {
        $this->seeElementInDOM('#expired-footer-style + span', ['style' => $style]);
    }

    /**
     * @When I fill Date Format with :dateFormat
     */
    public function iFillDateFormatWith($dateFormat)
    {
        $this->fillField('#expired-default-date-format', $dateFormat);
    }

   /**
    * @Then I see the expiration date in the post footer with format :dateFormat
    */
    public function iSeeTheExpirationDateInThePostFooterWithFormat($dateFormat)
    {
        global $currentExpirationDate;

        $date = PostExpirator_Util::get_wp_date($dateFormat, $currentExpirationDate->getTimestamp());

        $this->see($date, '.entry-content p');
    }

    /**
     * @Given settings is set to show in the post footer
     */
    public function settingsIsSetToShowInThePostFooter()
    {
        $this->haveOptionInDatabase('expirationdateDisplayFooter', true);
        $this->haveOptionInDatabase('expirationdateFooterContents', 'Post expires at EXPIRATIONTIME on EXPIRATIONDATE');
    }

    /**
     * @When I fill Time Format with :timeFormat
     */
    public function iFillTimeFormatWith($timeFormat)
    {
        $this->fillField('#expired-default-time-format', $timeFormat);
    }

   /**
    * @Then I see the expiration time in the post footer with format :timeFormat
    */
    public function iSeeTheExpirationTimeInThePostFooterWithFormat($timeFormat)
    {
        global $currentExpirationDate;

        $time = PostExpirator_Util::get_wp_date($timeFormat, $currentExpirationDate->getTimestamp());

        $this->see($time, '.entry-content p');
    }
}
