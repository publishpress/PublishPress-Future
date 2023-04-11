<?php
namespace wpunit\Framework\WordPress;

use Codeception\TestCase\WPTestCase;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use WordpressTester;

use function add_action;
use function add_filter;
use function has_action;
use function has_filter;
use function sq;


class HooksFacadeTest extends WPTestCase
{
    /**
     * @var WordpressTester
     */
    protected $tester;

    public function testAddFilter()
    {
        $callback = static function($value) {
            return $value + 1;
        };

        $hooks = new HooksFacade();
        $hooks->addFilter(sq('sum.numbers'), $callback);

        $hasFilterOnWordPress = has_filter(sq('sum.numbers'));

        $this->assertTrue($hasFilterOnWordPress);
    }

    public function testApplyFilters()
    {
        $callback = static function($value) {
            return $value + 1;
        };

        add_filter(sq('sum.numbers'), $callback);

        $hooks = new HooksFacade();
        $result = $hooks->applyFilters(sq('sum.numbers'), 3);


        $this->assertEquals(4, $result);
    }

    public function testApplyFiltersWithArguments()
    {
        $callback = static function($value, $increment) {
            return $value + $increment;
        };

        add_filter(sq('sum.two.numbers'), $callback, 10, 2);

        $hooks = new HooksFacade();
        $result = $hooks->applyFilters(sq('sum.two.numbers'), 5, 2);


        $this->assertEquals(7, $result);
    }


    public function testAddAction()
    {
        $callback = static function() {
            return 'yes';
        };

        $hooks = new HooksFacade();
        $hooks->addAction(sq('future.init'), $callback);

        $hasActionOnWordPress = has_action(sq('future.init'));

        $this->assertTrue($hasActionOnWordPress);
    }

    public function testDoAction()
    {
        $callback = static function() {
            echo 'yes';
        };

        add_action(sq('future.init'), $callback);

        ob_start();
        $hooks = new HooksFacade();
        $hooks->doAction(sq('future.init'));
        $output = ob_get_clean();

        $this->assertEquals('yes', $output);
    }

    public function testDoActionWithArguments()
    {
        $callback = static function($end) {
            echo 'yes' . $end;
        };

        add_action(sq('future.init'), $callback);

        ob_start();
        $hooks = new HooksFacade();
        $hooks->doAction(sq('future.init'), '!');
        $output = ob_get_clean();

        $this->assertEquals('yes!', $output);
    }
}
