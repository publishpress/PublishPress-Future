<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Core;

use Codeception\Stub\Expected;
use Codeception\Test\Unit;
use Exception;
use PublishPressFuture\Core\AbstractHooks;
use PublishPressFuture\Core\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Core\Plugin;
use stdClass;
use UnitTester;

class PluginTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @throws Exception
     */
    public function testInitializeTriggersActionInitPlugin()
    {
        $modules = [];

        global $testInitializeTriggersActionInitPluginActions;
        $testInitializeTriggersActionInitPluginActions = [];

        $hooksFacade = $this->makeEmpty(
            HooksFacade::class,
            [
                'doAction' => Expected::atLeastOnce(
                    function ($action) use (&$testInitializeTriggersActionInitPluginActions) {
                        $testInitializeTriggersActionInitPluginActions[] = $action;
                    }
                )
            ]
        );

        $legacyPlugin = $this->make(stdClass::class);

        $basePath = '/tmp';
        $pluginSlug = 'post-expirator';

        $plugin = $this->construct(
            Plugin::class,
            [
                $modules,
                $legacyPlugin,
                $hooksFacade,
                $basePath,
                $pluginSlug
            ]
        );

        $plugin->initialize();

        $this->assertTrue(in_array(AbstractHooks::ACTION_INIT_PLUGIN, $testInitializeTriggersActionInitPluginActions));
    }

    /**
     * @throws Exception
     */
    public function testInitializeRegisterDeactivationHook()
    {
        $modules = [];

        $hooksFacade = $this->makeEmpty(
            HooksFacade::class,
            [
                'registerDeactivationHook' => Expected::atLeastOnce(),
            ]
        );

        $legacyPlugin = $this->make(stdClass::class);

        $basePath = '/tmp';
        $pluginSlug = 'post-expirator';

        $plugin = $this->construct(
            Plugin::class,
            [
                $modules,
                $legacyPlugin,
                $hooksFacade,
                $basePath,
                $pluginSlug
            ]
        );

        $plugin->initialize();
    }

    /**
     * @throws Exception
     */
    public function testDeactivatePluginDoActionDeactivatePlugin()
    {
        global $testDeactivatePluginDoActionDeactivatePluginActions;
        $testDeactivatePluginDoActionDeactivatePluginActions = [];

        $hooksFacade = $this->makeEmpty(
            HooksFacade::class,
            [
                'doAction' => Expected::atLeastOnce(
                    function ($action) use (&$testDeactivatePluginDoActionDeactivatePluginActions) {
                        $testDeactivatePluginDoActionDeactivatePluginActions[] = $action;
                    }
                )
            ]
        );

        $plugin = $this->makeEmptyExcept(
            Plugin::class,
            'deactivatePlugin',
            [
                'hooks' => $hooksFacade,
            ]
        );

        $plugin->deactivatePlugin();

        $this->assertTrue(
            in_array(AbstractHooks::ACTION_DEACTIVATE_PLUGIN, $testDeactivatePluginDoActionDeactivatePluginActions)
        );
    }
}
