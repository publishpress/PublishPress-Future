<?php

namespace Tests\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHandler;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHelperRegistryInterface;

class RuntimeVariablesHandlerTest extends \lucatume\WPBrowser\TestCase\WPTestCase
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
        parent::setUp();

        $this->hooks = $this->createMock(HookableInterface::class);
        $this->helperRegistry = $this->createMock(RuntimeVariablesHelperRegistryInterface::class);
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

    private function createHandler(): RuntimeVariablesHandler
    {
        return new RuntimeVariablesHandler($this->hooks, $this->helperRegistry);
    }

    public function testSetAllVariablesCanBeRetrievedCorrectly(): void
    {
        $handler = $this->createHandler();

        $expectedVariables = [
            'test' => 'value',
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ];

        $handler->setAllVariables($expectedVariables);

        // Verify through the public API instead of using reflection
        $this->assertEquals($expectedVariables, $handler->getAllVariables());
    }

    public function testGetVariableReturnsCorrectValueForSimpleVariable(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'test' => 'value',
            'timestamp' => 1234567890,
            'boolean' => true,
        ]);

        $this->assertEquals('value', $handler->getVariable('test'));
        $this->assertEquals(1234567890, $handler->getVariable('timestamp'));
        $this->assertEquals(true, $handler->getVariable('boolean'));
    }

    public function testGetVariableReturnsCorrectValueForNestedVariable(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
                'site' => [
                    'name' => 'Test Site',
                ],
            ],
            'onSavePost1' => [
                'postId' => 234,
            ]
        ]);

        $this->assertEquals(123, $handler->getVariable('global.workflow.id'));
        $this->assertEquals('Test Site', $handler->getVariable('global.site.name'));
        $this->assertEquals(234, $handler->getVariable('onSavePost1.postId'));
    }

    public function testSetVariableInNestedArray(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ]);

        $handler->setVariable('global.site.id', 234);
        $handler->setVariable('global.site.name', 'New Site Name');
        $handler->setVariable('user.id', 1);

        $allVariables = $handler->getAllVariables();
        $this->assertEquals(234, $allVariables['global']['site']['id']);
        $this->assertEquals('New Site Name', $allVariables['global']['site']['name']);
        $this->assertEquals(1, $allVariables['user']['id']);
    }

    public function testExtractPlaceholdersFromText(): void
    {
        $handler = $this->createHandler();

        $text = 'This is a test {{variable1}} and {{variable2}}';
        $placeholders = $handler->extractExpressionsFromText($text);
        $this->assertEquals(['variable1', 'variable2'], $placeholders);
    }

    public function testVariableHasHelper(): void
    {
        $handler = $this->createHandler();

        $this->assertTrue($handler->variable('variable1'));
        $this->assertFalse($handler->variableHasHelper('variable3'));
    }

    public function testResolveExpressionsInText(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'step' => [
                'variable1' => 'value1',
                'variable2' => 'value2',
            ],
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ]);


        $text = 'This is a test {{step.variable1}} and {{step.variable2}} on the workflow {{global.workflow.id}}';
        $resolvedText = $handler->resolveExpressionsInText($text);
        $this->pause(['text' => $text, 'resolvedText' => $resolvedText, 'handler' => $handler]);
        $this->assertEquals('This is a test value1 and value2 on the workflow 123', $resolvedText);
    }
}
