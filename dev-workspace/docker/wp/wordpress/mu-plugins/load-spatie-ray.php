<?php

/**
 * Plugin Name: Load Spatie Ray
 * Description: Load the Spatie Ray plugin
 * Version: 1.0.0
 * Author: Spatie
 * Author URI: https://spatie.be
 * License: GPL-2.0 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @copyright 2025 PublishPress
 */

if (file_exists(WPMU_PLUGIN_DIR.'/spatie-ray/wp-ray.php')) {
    include_once WPMU_PLUGIN_DIR.'/spatie-ray/wp-ray.php';
}
