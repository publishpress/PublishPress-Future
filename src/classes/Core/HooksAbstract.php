<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Modules\Settings\HooksAbstract as SettingsHooksAbstractFree;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpirationHooksAbstractFree;
use PublishPressFuture\Modules\Debug\HooksAbstract as DebugHooksAbstractFree;

abstract class HooksAbstract
{
    public const ACTION_INIT_PLUGIN = 'publishpressfuturepro_init_plugin';

    public const ACTION_POST_EXPIRED = ExpirationHooksAbstractFree::ACTION_POST_EXPIRED;

    public const FILTER_CONTROLLERS_LIST = 'publishpressfuturepro_list_modules';

    public const FILTER_EXPIRATION_ACTION_FACTORY = ExpirationHooksAbstractFree::FILTER_EXPIRATION_ACTION_FACTORY;

    public const ACTION_ACTIVATE_PLUGIN = 'publishpressfuturepro_activate_plugin';

    public const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuturepro_deactivate_plugin';

    public const ACTION_ADMIN_MENU = 'admin_menu';

    public const ACTION_ADMIN_INIT = 'admin_init';

    public const ACTION_AFTER_DEBUG_LOG_SETTING = DebugHooksAbstractFree::ACTION_AFTER_DEBUG_LOG_SETTING;

    public const FILTER_ALLOWED_TABS = SettingsHooksAbstractFree::FILTER_ALLOWED_TABS;

    public const ACTION_LOAD_TAB = SettingsHooksAbstractFree::ACTION_LOAD_TAB;

    public const FILTER_SETTINGS_TABS = SettingsHooksAbstractFree::FILTER_SETTINGS_TABS;

    public const ACTION_SAVE_TAB = SettingsHooksAbstractFree::ACTION_SAVE_TAB;

    public const ACTION_ADMIN_ENQUEUE_SCRIPT = 'admin_enqueue_scripts';

    public const ACTION = 'publishpress_authors_show_blocks_recommendation_banner';
}
