<?php
namespace Core;

use Codeception\Stub\Expected;
use Codeception\Test\Feature\Stub as Stub;
use Codeception\Test\Unit;
use PublishPressFuture\Core\ModulesManager;
use PublishPressFuture\Core\PluginFacade;
use PublishPressFuture\Core\WordPress\HooksFacade;
use PublishPressFuture\Module\InstanceProtection\Controller as InstanceProtectionController;
use PublishPressFuture\Domain\PostExpiration\Controller as ExpirationController;
use UnitTester;
use stdClass;

class PluginFacadeTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    public function testModulesAreInitialized()
    {
        $hooksFacade = $this->makeEmpty(
            HooksFacade::class
        );

        $modulesClasses = [
            InstanceProtectionController::class,
            ExpirationController::class
        ];

        $modulesMocks = [];

        array_map(function($className) use (&$modulesMocks) {
            $module = $this->make(
                $className,
                [
                    'initialize' => Expected::once()
                ]
            );

            $modulesMocks[] = $module;

            return $className;
        }, $modulesClasses);

        $modulesManager = $this->make(
            ModulesManager::class,
            [
                'modulesInstanceList' => $modulesMocks,
                'hooks' => $hooksFacade,
            ]
        );

        $legacyPlugin = $this->make(
            stdClass::class
        );

        $basePath = '/tmp';
        $pluginSlug = 'post-expirator';

        $plugin = $this->construct(
            PluginFacade::class,
            [
                $modulesManager,
                $legacyPlugin,
                $hooksFacade,
                $basePath,
                $pluginSlug
            ]
        );


        $plugin->initialize();
    }
}
