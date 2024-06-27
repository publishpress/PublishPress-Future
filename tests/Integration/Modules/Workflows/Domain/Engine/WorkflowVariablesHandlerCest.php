<?php


namespace Tests\Modules\Workflows\Domain\Engine;

use lucatume\WPBrowser\TestCase\WPTestCase;
use Codeception\Stub;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use WP_User;

class WorkflowVariablesHandlerCest extends WPTestCase
{
    public function tryToTest()
    {
        $user = Stub::makeEmpty(new WP_User(), [
            'ID' => 1,
            'user_login' => 'admin',
            'user_email' => '',
            'roles' => ['administrator'],
            'caps' => ['edit_post' => true],
            'display_name' => 'Admin',
            'user_registered' => '2021-01-01 00:00:00',
        ]);

        $post = Stub::makeEmpty('WP_Post', [
            'ID' => 134,
            'post_title' => 'Test Post',
            'post_content' => 'This is a test post',
            'post_excerpt' => 'This is a test post excerpt',
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_date' => '2021-01-01 00:00:00',
            'post_modified' => '2021-01-01 00:00:00',
            'getPermalink' => 'http://example.com/test-post',
        ]);

        $dataSources = [
            'global' => [
                'workflow' => new WorkflowResolver([
                    'id' => 175,
                    'title' => 'Test Workflow',
                    'description' => 'This is a test workflow',
                    'modified_at' => '2021-01-01 00:12:00'
                ]),
                'user' => new UserResolver($user),
                'site' => new SiteResolver(),
                'trigger' => new NodeResolver([
                    'ID' => 1,
                    'name' => 'Post is saved',
                    'label' => 'Post is saved',
                    'activation_timestamp' => '2021-01-01 00:00:15'
                ]),
            ],
            'onSavePost1' => [
                'postId' => new IntegerResolver(134),
                'post' => new PostResolver($post),
                'update' => new BooleanResolver(true),
            ],
        ];


    }
}
