<?php

use Codeception\Util\Shared\Asserts;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Framework\WordPress\Models\PostModel;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class Test extends \Codeception\TestCase\WPTestCase
{
    /**
     * @var \WpunitTester
     */
    protected $tester;

    /**
     * @var \PublishPressFuture\Core\DI\ContainerInterface
     */
    protected $container;

    public function setUp(): void
    {
        // Before...
        parent::setUp();

        $services = require __DIR__ . '/../../../services.php';
        $this->container = new Container($services);
    }

    public function tearDown(): void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    // Tests
    public function testItWorks()
    {
        $post = static::factory()->post->create_and_get();

        $this->assertInstanceOf(\WP_Post::class, $post);
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    public function testPostModelFactory()
    {
        $factory = $this->container->get(ServicesAbstract::POST_MODEL_FACTORY);

        $this->assertIsCallable($factory);

        $postId = $this->tester->factory()->post->create(
            [
                'post_title' => 'TitleA',
            ]
        );

        $model = $factory($postId);

        $this->assertIsObject($model);
        $this->assertInstanceOf(PostModel::class, $model);
    }

    /**
     * @throws NotFoundExceptionInterface
     * @throws ContainerExceptionInterface
     */
    public function testExpirablePostModelFactory()
    {
        $factory = $this->container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);

        $this->assertIsCallable($factory);

        $postId = $this->tester->factory()->post->create(
            [
                'post_title' => 'TitleB',
            ]
        );

        $model = $factory($postId);

        $this->assertIsObject($model);
        $this->assertInstanceOf(ExpirablePostModel::class, $model);
    }
}
