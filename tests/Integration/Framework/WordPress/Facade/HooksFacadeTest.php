<?php

namespace Tests\Framework\WordPress\Facade;

use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;

class HooksFacadeTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function testAddFilter(): void
    {
        $hooksFacade = new HooksFacade();

        $hooksFacade->addFilter('test_filter', '__return_true');

        $this->assertEquals(10, has_filter('test_filter', '__return_true'));
    }

    public function testRemoveFilter(): void
    {
        $hooksFacade = new HooksFacade();

        add_filter('test_filter', '__return_true');

        $this->assertEquals(10, has_filter('test_filter', '__return_true'));

        $hooksFacade->removeFilter('test_filter', '__return_true');

        $this->assertEquals(0, has_filter('test_filter', '__return_true'));
    }

    public function testApplyFilters(): void
    {
        $hooksFacade = new HooksFacade();

        add_filter('test_filter', function ($value) {
            return $value . 'test';
        });

        $this->assertEquals('testtest', $hooksFacade->applyFilters('test_filter', 'test'));
    }

    public function testAddAction(): void
    {
        $hooksFacade = new HooksFacade();
        $output = '';

        add_action('test_action', function () use (&$output) {
            $output .= 'test_action';
        });

        $hooksFacade->doAction('test_action');

        $this->assertEquals('test_action', $output);
    }

    public function testRemoveAction(): void
    {
        $hooksFacade = new HooksFacade();
        $count = 0;

        $callback = function () use (&$count) {
            $count++;
        };

        add_action('test_action', $callback);

        do_action('test_action');
        do_action('test_action');

        $this->assertEquals(2, $count);

        $hooksFacade->removeAction('test_action', $callback);

        do_action('test_action');

        $this->assertEquals(2, $count);
    }

    public function testDoAction(): void
    {
        $hooksFacade = new HooksFacade();
        $output = '';

        add_action('test_action', function () use (&$output) {
            $output .= 'test_action';
        });

        $hooksFacade->doAction('test_action');

        $this->assertEquals('test_action', $output);
    }
}
