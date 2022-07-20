<?php
namespace Core;

use Codeception\Test\Feature\Stub;
use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\Exception\ServiceNotFoundException;
use stdClass;

class ContainerTest extends \Codeception\Test\Unit
{
    use Stub;

    /**
     * @var \UnitTester
     */
    protected $tester;

    public function testHasReturningTrueForExistentService()
    {
        $services = [
            'version' => '0.1.0',
            'module' => new stdClass,
        ];

        $container = $this->construct(
            Container::class,
            [$services]
        );

        $this->assertTrue($container->has('version'));
        $this->assertTrue($container->has('module'));
    }

    public function testHasReturningFalseForNonExistentService()
    {
        $services = [
            'module' => new stdClass,
        ];

        $container = $this->construct(
            Container::class,
            [$services]
        );

        $this->assertFalse($container->has('module1'));
        $this->assertFalse($container->has('module2'));
    }

    public function testGetThrowsExceptionForNotFoundService()
    {
        $this->tester->expectThrowable(
            ServiceNotFoundException::class,
            function() {
                $services = [
                    'module' => new stdClass,
                ];

                $container = new Container($services);
                $container->get('module1');
            }
        );
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
