<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace Core\WordPress;

use Codeception\Test\Unit;
use PublishPressFuture\Modules\PostExpirator;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostStatusToDraft;
use PublishPressFuture\Modules\PostExpirator\Strategies\PostStatusToPrivate;
use PublishPressFuture\Modules\PostExpirator\ActionMapper;
use PublishPressFuture\Modules\PostExpirator\ActionsAbstract;
use PublishPressFuture\Modules\PostExpirator\Exceptions\UndefinedActionException;

use WordpressTester;

use function sq;


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
