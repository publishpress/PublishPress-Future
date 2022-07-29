<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Core\Framework;

use Codeception\Test\Unit;
use PublishPressFuture\Modules\Expirator\ActionMapper;
use PublishPressFuture\Modules\Expirator\ActionsAbstract;
use PublishPressFuture\Modules\Expirator\Exceptions\UndefinedActionException;
use PublishPressFuture\Modules\Expirator\Strategies\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\Strategies\PostStatusToPrivate;
use WordpressTester;


class ActionMapperTest extends Unit
{
    /**
     * @var WordpressTester
     */
    protected $tester;

    public function testMapToExistentActionReturnActionClassName()
    {
        $mapper = $this->construct(
            ActionMapper::class
        );

        $actionName = $mapper->map(ActionsAbstract::POST_STATUS_TO_DRAFT);

        $this->assertIsString($actionName);
        $this->assertEquals(PostStatusToDraft::class, $actionName);

        $actionName = $mapper->map(ActionsAbstract::POST_STATUS_TO_PRIVATE);

        $this->assertIsString($actionName);
        $this->assertEquals(PostStatusToPrivate::class, $actionName);
    }

    public function testMapToNonExistentActionThrowsException()
    {
        $this->tester->expectThrowable(
            UndefinedActionException::class,
            function() {
                $mapper = $this->construct(
                    ActionMapper::class
                );

                $mapper->map('undefined-action');
            }
        );
    }
}
