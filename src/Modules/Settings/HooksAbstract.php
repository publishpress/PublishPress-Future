<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class HooksAbstract
{
    const ACTION_DELETE_ALL_SETTINGS = 'publishpressfuture_delete_settings';
    const FILTER_DEBUG_ENABLED = 'publishpressfuture_debug_enabled';
    const ACTION_SAVE_TAB_PREFIX = 'publishpressfuture_save_tab_';
    const FILTER_ALLOWED_TABS = 'publishpressfuture_allowed_tabs';
    const FILTER_SETTINGS_TABS = 'publishpressfuture_settings_tabs';
    const ACTION_LOAD_TAB = 'publishpressfuture_load_tab';
    const FILTER_SHOW_PRO_BANNER = 'publishpressfuture_show_pro_banner';
    const FILTER_SAVE_DEFAULTS_SETTINGS = 'publishpressfuture_save_defaults_settings';
    const ACTION_SAVE_POST_TYPE_SETTINGS = 'publishpressfuture_saved_post_type_settings';
    const ACTION_SAVE_ALL_POST_TYPES_SETTINGS = 'publishpressfuture_saved_all_post_types_settings';
    const FILTER_SETTINGS_POST_TYPE = 'publishpress_future_settings_post_type';
    const ACTION_SETTINGS_TAB_ADVANCED_BEFORE = 'publishpress_future/settings_tab_advanced_before';
}
