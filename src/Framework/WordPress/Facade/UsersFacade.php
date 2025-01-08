<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

defined('ABSPATH') or die('Direct access not allowed.');

class UsersFacade
{
    public function getUsers($args = [])
    {
        return get_users($args);
    }
}
