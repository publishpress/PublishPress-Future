<?php

namespace PublishPress\Future\Tests\Integration\Modules\Workflows\Domain\Caches;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Caches\PostCache;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

class PostCacheTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    private $postCache;
    private $hookable;
    private $postId;
    private $postBefore;
    private $postAfter;

    public function setUp(): void
    {
        parent::setUp();

        // Create a real implementation of HookableInterface that uses WordPress hooks
        $container = Container::getInstance();
        $this->hookable = $container->get(ServicesAbstract::HOOKS);

        // Create the PostCache instance with real hookable implementation
        $this->postCache = new PostCache($this->hookable);

        // Setup the hooks
        $this->postCache->setup();

        // Create a test post
        $this->postId = $this->factory->post->create([
            'post_title' => 'Original Title',
            'post_content' => 'Original Content',
            'post_status' => 'publish'
        ]);

        // Get the post object
        $this->postBefore = get_post($this->postId);
    }

    public function tearDown(): void
    {
        wp_delete_post($this->postId, true);
        parent::tearDown();
    }

    public function testSetupRegistersHooks()
    {
        // Check if our hooks are registered
        $this->assertTrue(has_action(HooksAbstract::ACTION_PRE_POST_UPDATE));
        $this->assertTrue(has_action(HooksAbstract::ACTION_POST_UPDATED));
    }

    public function testCachePermalinkViaHook()
    {
        // Trigger the pre-update hook
        do_action(HooksAbstract::ACTION_PRE_POST_UPDATE, $this->postId);

        // Get the cached permalink
        $cachedPermalink = $this->postCache->getCachedPermalink($this->postId);

        // Assert that the permalink was cached correctly
        $this->assertNotNull($cachedPermalink);
        $this->assertEquals(get_permalink($this->postId), $cachedPermalink['postBefore']);
        $this->assertNull($cachedPermalink['postAfter']);
    }

    public function testCachePostsViaHook()
    {
        // Update the post to create a different version
        wp_update_post([
            'ID' => $this->postId,
            'post_title' => 'Updated Title',
            'post_content' => 'Updated Content'
        ]);

        // Get the updated post
        $this->postAfter = get_post($this->postId);

        // Trigger the post-updated hook
        do_action(HooksAbstract::ACTION_POST_UPDATED, $this->postId, $this->postAfter, $this->postBefore);

        // Get the cached posts
        $cachedPosts = $this->postCache->getCachedPosts($this->postId);

        // Assert that the posts were cached correctly
        $this->assertNotNull($cachedPosts);
        $this->assertSame($this->postAfter, $cachedPosts['postAfter']);
        $this->assertSame($this->postBefore, $cachedPosts['postBefore']);
    }

    public function testCachePostsAndPermalinkViaHooks()
    {
        // First trigger the pre-update hook
        do_action(HooksAbstract::ACTION_PRE_POST_UPDATE, $this->postId);

        // Update the post to create a different version
        wp_update_post([
            'ID' => $this->postId,
            'post_title' => 'Updated Title',
            'post_content' => 'Updated Content'
        ]);

        // Get the updated post
        $this->postAfter = get_post($this->postId);

        // Then trigger the post-updated hook
        do_action(HooksAbstract::ACTION_POST_UPDATED, $this->postId, $this->postAfter, $this->postBefore);

        // Get the cached permalink
        $cachedPermalink = $this->postCache->getCachedPermalink($this->postId);

        // Assert that both before and after permalinks are set
        $this->assertNotNull($cachedPermalink);
        $this->assertEquals(get_permalink($this->postId), $cachedPermalink['postBefore']);
        $this->assertEquals(get_permalink($this->postId), $cachedPermalink['postAfter']);

        // Also check the cached posts
        $cachedPosts = $this->postCache->getCachedPosts($this->postId);
        $this->assertNotNull($cachedPosts);
        $this->assertSame($this->postAfter, $cachedPosts['postAfter']);
        $this->assertSame($this->postBefore, $cachedPosts['postBefore']);
    }

    public function testGetCachedPermalinkForNonExistentPost()
    {
        // Try to get a cached permalink for a non-existent post
        $nonExistentPostId = 99999;
        $cachedPermalink = $this->postCache->getCachedPermalink($nonExistentPostId);

        // Assert that null is returned
        $this->assertNull($cachedPermalink);
    }

    public function testGetCachedPostsForNonExistentPost()
    {
        // Try to get cached posts for a non-existent post
        $nonExistentPostId = 99999;
        $cachedPosts = $this->postCache->getCachedPosts($nonExistentPostId);

        // Assert that null is returned
        $this->assertNull($cachedPosts);
    }
}
