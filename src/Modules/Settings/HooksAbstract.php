<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

abstract class HooksAbstract
{
    const ACTION_DELETE_ALL_SETTINGS = 'publishpressfuture_delete_settings';
    const FILTER_DEBUG_ENABLED = 'publishpressfuture_debug_enabled';
    const ACTION_SAVE_TAB = 'publishpressfuture_save_tab_';
    const FILTER_ALLOWED_TABS = 'publishpressfuture_allowed_tabs';
    const FILTER_SETTINGS_TABS = 'publishpressfuture_settings_tabs';
    const ACTION_LOAD_TAB = 'publishpressfuture_load_tab';
    const ACTION_SETTINGS_TABS = 'publishpressfuture_settings_tabs';
}
