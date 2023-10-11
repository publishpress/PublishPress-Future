<?php
/**
 * @throws \Exception
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPress\FuturePro;

use Exception;

defined('ABSPATH') or die('No direct script access allowed.');

$pluginPath = PUBLISHPRESS_FUTURE_PRO_VENDOR_DIR . '/publishpress/publishpress-future/post-expirator.php';
if (
    ! is_file($pluginPath)
    || ! is_readable($pluginPath)
) {
    throw new Exception('Free plugin is not readable on ' . $pluginPath);
}

include_once $pluginPath;
