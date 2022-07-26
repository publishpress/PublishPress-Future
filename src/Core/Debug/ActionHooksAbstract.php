<?php

namespace PublishPressFuture\Core\Debug;

abstract class ActionHooksAbstract
{
    const LOG = 'publishpressfuture.debug/log';

    const LOG_EMERGENCY = 'publishpressfuture.debug/log/emergency';

    const LOG_ALERT = 'publishpressfuture.debug/log/alert';

    const LOG_CRITICAL = 'publishpressfuture.debug/log/critical';

    const LOG_ERROR = 'publishpressfuture.debug/log/error';

    const LOG_WARNING = 'publishpressfuture.debug/log/warning';

    const LOG_NOTICE = 'publishpressfuture.debug/log/notice';

    const LOG_INFO = 'publishpressfuture.debug/log/info';

    const LOG_DEBUG = 'publishpressfuture.debug/log/debug';

    const DELETE_LOGS = 'publishpressfuture.debug/delete/logs';

    const DROP_DATABASE_TABLE = 'publishpressfuture.debug/db/drop/table';

    const FETCH_ALL_LOGS = 'publishpressfuture.debug/fetch/all';
}
