<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

abstract class ServicesAbstract
{
    const PLUGIN = 'future.free/plugin';
    const PLUGIN_VERSION = 'future.free/plugin/version';
    const PLUGIN_SLUG = 'future.free/plugin/slug';
    const PLUGIN_NAME = 'future.free/plugin/name';
    const DEFAULT_DATA = 'future.free/default/data';
    const DEFAULT_DATE_FORMAT = 'future.free/default/date-format';
    const DEFAULT_TIME_FORMAT = 'future.free/default/time-format';
    const DEFAULT_FOOTER_CONTENT = 'future.free/default/footer-content';
    const DEFAULT_FOOTER_STYLE = 'future.free/default/footer-style';
    const DEFAULT_FOOTER_DISPLAY = 'future.free/default/footer-display';
    const DEFAULT_EMAIL_NOTIFICATION = 'future.free/default/email-notification';
    const DEFAULT_EMAIL_NOTIFICATION_ADMINS = 'future.free/default/email-notification-admins';
    const DEFAULT_DEBUG = 'future.free/default/debug';
    const DEFAULT_EXPIRATION_DATE = 'future.free/default/expiration-date';
    const BASE_PATH = 'future.free/base/path';
    const BASE_URL = 'future.free/base/url';
    const HOOKS = 'future.free/hooks';
    const LEGACY_PLUGIN = 'future.free/legacy-plugin';
    const PATHS = 'future.free/paths';
    const DB = 'future.free/db';
    const SITE = 'future.free/site';
    const SETTINGS = 'future.free/settings';
    const LOGGER = 'future.free/logger';
    const CRON = 'future.free/cron';
    const ERROR = 'future.free/error';
    const DATETIME = 'future.free/datetime';
    const OPTIONS = 'future.free/options';
    const USERS = 'future.free/users-facade';
    const EMAIL = 'future.free/email-facade';
    const REQUEST = 'future.free/request-facade';
    const DEBUG = 'future.free/debug';
    const SANITIZATION = 'future.free/sanitization';
    const MODULES = 'future.free/modules';
    const EXPIRATION_SCHEDULER = 'future.free/expiration-scheduler';
    const MODULE_DEBUG = 'future.free/module-debug';
    const MODULE_WOOCOMMERCE = 'future.free/module-woocommerce';
    const MODULE_INSTANCE_PROTECTION = 'future.free/module-instance_protection';
    const MODULE_EXPIRATOR = 'future.free/module-expirator';
    const MODULE_SETTINGS = 'future.free/module-settings';
    const MODULE_VERSION_NOTICES = 'future.free/module-version-notices';
    const POST_MODEL_FACTORY = 'future.free/post-model-factory';
    const TERM_MODEL_FACTORY = 'future.free/term-model-factory';
    const USER_MODEL_FACTORY = 'future.free/user-model-factory';
    const CURRENT_USER_MODEL_FACTORY = 'future.free/current-user-model-factory';
    const EXPIRABLE_POST_MODEL_FACTORY = 'future.free/expirable-post-model-factory';
    const EXPIRATION_ACTION_FACTORY = 'future.free/expiration-action-factory';
    const DEFAULT_DATA_MODEL = 'future.free/default-data-model-factory';
    const EXPIRATION_ACTIONS_MODEL = 'future.free/expiration-actions-model';
    const POST_TYPE_SETTINGS_MODEL_FACTORY = 'future.free/post-type-settings-model-factory';
    const TAXONOMIES_MODEL_FACTORY = 'future.free/taxonomies-model-factory';
}
