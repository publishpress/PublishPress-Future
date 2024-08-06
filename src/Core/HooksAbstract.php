<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class HooksAbstract
{
    public const ACTION_INIT = 'init';
    public const ACTION_ADMIN_INIT = 'admin_init';
    public const ACTION_ADMIN_MENU = 'admin_menu';
    public const ACTION_ADMIN_NOTICES = 'admin_notices';
    public const ACTION_INIT_PLUGIN = 'publishpressfuture_init_plugin';
    public const ACTION_ACTIVATE_PLUGIN = 'publishpressfuture_activate_plugin';
    public const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuture_deactivate_plugin';
    public const ACTION_ADMIN_ENQUEUE_SCRIPT = 'admin_enqueue_scripts';
    public const ACTION_INSERT_POST = 'wp_insert_post';
    public const ACTION_PURGE_PLUGIN_CACHE = 'publishpressfuture_purge_plugin_cache';
    public const ACTION_BULK_EDIT_CUSTOM_BOX = 'bulk_edit_custom_box';
    public const ACTION_QUICK_EDIT_CUSTOM_BOX = 'quick_edit_custom_box';
    public const ACTION_SAVE_POST = 'save_post';
    public const ACTION_ADD_META_BOXES = 'add_meta_boxes';
    /**
     * @deprecated 3.1.5 use ACTION_ADD_META_BOXES instead
     */
    public const ACTION_ADD_META_BOX = self::ACTION_ADD_META_BOXES;
    public const ACTION_ADMIN_PRINT_SCRIPTS_EDIT = 'admin_print_scripts-edit.php';
    public const ACTION_ADMIN_ENQUEUE_SCRIPTS = 'admin_enqueue_scripts';
    public const FILTER_MODULES_LIST = 'publishpressfuture_list_modules';
    public const FILTER_PLUGIN_ACTION_LINKS = 'plugin_action_links';
}
