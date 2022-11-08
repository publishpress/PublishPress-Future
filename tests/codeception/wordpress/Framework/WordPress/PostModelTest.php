<?php
namespace wordpress\Framework\WordPress;

use Codeception\TestCase\WPTestCase;
use PublishPressFuture\Framework\WordPress\Models\PostModel;
use WordpressTester;


class PostModelTest extends WPTestCase
{
    /**
     * @var WordpressTester
     */
    protected $tester;

    public function testUpdatePostData()
    {
        $postId = $this->tester->factory()->post->create(
            [
                'post_title' => 'TitleA',
            ]
        );

        $post = get_post($postId);

        $this->assertEquals('TitleA', $post->post_title);

        $postModel = new PostModel($postId);
        $postModel->update(['post_title' => 'TitleB']);

        $post = get_post($postId);
        $this->assertEquals('TitleB', $post->post_title);
    }

    public function testSetPostStatus()
    {
        $postId = $this->tester->factory()->post->create(
            [
                'post_status' => 'draft',
            ]
        );

        $post = get_post($postId);

        $this->assertEquals('draft', $post->post_status);

        $actionsCount = [
            'transition_post_status' => 0,
            'draft_to_private' => 0
        ];

        // Initial count for each action
        array_walk($actionsCount, function(&$count, $actionName) {
            $count = did_action($actionName);
        });

        // Update the post
        $postModel = new PostModel($postId);
        $postModel->setPostStatus('private');

        $post = get_post($postId);
        $this->assertEquals('private', $post->post_status);

        // Did the status transition actions were called?
        array_walk($actionsCount, function($count, $actionName) {
            $this->assertGreaterThan($count, did_action($actionName), $actionName);
        });
    }
}
