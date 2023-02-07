<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

abstract class HooksAbstract
{
    const ACTION_ADMIN_INIT = 'admin_init';
    const ACTION_LEGACY_SCHEDULE = 'postexpirator_schedule';
    const ACTION_LEGACY_UNSCHEDULE = 'postexpirator_unschedule';
    const ACTION_LEGACY_EXPIRE_POST = 'postExpiratorExpire';
    const ACTION_LEGACY_DELETE = 'expirationdate_delete';
    const ACTION_LEGACY_MULTISITE_DELETE_PREFIX = 'expirationdate_delete_';
    const FILTER_LEGACY_CUSTOM_EXPIRATION_TYPE = 'postexpirator_custom_posttype_expire';
    const ACTION_SCHEDULE_POST_EXPIRATION = 'publishpressfuture_schedule_expiration';
    const ACTION_UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture_unschedule_expiration';
    const ACTION_POST_EXPIRED = 'publishpressfuture_post_expired';
    const ACTION_EXPIRE_POST = 'publishpressfuture_expire';
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


    public static function getActionLegacyMultisiteDelete($blogId)
    {
        return self::ACTION_LEGACY_MULTISITE_DELETE_PREFIX . $blogId;
    }
}
