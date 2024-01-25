<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\FuturePro\Core;

use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstractFree;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpirationHooksAbstractFree;

defined('ABSPATH') or die('No direct script access allowed.');

abstract class HooksAbstract
{
    const ACTION_INIT_PLUGIN = 'publishpressfuturepro_init_plugin';

    const ACTION_POST_EXPIRED = ExpirationHooksAbstractFree::ACTION_POST_EXPIRED;

    const FILTER_CONTROLLERS_LIST = 'publishpressfuturepro_list_modules';

    const FILTER_EXPIRATION_ACTION_FACTORY = ExpirationHooksAbstractFree::FILTER_EXPIRATION_ACTION_FACTORY;

    const ACTION_ACTIVATE_PLUGIN = 'publishpressfuturepro_activate_plugin';

    const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuturepro_deactivate_plugin';

    const ACTION_ADMIN_INIT = 'admin_init';

    const FILTER_ALLOWED_TABS = SettingsHooksAbstractFree::FILTER_ALLOWED_TABS;

    const ACTION_LOAD_TAB = SettingsHooksAbstractFree::ACTION_LOAD_TAB;

    const FILTER_SETTINGS_TABS = SettingsHooksAbstractFree::FILTER_SETTINGS_TABS;

    const ACTION_SAVE_LICENSE_TAB = SettingsHooksAbstractFree::ACTION_SAVE_TAB_PREFIX . 'license';

    const ACTION_SAVE_POST_TYPE_SETTINGS = SettingsHooksAbstractFree::ACTION_SAVE_POST_TYPE_SETTINGS;

    const ACTION_SAVE_ADVANCED_SETTINGS = SettingsHooksAbstractFree::ACTION_SAVE_TAB_PREFIX . 'advanced';

    const ACTION_ADMIN_ENQUEUE_SCRIPT = 'admin_enqueue_scripts';

    const ACTION = 'publishpress_authors_show_blocks_recommendation_banner';

    const FILTER_SETTINGS_POST_TYPE = SettingsHooksAbstractFree::FILTER_SETTINGS_POST_TYPE;

    const ACTION_DELETE_ALL_SETTINGS = SettingsHooksAbstractFree::ACTION_DELETE_ALL_SETTINGS;

    const ACTION_SETTINGS_TAB_ADVANCED_BEFORE = 'publishpress_future/settings_tab_advanced_before';
}
