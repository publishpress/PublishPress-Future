<?php
/**
 * Plugin Name: My Custom Step Plugin
 * Plugin URI: https://example.com
 * Description: This is a custom WordPress plugin for custom step.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL2
 */

add_action('init', 'init_my_step_plugin', 20);

// Example function
function init_my_step_plugin() {
    require_once __DIR__ . '/node-type.php';
}
