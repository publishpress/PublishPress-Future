<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Framework\WordPress\Models;

defined('ABSPATH') or die('Direct access not allowed.');

class CurrentUserModel extends UserModel
{
    public function __construct()
    {
        $user = wp_get_current_user();

        parent::__construct($user);
    }
}
