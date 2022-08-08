<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Core\Framework;

use Codeception\Test\Unit;
use PublishPressFuture\Modules\Expirator\ExpirationActionMapper;
use PublishPressFuture\Modules\Expirator\ActionsAbstract;
use PublishPressFuture\Modules\Expirator\Exceptions\UndefinedActionException;
use PublishPressFuture\Modules\Expirator\Actions\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\Actions\PostStatusToPrivate;
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
            ExpirationActionMapper::class
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
                    ExpirationActionMapper::class
                );

                $mapper->map('undefined-action');
            }
        );
    }
}
