<?php

namespace Steps;

trait Menu
{
    /**
     * @Then I see the Settings submenu :submenu
     */
    public function iSeeSettingsSubmenuInCode($submenu)
    {
        $this->seeInSource($submenu, '#menu-settings .wp-submenu li a');
    }
}
