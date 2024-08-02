<?php

namespace Tests\Modules\Expirator\Schemas;

use PublishPress\Future\Modules\Expirator\Models\ActionArgsModel;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;
use Tests\NoTransactionWPTestCase;

class ActionArgsSchemaTest extends NoTransactionWPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    protected function setUp(): void
    {
        parent::setUp();

        $this->resetTable();
    }

    protected function resetTable(): void
    {
        global $wpdb;
        $wpdb->query('DROP TABLE IF EXISTS ' . ActionArgsSchema::getTableName());

        ActionArgsSchema::createTable();
    }

    protected function ensureTableDoesNotExist(): void
    {
        global $wpdb;
        $wpdb->query('DROP TABLE IF EXISTS ' . ActionArgsSchema::getTableName());
    }

    protected function getTablePrefix(): string
    {
        $loaderConfig = $this->getModule('lucatume\WPBrowser\Module\WPLoader')->_getConfig();

        return $loaderConfig['tablePrefix'];
    }

    public function testGetTableName(): void
    {
        $tableName = ActionArgsSchema::getTableName();
        $prefix = $this->getTablePrefix();

        $this->assertStringStartsWith($prefix, $tableName);
        $this->assertEquals($prefix . 'ppfuture_actions_args', $tableName);
    }

    public function testCreateTable(): void
    {
        $this->ensureTableDoesNotExist();
        $this->assertTrue(ActionArgsSchema::createTable());
    }

    public function testTableExistsReturnsFalseIfTableDoesNotExist(): void
    {
        $this->ensureTableDoesNotExist();
        $this->assertFalse(ActionArgsSchema::isTableExistent());
    }

    public function testTableExistsReturnsTrueIfTableExists(): void
    {
        $this->assertTrue(ActionArgsSchema::isTableExistent(), 'Table should exist by default');
    }

    public function testIsTableHealthyReturnsTrueIfTableIsHealthy(): void
    {
        $isHealthy = ActionArgsSchema::isTableHealthy();
        $this->assertTrue($isHealthy);
    }

    public function testIsTableHealthyReturnsFalseIfTableDoesNotExist(): void
    {
        $this->ensureTableDoesNotExist();
        $this->assertFalse(ActionArgsSchema::isTableHealthy());
    }

    public function testIsTableHealthyReturnsFalseIfIndexesAreMissing(): void
    {
        global $wpdb;
        $wpdb->query('ALTER TABLE ' . ActionArgsSchema::getTableName() . ' DROP INDEX `cron_action_id`');

        $this->assertFalse(ActionArgsSchema::isTableHealthy());
    }

    public function testIsTableHealthyReturnsFalseIfIndexesExistsButIsDifferent(): void
    {
        global $wpdb;

        $tableName = ActionArgsSchema::getTableName();

        $wpdb->query("DROP INDEX `cron_action_id` on `$tableName`");
        $wpdb->query("CREATE INDEX `cron_action_id` on `$tableName` (`post_id`)");

        $this->assertFalse(ActionArgsSchema::isTableHealthy());

        // To fix the index for next tests
        $this->ensureTableDoesNotExist();
    }

    public function testIsTableHealthyReturnsFalseIfColumnArgsLengthIsNotUpdated(): void
    {
        global $wpdb;
        $wpdb->query('ALTER TABLE ' . ActionArgsSchema::getTableName() . ' MODIFY COLUMN args VARCHAR(255)');

        $this->assertFalse(ActionArgsSchema::isTableHealthy());
    }

    public function testFixTableCreatesTableIfItDoesNotExist(): void
    {
        $this->ensureTableDoesNotExist();
        ActionArgsSchema::fixTable();

        $this->assertTrue(ActionArgsSchema::isTableExistent());
    }

    public function testFixTableUpdatesColumnArgsLengthIfItIsNotUpdated(): void
    {
        global $wpdb;
        $wpdb->query('ALTER TABLE ' . ActionArgsSchema::getTableName() . ' MODIFY COLUMN args VARCHAR(255)');

        ActionArgsSchema::fixTable();

        $this->assertTrue(ActionArgsSchema::isTableHealthy());
    }

    public function testFixTableCreatesIndexesIfTheyAreMissing(): void
    {
        global $wpdb;
        $tableName = ActionArgsSchema::getTableName();

        $wpdb->query("DROP INDEX `post_id` on $tableName");

        ActionArgsSchema::fixTable();

        $isHealthy = ActionArgsSchema::isTableHealthy();
        ray(ActionArgsSchema::getErrors());
        $this->assertTrue($isHealthy);
    }

    public function testFixTableCreatesIndexesIfColumnsAreDifferent(): void
    {
        global $wpdb;
        $tableName = ActionArgsSchema::getTableName();

        $wpdb->query("DROP INDEX `cron_action_id` on `$tableName`");
        $wpdb->query("CREATE INDEX `cron_action_id` on `$tableName` (`post_id`)");

        ActionArgsSchema::fixTable();

        $this->assertTrue(ActionArgsSchema::isTableHealthy());
    }

    public function testDropTable(): void
    {
        ActionArgsSchema::dropTable();

        global $wpdb;
        $this->assertNull($wpdb->get_var("SHOW TABLES LIKE '" . ActionArgsSchema::getTableName() . "'"));
    }

    public function testGetErrors(): void
    {
        $this->ensureTableDoesNotExist();
        $this->assertFalse(ActionArgsSchema::isTableHealthy());

        $errors = ActionArgsSchema::getErrors();

        $this->assertArrayHasKey(ActionArgsSchema::HEALTH_ERROR_TABLE_DOES_NOT_EXIST, $errors);
    }

    public function testDeprecatedMethodsExists(): void
    {
        $this->assertTrue(method_exists(ActionArgsSchema::class, 'tableExists'));
        $this->assertTrue(method_exists(ActionArgsSchema::class, 'healthCheckTableExists'));
        $this->assertTrue(method_exists(ActionArgsSchema::class, 'checkSchemaHealth'));
        $this->assertTrue(method_exists(ActionArgsSchema::class, 'createTableIfNotExists'));
        $this->assertTrue(method_exists(ActionArgsSchema::class, 'fixSchema'));
        $this->assertTrue(method_exists(ActionArgsSchema::class, 'getSchemaHealthErrors'));
    }
}
