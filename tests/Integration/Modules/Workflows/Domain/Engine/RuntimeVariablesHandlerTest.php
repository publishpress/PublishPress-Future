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
        $this->hooks->method('applyFilters')->willReturnCallback(function ($hook, $value) {
            return $value;
        });
        $this->helperRegistry = $this->createMock(RuntimeVariablesHelperRegistryInterface::class);
        $this->helperRegistry->method('execute')->willReturnCallback(function ($helper, $value, $args) {
            if ($helper === 'date') {
                return strtotime($value);
            }

            return $value;
        });
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

        $expectedVariables = [
            'test' => 'value',
            'timestamp' => 1234567890,
            'boolean' => true,
        ];

        $handler->setAllVariables($expectedVariables);

        $this->assertEquals('value', $handler->getVariable('test'));
        $this->assertEquals(1234567890, $handler->getVariable('timestamp'));
        $this->assertEquals(true, $handler->getVariable('boolean'));
    }

    public function testGetVariableReturnsCorrectValueForEdgeCases(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([]);

        $this->assertEquals('non-existent', $handler->getVariable('non-existent'));
        $this->assertEquals('', $handler->getVariable(''));
        $this->assertEquals(false, $handler->getVariable(false));
        $this->assertEquals(true, $handler->getVariable(true));
        $this->assertEquals(0, $handler->getVariable(0));
    }

    public function testGetVariableReturnsCorrectValueForDeeplyNestedVariable(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ]);

        $this->assertEquals(123, $handler->getVariable('global.workflow.id'));
    }

    public function testGetVariableReturnsCorrectValueFromDifferentBranches(): void
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
        ]);

        $this->assertEquals(123, $handler->getVariable('global.workflow.id'));
        $this->assertEquals('Test Site', $handler->getVariable('global.site.name'));
    }

    public function testGetVariableReturnsCorrectValueFromTopLevelBranch(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'onSavePost1' => [
                'postId' => 234,
            ]
        ]);

        $this->assertEquals(234, $handler->getVariable('onSavePost1.postId'));
    }

    public function testGetVariableReturnsPathForNonExistentVariable(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ]);

        // This behavior seems unusual - typically you'd expect null or an exception
        // for a non-existent variable, not the path itself
        $this->assertEquals('non-existent.id', $handler->getVariable('non-existent.id'));
    }

    public function testSetVariableExtendsExistingNestedStructure(): void
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

        $allVariables = $handler->getAllVariables();

        $this->assertEquals(234, $allVariables['global']['site']['id']);
        $this->assertEquals(123, $allVariables['global']['workflow']['id'],
            'Existing nested structure should be preserved');
    }

    public function testSetVariableAddsToExistingBranch(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'site' => [
                    'id' => 234,
                ],
            ],
        ]);

        $handler->setVariable('global.site.name', 'New Site Name');

        $allVariables = $handler->getAllVariables();

        $this->assertEquals('New Site Name', $allVariables['global']['site']['name']);
        $this->assertEquals(234, $allVariables['global']['site']['id'],
            'Existing values in the same branch should be preserved');
    }

    public function testSetVariableCreatesNewBranch(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                ],
            ],
        ]);

        $handler->setVariable('user.id', 1);

        $allVariables = $handler->getAllVariables();

        $this->assertEquals(1, $allVariables['user']['id']);
        $this->assertEquals(123, $allVariables['global']['workflow']['id'],
            'Existing structure should be preserved when creating new branches');
    }

    public function testExtractExpressionsFromTextWithBasicVariables(): void
    {
        $handler = $this->createHandler();

        $text = 'This is a test {{variable1}} and {{variable2}}';
        $placeholders = $handler->extractExpressionsFromText($text);

        $this->assertEquals(['variable1', 'variable2'], $placeholders);
    }

    public function testExtractExpressionsFromTextWithNestedVariables(): void
    {
        $handler = $this->createHandler();

        $textWithNested = 'Testing {{global.workflow.id}} and {{step.variable}}';
        $nestedPlaceholders = $handler->extractExpressionsFromText($textWithNested);

        $this->assertEquals(['global.workflow.id', 'step.variable'], $nestedPlaceholders);
    }

    public function testExtractExpressionsFromTextWithHelperFunctions(): void
    {
        $handler = $this->createHandler();

        $textWithHelpers = 'Testing {{format date.created}} and {{uppercase user.name}}';
        $helperPlaceholders = $handler->extractExpressionsFromText($textWithHelpers);

        $this->assertEquals(['format date.created', 'uppercase user.name'], $helperPlaceholders);
    }

    public function testExtractExpressionsFromTextWithHelperFunctionsAndArguments(): void
    {
        $handler = $this->createHandler();

        $textWithHelpers = 'Testing {{format date.created format="Y-m-d"}} and {{date user.created format="Y-m-d" output="U"}}';
        $helperPlaceholders = $handler->extractExpressionsFromText($textWithHelpers);

        $this->assertEquals(['format date.created format="Y-m-d"', 'date user.created format="Y-m-d" output="U"'], $helperPlaceholders);
    }

    public function testExtractExpressionsFromTextWithNoExpressions(): void
    {
        $handler = $this->createHandler();

        $textWithoutExpressions = 'This text has no expressions';
        $emptyPlaceholders = $handler->extractExpressionsFromText($textWithoutExpressions);

        $this->assertEmpty($emptyPlaceholders);
    }

    public function testResolveExpressionsInTextWithBasicVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'step' => [
                'variable1' => 'value1',
                'variable2' => 'value2',
            ],
        ]);

        $text = 'This is a test {{step.variable1}} and {{step.variable2}}';
        $resolvedText = $handler->resolveExpressionsInText($text);

        $this->assertEquals('This is a test value1 and value2', $resolvedText);
    }

    public function testResolveExpressionsInTextWithNestedVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                    'name' => 'Test Workflow',
                ],
            ],
        ]);

        $text = 'Workflow ID: {{global.workflow.id}}, Name: {{global.workflow.name}}';
        $resolvedText = $handler->resolveExpressionsInText($text);

        $this->assertEquals('Workflow ID: 123, Name: Test Workflow', $resolvedText);
    }

    public function testResolveExpressionsInTextWithMixedVariables(): void
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

        $this->assertEquals('This is a test value1 and value2 on the workflow 123', $resolvedText);
    }

    public function testResolveExpressionsInTextWithNonExistentVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'step' => [
                'variable1' => 'value1',
            ],
        ]);

        $text = 'This variable exists: {{step.variable1}}, but this one does not: {{step.nonexistent}}';
        $resolvedText = $handler->resolveExpressionsInText($text);

        $this->assertEquals('This variable exists: value1, but this one does not: nonexistent', $resolvedText);
    }

    public function testResolveExpressionsInTextWithNoExpressions(): void
    {
        $handler = $this->createHandler();

        $text = 'This text has no expressions to resolve';
        $resolvedText = $handler->resolveExpressionsInText($text);

        $this->assertEquals($text, $resolvedText);
    }

    public function testResolveExpressionsInArrayWithBasicVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'variable1' => 'value1',
            'variable2' => 'value2',
            'variable3' => 'value3',
            'variable4' => 'value4',
        ]);

        $array = [
            'This is a test {{variable1}} and {{variable2}}',
            'This is another test {{variable3}} and {{variable4}}',
        ];

        $resolvedArray = $handler->resolveExpressionsInArray($array);

        $this->assertEquals(['This is a test value1 and value2', 'This is another test value3 and value4'], $resolvedArray);
    }

    public function testResolveExpressionsInJsonLogicWithBasicVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'variable1' => 'value1',
        ]);

        $jsonLogic = [
            'var' => '{{variable1}}',
        ];

        $resolvedJsonLogic = $handler->resolveExpressionsInJsonLogic($jsonLogic);

        $this->assertEquals(['var' => 'value1'], $resolvedJsonLogic);
    }

    public function testResolveExpressionsInJsonLogicWithSimpleNestedVariable(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                    'name' => 'Test Workflow',
                ],
            ],
        ]);

        $jsonLogic = [
            'var' => '{{global.workflow.id}}',
        ];

        $resolvedJsonLogic = $handler->resolveExpressionsInJsonLogic($jsonLogic);

        $this->assertEquals(['var' => 123], $resolvedJsonLogic);
    }

    public function testResolveExpressionsInJsonLogicWithMultipleNestedVariables(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                    'name' => 'Test Workflow',
                ],
            ],
        ]);

        $jsonLogic = [
            'and' => [
                '{{global.workflow.id}}',
                '{{global.workflow.name}}',
            ],
        ];

        $resolvedJsonLogic = $handler->resolveExpressionsInJsonLogic($jsonLogic);

        $this->assertEquals(['and' => [123, 'Test Workflow']], $resolvedJsonLogic);
    }

    public function testResolveExpressionsInJsonLogicWithNestedLogicStructure(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'id' => 123,
                    'name' => 'Test Workflow',
                ],
            ],
        ]);

        $jsonLogic = [
            'and' => [
                'or' => [
                    '{{global.workflow.id}}',
                    '{{global.workflow.name}}',
                ],
            ],
        ];

        $resolvedJsonLogic = $handler->resolveExpressionsInJsonLogic($jsonLogic);

        $this->assertEquals(['and' => ['or' => [123, 'Test Workflow']]], $resolvedJsonLogic);
    }

    public function testResolveExpressionsInJsonLogicVariableHelper(): void
    {
        $handler = $this->createHandler();

        $handler->setAllVariables([
            'global' => [
                'workflow' => [
                    'created' => '2021-01-01',
                ],
            ],
        ]);

        $jsonLogic = [
            'var' => '{{date global.workflow.created input="Y-m-d" output="U"}}',
        ];

        $resolvedJsonLogic = $handler->resolveExpressionsInJsonLogic($jsonLogic);

        $this->assertEquals(['var' => 1609459200], $resolvedJsonLogic);
    }
}
