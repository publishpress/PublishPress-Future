<?php
/**
 * Plugin Name: ray-future
 * Plugin URI:  https://wordpress.org/plugins/post-expirator/
 * Description: Auxiliar plugin for the debug on tests
 * Author:      PublishPress
 * Author URI:  https://publishpress.com
 * Version: 0.1.0
 * Text Domain: ray-future
 */

namespace RayFuture;

require_once __DIR__ . '/vendor/autoload.php';

\ray()->phpinfo();
