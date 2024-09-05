<?php

/**
 * Copyright (c) 2024 Ramble Ventures
 */

namespace PublishPress\FuturePro\Core;

use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstractFree;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpirationHooksAbstractFree;

defined('ABSPATH') or die('No direct script access allowed.');

abstract class HooksAbstract
{
    public const ACTION_INIT_PLUGIN = 'publishpressfuturepro_init_plugin';

    public const ACTION_POST_EXPIRED = ExpirationHooksAbstractFree::ACTION_POST_EXPIRED;

    public const FILTER_CONTROLLERS_LIST = 'publishpressfuturepro_controllers';

    public const FILTER_EXPIRATION_ACTION_FACTORY = ExpirationHooksAbstractFree::FILTER_EXPIRATION_ACTION_FACTORY;

    public const ACTION_ACTIVATE_PLUGIN = 'publishpressfuturepro_activate_plugin';

    public const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuturepro_deactivate_plugin';

    public const ACTION_ADMIN_INIT = 'admin_init';

    public const FILTER_ALLOWED_TABS = SettingsHooksAbstractFree::FILTER_ALLOWED_TABS;

    public const ACTION_LOAD_TAB = SettingsHooksAbstractFree::ACTION_LOAD_TAB;

    public const FILTER_SETTINGS_TABS = SettingsHooksAbstractFree::FILTER_SETTINGS_TABS;

    public const ACTION_SAVE_LICENSE_TAB = SettingsHooksAbstractFree::ACTION_SAVE_TAB_PREFIX . 'license';

    public const ACTION_SAVE_POST_TYPE_SETTINGS = SettingsHooksAbstractFree::ACTION_SAVE_POST_TYPE_SETTINGS;

    public const ACTION_SAVE_ALL_POST_TYPES_SETTINGS = SettingsHooksAbstractFree::ACTION_SAVE_ALL_POST_TYPES_SETTINGS;

    public const ACTION_SAVE_ADVANCED_SETTINGS = SettingsHooksAbstractFree::ACTION_SAVE_TAB_PREFIX . 'advanced';

    public const ACTION_ADMIN_ENQUEUE_SCRIPT = 'admin_enqueue_scripts';

    public const ACTION = 'publishpress_authors_show_blocks_recommendation_banner';

    public const FILTER_SETTINGS_POST_TYPE = SettingsHooksAbstractFree::FILTER_SETTINGS_POST_TYPE;

    public const ACTION_DELETE_ALL_SETTINGS = SettingsHooksAbstractFree::ACTION_DELETE_ALL_SETTINGS;

    public const ACTION_SETTINGS_TAB_ADVANCED_BEFORE = 'publishpress_future/settings_tab_advanced_before';

    public const ACTION_ENQUEUE_BLOCK_EDITOR_ASSETS = 'enqueue_block_editor_assets';

    public const ACTION_PROCESS_METADATA = 'publishpressfuturepro_process_metadata';

    public const ACTION_IMPORT_START = 'import_start';

    public const ACTION_IMPORT_END = 'import_end';

    public const FILTER_MODULES_LIST = 'publishpressfuturepro_modules';

    public const ACTION_ADMIN_MENU = 'admin_menu';

    public const ACTION_ADD_METABOXES = 'add_meta_boxes';

    public const ACTION_SAVE_POST = 'save_post';

    public const ACTION_REST_API_INIT = 'rest_api_init';

    public const ACTION_LOAD_POST_PHP = 'load-post.php';

    public const ACTION_LOAD_POST_NEW_PHP = 'load-post-new.php';
}
