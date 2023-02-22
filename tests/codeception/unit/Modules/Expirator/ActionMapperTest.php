<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Modules\Expirator;

use Codeception\Test\Unit;
use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\ExpirationActionMapper;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToPrivate;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel;
use WordpressTester;


class ActionMapperTest extends Unit
{
    /**
     * @var WordpressTester
     */
    protected $tester;

    /**
     * @dataProvider providerActions
     */
    public function testMapToExistentActionReturnActionClassName($inputActions)
    {
        $actionsModelMockup = $this->makeEmpty(
            ExpirationActionsModel::class,
            [
                'getActions' => $inputActions
            ]
        );

        $mapper = $this->construct(
            ExpirationActionMapper::class,
            [
                'actionsModel' => $actionsModelMockup,
            ]
        );

        $mappedActionClass = $mapper->mapToClass('draft');

        $this->assertIsString($mappedActionClass);
        $this->assertEquals(PostStatusToDraft::class, $mappedActionClass);
    }

    /**
     * @dataProvider providerActions
     */
    public function testMapToNonExistentActionThrowsException($inputActions)
    {
        $actionsModelMockup = $this->makeEmpty(
            ExpirationActionsModel::class,
            [
                'getActions' => $inputActions,
            ]
        );

        $this->tester->expectThrowable(
            NonexistentPostException::class,
            function () use ($actionsModelMockup) {
                $mapper = $this->construct(
                    ExpirationActionMapper::class,
                    [
                        'actionsModel' => $actionsModelMockup,
                    ]
                );

                $mapper->mapToClass('undefined-action');
            }
        );
    }

    public function providerActions()
    {
        return [
            [
                [
                    [
                        ExpirationActionsModel::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_STATUS_TO_DRAFT,
                        ExpirationActionsModel::ACTION_LABEL_ATTRIBUTE => 'Draft',
                    ],
                    [
                        ExpirationActionsModel::ACTION_NAME_ATTRIBUTE => ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE,
                        ExpirationActionsModel::ACTION_LABEL_ATTRIBUTE => 'Private',
                        ExpirationActionsModel::ACTION_CLASS_ATTRIBUTE => PostStatusToPrivate::class,
                    ]
                ]
            ]
        ];
    }
}
