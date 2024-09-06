<?php

namespace Tests\Modules\Workflows\Domain\Engine;

use Codeception\Stub;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\WorkflowVariablesHandler;
use stdClass;


class WorkflowVariablesHandlerTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function setUp() :void
    {
        // Before...
        parent::setUp();

        // Your set up methods here.
    }

    public function tearDown() :void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    public function testExtractVariablePlaceholdersFromTextReturnsVariablesForCorrectText(): void
    {
        $text = 'This is a text with a {{variable}} and another {{global.variable}} and another {{global.variable.with.subproperty}}';

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $this->assertEquals([
            'variable',
            'global.variable',
            'global.variable.with.subproperty'
        ], $variables);
    }

    public function testExtractVariablePlaceholdersFromTextReturnsEmptyArrayWhenNoVariables(): void
    {
        $text = 'This is a text without variables';

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $this->assertEquals([], $variables);
    }

    public function testExtractVariablePlaceholdersFromTextReturnsEmptyArrayWhenEmptyText(): void
    {
        $text = '';

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $this->assertEquals([], $variables);
    }

    public function testExtractVariablePlaceholdersFromTextReturnsEmptyArrayWhenNullText(): void
    {
        $text = null;

        $handler = new WorkflowVariablesHandler();

        $variables = $handler->extractVariablePlaceholdersFromText($text);

        $this->assertEquals([], $variables);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingSimpleVariable(): void
    {
        $handler = new WorkflowVariablesHandler();

        $result = $handler->getVariablesValue('variable', [
            'variable' => 'Variable value'
        ]);

        $this->assertEquals('Variable value', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsStringResolver(): void
    {
        $handler = new WorkflowVariablesHandler();
        $resolver = new StringResolver('Variable value');

        $result = $handler->getVariablesValue('name', $resolver);

        $this->assertEquals('Variable value', $result);
    }

    public function testGetValueFromVariableReturnsEmptyStringWhenVariableNotFound(): void
    {
        $handler = new WorkflowVariablesHandler();

        $result = $handler->getVariablesValue('variable', []);

        $this->assertEquals('', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsBooleanResolver(): void
    {
        $handler = new WorkflowVariablesHandler();
        $resolver = new BooleanResolver(true);

        $result = $handler->getVariablesValue('', $resolver);

        $this->assertEquals('Yes', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsPostResolver(): void
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $resolver = new PostResolver($post);

        $result = $handler->getVariablesValue('post_title', $resolver);

        $this->assertEquals('Post title', $result);
    }

    public function testGetValueFromVariableReturnsEmptyStringWhenPassingVariableAsPostResolverAndPropertyNotFound(): void
    {
        $handler = new WorkflowVariablesHandler();

        $post = new stdClass();
        $post->post_title = 'Post title';
        $resolver = new PostResolver($post);

        $result = $handler->getVariablesValue('non_existent_property', $resolver);

        $this->assertEquals('', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsPostResolverAndPropertyIsPermalink(): void
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

        $this->assertEquals('http://example.com/test-post', $result);
    }

    public function testParseNestedVariableValueReturnsCorrectValueForSimpleVariable(): void
    {
        $handler = new WorkflowVariablesHandler();

        $dataSources = [
            'test' => new IntegerResolver(235)
        ];

        $result = $handler->parseNestedVariableValue('test', $dataSources);

        $this->assertEquals('235', $result);
    }

    public function testParseNestedVariableValueReturnsCorrectValueForNestedVariable(): void
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

        $this->assertEquals('175', $handler->parseNestedVariableValue('global.workflow.id', $dataSources));
        $this->assertEquals('Test Workflow', $handler->parseNestedVariableValue('global.workflow.title', $dataSources));
        $this->assertEquals('235', $handler->parseNestedVariableValue('onSavePost1.postId', $dataSources));
        $this->assertEquals('Yes', $handler->parseNestedVariableValue('onSavePost1.update', $dataSources));
        $this->assertEquals('Post title', $handler->parseNestedVariableValue('onSavePost1.post.post_title', $dataSources));
        $this->assertEquals('http://example.com/test-post', $handler->parseNestedVariableValue('onSavePost1.post.permalink', $dataSources));
    }

    public function testReplaceVariablesPlaceholdersInTextReturnsCorrectText(): void
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

        $this->assertEquals('This is a test with a Test Workflow and a 235 and a Yes, Post title, but not .', $result);
    }

    public function testGetGlobalVariablesReturnsCorrectValues(): void
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

        $this->assertArrayHasKey('workflow', $result);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('site', $result);
        $this->assertArrayHasKey('trigger', $result);

        $this->assertEquals(new stdClass(), $result['user']);
        $this->assertEquals(new stdClass(), $result['site']);
        $this->assertEquals(new stdClass(), $result['trigger']);
        $this->assertEquals(new stdClass(), $result['workflow']);
    }
}
