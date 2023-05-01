<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

defined('ABSPATH') or die('Direct access not allowed.');

class RequestFacade
{
    /**
     * @param string $action
     * @param string $query_arg
     * @return false|int|void
     */
    public function checkAdminReferer($action = -1, $query_arg = '_wpnonce')
    {
        return check_admin_referer($action, $query_arg);
    }
}
