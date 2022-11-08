<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

abstract class ServicesAbstract
{
    const PLUGIN = 'plugin';
    const PLUGIN_VERSION = 'plugin.version';
    const PLUGIN_SLUG = 'plugin.slug';
    const PLUGIN_NAME = 'plugin.name';
    const DEFAULT_DATA = 'default.data';
    const DEFAULT_DATE_FORMAT = 'default.date.format';
    const DEFAULT_TIME_FORMAT = 'default.time.format';
    const DEFAULT_FOOTER_CONTENT = 'default.footer.content';
    const DEFAULT_FOOTER_STYLE = 'default.footer.style';
    const DEFAULT_FOOTER_DISPLAY = 'default.footer.display';
    const DEFAULT_EMAIL_NOTIFICATION = 'default.email.notification';
    const DEFAULT_EMAIL_NOTIFICATION_ADMINS = 'default.email.notification.admins';
    const DEFAULT_DEBUG = 'default.debug';
    const DEFAULT_EXPIRATION_DATE = 'default.expiration.date';
    const BASE_PATH = 'base.path';
    const BASE_URL = 'base.url';
    const HOOKS = 'hooks';
    const LEGACY_PLUGIN = 'legacy.plugin';
    const PATHS = 'paths';
    const DB = 'db';
    const SITE = 'site';
    const SETTINGS = 'settings';
    const LOGGER = 'logger';
    const CRON = 'cron';
    const ERROR = 'error';
    const DATETIME = 'datetime';
    const OPTIONS = 'options';
    const USERS = 'users.facade';
    const EMAIL = 'email.facade';
    const REQUEST = 'request.facade';
    const DEBUG = 'debug';
    const SANITIZATION = 'sanitization';
    const MODULES = 'modules';
    const EXPIRATION_SCHEDULER = 'expiration.scheduler';
    const MODULE_DEBUG = 'module.debug';
    const MODULE_WOOCOMMERCE = 'module.woocommerce';
    const MODULE_INSTANCE_PROTECTION = 'module.instance_protection';
    const MODULE_EXPIRATOR = 'module.expirator';
    const MODULE_SETTINGS = 'module.settings';
    const POST_MODEL_FACTORY = 'post.model.factory';
    const TERM_MODEL_FACTORY = 'term.model.factory';
    const USER_MODEL_FACTORY = 'user.model.factory';
    const CURRENT_USER_MODEL_FACTORY = 'current.user.model.factory';
    const EXPIRABLE_POST_MODEL_FACTORY = 'expirable.post.model.factory';
    const EXPIRATION_ACTION_FACTORY = 'expiration.action.factory';
    const DEFAULT_DATA_MODEL = 'default.data.model.factory';
    const EXPIRATION_ACTION_MAPPER = 'expiration.action.mapper';
}
