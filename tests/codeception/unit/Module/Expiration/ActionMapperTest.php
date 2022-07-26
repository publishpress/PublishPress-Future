<?php
namespace Core\WordPress;

use Codeception\Test\Unit;
use PublishPressFuture\Domain\Expiration;
use PublishPressFuture\Domain\Expiration\Action\PostStatusToDraft;
use PublishPressFuture\Domain\Expiration\Action\PostStatusToPrivate;
use PublishPressFuture\Domain\Expiration\ActionMapper;
use PublishPressFuture\Domain\Expiration\ActionsAbstract;
use PublishPressFuture\Domain\Expiration\Exception\UndefinedActionException;

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
