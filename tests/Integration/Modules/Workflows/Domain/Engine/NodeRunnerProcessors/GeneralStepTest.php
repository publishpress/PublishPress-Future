<?php

namespace Tests\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use Codeception\Test\Descriptor;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors\GeneralStep;
use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHandler;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHelperRegistryInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class GeneralStepTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    /**
     * @var HookableInterface&\PHPUnit\Framework\MockObject\MockObject
     */
    private $hooks;

    /**
     * @var RuntimeVariablesHelperRegistryInterface&\PHPUnit\Framework\MockObject\MockObject
     */
    private $helperRegistry;

    public function setUp(): void
    {
        // Before...
        parent::setUp();

        $this->hooks = $this->createMock(HookableInterface::class);
        $this->helperRegistry = $this->createMock(RuntimeVariablesHelperRegistryInterface::class);
    }

    public function tearDown(): void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    private function createHandler(): RuntimeVariablesHandler
    {
        return new RuntimeVariablesHandler($this->hooks, $this->helperRegistry);
    }

    public function testPrepareLogMessage(): void
    {
        $variablesHandler = $this->createHandler();
        $variablesHandler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                    'title' => 'Our Workflow',
                ],
            ],
        ]);

        $processor = new GeneralStep(
            $this->makeEmpty(HooksFacade::class),
            $this->makeEmpty(WorkflowEngineInterface::class, [
                'getVariablesHandler' => $variablesHandler,
            ]),
            $this->makeEmpty(LoggerInterface::class)
        );

        $this->assertEquals(
            '[WF Engine]   - Workflow 123: Setting up step step1',
            $processor->prepareLogMessage('Setting up step %s', 'step1')
        );

        $this->assertEquals(
            '[WF Engine]   - Workflow 123: Setting up step step1',
            $processor->prepareLogMessage('Setting up step %1$s', 'step1')
        );

        $this->assertEquals(
            '[WF Engine]   - Workflow 123: Setting up step step1 with title "step title"',
            $processor->prepareLogMessage('Setting up step %1$s with title "%2$s"', 'step1', 'step title')
        );
    }
}
