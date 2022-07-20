<?php
namespace Core;

use Codeception\Stub;
use Codeception\Stub\Expected;
use Codeception\Test\Feature\Stub as FeatureStub;
use PublishPressFuture\Core\ModulesManager;
use UnitTester;

class ModulesManagerTest extends \Codeception\Test\Unit
{
    use FeatureStub;

    /**
     * @var \UnitTester
     */
    protected $tester;

    public function testInitializingAModule()
    {
        $module = $this->make(
            'PublishPressFuture\\Module\\InstanceProtection\\Controller',
            [
                'initialize' => Expected::once()
            ],
            $this
        );

        $instance = $this->make(
            'PublishPressFuture\\Core\\ModulesManager'
        );

        $instance->initializeAModule($module);
    }

    public function testInitializingAllModules()
    {
        $module1 = $this->make(
            'PublishPressFuture\\Module\\InstanceProtection\\Controller',
            [
                'initialize' => Expected::once()
            ],
            $this
        );

        $module2 = $this->make(
            'PublishPressFuture\\Module\\InstanceProtection\\Controller',
            [
                'initialize' => Expected::once()
            ],
            $this
        );

        $instance = $this->make(
            'PublishPressFuture\\Core\\ModulesManager',
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
