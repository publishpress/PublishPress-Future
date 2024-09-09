<?php

namespace Tests\Framework\WordPress\Models;

use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Framework\WordPress\Models\PostModel;
use PublishPress\Future\Modules\Expirator\HooksAbstract;

class PostModelTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function testAddMetaWithUnfilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $postModel->addMeta($metaKey, $metaValue);

        $this->assertEquals($metaValue, get_post_meta($post->ID, $metaKey, true));
    }

    public function testAddMetaWithFilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $filteredMetaKey = 'filtered_color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        add_filter(HooksAbstract::FILTER_ACTION_META_KEY, function ($key) use ($filteredMetaKey) {
            if ($key === 'color') {
                return $filteredMetaKey;
            }

            return $key;
        }, 10);

        $postModel->addMeta($metaKey, $metaValue);

        $this->assertEquals($metaValue, get_post_meta($post->ID, $filteredMetaKey, true));
        $this->assertEmpty(get_post_meta($post->ID, $metaKey, true));
    }

    public function testUpdateMetaWithUnfilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $postModel->updateMeta($metaKey, $metaValue);

        $this->assertEquals($metaValue, get_post_meta($post->ID, $metaKey, true));
    }

    public function testUpdateMetaWithFilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $filteredMetaKey = 'filtered_color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        add_filter(HooksAbstract::FILTER_ACTION_META_KEY, function ($key) use ($filteredMetaKey) {
            if ($key === 'color') {
                return $filteredMetaKey;
            }

            return $key;
        }, 10);

        $postModel->updateMeta($metaKey, $metaValue);

        $this->assertEquals($metaValue, get_post_meta($post->ID, $filteredMetaKey, true));
        $this->assertEmpty(get_post_meta($post->ID, $metaKey, true));
    }

    public function testDeleteMetaWithUnfilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $postModel->addMeta($metaKey, $metaValue);

        $postModel->deleteMeta($metaKey);

        $this->assertEmpty(get_post_meta($post->ID, $metaKey, true));
    }

    public function testDeleteMetaWithFilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $filteredMetaKey = 'filtered_color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        add_filter(HooksAbstract::FILTER_ACTION_META_KEY, function ($key) use ($filteredMetaKey) {
            if ($key === 'color') {
                return $filteredMetaKey;
            }

            return $key;
        }, 10);

        $postModel->addMeta($metaKey, $metaValue);

        $postModel->deleteMeta($metaKey);

        $this->assertEmpty(get_post_meta($post->ID, $filteredMetaKey, true));
    }

    public function testGetMetaWithUnfilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        add_post_meta($post->ID, $metaKey, $metaValue);

        $this->assertEquals($metaValue, $postModel->getMeta($metaKey, true));
    }

    public function testGetMetaWithFilteredMetaKey(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $filteredMetaKey = 'filtered_color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        add_filter(HooksAbstract::FILTER_ACTION_META_KEY, function ($key) use ($filteredMetaKey) {
            if ($key === 'color') {
                return $filteredMetaKey;
            }

            return $key;
        }, 10);

        add_post_meta($post->ID, $filteredMetaKey, $metaValue);

        $this->assertEquals($metaValue, $postModel->getMeta($metaKey, true));
    }

    public function testSetPostStatus(): void
    {
        $post = static::factory()->post->create_and_get();

        $this->assertInstanceOf(\WP_Post::class, $post);
        $this->assertEquals('publish', $post->post_status);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $postModel->setPostStatus('draft');

        $this->assertEquals('draft', get_post_status($post->ID));
    }

    public function testPostExistsRetursTrueWhenPostExists(): void
    {
        $post = static::factory()->post->create_and_get();

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $this->assertTrue($postModel->postExists());
    }

    public function testPostExistsThrowsExceptionWhenPostDoesNotExist(): void
    {
        $this->expectException(\PublishPress\Future\Framework\WordPress\Exceptions\NonexistentPostException::class);

        $postModel = new PostModel(
            999999,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $postModel->postExists();
    }

    public function testGetPostTypeReturnsPostType(): void
    {
        $post = static::factory()->post->create_and_get();

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $this->assertEquals('post', $postModel->getPostType());
    }

    public function testMetadataExistsReturnsTrueWhenUnfilteredMetadataExists(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        add_post_meta($post->ID, $metaKey, $metaValue);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $this->assertTrue($postModel->metadataExists($metaKey));
    }

    public function testeMetadataExistsReturnsFalseWhenUnfilteredMetadataDoesNotExist(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';

        $this->assertInstanceOf(\WP_Post::class, $post);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $this->assertFalse($postModel->metadataExists($metaKey));
    }

    public function testMetadataExistsReturnsTrueWhenFilteredMetadataExists(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $filteredMetaKey = 'filtered_color';
        $metaValue = 'blue';

        $this->assertInstanceOf(\WP_Post::class, $post);

        add_filter(HooksAbstract::FILTER_ACTION_META_KEY, function ($key) use ($filteredMetaKey) {
            if ($key === 'color') {
                return $filteredMetaKey;
            }

            return $key;
        }, 10);

        add_post_meta($post->ID, $filteredMetaKey, $metaValue);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $this->assertTrue($postModel->metadataExists($metaKey));
    }

    public function testMetadataExistsReturnsFalseWhenFilteredMetadataDoesNotExist(): void
    {
        $post = static::factory()->post->create_and_get();

        $metaKey = 'color';
        $filteredMetaKey = 'filtered_color';

        $this->assertInstanceOf(\WP_Post::class, $post);

        add_filter(HooksAbstract::FILTER_ACTION_META_KEY, function ($key) use ($filteredMetaKey) {
            if ($key === 'color') {
                return $filteredMetaKey;
            }

            return $key;
        }, 10);

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $this->assertFalse($postModel->metadataExists($metaKey));
    }

    public function testSetPostStatusSetsPostStatusToPublish(): void
    {
        $post = static::factory()->post->create_and_get();
        $post->post_status = 'draft';
        $post->post_date = '2034-01-01 00:00:00';
        wp_update_post($post);

        $this->assertEquals('draft', get_post_status($post->ID));

        $postModel = new PostModel(
            $post->ID,
            function () {
                return null;
            },
            $this->createStub(\PublishPress\Future\Modules\Debug\DebugInterface::class),
            new HooksFacade()
        );

        $postModel->publish();

        $this->assertEquals('publish', get_post_status($post->ID));
    }
}
