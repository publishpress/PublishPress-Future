<?php
/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace unit\Core\DI;

use Codeception\Test\Feature\Stub;
use Codeception\Test\Unit;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServiceNotFoundException;
use stdClass;
use UnitTester;

class ContainerTest extends Unit
{
    use Stub;

    /**
     * @var UnitTester
     */
    protected $tester;

    public function testHasReturningTrueForExistentService()
    {
        $services = [
            'version' => '0.1.0',
            'module' => new stdClass(),
        ];

        $container = $this->construct(
            Container::class,
            [$services]
        );

        $this->assertTrue($container->has('version'));
        $this->assertTrue($container->has('module'));
    }

    public function testGetReturnsResolvedService()
    {
        $services = [
            'version' => '0.1.0',
            'module' => static function () {
                return new stdClass();
            }
        ];

        $container = $this->construct(
            Container::class,
            [$services]
        );

        $serviceVersion = $container->get('version');

        $this->assertIsString($serviceVersion);
        $this->assertEquals($services['version'], $serviceVersion);

        $serviceModule = $container->get('module');

        $this->assertIsObject($serviceModule);
        $this->assertEquals(new stdClass(), $serviceModule);
    }

    public function testGetReturnsCachedService()
    {
        $services = [
            'module' => static function () {
                return new stdClass();
            }
        ];

        $container = $this->construct(
            Container::class,
            [$services]
        );

        $serviceModule1 = $container->get('module');
        $serviceModule2 = $container->get('module');

        $this->assertIsObject($serviceModule1);
        $this->assertIsObject($serviceModule2);
        $this->assertSame($serviceModule1, $serviceModule2);
    }
}
