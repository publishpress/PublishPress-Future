<?php

namespace PublishPressFuture\Module\Expiration;

class HooksAbstract
{
    const ACTION_LEGACY_SCHEDULE = 'postexpirator_schedule';

    const ACTION_LEGACY_UNSCHEDULE = 'postexpirator_unschedule';

    const ACTION_EXPIRE_POST = 'postExpiratorExpire';

    const ACTION_SCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/schedule';

    const ACTION_UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/unschedule';
}
