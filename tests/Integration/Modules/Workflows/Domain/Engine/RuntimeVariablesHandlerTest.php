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

    public function testSetAndGetVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'test' => 'value',
            'test2' => 'value2',
        ]);

        $this->assertEquals([
            'test' => 'value',
            'test2' => 'value2',
        ], $handler->getAllVariables());
    }

    public function testGetVariableValueForSimpleVariable(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'test' => 'value',
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
            'onSavePost1' => [
                'postId' => 234,
            ],
            'timestamp' => 1234567890,
            'boolean' => true,
        ]);

        $this->assertEquals('value', $handler->getVariable('test'));
        $this->assertEquals([
            'workflow' => [
                'id' => 123,
            ],
        ], $handler->getVariable('global'));
        $this->assertEquals([
            'postId' => 234,
        ], $handler->getVariable('onSavePost1'));
        $this->assertEquals(1234567890, $handler->getVariable('timestamp'));
        $this->assertEquals(true, $handler->getVariable('boolean'));
    }

    public function testGetVariableValueForNestedVariable(): void
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
            ],
            'timestamp' => 1234567890,
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

    public function testResolveExpressionsInText(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'variable1' => 'value1',
            'variable2' => 'value2',
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ]);

        $text = 'This is a test {{variable1}} and {{variable2}} on the workflow {{global.workflow.id}}';
        $resolvedText = $handler->resolveExpressionsInText($text);
        $this->assertEquals('This is a test value1 and value2 on the workflow 123', $resolvedText);
    }
}
