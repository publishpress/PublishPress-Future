<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * Inherited Methods
 * @method void wantTo($text)
 * @method void wantToTest($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause($vars = [])
 *
 * @SuppressWarnings(PHPMD)
*/
class EndToEndTester extends \Codeception\Actor
{
    use _generated\EndToEndTesterActions;

    public function havePluginActivated($pluginPath = 'post-expirator/post-expirator.php')
    {
        $activePlugins = $this->grabOptionFromDatabase('active_plugins');
        $activePlugins[] = $pluginPath;
        $this->haveOptionInDatabase('active_plugins', $activePlugins);
    }

    public function havePluginDeactivated($pluginPath = 'post-expirator/post-expirator.php')
    {
        $activePlugins = $this->grabOptionFromDatabase('active_plugins');
        $activePlugins = array_diff($activePlugins, [$pluginPath]);
        $this->haveOptionInDatabase('active_plugins', $activePlugins);
    }
}
