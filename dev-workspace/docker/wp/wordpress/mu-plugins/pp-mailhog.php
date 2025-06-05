<?php

/**
 * Plugin Name: PublishPress MailHog
 * Description: Routes WordPress emails to MailHog for development purposes
 * Version: 1.0.0
 * Author: PublishPress
 * Author URI: https://publishpress.com
 * License: GPL-2.0 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Based on: MailHog for WordPress by Tareq Hasan
 * @see https://github.com/tareq1988/mailhog-for-wp
 * @copyright 2025 PublishPress
 */

namespace PublishPress\PPMailHog;

add_filter('wp_mail_from', function ($from) {
    if (defined('WP_MAILHOG_MAIL_FROM')) {
        return constant('WP_MAILHOG_MAIL_FROM');
    }

    return $from;
});

add_filter('wp_mail_from_name', function ($from_name) {
    if (defined('WP_MAILHOG_MAIL_FROM_NAME')) {
        return constant('WP_MAILHOG_MAIL_FROM_NAME');
    }

    return $from_name;
});

add_action('phpmailer_init', function (\WP_PHPMailer $phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = constant('WP_MAILHOG_SMTP_HOST');
    $phpmailer->Port = constant('WP_MAILHOG_SMTP_PORT');
    $phpmailer->SMTPAuth = false;
    $phpmailer->SMTPSecure = false;
});


add_action('wp_mail_failed', function (\WP_Error $error) {
    error_log('WP Mail failed: ' . $error->get_error_message());
});
