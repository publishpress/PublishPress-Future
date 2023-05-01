<?php

namespace PublishPress\Future\Modules\Debug;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class HooksAbstract
{
    const ACTION_DEBUG_LOG = 'publishpressfuture_debug_log';
    const ACTION_AFTER_DEBUG_LOG_SETTING = 'publishpressfuture_after_debug_log_setting';
}
