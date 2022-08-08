<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

abstract class HooksAbstract
{
    const LEGACY_SCHEDULE = 'postexpirator_schedule';

    const LEGACY_UNSCHEDULE = 'postexpirator_unschedule';

    const LEGACY_EXPIRE_POST = 'postExpiratorExpire';

    const SCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/schedule';

    const UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/unschedule';
}
