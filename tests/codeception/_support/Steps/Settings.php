<?php

namespace Steps;

trait Settings
{
    /**
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
}
