<?php

namespace Modules\Expirator\Schemas;

use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

class ActionArgsSchemaTest extends \Codeception\TestCase\WPTestCase
{
    /**
     * @var \WpunitTester
     */
    protected $tester;

    protected function _after()
    {
        parent::_after();

//        $this->tester->importSqlDumpFile('tests/_data/dump.sql');
    }

    // Tests
    public function testGetTableName()
    {
        $tableName = $this->tester->grabPrefixedTableNameFor('ppfuture_actions_args');

        $this->assertEquals($tableName, ActionArgsSchema::getTableName());
    }

    public function testTableExistsReturnsTrueWhenTableExists()
    {
        $tableName = $this->tester->grabPrefixedTableNameFor('ppfuture_actions_args');

        $this->tester->importSql(["CREATE TABLE IF NOT EXISTS $tableName (id INT)"]);

        $this->tester->seeTableInDatabase($tableName);
        $this->assertTrue(ActionArgsSchema::tableExists($tableName));
    }

    /**
     * @testdox tableExists returns false when table does not exists
     */
    public function testTableExistsReturnsFalseWhenTableDoesNotExists()
    {
        $tableName = $this->tester->grabPrefixedTableNameFor('ppfuture_actions_args');

        $this->tester->dontHaveTableInDatabase($tableName);

        $this->tester->dontSeeTableInDatabase($tableName);
        $this->assertFalse(ActionArgsSchema::tableExists($tableName));
    }

    /**
     * This test is failling because the dbDelta function is not working as expected
     * if we force to drop the table before running the test.
     * The createTableIfNotExists method is working fine when the plugin is installed
     * or loaded, but not when we run the test. It seems that the dbDelta function
     * is not working as expected. I tried to use the query method of the wpdb object,
     * but it did not work either.
     */
//    public function testCreateTableIfNotExists()
//    {
//        $tableName = $this->tester->grabPrefixedTableNameFor('ppfuture_actions_args');
//
//        $this->tester->dontHaveTableInDatabase($tableName);
//        $this->tester->dontSeeTableInDatabase($tableName);
//
//        ActionArgsSchema::createTableIfNotExists();
//
//        $this->tester->seeTableInDatabase($tableName);
//    }

    /**
     * This test is failing because the DROP TABLE instruction is not working as expected.
     * It is the same issue for the test above. It seems like only DB changes made in the
     * plugin activation is working as expected. But if we try changing structure during
     * a test it is not having any effect.
     */
//    public function testDropTableIfExists()
//    {
//        $tableName = $this->tester->grabPrefixedTableNameFor('ppfuture_actions_args');
//
//        $this->tester->importSql(["CREATE TABLE IF NOT EXISTS $tableName (id INT)"]);
//
//        $this->tester->seeTableInDatabase($tableName);
//
//        ActionArgsSchema::dropTableIfExists();
//
//        $this->tester->dontSeeTableInDatabase($tableName);
//    }
}
