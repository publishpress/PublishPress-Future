<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Core\Framework;

use Codeception\Test\Unit;
use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\ExpirationActionMapper;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToPrivate;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
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

        $actionName = $mapper->map(ExpirationActionsAbstract::POST_STATUS_TO_DRAFT);

        $this->assertIsString($actionName);
        $this->assertEquals(PostStatusToDraft::class, $actionName);

        $actionName = $mapper->map(ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE);

        $this->assertIsString($actionName);
        $this->assertEquals(PostStatusToPrivate::class, $actionName);
    }

    public function testMapToNonExistentActionThrowsException()
    {
        $this->tester->expectThrowable(
            NonexistentPostException::class,
            function() {
                $mapper = $this->construct(
                    ExpirationActionMapper::class
                );

                $mapper->map('undefined-action');
            }
        );
    }
}
