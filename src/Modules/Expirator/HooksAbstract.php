<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

abstract class HooksAbstract
{
    const ACTION_LEGACY_SCHEDULE = 'postexpirator_schedule';
    const ACTION_LEGACY_UNSCHEDULE = 'postexpirator_unschedule';
    const ACTION_LEGACY_EXPIRE_POST = 'postExpiratorExpire';
    const ACTION_LEGACY_DELETE = 'expirationdate_delete';
    const ACTION_LEGACY_MULTISITE_DELETE_PREFIX = 'expirationdate_delete_';
    const ACTION_SCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/schedule';
    const ACTION_UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/unschedule';
    const ACTION_RUN_POST_EXPIRATION = 'publishpressfuture.expiration/run';
    const FILTER_LEGACY_CUSTOM_EXPIRATION_TYPE = 'postexpirator_custom_posttype_expire';
    const FILTER_CUSTOM_EXPIRATION_TYPE = 'publishpressfuture.expiration/custom.expiration.type';

    public static function getActionLegacyMultisiteDelete($blogId)
    {
        return self::ACTION_LEGACY_MULTISITE_DELETE_PREFIX . $blogId;
    }
}
