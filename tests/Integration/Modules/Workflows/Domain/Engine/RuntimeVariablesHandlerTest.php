<?php

namespace Tests\Modules\Workflows\Domain\Engine;

use Codeception\Stub;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHandler;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use stdClass;


class RuntimeVariablesHandlerTest extends \lucatume\WPBrowser\TestCase\WPTestCase
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

    public function testExtractPlaceholdersFromTextReturnsVariablesForCorrectText(): void
    {
        $text = 'This is a text with a {{variable}} and another {{global.variable}} and another {{global.variable.with.subproperty}}';

        $handler = new RuntimeVariablesHandler();

        $variables = $handler->extractPlaceholdersFromText($text);

        $this->assertEquals([
            'variable',
            'global.variable',
            'global.variable.with.subproperty'
        ], $variables);
    }

    public function testExtractPlaceholdersFromTextReturnsEmptyArrayWhenNoVariables(): void
    {
        $text = 'This is a text without variables';

        $handler = new RuntimeVariablesHandler();

        $variables = $handler->extractPlaceholdersFromText($text);

        $this->assertEquals([], $variables);
    }

    public function testExtractPlaceholdersFromTextReturnsEmptyArrayWhenEmptyText(): void
    {
        $text = '';

        $handler = new RuntimeVariablesHandler();

        $variables = $handler->extractPlaceholdersFromText($text);

        $this->assertEquals([], $variables);
    }

    public function testExtractPlaceholdersFromTextReturnsEmptyArrayWhenNullText(): void
    {
        $text = null;

        $handler = new RuntimeVariablesHandler();

        $variables = $handler->extractPlaceholdersFromText($text);

        $this->assertEquals([], $variables);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingSimpleVariable(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'variable' => new StringResolver('Variable value'),
        ]);

        $result = $handler->getVariable('variable');

        $this->assertEquals('Variable value', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsStringResolver(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'name' => new StringResolver('Variable value'),
        ]);

        $result = $handler->getVariable('name');

        $this->assertEquals('Variable value', $result);
    }

    public function testGetValueFromVariableReturnsEmptyStringWhenVariableNotFound(): void
    {
        $handler = new RuntimeVariablesHandler();

        $result = $handler->getVariable('variable', []);

        $this->assertEquals('', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsBooleanResolver(): void
    {
        $handler = new RuntimeVariablesHandler();
        $resolver = new BooleanResolver(true);

        $handler->setAllVariables([
            'boolean' => $resolver,
        ]);

        $result = $handler->getVariable('boolean');

        $this->assertEquals(true, $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsPostResolver(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'post' => [
                'title' => 'Post title',
            ],
        ]);

        $result = $handler->getVariable('post.title');

        $this->assertEquals('Post title', $result);
    }

    public function testGetValueFromVariableReturnsEmptyStringWhenPassingVariableAsPostResolverAndPropertyNotFound(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'post' => [
                'title' => 'Post title',
            ],
        ]);

        $result = $handler->getVariable('non_existent_property');

        $this->assertEquals('', $result);
    }

    public function testGetValueFromVariableReturnsCorrectValueWhenPassingVariableAsPostResolverAndPropertyIsPermalink(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'post' => [
                'permalink' => 'http://example.com/test-post',
            ],
        ]);

        $result = $handler->getVariable('post.permalink');

        $this->assertEquals('http://example.com/test-post', $result);
    }

    public function testParseNestedVariableValueReturnsCorrectValueForSimpleVariable(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'test' => new IntegerResolver(235)
        ]);

        $result = $handler->getVariable('test');

        $this->assertEquals('235', $result);
    }

    public function testParseNestedVariableValueReturnsCorrectValueForNestedVariable(): void
    {
        $handler = new RuntimeVariablesHandler();

        $postId = $this->factory()->post->create([
            'post_title' => 'Post title'
        ]);
        $post = get_post($postId);

        $hooks = $this->makeEmpty(HookableInterface::class);

        $handler->setAllVariables([
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
                'post' => new PostResolver($post, $hooks),
                'update' => new BooleanResolver(true),
            ],
        ]);

        $result = $handler->getVariable('onSavePost1.post.post_title');

        $this->assertEquals('Post title', $result);

        $this->assertEquals('175', $handler->getVariable('global.workflow.id'));
        $this->assertEquals('Test Workflow', $handler->getVariable('global.workflow.title'));
        $this->assertEquals('235', $handler->getVariable('onSavePost1.postId'));
        $this->assertEquals('Yes', $handler->getVariable('onSavePost1.update'));
        $this->assertEquals('Post title', $handler->getVariable('onSavePost1.post.post_title'));
        $this->assertEquals(get_permalink($postId), $handler->getVariable('onSavePost1.post.permalink'));
    }

    public function replaceReturnsCorrectText(): void
    {
        $handler = new RuntimeVariablesHandler();

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

        $result = $handler->replacePlaceholdersInText($text, $dataSources);

        $this->assertEquals('This is a test with a Test Workflow and a 235 and a Yes, Post title, but not .', $result);
    }

    public function testGetGlobalVariablesReturnsCorrectValues(): void
    {
        $handler = new RuntimeVariablesHandler();

        $handler->setAllVariables([
            'workflow' => ['id' => 175],
            'user' => ['id' => 235],
            'site' => ['id' => 357],
            'trigger' => ['id' => 478],
        ]);

        $result = $handler->getAllVariables();

        $this->assertEquals(235, $result['user']['id']);
        $this->assertEquals(357, $result['site']['id']);
        $this->assertEquals(478, $result['trigger']['id']);
        $this->assertEquals(175, $result['workflow']['id']);
    }
}
