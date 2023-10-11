<?php
/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPress\FuturePro;

use PublishPressInstanceProtection\Config;
use PublishPressInstanceProtection\InstanceChecker;

defined('ABSPATH') or die('No direct script access allowed.');

const INSTANCE_PROTECTION_INCLUDE_FILE = PUBLISHPRESS_FUTURE_PRO_VENDOR_DIR . '/publishpress/instance-protection/include.php';

if (file_exists(INSTANCE_PROTECTION_INCLUDE_FILE)) {
    require_once INSTANCE_PROTECTION_INCLUDE_FILE;
}

if (class_exists(Config::class)) {
    $pluginCheckerConfig = new Config();
    $pluginCheckerConfig->pluginSlug = PUBLISHPRESS_FUTURE_PRO_PLUGIN_SLUG;
    $pluginCheckerConfig->pluginName = PUBLISHPRESS_FUTURE_PRO_PLUGIN_NAME;
    $pluginCheckerConfig->freePluginName = PUBLISHPRESS_FUTURE_PRO_FREE_PLUGIN_NAME;
    $pluginCheckerConfig->isProPlugin = true;

    new InstanceChecker($pluginCheckerConfig);
}
