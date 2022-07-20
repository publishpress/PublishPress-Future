<?php
namespace Core\WordPress;

use PublishPressFuture\Core\WordPress\ActionsFacade;

use function sq;


class ActionsFacadeTest extends \Codeception\Test\Unit
{
    /**
     * @var \WordpressTester
     */
    protected $tester;


    public function testAddAnAction()
    {
        $callback = static function() {
            return 'yes';
        };

        $actionsFacade = new ActionsFacade();
        $actionsFacade->add(sq('future.init'), $callback);

        $hasActionOnWordPress = has_action(sq('future.init'));

        $this->assertTrue($hasActionOnWordPress);
    }

    public function testExecuteAnAction()
    {
        $callback = static function() {
            echo 'yes';
        };

        add_action(sq('future.init'), $callback);

        ob_start();
        $actionsFacade = new ActionsFacade();
        $actionsFacade->do(sq('future.init'));
        $output = ob_get_clean();

        $this->assertEquals('yes', $output);
    }
}
