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
    const ACTION_INSERT_POST = 'wp_insert_post';
    const ACTION_PURGE_PLUGIN_CACHE = 'publishpressfuture_purge_plugin_cache';
    const ACTION_BULK_EDIT_CUSTOM_BOX = 'bulk_edit_custom_box';
    const ACTION_QUICK_EDIT_CUSTOM_BOX = 'quick_edit_custom_box';
    const ACTION_SAVE_POST = 'save_post';
    const ACTION_ADD_META_BOXES = 'add_meta_boxes';
    /**
     * @deprecated 3.1.5 use ACTION_ADD_META_BOXES instead
     */
    const ACTION_ADD_META_BOX = self::ACTION_ADD_META_BOXES;
    const ACTION_ADMIN_PRINT_SCRIPTS_EDIT = 'admin_print_scripts-edit.php';
    const ACTION_ADMIN_ENQUEUE_SCRIPTS = 'admin_enqueue_scripts';
    const FILTER_MODULES_LIST = 'publishpressfuture_list_modules';
    const FILTER_PLUGIN_ACTION_LINKS = 'plugin_action_links';
}
