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

    protected function tearDown(): void
    {
        // We delete the table in some tests, so we need to recreate it
        $this->ensureTableExists();

        parent::tearDown();
    }

    protected function ensureTableExists() :void
    {
        if (! ActionArgsSchema::isTableExistent()) {
            ActionArgsSchema::createTable();
        }
    }

    protected function ensureTableDoesNotExist() :void
    {
        global $wpdb;
        $wpdb->query('DROP TABLE IF EXISTS ' . ActionArgsSchema::getTableName());
    }

    protected function getTablePrefix(): string
    {
        $loaderConfig = $this->getModule('lucatume\WPBrowser\Module\WPLoader')->_getConfig();

        return $loaderConfig['tablePrefix'];
    }

    public function testGetTableName() :void
    {
        $tableName = ActionArgsSchema::getTableName();
        $prefix = $this->getTablePrefix();

        $this->assertStringStartsWith($prefix, $tableName);
        $this->assertEquals($prefix . 'ppfuture_actions_args', $tableName);
    }

    public function testCreateTable() :void
    {
        $this->ensureTableDoesNotExist();
        $this->assertTrue(ActionArgsSchema::createTable());
    }

    public function testTableExistsReturnsFalseIfTableDoesNotExist() :void
    {
        $this->ensureTableDoesNotExist();
        $this->assertFalse(ActionArgsSchema::isTableExistent());
    }

    public function testTableExistsReturnsTrueIfTableExists() :void
    {
        $this->assertTrue(ActionArgsSchema::isTableExistent(), 'Table should exist by default');
    }

    public function testIsTableHealthyReturnsTrueIfTableIsHealthy() :void
    {
        $this->assertTrue(ActionArgsSchema::isTableHealthy());
    }

    public function testIsTableHealthyReturnsFalseIfTableDoesNotExist() :void
    {
        $this->ensureTableDoesNotExist();
        $this->assertFalse(ActionArgsSchema::isTableHealthy());
    }

    public function testIsTableHealthyReturnsFalseIfColumnArgsLengthIsNotUpdated() :void
    {
        $this->ensureTableExists();

        global $wpdb;
        $wpdb->query('ALTER TABLE ' . ActionArgsSchema::getTableName() . ' MODIFY COLUMN args VARCHAR(255)');

        $this->assertFalse(ActionArgsSchema::isTableHealthy());
    }

    public function testFixTableCreatesTableIfItDoesNotExist() :void
    {
        $this->ensureTableDoesNotExist();
        ActionArgsSchema::fixTable();

        $this->assertTrue(ActionArgsSchema::isTableExistent());
    }

    public function testFixTableUpdatesColumnArgsLengthIfItIsNotUpdated() :void
    {
        $this->ensureTableExists();

        global $wpdb;
        $wpdb->query('ALTER TABLE ' . ActionArgsSchema::getTableName() . ' MODIFY COLUMN args VARCHAR(255)');

        ActionArgsSchema::fixTable();

        $this->assertTrue(ActionArgsSchema::isTableHealthy());
    }

    public function testDropTable() :void
    {
        $this->ensureTableExists();
        ActionArgsSchema::dropTable();

        global $wpdb;
        $this->assertNull($wpdb->get_var("SHOW TABLES LIKE '" . ActionArgsSchema::getTableName() . "'"));
    }

    public function testGetErrors() :void
    {
        $this->ensureTableDoesNotExist();
        $this->assertFalse(ActionArgsSchema::isTableHealthy());

        $errors = ActionArgsSchema::getErrors();

        $this->assertArrayHasKey(ActionArgsSchema::HEALTH_ERROR_TABLE_DOES_NOT_EXIST, $errors);
    }
}
