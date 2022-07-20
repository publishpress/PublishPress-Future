<?php
namespace Core;

use Codeception\Test\Feature\Stub;
use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\Exception\DefinitionsNotFoundException;

class ContainerTest extends \Codeception\Test\Unit
{
    use Stub;

    /**
     * @var \UnitTester
     */
    protected $tester;

    protected function __before()
    {

    }

    // public function testGetInstanceWhenNeverConstructedWithDefinitions()
    // {
    //     // $this->tester->expectThrowable(
    //     //     DefinitionsNotFoundException::class,
    //     //     function() {
    //     //         // $instance = Container::getInstance();

    //     //         $container = $this->makeEmpty(
    //     //             Container::class,
    //     //             [
    //     //                 'definitions' => [],
    //     //                 'instance' => null,
    //     //             ]
    //     //         );

    //     //         $container::getInstance();
    //     //     }
    //     // );
    // }

    // public function testGetInstanceConstructingWithDefinitions()
    // {
    //     // $definitions = [
    //     //     'version' => 1702,
    //     // ];

    //     // $instance = Container::getInstance($definitions);

    //     // $this->assertIsObject($instance);
    //     // $this->assertInstanceOf(Container::class, $instance);
    // }

    // public function testGet()
    // {

    // }
}
