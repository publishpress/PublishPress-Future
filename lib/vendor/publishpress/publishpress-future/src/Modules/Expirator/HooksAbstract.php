<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class HooksAbstract
{
    const ACTION_INIT = 'init';
    const ACTION_ADMIN_INIT = 'admin_init';
    const ACTION_ADMIN_MENU = 'admin_menu';
    const ACTION_ADMIN_NOTICES = 'admin_notices';
    const ACTION_REST_API_INIT = 'rest_api_init';
    const ACTION_LEGACY_SCHEDULE = 'postexpirator_schedule';
    const ACTION_LEGACY_UNSCHEDULE = 'postexpirator_unschedule';
    const ACTION_LEGACY_EXPIRE_POST1 = 'postExpiratorExpire';
    const ACTION_LEGACY_EXPIRE_POST2 = 'publishpressfuture_expire';
    const ACTION_LEGACY_DELETE = 'expirationdate_delete';
    const ACTION_LEGACY_MULTISITE_DELETE_PREFIX = 'expirationdate_delete_';
    const FILTER_LEGACY_CUSTOM_EXPIRATION_TYPE = 'postexpirator_custom_posttype_expire';
    const ACTION_SCHEDULE_POST_EXPIRATION = 'publishpressfuture_schedule_expiration';
    const ACTION_UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture_unschedule_expiration';
    const ACTION_RUN_WORKFLOW = 'publishpressfuture_run_workflow';
    const ACTION_LEGACY_RUN_WORKFLOW = 'publishpress_future/run_workflow';
    const ACTION_POST_EXPIRED = 'publishpressfuture_post_expired';
    const ACTION_MIGRATE_REPLACE_FOOTER_PLACEHOLDERS = 'publishpress_future/v30000_replace_footer_placeholders';
    const ACTION_MIGRATE_WPCRON_EXPIRATIONS = 'publishpress_future/v30000_migrate_wpcron_expirations';
    const ACTION_MIGRATE_CREATE_ACTION_ARGS_SCHEMA = 'publishpress_future/v30000_create_actions_args_schema';
    const ACTION_MIGRATE_RESTORE_POST_META = 'publishpress_future/v30001_restore_post_meta';
    const ACTION_MIGRATE_ARGS_LENGTH = 'publishpress_future/V30104ArgsColumnLength';
    const ACTION_SCHEDULER_DELETED_ACTION = 'action_scheduler_deleted_action';
    const ACTION_SCHEDULER_CANCELED_ACTION = 'action_scheduler_canceled_action';
    const ACTION_SCHEDULER_AFTER_EXECUTE = 'action_scheduler_after_execute';
    const ACTION_SCHEDULER_FAILED_EXECUTION = 'action_scheduler_failed_execution';
    const ACTION_SYNC_SCHEDULER_WITH_POST_META = 'admin_action_sync_scheduler_with_post_meta';
    const ACTION_MANAGE_POSTS_CUSTOM_COLUMN = 'manage_posts_custom_column';
    const ACTION_MANAGE_PAGES_CUSTOM_COLUMN = 'manage_pages_custom_column';
    const ACTION_POSTS_ORDER_BY = 'posts_orderby';
    const ACTION_THE_CONTENT = 'the_content';
    const FILTER_CUSTOM_EXPIRATION_TYPE = 'publishpressfuture_custom_expiration_type';
    const FILTER_LEGACY_TEMPLATE_PARAMS = 'publishpressfuture_legacy_template_params';
    const FILTER_LEGACY_TEMPLATE_FILE = 'publishpressfuture_legacy_template_file';
    const FILTER_EXPIRED_EMAIL_SUBJECT = 'publishpressfuture_expired_email_subject';
    const FILTER_EXPIRED_EMAIL_BODY = 'publishpressfuture_expired_email_body';
    const FILTER_EXPIRED_EMAIL_ADDRESSES = 'publishpressfuture_expired_email_addresses';
    const FILTER_EXPIRED_EMAIL_HEADERS = 'publishpressfuture_expired_email_headers';
    const FILTER_EXPIRED_EMAIL_ATTACHMENTS = 'publishpressfuture_expired_email_attachments';
    const FILTER_EXPIRATION_ACTIONS = 'publishpressfuture_expiration_actions';
    const FILTER_EXPIRATION_ACTION_FACTORY = 'publishpressfuture_expiration_action_factory';
    const FILTER_ACTION_SCHEDULER_LIST_COLUMN_HOOK = 'publishpressfuture_action_scheduler_column_hook';
    const FILTER_BULK_ACTIONS_POST_EDIT = 'bulk_actions-edit-%s';
    const FILTER_MANAGE_POSTS_COLUMNS = 'manage_posts_columns';
    const FILTER_MANAGE_PAGES_COLUMNS = 'manage_pages_columns';
    const FILTER_POSTS_JOIN = 'posts_join';
    const FILTER_CONTENT_FOOTER = 'publishpress_future/content_footer';
    const FILTER_ACTION_BASE_DATE_STRING = 'publishpress_future/action_base_date_string';
    const FILTER_ACTION_META_KEY = 'publishpressfuture_action_meta_key';
    const FILTER_SUPPORTED_POST_TYPES = 'publishpressfuture_supported_post_types';
    const FILTER_UNSET_POST_TYPES_DEPRECATED = 'postexpirator_unset_post_types';
    const FILTER_HIDE_METABOX = 'publishpressfuture_hide_metabox';
    const FILTER_EXPIRATION_NEW_STATUS = 'publishpressfuture_expiration_new_status';
    const FILTER_EXPIRATION_STATUSES = 'publishpressfuture_expiration_statuses';


    public static function getActionLegacyMultisiteDelete($blogId)
    {
        return self::ACTION_LEGACY_MULTISITE_DELETE_PREFIX . $blogId;
    }
}
