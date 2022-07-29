<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace unit\Core\Framework\Logger;

use Codeception\Stub\Expected;
use Codeception\Test\Feature\Stub;
use Codeception\Test\Unit;
use Exception;
use PublishPressFuture\Core\Framework\Logger\Logger;
use PublishPressFuture\Core\Framework\WordPress\Facade\DatabaseFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Modules\Settings\SettingsFacade;
use UnitTester;

class LoggerTest extends Unit
{
    use Stub;

    /**
     * @var UnitTester
     */
    protected $tested;

    /**
     * @throws Exception
     */
    public function testConstructCreatesDBTable()
    {
        $db = $this->makeEmpty(
            DatabaseFacade::class,
            [
                'modifyStructure' => Expected::once(
                    function ($sql) {
                        $this->assertStringStartsWith('CREATE TABLE `wp_postexpirator_debug`', $sql);
                    }
                ),
                'escape' => function ($string) {
                    return $string;
                },
                'getTablePrefix' => 'wp_',
            ]
        );

        $site = $this->makeEmpty(SiteFacade::class);

        $settings = $this->makeEmpty(SettingsFacade::class);

        $logger = $this->construct(
            Logger::class,
            [
                $db,
                $site,
                $settings,
            ]
        );
    }
}
