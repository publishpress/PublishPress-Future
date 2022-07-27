<?php
namespace Framework;

use Codeception\Stub\Expected;
use Codeception\Test\Feature\Stub as Stub;
use Codeception\Test\Unit;
use PublishPressFuture\Framework\ModulesManager;
use PublishPressFuture\Framework\WordPress\HooksFacade;
use PublishPressFuture\Modules\InstanceProtection\Controller;
use UnitTester;

class ModulesManagerTest extends Unit
{
    use Stub;

    /**
     * @var UnitTester
     */
    protected $tester;

    public function testInitializingSingleModule()
    {
        $module = $this->make(
            Controller::class,
            [
                'initialize' => Expected::once()
            ]
        );

        $hooksFacade = $this->makeEmpty(
            HooksFacade::class
        );

        $instance = $this->make(
            ModulesManager::class,
            [
                'hooks' => $hooksFacade,
            ]
        );

        $instance->initializeSingleModule($module);
    }

    public function testInitializingAllModules()
    {
        $module1 = $this->make(
            Controller::class,
            [
                'initialize' => Expected::once()
            ]
        );

        $module2 = $this->make(
            Controller::class,
            [
                'initialize' => Expected::once()
            ]
        );

        $hooksFacade = $this->makeEmpty(
            HooksFacade::class
        );

        $instance = $this->make(
            ModulesManager::class,
            [
                'modulesInstanceList' => [
                    $module1,
                    $module2
                ],
                'hooks' => $hooksFacade,
            ]
        );

        $instance->initializeModules();
    }
}
