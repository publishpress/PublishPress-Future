<?php
/**
 * @throws \Exception
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPressFuturePro {

    defined('ABSPATH') or die('No direct script access allowed.');

    if (
        defined('PUBLISHPRESS_FUTURE_BASE_PATH')
        && file_exists(PUBLISHPRESS_FUTURE_BASE_PATH . '/post-expirator.php')
    ) {
        $pluginPath = PUBLISHPRESS_FUTURE_BASE_PATH . '/post-expirator.php';
    }

    if (empty($pluginPath)) {
        $pluginPath = __DIR__ . '/../vendor/publishpress/post-expirator/post-expirator.php';
    }

    if (! is_readable($pluginPath)) {
        throw new \Exception('Free plugin is not readable on ' . $pluginPath);
    }

    include_once $pluginPath;
}
