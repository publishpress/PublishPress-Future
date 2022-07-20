<?php
namespace Core;

use Codeception\Example;
use PublishPressFuture\Core\Paths;
use UnitTester;

class PathsCest
{
    public function _before(UnitTester $I)
    {
    }

    /**
     * @example ["/tmp", "/tmp"]
     * @example ["/tmp/", "/tmp"]
     */
    public function testGetBaseDirPathReturnsNoTrailingSlash(UnitTester $I, Example $example)
    {
        $I->amGoingTo('test if method getBaseDirPath returns no trailing slash');

        $instance = new Paths($example[0]);
        $result = $instance->getBaseDirPath();

        $I->assertIsString($result);
        $I->assertEquals($example[1], $result);
    }

    /**
     * @example ["/tmp", "/tmp/vendor"]
     * @example ["/tmp/", "/tmp/vendor"]
     */
    public function testGetVendorDirPathReturnsTheVendorDirWithNoTraillingSlash(UnitTester $I, Example $example)
    {
        $I->amGoingTo('test if method getVendorDirPath returns no trailing slash');

        $instance = new Paths($example[0]);
        $result = $instance->getVendorDirPath();

        $I->assertIsString($result);
        $I->assertEquals($example[1], $result);
    }
}
