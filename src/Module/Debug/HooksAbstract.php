<?php

namespace PublishPressFuture\Module\Debug;

class HooksAbstract
{
    const ACTION_LOGGER_LOG = 'publishpressfuture.debug/log';

    const ACTION_LOGGER_EMERGENCY = 'publishpressfuture.debug/log/emergency';

    const ACTION_LOGGER_ALERT = 'publishpressfuture.debug/log/alert';

    const ACTION_LOGGER_CRITICAL = 'publishpressfuture.debug/log/critical';

    const ACTION_LOGGER_ERROR = 'publishpressfuture.debug/log/error';

    const ACTION_LOGGER_WARNING = 'publishpressfuture.debug/log/warning';

    const ACTION_LOGGER_NOTICE = 'publishpressfuture.debug/log/notice';

    const ACTION_LOGGER_INFO = 'publishpressfuture.debug/log/info';

    const ACTION_LOGGER_DEBUG = 'publishpressfuture.debug/log/debug';

    const ACTION_LOGGER_DELETE_LOGS = 'publishpressfuture.debug/delete/logs';

    const ACTION_LOGGER_DROP_DATABASE_TABLE = 'publishpressfuture.debug/db/drop/table';

    const FILTER_LOGGER_FETCH_ALL = 'publishpressfuture.debug/fetch/all';
}
