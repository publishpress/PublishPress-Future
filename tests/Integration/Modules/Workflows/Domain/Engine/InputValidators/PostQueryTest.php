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

    /**
     * @var PostQuery
     */
    private $validator;

    public function setUp(): void
    {
        parent::setUp();

        $this->runtimeVariablesHandler = $this->createMock(RuntimeVariablesHandlerInterface::class);
        $this->jsonLogicEngine = $this->createMock(JsonLogicEngineInterface::class);

        $this->validator = new PostQuery(
            $this->runtimeVariablesHandler,
            $this->jsonLogicEngine
        );
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostType()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndWorkflowPostType()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndEmptyPostType()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostType()
    {
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

        $result = $this->validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostId()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostId()
    {
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

        $result = $this->validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostStatus()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostStatus()
    {
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

        $result = $this->validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostAuthor()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostAuthor()
    {
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

        $result = $this->validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndValidPostTerms()
    {
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

        $result = $this->validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithLegacyPostQueryAndInvalidPostTerms()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithJsonPostQueryAndValidJson()
    {
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

        $result = $this->validator->validate($args);

        $this->assertTrue($result);
    }

    public function testValidateWithJsonPostQueryAndInvalidJson()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }

    public function testValidateWithJsonPostQueryAndEmptyJson()
    {
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

        $result = $this->validator->validate($args);

        $this->assertFalse($result);
    }
}
