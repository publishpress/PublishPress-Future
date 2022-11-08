<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Models;

class CurrentUserModel extends UserModel
{
    public function __construct()
    {
        $user = wp_get_current_user();

        parent::__construct($user);
    }
}
