<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\FuturePro\Core;

use PublishPress\Future\Core\DI\ServicesAbstract as ServicesAbstractFree;

defined('ABSPATH') or die('No direct script access allowed.');
abstract class ServicesAbstract
{
    const PLUGIN_VERSION = 'future.pro/plugin-version';
    const PLUGIN_SLUG = 'future.pro/plugin-slug';
    const PLUGIN_NAME = 'future.pro/plugin-name';
    const PLUGIN_AUTHOR = 'future.pro/plugin-author';
    const PLUGIN_FILE = 'future.pro/plugin-file';
    const BASE_PATH = 'future.pro/base-path';
    const TEMPLATE_PATH = 'future.pro/template-path';
    const ASSETS_URL = 'future.pro/assets-url';
    const BASE_URL = 'future.pro/base-url';
    const CONTROLLERS = 'future.pro/controllers';
    const PLUGIN = 'future.pro/plugin';
    const HOOKS = ServicesAbstractFree::HOOKS;
    const CONTROLLER_CUSTOM_STATUSES = 'future.pro/controller-custom-statuses';
    const CONTROLLER_SETTINGS = 'future.pro/controller-settings';
    const CONTROLLER_EDD_INTEGRATION = 'future.pro/controller-edd-integration';
    const CONTROLLER_BASE_DATE = 'future.pro/controller-base-date';
    const CONTROLLER_BLOCKS = 'future.pro/controller-blocks';
    const CONTROLLER_METADATA_MAPPING = 'future.pro/controller-metadata-mapping';
    const MODEL_CUSTOM_STATUSES = 'future.pro/model-custom-statuses';
    const MODEL_SETTINGS = 'future.pro/model-settings';
    const OPTIONS = ServicesAbstractFree::OPTIONS;
    const EDD_CONTAINER = 'future.pro/edd-container';
    const EDD_SITE_URL = 'future.pro/edd-site-url';
    const EDD_ITEM_ID = 'future.pro/edd-item-id';
    const LICENSE_KEY = 'future.pro/license-key';
    const LICENSE_STATUS = 'future.pro/license-status';
    const MODULES = 'future.pro/modules';
    const MODULE_WORKFLOWS = 'future.pro/module-workflows';
    const WORKFLOWS_REST_API_MANAGER = 'future.pro/workflows-rest-api-manager';
    const NODE_TYPES_MODEL = 'future.pro/node-types-model';
    const CRON_SCHEDULES_MODEL = 'future.pro/cron-schedules-model';
    const WORKFLOW_ENGINE = 'future.pro/workflow-engine';
}
