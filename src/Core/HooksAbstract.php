<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class HooksAbstract
{
    const ACTION_INIT = 'init';
    const ACTION_ADMIN_INIT = 'admin_init';
    const ACTION_ADMIN_NOTICES = 'admin_notices';
    const ACTION_INIT_PLUGIN = 'publishpressfuture_init_plugin';
    const ACTION_ACTIVATE_PLUGIN = 'publishpressfuture_activate_plugin';
    const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuture_deactivate_plugin';
    const ACTION_ADMIN_ENQUEUE_SCRIPT= 'admin_enqueue_scripts';
    const FILTER_MODULES_LIST = 'publishpressfuture_list_modules';
    const ACTION_INSERT_POST = 'wp_insert_post';
}
