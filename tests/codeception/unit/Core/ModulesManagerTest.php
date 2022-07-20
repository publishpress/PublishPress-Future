<?php
namespace Core;

use Codeception\Stub\Expected;
use Codeception\Test\Feature\Stub as Stub;
use PublishPressFuture\Core\ModulesManager;
use PublishPressFuture\Module\InstanceProtection\Controller;
use UnitTester;

class ModulesManagerTest extends \Codeception\Test\Unit
{
    use Stub;

    /**
     * @var UnitTester
     */
    protected $tester;

    public function testInitializingAModule()
    {
        $module = $this->make(
            Controller::class,
            [
                'initialize' => Expected::once()
            ]
        );

        $instance = $this->make(
            ModulesManager::class
        );

        $instance->initializeAModule($module);
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

        $instance = $this->make(
            ModulesManager::class,
            [
                'modulesInstanceList' => [
                    $module1,
                    $module2
                ]
            ]
        );

        $instance->initializeAllModules();
    }
}
