<?php

namespace Tests\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use Codeception\Test\Descriptor;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors\GeneralStep;
use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHandler;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class GeneralStepTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function setUp(): void
    {
        // Before...
        parent::setUp();

        // Your set up methods here.
    }

    public function tearDown(): void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    public function testPrepareLogMessage(): void
    {
        $variablesHandler = new RuntimeVariablesHandler();
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
