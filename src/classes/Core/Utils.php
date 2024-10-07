<?php

/**
 * Copyright (c) 2024 Ramble Ventures
 */

namespace PublishPress\FuturePro\Core;

use PublishPress\Future\Core\DI\Container;

defined('ABSPATH') or die('No direct script access allowed.');

abstract class Utils
{
    public static function getScriptUrl($script)
    {
        $extension = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '.js' : '.min.js';

        $container = Container::getInstance();
        $baseUrl = $container->get(ServicesAbstract::BASE_URL);

        return $baseUrl . 'src/assets/js/' . $script . $extension;
    }
}
