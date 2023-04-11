<?php
namespace Modules\Expirator\Migrations;

use PublishPressFuture\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Modules\Expirator\Migrations\V30000ActionArgsSchema;

class V30000ActionArgsSchemaTest extends \Codeception\TestCase\WPTestCase
{
    /**
     * @var \WpunitTester
     */
    protected $tester;

    public function setUp(): void
    {
        parent::setUp();
        $this->prepareSiteFormigrationTest();
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

    protected function prepareSiteFormigrationTest()
    {
        $this->tester->haveOptionInDatabase('postexpiratorVersion', '2.9.2');
    }

    public function testMigrationHook()
    {
        do_action('admin_init');
        postexpirator_upgrade();
//        $actionSet = false;
//        $cronAdapter = $this->createMock(CronFacade::class);
//        $hooksFacade = $this->createMock(HooksFacade::class, ['addAction' => function()]]);
//
//        $migration = new V30000ActionArgsSchema($cronAdapter, $hooksFacade);

        $hasAction = has_action(V30000ActionArgsSchema::HOOK, [V30000ActionArgsSchema::class, 'migrate']);

        $this->assertTrue($hasAction, 'The migration hook is not registered');
    }

    // Tests
    public function testVersion()
    {
        update_option('postexpiratorVersion', '3.0.0');
        $version = get_option('postexpiratorVersion');

        $this->assertEquals('3.0.0', $version);
        $this->tester->dontSeeOptionInDatabase('postexpiratorVersion', '2.9.2');
    }
}
