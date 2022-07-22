<?php
namespace Core\WordPress;

use PublishPressFuture\Module\Expiration;
use PublishPressFuture\Module\Expiration\Action\PostStatusToDraft;
use PublishPressFuture\Module\Expiration\Action\PostStatusToPrivate;
use PublishPressFuture\Module\Expiration\ActionMapper;
use PublishPressFuture\Module\Expiration\ActionsAbstract;
use PublishPressFuture\Module\Expiration\Exception\UndefinedActionException;

use function sq;


class ActionMapperTest extends \Codeception\Test\Unit
{
    /**
     * @var \WordpressTester
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
