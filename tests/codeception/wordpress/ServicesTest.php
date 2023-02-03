<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace wordpress;

use Codeception\Test\Unit;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Framework\WordPress\Models\PostModel;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use UnitTester;

class ServicesTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var \PublishPressFuture\Core\DI\ContainerInterface
     */
    protected $container;

    public function _before()
    {
        $services = require __DIR__ . '/../../../services.php';
        $this->container = new Container($services);
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
