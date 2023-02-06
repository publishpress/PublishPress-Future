<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Core\DI\ServicesAbstract as ServicesAbstractFree;

abstract class ServicesAbstract
{
    public const PLUGIN_VERSION = 'future.pro/plugin/version';
    public const PLUGIN_SLUG = 'future.pro/plugin/slug';
    public const PLUGIN_NAME = 'future.pro/plugin/name';
    public const BASE_PATH = 'future.pro/base-path';
    public const BASE_URL = 'future.pro/base-url';
    public const CONTROLLERS = 'future.pro/controllers';
    public const PLUGIN = 'future.pro/plugin';
    public const HOOKS = ServicesAbstractFree::HOOKS;
    public const CONTROLLER_CUSTOM_STATUSES = 'future.pro/controller-custom-statuses';
    public const MODEL_CUSTOM_STATUSES = 'future.pro/model-custom-statuses';
}
