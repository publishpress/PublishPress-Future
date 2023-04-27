<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

class UsersFacade
{
    public function getUsers($args = [])
    {
        return get_users($args);
    }
}
