<?php

namespace Tests;

use lucatume\WPBrowser\TestCase\WPTestCase;

class SampleTest extends WPTestCase
{
    public function testPluginIsActive(): void
    {
        $this->assertTrue(is_plugin_active('post-expirator/post-expirator.php'));
    }
}
