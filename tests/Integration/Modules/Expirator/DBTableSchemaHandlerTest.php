<?php

namespace Tests\Modules\Expirator\Schemas;

use PublishPress\Future\Framework\Database\DBTableSchemaHandler;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaHandlerInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;
use Tests\NoTransactionWPTestCase;

class DBTableSchemaHandlerTest extends NoTransactionWPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    protected $wpdb;

    protected function setUp(): void
    {
        parent::setUp();

        global $wpdb;

        $this->wpdb = $wpdb;
    }

    protected function getHandler(string $tableName): DBTableSchemaHandlerInterface
    {
        $handler = new DBTableSchemaHandler($this->wpdb);
        $handler->setTableName($tableName);

        return $handler;
    }

    public function testSetAndGetTableName(): void
    {
        $handler = $this->getHandler('new_custom_table_name');

        $this->assertEquals('wp_new_custom_table_name', $handler->getTableName());
    }

    public function testGetTablePrefix(): void
    {
        $handler = $this->getHandler('new_custom_table_name');
        $tablePrefix = $handler->getTablePrefix();

        $this->assertEquals($this->getTablePrefix(), $tablePrefix);
    }

    public function testIsTableExistentReturnsFalseIfTableDoesNotExist(): void
    {
        $handler = $this->getHandler('non_existent_table');
        $this->assertFalse($handler->isTableExistent());
    }

    public function testIsTableExistentReturnsTrueIfTableExists(): void
    {
        $handler = $this->getHandler('users');
        $this->assertTrue($handler->isTableExistent());

        $handler = $this->getHandler('posts');
        $this->assertTrue($handler->isTableExistent());
    }

    public function testCreateTable(): void
    {
        $handler = $this->getHandler('new_custom_table_name');

        $columns = [
            'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
            'name' => 'VARCHAR(255) NOT NULL',
            'age' => 'INT(11) NOT NULL',
        ];

        $indexes = [
            'PRIMARY' => ['id'],
            'age' => ['age'],
        ];

        $this->assertTrue($handler->createTable($columns, $indexes));

        $this->assertTableExists('wp_new_custom_table_name');
    }

    public function testDropTable(): void
    {
        $handler = $this->getHandler('new_custom_table_name');

        $columns = [
            'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
            'name' => 'VARCHAR(255) NOT NULL',
            'age' => 'INT(11) NOT NULL',
        ];

        $indexes = [
            'PRIMARY' => ['id'],
            'age' => ['age'],
        ];

        $handler->createTable($columns, $indexes);

        $this->assertTrue($handler->dropTable());

        $this->assertTableDoesNotExists('wp_new_custom_table_name');
    }

    public function testGetColumnLength(): void
    {
        $handler = $this->getHandler('users');

        $this->assertEquals(60, $handler->getColumnLength('user_login'));
        $this->assertEquals(255, $handler->getColumnLength('user_pass'));
    }

    public function testCheckTableIndexesReturnsTrueWhenIndexesAreValid(): void
    {
        $handler = $this->getHandler('users');

        $indexes = [
            'PRIMARY' => ['ID'],
            'user_login_key' => ['user_login'],
            'user_nicename' => ['user_nicename'],
            'user_email' => ['user_email'],
        ];

        $this->assertEmpty($handler->checkTableIndexes($indexes));
    }

    public function testCheckTableIndexesReturnsFalseWhenIndexesAreInvalid(): void
    {
        $handler = $this->getHandler('users');

        $indexes = [
            'PRIMARY' => ['ID'],
            'user_login_key' => ['user_login'],
            'user_nicename' => ['user_nicename'],
            'user_email' => ['user_email'],
            'invalid_index' => ['invalid_column'],
        ];

        $this->assertNotEmpty($handler->checkTableIndexes($indexes));
    }

    public function testCheckTableIndexesReturnsFalseForExtraIndexes(): void
    {
        $handler = $this->getHandler('users');

        $indexes = [
            'PRIMARY' => ['ID'],
            'user_login_key' => ['user_login'],
            'user_nicename' => ['user_nicename'],
            'user_email' => ['user_email'],
            'extra_index' => ['ID'],
        ];

        $this->assertNotEmpty($handler->checkTableIndexes($indexes));
    }

    public function testRegisterAndGetError(): void
    {
        $handler = $this->getHandler('users');

        $handler->registerError('error_code', 'Error message');

        $errors = $handler->getErrors();

        $this->assertArrayHasKey('error_code', $errors);
        $this->assertEquals('Error message', $errors['error_code']);
    }

    public function testResetErrors(): void
    {
        $handler = $this->getHandler('users');

        $handler->registerError('error_code', 'Error message');

        $handler->resetErrors();

        $this->assertEmpty($handler->getErrors());
    }

    public function testHasErrorsReturnsTrueIfErrorsExist(): void
    {
        $handler = $this->getHandler('users');

        $handler->registerError('error_code', 'Error message');

        $this->assertTrue($handler->hasErrors());
    }

    public function testHasErrorsReturnsFalseIfErrorsDoNotExist(): void
    {
        $handler = $this->getHandler('users');

        $this->assertFalse($handler->hasErrors());
    }

    public function testFixIndexesForMissedIndexes(): void
    {
        $this->dropTable('wp_new_custom_table_name');
        $this->createTable(
            'wp_new_custom_table_name',
            'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, age INT(11) NOT NULL, PRIMARY KEY (id)'
        );
        $handler = $this->getHandler('new_custom_table_name');

        $indexes = [
            'PRIMARY' => ['id'],
            'age' => ['id', 'age'],
        ];

        $handler->fixIndexes($indexes);

        $this->assertEmpty($handler->checkTableIndexes($indexes));
    }

    public function testFixIndexesForDifferentColumns(): void
    {
        $this->dropTable('wp_new_custom_table_name');
        $this->createTable(
            'wp_new_custom_table_name',
            'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, age INT(11) NOT NULL, PRIMARY KEY (id), KEY age (age)'
        );
        $handler = $this->getHandler('new_custom_table_name');

        $indexes = [
            'PRIMARY' => ['id'],
            'age' => ['id', 'age'],
        ];

        $handler->fixIndexes($indexes);

        $this->assertEmpty($handler->checkTableIndexes($indexes));
    }

    public function testFixIndexesForExtraIndixes(): void
    {
        $this->dropTable('wp_new_custom_table_name');
        $this->createTable(
            'wp_new_custom_table_name',
            'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, age INT(11) NOT NULL, PRIMARY KEY (id), KEY age (age), KEY name (name)'
        );
        $handler = $this->getHandler('new_custom_table_name');

        $indexes = [
            'PRIMARY' => ['id'],
            'age' => ['id', 'age'],
        ];

        $handler->fixIndexes($indexes);

        $this->assertEmpty($handler->checkTableIndexes($indexes));
    }

    public function testChangeColumn(): void
    {
        $this->dropTable('wp_new_custom_table_name');
        $this->createTable(
            'wp_new_custom_table_name',
            'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, age INT(11) NOT NULL, PRIMARY KEY (id)'
        );
        $handler = $this->getHandler('new_custom_table_name');

        $handler->changeColumn('name', 'VARCHAR(100) NOT NULL');

        $this->assertEquals(100, $handler->getColumnLength('name'));
    }
}
