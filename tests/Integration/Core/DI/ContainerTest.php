<?php

namespace Tests\Core\DI;

use Codeception\Stub\Expected;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\HooksAbstract;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Framework\WordPress\Facade\NoticeFacade;
use PublishPress\Future\Framework\WordPress\Facade\NoticeInterface;
use stdClass;

class ContainerTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function testHasReturningFalseForNonExistentService()
    {
        $services = [
            'module' => new stdClass(),
        ];

        $container = $this->construct(
            Container::class,
            [$services]
        );

        $this->assertFalse($container->has('module1'));
        $this->assertFalse($container->has('module2'));
    }
}
