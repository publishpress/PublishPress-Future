<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core;

abstract class HooksAbstract
{
    const ACTION_ADMIN_INIT = 'admin_init';
    const ACTION_INIT_PLUGIN = 'publishpressfuture_init_plugin';
    const ACTION_ACTIVATE_PLUGIN = 'publishpressfuture_activate_plugin';
    const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuture_deactivate_plugin';
    const ACTION_ADMIN_ENQUEUE_SCRIPT= 'admin_enqueue_scripts';
    const FILTER_MODULES_LIST = 'publishpressfuture_list_modules';
}
