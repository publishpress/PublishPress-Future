<?php
namespace Core\WordPress;

use PublishPressFuture\Core\WordPress\FiltersFacade;

class FiltersFacadeTest extends \Codeception\Test\Unit
{
    /**
     * @var \WordpressTester
     */
    protected $tester;

    public function testAddAFilter()
    {
        $callback = static function($value) {
            return $value + 1;
        };

        $filtersFacade = new FiltersFacade();
        $filtersFacade->add(sq('sum.numbers'), $callback);

        $hasFilterOnWordPress = has_filter(sq('sum.numbers'));

        $this->assertTrue($hasFilterOnWordPress);
    }

    public function testApplyAFilter()
    {
        $callback = static function($value) {
            return $value + 1;
        };

        add_filter(sq('sum.numbers'), $callback);

        $filtersFacade = new FiltersFacade();
        $result = $filtersFacade->apply(sq('sum.numbers'), 3);


        $this->assertEquals(4, $result);
    }

    public function testApplyAFilterWithArguments()
    {
        $callback = static function($value, $increment) {
            return $value + $increment;
        };

        add_filter(sq('sum.two.numbers'), $callback, 10, 2);

        $filtersFacade = new FiltersFacade();
        $result = $filtersFacade->apply(sq('sum.two.numbers'), 5, [2]);


        $this->assertEquals(7, $result);
    }
}
