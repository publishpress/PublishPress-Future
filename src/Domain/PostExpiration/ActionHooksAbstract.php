<?php

namespace PublishPressFuture\Domain\PostExpiration;

abstract class ActionHooksAbstract
{
    const LEGACY_SCHEDULE = 'postexpirator_schedule';

    const LEGACY_UNSCHEDULE = 'postexpirator_unschedule';

    const LEGACY_EXPIRE_POST = 'postExpiratorExpire';

    const SCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/schedule';

    const UNSCHEDULE_POST_EXPIRATION = 'publishpressfuture.expiration/unschedule';

    const EXPIRE_POST = 'publishpressfuture.expiration/expire';
}
