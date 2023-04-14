<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Core\DI\ServicesAbstract as ServicesAbstractFree;

abstract class ServicesAbstract
{
    public const PLUGIN_VERSION = 'future.pro/plugin-version';
    public const PLUGIN_SLUG = 'future.pro/plugin-slug';
    public const PLUGIN_NAME = 'future.pro/plugin-name';
    public const PLUGIN_AUTHOR = 'future.pro/plugin-author';
    public const PLUGIN_FILE = 'future.pro/plugin-file';
    public const BASE_PATH = 'future.pro/base-path';
    public const TEMPLATE_PATH = 'future.pro/template-path';
    public const ASSETS_URL = 'future.pro/assets-path';
    public const BASE_URL = 'future.pro/base-url';
    public const CONTROLLERS = 'future.pro/controllers';
    public const PLUGIN = 'future.pro/plugin';
    public const HOOKS = ServicesAbstractFree::HOOKS;
    public const CONTROLLER_CUSTOM_STATUSES = 'future.pro/controller-custom-statuses';
    public const CONTROLLER_SETTINGS = 'future.pro/controller-settings';
    public const CONTROLLER_EDD_INTEGRATION = 'future.pro/controller-edd-integration';
    public const MODEL_CUSTOM_STATUSES = 'future.pro/model-custom-statuses';
    public const MODEL_SETTINGS = 'future.pro/model-settings';
    public const OPTIONS = ServicesAbstractFree::OPTIONS;
    public const EDD_CONTAINER = 'future.pro/edd-container';
    public const EDD_SITE_URL = 'future.pro/edd-site-url';
    public const EDD_ITEM_ID = 'future.pro/edd-item-id';
    public const LICENSE_KEY = 'future.pro/license-key';
    public const LICENSE_STATUS = 'future.pro/license-status';
}
