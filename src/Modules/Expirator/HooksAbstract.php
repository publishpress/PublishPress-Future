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
    const ACTION_SCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/schedule';
    const ACTION_UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/unschedule';
    const ACTION_EXPIRE_POST = 'publishpressfuture.expiration/expire';
    const FILTER_CUSTOM_EXPIRATION_TYPE = 'publishpressfuture.expiration/custom_expiration/type';

    public static function getActionLegacyMultisiteDelete($blogId)
    {
        return self::ACTION_LEGACY_MULTISITE_DELETE_PREFIX . $blogId;
    }
}
