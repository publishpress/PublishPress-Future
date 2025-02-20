<?php

namespace Tests\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHandler;

class RuntimeVariablesHandlerTest extends \lucatume\WPBrowser\TestCase\WPTestCase
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

    public function testSetAndGetVariables(): void
    {
        $handler = new RuntimeVariablesHandler();

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
        $handler = new RuntimeVariablesHandler();

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
        $handler = new RuntimeVariablesHandler();

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
        $handler = new RuntimeVariablesHandler();

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
        $handler = new RuntimeVariablesHandler();

        $text = 'This is a test {{variable1}} and {{variable2}}';
        $placeholders = $handler->extractExpressionsFromText($text);
        $this->assertEquals(['variable1', 'variable2'], $placeholders);
    }

    public function testReplacePlaceholdersInText(): void
    {
        $handler = new RuntimeVariablesHandler();

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
        $replacedText = $handler->resolveExpressionsInText($text);
        $this->assertEquals('This is a test value1 and value2 on the workflow 123', $replacedText);
    }
}
