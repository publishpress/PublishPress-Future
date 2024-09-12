<?php

/**
 * Copyright (c) 2024 Ramble Ventures
 */

namespace PublishPress\FuturePro\Core;

use PublishPress\Future\Core\DI\ServicesAbstract as ServicesAbstractFree;

defined('ABSPATH') or die('No direct script access allowed.');

abstract class ServicesAbstract
{
    public const PLUGIN_VERSION = 'future.pro/plugin-version';

    public const PLUGIN_SLUG = 'future.pro/plugin-slug';

    public const PLUGIN_NAME = 'future.pro/plugin-name';

    public const PLUGIN_AUTHOR = 'future.pro/plugin-author';

    public const PLUGIN_FILE = 'future.pro/plugin-file';

    public const BASE_PATH = 'future.pro/base-path';

    public const TEMPLATE_PATH = 'future.pro/template-path';

    public const ASSETS_URL = 'future.pro/assets-url';

    public const BASE_URL = 'future.pro/base-url';

    public const CONTROLLERS = 'future.pro/controllers';

    public const PLUGIN = 'future.pro/plugin';

    public const HOOKS = ServicesAbstractFree::HOOKS;

    public const CONTROLLER_CUSTOM_STATUSES = 'future.pro/controller-custom-statuses';

    public const CONTROLLER_SETTINGS = 'future.pro/controller-settings';

    public const CONTROLLER_EDD_INTEGRATION = 'future.pro/controller-edd-integration';

    public const CONTROLLER_BASE_DATE = 'future.pro/controller-base-date';

    public const CONTROLLER_BLOCKS = 'future.pro/controller-blocks';

    public const CONTROLLER_METADATA_MAPPING = 'future.pro/controller-metadata-mapping';

    public const MODEL_CUSTOM_STATUSES = 'future.pro/model-custom-statuses';

    public const MODEL_SETTINGS = 'future.pro/model-settings';

    public const OPTIONS = ServicesAbstractFree::OPTIONS;

    public const EDD_CONTAINER = 'future.pro/edd-container';

    public const EDD_SITE_URL = 'future.pro/edd-site-url';

    public const EDD_ITEM_ID = 'future.pro/edd-item-id';

    public const LICENSE_KEY = 'future.pro/license-key';

    public const LICENSE_STATUS = 'future.pro/license-status';

    public const MODULES = 'future.pro/modules';

    public const MODULE_WPFORMS = 'future.pro/module-wpforms';

    public const MODULE_WORKFLOWS = 'future.pro/module-workflows';

    public const MIGRATIONS_FACTORY = 'future.pro/migrations-factory';

    public const WORKFLOW_ENGINE = 'future.pro/workflow-engine';

    public const NODE_RUNNER_FACTORY = 'future.pro/node-runner-factory';

    /**
     * @deprecated 4.0.0
     */
    public const WORKFLOWS_REST_API_MANAGER = 'future.pro/workflows-rest-api-manager';

    /**
     * @deprecated 4.0.0
     */
    public const NODE_TYPES_MODEL = 'future.pro/node-types-model';

    /**
     * @deprecated 4.0.0
     */
    public const CRON_SCHEDULES_MODEL = 'future.pro/cron-schedules-model';

    /**
     * @deprecated 4.0.0
     */
    public const WORKFLOW_VARIABLES_HANDLER = 'future.pro/workflow-variables-handler';

    /**
     * @deprecated 4.0.0
     */
    public const NODE_RUNNER_MAPPER = 'future.pro/node-runner-mapper';

    /**
     * @deprecated 4.0.0
     */
    public const GENERAL_ACTION_NODE_RUNNER_PROCESSOR = 'future.pro/general-action-node-runner-processor';

    /**
     * @deprecated 4.0.0
     */
    public const POST_ACTION_NODE_RUNNER_PROCESSOR = 'future.pro/post-action-node-runner-processor';

    /**
     * @deprecated 4.0.0
     */
    public const GENERAL_STEP_NODE_RUNNER_PROCESSOR = 'future.pro/general-step-node-runner-processor';

    /**
     * @deprecated 4.0.0
     */
    public const POST_STEP_NODE_RUNNER_PROCESSOR = 'future.pro/post-step-node-runner-processor';

    /**
     * @deprecated 4.0.0
     */
    public const CRON_STEP_NODE_RUNNER_PROCESSOR = 'future.pro/cron-step-node-runner-processor';

    /**
     * @deprecated 4.0.0
     */
    public const INPUT_VALIDATOR_POST_QUERY = 'future.pro/input-validator-post-query';

    /**
     * @deprecated 4.0.0
     */
    public const DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA = 'future.pro/db-table-workflow-scheduled-steps-schema';
}
