<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

class EmailFacade
{
    public function send($to, $subject, $message, $headers = '', $attachments = [])
    {
        // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_mail_wp_mail
        return wp_mail($to, $subject, $message, $headers, $attachments);
    }
}
