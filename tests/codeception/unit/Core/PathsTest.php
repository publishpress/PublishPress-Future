<?php
namespace Core;

use Codeception\Example;
use Codeception\Test\Feature\Stub as Stub;
use PublishPressFuture\Core\Paths;
use UnitTester;

class PathsTest extends \Codeception\Test\Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @dataProvider baseDirProvider
     */
    public function testGetBaseDirPathReturnsNoTrailingSlash($baseDir, $expected)
    {
        $instance = new Paths($baseDir);
        $result = $instance->getBaseDirPath();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }

    public function baseDirProvider()
    {
        return [
            ['/tmp', '/tmp'],
            ['/tmp/', '/tmp'],
        ];
    }

    /**
     * @dataProvider baseDirVendorProvider
     */
    public function testGetVendorDirPathReturnsNoTraillingSlash($baseDir, $expected)
    {
        $instance = new Paths($baseDir);
        $result = $instance->getVendorDirPath();

        $this->assertIsString($result);
        $this->assertEquals($expected, $result);
    }

    public function baseDirVendorProvider()
    {
        return [
            ['/tmp', '/tmp/vendor'],
            ['/tmp/', '/tmp/vendor'],
        ];
    }
}
