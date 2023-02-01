<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Core\DI\ServicesAbstract as ServicesAbstractFree;

abstract class ServicesAbstract
{
    const PLUGIN_VERSION = 'future.pro/plugin/version';
    const PLUGIN_SLUG = 'future.pro/plugin/slug';
    const PLUGIN_NAME = 'future.pro/plugin/name';
    const BASE_PATH = 'future.pro/base-path';
    const BASE_URL = 'future.pro/base-url';
    const MODULES = 'future.pro/modules';
    const PLUGIN = 'future.pro/plugin';
    const HOOKS = ServicesAbstractFree::HOOKS;
    const MODULE_CUSTOM_STATUSES = 'future.pro/module-custom-statuses';
    const MODEL_CUSTOM_STATUSES = 'future.pro/model-custom-statuses';
}
