<?php

namespace Tests\Modules\Workflows\Domain\Engine;

use Codeception\Stub;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\BooleanResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\IntegerResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\StringResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\WorkflowResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\WorkflowVariablesHandler;
use stdClass;
use Tests\Support\UnitTester;

class WorkflowVariablesHandlerCest
{
    public function extractVariablePlaceholdersFromTextReturnsVariablesForCorrectText(UnitTester $I)
    {
        $text = 'This is a text with a {{variable}} and another {{global.variable}} and another {{global.variable.with.subproperty}}';

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $I->assertEquals([
            'variable',
            'global.variable',
            'global.variable.with.subproperty'
        ], $variables);
    }

    public function extractVariablePlaceholdersFromTextReturnsEmptyArrayWhenNoVariables(UnitTester $I)
    {
        $text = 'This is a text without variables';

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $I->assertEquals([], $variables);
    }

    public function extractVariablePlaceholdersFromTextReturnsEmptyArrayWhenEmptyText(UnitTester $I)
    {
        $text = '';

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $I->assertEquals([], $variables);
    }

    public function extractVariablePlaceholdersFromTextReturnsEmptyArrayWhenNullText(UnitTester $I)
    {
        $text = null;

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $I->assertEquals([], $variables);
    }

    public function getValueFromVariableReturnsCorrectValueWhenPassingSimpleVariable(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $result = $handler->getVariablesValue('variable', [
            'variable' => 'Variable value'
        ]);

        $I->assertEquals('Variable value', $result);
    }

    public function getValueFromVariableReturnsCorrectValueWhenPassingVariableAsStringResolver(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();
        $resolver = new StringResolver('Variable value');

        $result = $handler->getVariablesValue('name', $resolver);

        $I->assertEquals('Variable value', $result);
    }

    public function getValueFromVariableReturnsEmptyStringWhenVariableNotFound(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $result = $handler->getVariablesValue('variable', []);

        $I->assertEquals('', $result);
    }

    public function getValueFromVariableReturnsCorrectValueWhenPassingVariableAsBooleanResolver(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();
        $resolver = new BooleanResolver(true);

        $result = $handler->getVariablesValue('', $resolver);

        $I->assertEquals('Yes', $result);
    }

    public function getValueFromVariableReturnsCorrectValueWhenPassingVariableAsPostResolver(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $resolver = new PostResolver($post);

        $result = $handler->getVariablesValue('post_title', $resolver);

        $I->assertEquals('Post title', $result);
    }

    public function getValueFromVariableReturnsEmptyStringWhenPassingVariableAsPostResolverAndPropertyNotFound(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $resolver = new PostResolver($post);

        $result = $handler->getVariablesValue('non_existent_property', $resolver);

        $I->assertEquals('', $result);
    }

    public function getValueFromVariableReturnsCorrectValueWhenPassingVariableAsPostResolverAndPropertyIsPermalink(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $post->ID = 123;
        $resolver = Stub::make(PostResolver::class, [
            'getPermalink' => 'http://example.com/test-post',
            'post' => $post,
        ]);

        $result = $handler->getVariablesValue('permalink', $resolver);

        $I->assertEquals('http://example.com/test-post', $result);
    }

    public function parseNestedVariableValueReturnsCorrectValueForSimpleVariable(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $dataSources = [
            'test' => new IntegerResolver(235)
        ];

        $result = $handler->parseNestedVariableValue('test', $dataSources);

        $I->assertEquals('235', $result);
    }

    public function parseNestedVariableValueReturnsCorrectValueForNestedVariable(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $post->ID = 123;
        $postResolver = Stub::make(PostResolver::class, [
            'getPermalink' => 'http://example.com/test-post',
            'post' => $post,
        ]);

        $dataSources = [
            'global' => [
                'workflow' => new WorkflowResolver([
                    'id' => 175,
                    'title' => 'Test Workflow',
                    'description' => 'This is a test workflow',
                    'modified_at' => '2021-01-01 00:12:00'
                ]),
            ],
            'onSavePost1' => [
                'postId' => new IntegerResolver(235),
                'post' => $postResolver,
                'update' => new BooleanResolver(true),
            ],
        ];

        $I->assertEquals('175', $handler->parseNestedVariableValue('global.workflow.id', $dataSources));
        $I->assertEquals('Test Workflow', $handler->parseNestedVariableValue('global.workflow.title', $dataSources));
        $I->assertEquals('235', $handler->parseNestedVariableValue('onSavePost1.postId', $dataSources));
        $I->assertEquals('Yes', $handler->parseNestedVariableValue('onSavePost1.update', $dataSources));
        $I->assertEquals('Post title', $handler->parseNestedVariableValue('onSavePost1.post.post_title', $dataSources));
        $I->assertEquals('http://example.com/test-post', $handler->parseNestedVariableValue('onSavePost1.post.permalink', $dataSources));
    }

    public function replaceVariablesPlaceholdersInTextReturnsCorrectText(UnitTester $I)
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $post->ID = 123;
        $postResolver = Stub::make(PostResolver::class, [
            'getPermalink' => 'http://example.com/test-post',
            'post' => $post,
        ]);

        $dataSources = [
            'global' => [
                'workflow' => new WorkflowResolver([
                    'id' => 175,
                    'title' => 'Test Workflow',
                    'description' => 'This is a test workflow',
                    'modified_at' => '2021-01-01 00:12:00'
                ]),
            ],
            'onSavePost1' => [
                'postId' => new IntegerResolver(235),
                'post' => $postResolver,
                'update' => new BooleanResolver(true),
            ],
        ];

        $text = 'This is a test with a {{global.workflow.title}} and a {{onSavePost1.postId}} and a {{onSavePost1.update}}, {{onSavePost1.post.title}}, but not {{onSavePost1.post.non_existent_property}}.';

        $result = $handler->replaceVariablesPlaceholdersInText($text, $dataSources);

        $I->assertEquals('This is a test with a Test Workflow and a 235 and a Yes, Post title, but not .', $result);
    }

    public function getGlobalVariablesReturnsCorrectValues(UnitTester $I)
    {
        $handler = Stub::make(WorkflowVariablesHandler::class, [
            'getUserGlobal' => new stdClass(),
            'getSiteGlobal' => new stdClass(),
            'getTriggerGlobal' => new stdClass(),
            'getWorkflowGlobal' => new stdClass(),
        ]);

        $workflow = new stdClass();
        $workflow->id = 175;
        $workflow->title = 'Test Workflow';
        $workflow->description = 'This is a test workflow';
        $workflow->modified_at = '2021-01-01 00:12:00';

        $result = $handler->getGlobalVariables($workflow);

        $I->assertArrayHasKey('workflow', $result);
        $I->assertArrayHasKey('user', $result);
        $I->assertArrayHasKey('site', $result);
        $I->assertArrayHasKey('trigger', $result);
    }
}
