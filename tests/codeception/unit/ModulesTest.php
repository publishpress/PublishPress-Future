<?php
namespace Core;

use Codeception\Stub\Expected;
use Codeception\Test\Feature\Stub as Stub;
use PublishPressFuture\Core\ModulesManager;
use PublishPressFuture\Module\InstanceProtection\Controller as InstanceProtectionController;
use PublishPressFuture\Module\Expiration\Controller as ExpirationController;
use UnitTester;

class ModulesTest extends \Codeception\Test\Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    public function testInitializeDefaultModules()
    {
        $modulesClasses = [
            InstanceProtectionController::class,
            ExpirationController::class
        ];

        $modulesMocks = [];
        $self = $this;

        array_map(function($className) use (&$modulesMocks, $self) {
            $module = $self->make(
                $className,
                [
                    'initialize' => Expected::once()
                ]
            );

            $modulesMocks[] = $module;

            return $className;
        }, $modulesClasses);

        $instance = $this->make(
            ModulesManager::class,
            [
                'modulesInstanceList' => $modulesMocks,
            ]
        );

        $instance->initializeAllModules();
    }
}
