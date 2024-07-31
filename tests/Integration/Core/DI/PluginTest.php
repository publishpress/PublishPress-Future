<?php

namespace Tests\Core\DI;

use Codeception\Stub\Expected;
use PublishPress\Future\Core\HooksAbstract;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Framework\WordPress\Facade\NoticeFacade;
use PublishPress\Future\Framework\WordPress\Facade\NoticeInterface;
use stdClass;

class PluginTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function testInitializeTriggersActionInitPlugin() :void
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

        $legacyPlugin = $this->makeEmpty(stdClass::class);
        $noticesFacade = $this->makeEmpty(NoticeFacade::class);

        $basePath = '/tmp';
        $pluginSlug = 'post-expirator';

        $plugin = $this->construct(
            Plugin::class,
            [
                $modules,
                $legacyPlugin,
                $hooksFacade,
                $basePath,
                $pluginSlug,
                $noticesFacade
            ]
        );

        $plugin->initialize();

        $this->assertTrue(in_array(HooksAbstract::ACTION_INIT_PLUGIN, $testInitializeTriggersActionInitPluginActions));
    }
}
