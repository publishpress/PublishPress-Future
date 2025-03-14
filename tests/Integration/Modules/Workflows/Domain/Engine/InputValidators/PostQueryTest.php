<?php

namespace PublishPress\Future\Tests\Integration\Modules\Workflows\Domain\Engine\InputValidators;


use \lucatume\WPBrowser\TestCase\WPTestCase;
use PublishPress\Future\Modules\Workflows\Domain\Engine\InputValidators\PostQuery;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\JsonLogicEngineInterface;
use PublishPress\Future\Modules\Workflows\Module;
use Brain\Monkey\Functions;
use Mockery;

class PostQueryTest extends WPTestCase
{
    /**
     * @var RuntimeVariablesHandlerInterface|Mockery\MockInterface
     */
    private $runtimeVariablesHandler;

    /**
     * @var JsonLogicEngineInterface|Mockery\MockInterface
     */
    private $jsonLogicEngine;

    public function setUp(): void
    {
        parent::setUp();

        $this->runtimeVariablesHandler = $this->createMock(RuntimeVariablesHandlerInterface::class);
        $this->jsonLogicEngine = $this->createMock(JsonLogicEngineInterface::class);
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

    private function createValidator(): PostQuery
    {
        return new PostQuery(
            $this->runtimeVariablesHandler,
            $this->jsonLogicEngine
        );
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostType()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post'
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['page']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndWorkflowPostType()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => Module::POST_TYPE_WORKFLOW
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => [Module::POST_TYPE_WORKFLOW]
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndEmptyPostType()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post'
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => []
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostType()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostId()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postIds' => [456]
                    ]
                ]
            ]
        ];

        $args = [
            'post' => 123,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostId()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postIds' => [123]
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostStatus()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'draft',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postStatus' => ['publish']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostStatus()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postStatus' => ['publish']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostAuthor()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postAuthor' => ['2']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostAuthor()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postAuthor' => ['1']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostTerms()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postTerms' => ['category:5']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostTerms()
    {
        $validator = $this->createValidator();

        $post = (object)[
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_author' => '1',
            'ID' => 123
        ];

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'postType' => ['post'],
                        'postTerms' => ['category:5']
                    ]
                ]
            ]
        ];

        $args = [
            'post' => $post,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithJsonPostQueryAndValidJson()
    {
        $validator = $this->createValidator();

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'json' => ['==', 1, 1]
                    ]
                ]
            ]
        ];

        $args = [
            'post' => null,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithJsonPostQueryAndInvalidJson()
    {
        $validator = $this->createValidator();

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'json' => ['==', 1, 2]
                    ]
                ]
            ]
        ];

        $args = [
            'post' => null,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithJsonPostQueryAndEmptyJson()
    {
        $validator = $this->createValidator();

        $node = [
            'data' => [
                'settings' => [
                    'postQuery' => [
                        'json' => []
                    ]
                ]
            ]
        ];

        $args = [
            'post' => null,
            'node' => $node
        ];

        $result = $validator->validate($args);

        $this->assertFalse($result);
    }
}
