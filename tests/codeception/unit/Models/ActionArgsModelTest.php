<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Models;

use Codeception\Test\Unit;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Modules\Expirator\Models\ActionArgsModel;
use UnitTester;

class ActionArgsModelTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    public function testGetId()
    {
        $expected = 1;

        $model = $this->make(
            ActionArgsModel::class,
            [
                'id' => $expected,
            ]
        );

        $result = $model->getId();

        $this->assertIsInt($result);
        $this->assertEquals($expected, $result);
    }

    public function testGetCronActionId()
    {
        $expected = 1;

        $model = $this->make(
            ActionArgsModel::class,
            [
                'cronActionId' => $expected,
            ]
        );

        $result = $model->getCronActionId();

        $this->assertIsInt($result);
        $this->assertEquals($expected, $result);
    }

    public function testSetCronActionId()
    {
        $expected = 1;

        $model = $this->make(
            ActionArgsModel::class,
            [
                'cronActionId' => 2,
            ]
        );

        $model->setCronActionId($expected);

        $result = $model->getCronActionId();

        $this->assertIsInt($result);
        $this->assertEquals($expected, $result);
    }

    public function testGetPostId()
    {
        $expected = 1;

        $model = $this->make(
            ActionArgsModel::class,
            [
                'postId' => $expected,
            ]
        );

        $result = $model->getPostId();

        $this->assertIsInt($result);
        $this->assertEquals($expected, $result);
    }

    public function testSetPostId()
    {
        $expected = 1;

        $model = $this->make(
            ActionArgsModel::class,
            [
                'postId' => 2,
            ]
        );

        $model->setPostId($expected);

        $result = $model->getPostId();

        $this->assertIsInt($result);
        $this->assertEquals($expected, $result);
    }

    public function testGetArgs()
    {
        $expected = [
            'post_id' => 1,
            'post_status' => 'publish',
        ];

        $model = $this->make(
            ActionArgsModel::class,
            [
                'args' => $expected,
            ]
        );

        $result = $model->getArgs();

        $this->assertIsArray($result);
        $this->assertEquals($expected, $result);
    }

    public function testSetArgs()
    {
        $expected = [
            'post_id' => 1,
            'post_status' => 'publish',
        ];

        $model = $this->make(
            ActionArgsModel::class,
            [
                'args' => [
                    'post_id' => 2,
                    'post_status' => 'draft',
                ],
            ]
        );

        $model->setArgs($expected);

        $result = $model->getArgs();

        $this->assertIsArray($result);
        $this->assertEquals($expected, $result);
    }

    public function testGetCreatedAt()
    {
        $expected = '2023-04-01 03:06:10';

        $model = $this->make(
            ActionArgsModel::class,
            [
                'createdAt' => $expected,
            ]
        );

        $result = $model->getCreatedAt();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }

    public function testSetCreatedAt()
    {
        $expected = '2023-04-01 03:06:10';

        $model = $this->make(
            ActionArgsModel::class,
            [
                'createdAt' => '2023-03-16 15:13:20',
            ]
        );

        $model->setCreatedAt($expected);

        $result = $model->getCreatedAt();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }

    public function testGetScheduledDate()
    {
        $expected = '2023-04-01 03:06:10';

        $model = $this->make(
            ActionArgsModel::class,
            [
                'scheduledDate' => $expected,
            ]
        );

        $result = $model->getScheduledDate();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }

    public function testGetScheduledDateAsUnixTime()
    {
        $model = $this->make(
            ActionArgsModel::class,
            [
                'scheduledDate' => '2023-03-16 15:13:20',
            ]
        );

        $result = $model->getScheduledDateAsUnixTime();

        $this->assertIsInt($result);
        $this->assertEquals(1678979600, $result);
    }

    public function testSetScheduledDate()
    {
        $expected = '2023-04-01 03:06:10';

        $model = $this->make(
            ActionArgsModel::class,
            [
                'scheduledDate' => '2023-03-16 15:13:20',
            ]
        );

        $model->setScheduledDate($expected);

        $result = $model->getScheduledDate();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }

    public function testSetScheduledDateFromUnixTime()
    {
        $expected = '2023-04-01 06:06:10';

        $model = $this->make(
            ActionArgsModel::class,
            [
                'scheduledDate' => '2023-03-16 15:13:20',
            ]
        );

        $model->setScheduledDateFromUnixTime(1680329170);

        $result = $model->getScheduledDate();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }
}
