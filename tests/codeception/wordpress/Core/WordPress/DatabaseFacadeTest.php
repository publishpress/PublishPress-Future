<?php
namespace Core\WordPress;

use Codeception\TestCase\WPTestCase;
use PublishPressFuture\Framework\WordPress\DatabaseFacade;
use PDO;

use WordpressTester;

use function sq;

class DatabaseFacadeTest extends WPTestCase
{
    /**
     * @var WordpressTester
     */
    protected $tester;

    protected $dbDriver;

    public function _before()
    {
        if (empty($this->dbDriver)) {
            $this->dbDriver = $this->getModule('WPDb')->_getDriver();
        }
    }

    protected function getTables()
    {
        return $this->dbDriver->executeQuery('SHOW TABLES', [])->fetchAll(PDO::FETCH_COLUMN);
    }

    public function testGetTablePrefix()
    {
        $facade = new DatabaseFacade();

        $this->assertEquals('wp_', $facade->getTablePrefix());
    }

    public function testGetVar()
    {
        $facade = new DatabaseFacade();

        $var = $facade->getVar('SHOW TABLES LIKE "wp_posts"');

        $this->assertEquals('wp_posts', $var);
    }

    public function testModifyStructureCreatingANewTable()
    {
        $facade = new DatabaseFacade();

        $results = $facade->modifyStructure('CREATE TABLE `wp_test_1` (`id` int(9) NOT NULL);');

        $this->assertArrayHasKey('`wp_test_1`', $results);
        $this->assertEquals('Created table `wp_test_1`', $results['`wp_test_1`']);
    }
}
