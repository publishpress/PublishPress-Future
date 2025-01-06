<?php

/**
 * Copyright (c) 2024, Ramble Ventures
 */

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class ServicesAbstract
{
    public const PLUGIN = 'future.free/plugin';

    public const PLUGIN_VERSION = 'future.free/plugin/version';

    public const PLUGIN_SLUG = 'future.free/plugin/slug';

    public const PLUGIN_NAME = 'future.free/plugin/name';

    public const DEFAULT_DATA = 'future.free/default/data';

    public const DEFAULT_DATE_FORMAT = 'future.free/default/date-format';

    public const DEFAULT_TIME_FORMAT = 'future.free/default/time-format';

    public const DEFAULT_FOOTER_CONTENT = 'future.free/default/footer-content';

    public const DEFAULT_FOOTER_STYLE = 'future.free/default/footer-style';

    public const DEFAULT_FOOTER_DISPLAY = 'future.free/default/footer-display';

    public const DEFAULT_EMAIL_NOTIFICATION = 'future.free/default/email-notification';

    public const DEFAULT_EMAIL_NOTIFICATION_ADMINS = 'future.free/default/email-notification-admins';

    public const DEFAULT_DEBUG = 'future.free/default/debug';

    public const DEFAULT_EXPIRATION_DATE = 'future.free/default/expiration-date';

    public const BASE_PATH = 'future.free/base/path';

    public const BASE_URL = 'future.free/base/url';

    public const HOOKS = 'future.free/hooks';

    public const LEGACY_PLUGIN = 'future.free/legacy-plugin';

    public const PATHS = 'future.free/paths';

    public const DB = 'future.free/db';

    public const SITE = 'future.free/site';

    public const SETTINGS = 'future.free/settings';

    public const LOGGER = 'future.free/logger';

    public const CRON = 'future.free/cron';

    public const WOO_CRON_ADAPTER = 'future.free/woo-cron-adapter';

    public const ERROR = 'future.free/error';

    public const DATETIME = 'future.free/datetime';

    public const OPTIONS = 'future.free/options';

    public const USERS = 'future.free/users-facade';

    public const EMAIL = 'future.free/email-facade';

    public const REQUEST = 'future.free/request-facade';

    public const DEBUG = 'future.free/debug';

    public const SANITIZATION = 'future.free/sanitization';

    public const MODULES = 'future.free/modules';

    public const EXPIRATION_SCHEDULER = 'future.free/expiration-scheduler';

    public const MODULE_DEBUG = 'future.free/module-debug';

    public const MODULE_WOOCOMMERCE = 'future.free/module-woocommerce';

    public const MODULE_INSTANCE_PROTECTION = 'future.free/module-instance_protection';

    public const MODULE_EXPIRATOR = 'future.free/module-expirator';

    public const MODULE_SETTINGS = 'future.free/module-settings';

    public const MODULE_VERSION_NOTICES = 'future.free/module-version-notices';

    public const MODULE_WORKFLOWS = 'future.free/module-workflows';

    public const MODULE_BACKUP = 'future.free/module-backup';

    public const POST_MODEL_FACTORY = 'future.free/post-model-factory';

    public const TERM_MODEL_FACTORY = 'future.free/term-model-factory';

    public const USER_MODEL_FACTORY = 'future.free/user-model-factory';

    public const CURRENT_USER_MODEL_FACTORY = 'future.free/current-user-model-factory';

    public const EXPIRABLE_POST_MODEL_FACTORY = 'future.free/expirable-post-model-factory';

    public const EXPIRATION_ACTION_FACTORY = 'future.free/expiration-action-factory';

    public const POST_TYPE_DEFAULT_DATA_MODEL_FACTORY = 'future.free/post-type-default-data-model-factory';

    public const EXPIRATION_ACTIONS_MODEL = 'future.free/expiration-actions-model';

    public const POST_TYPE_SETTINGS_MODEL_FACTORY = 'future.free/post-type-settings-model-factory';

    public const TAXONOMIES_MODEL_FACTORY = 'future.free/taxonomies-model-factory';

    public const SCHEDULED_ACTIONS_TABLE_FACTORY = 'future.free/scheduled-actions-table';

    public const ACTION_ARGS_MODEL_FACTORY = 'future.free/actions-args-mode-factory';

    public const ACTION_SCHEDULER_STORE = 'future.free/action-scheduler/store';

    public const ACTION_SCHEDULER_LOGGER = 'future.free/action-scheduler/logger';

    public const ACTION_SCHEDULER_RUNNER = 'future.free/action-scheduler/runner';

    public const MIGRATIONS_FACTORY = 'future.free/migrations';

    public const NOTICES = 'future.free/notices-facade';

    public const DB_TABLE_SCHEMA_HANDLER_FACTORY = 'future.free/db-table-schema/handler-factory';

    public const DB_TABLE_ACTION_ARGS_SCHEMA = 'future.free/db-table-schema/action-args-schema';

    public const DB_TABLE_DEBUG_LOG_SCHEMA = 'future.free/db-table-schema/debug-log-schema';

    public const WPDB = 'future.free/wpdb';

    public const WORKFLOWS_REST_API_MANAGER = 'future.free/workflows/rest-api-manager';

    public const NODE_TYPES_MODEL = 'future.free/workflows/node-types-model';

    public const CRON_SCHEDULES_MODEL = 'future.free/workflows/cron-schedules-model';

    public const WORKFLOW_ENGINE = 'future.free/workflows/engine';

    public const WORKFLOW_VARIABLES_HANDLER = 'future.free/workflows/variables-handler';

    public const NODE_RUNNER_MAPPER = 'future.free/workflows/node-runner-mapper';

    public const GENERAL_STEP_NODE_RUNNER_PROCESSOR = 'future.free/workflows/general-step-node-runner-processor';

    public const POST_STEP_NODE_RUNNER_PROCESSOR = 'future.free/workflows/post-step-node-runner-processor';

    public const CRON_STEP_NODE_RUNNER_PROCESSOR = 'future.free/workflows/cron-step-node-runner-processor';

    public const NODE_RUNNER_FACTORY = 'future.free/workflows/node-runner-factory';

    public const INPUT_VALIDATOR_POST_QUERY = 'future.free/workflows/input-validator-post-query';

    public const DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA = 'future.free/workflows/db-table-workflow-scheduled-steps-schema';

    public const DATE_TIME_HANDLER = 'future.free/datetime-handler';
}
