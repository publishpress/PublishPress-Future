<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core;

abstract class HooksAbstract
{
    const ACTION_INIT_PLUGIN = 'publishpressfuture.core/init';
    const ACTION_ACTIVATE_PLUGIN = 'publishpressfuture.core/activate';
    const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuture.core/deactivate';
    const FILTER_MODULES_LIST = 'publishpressfuture.core/modules/list';
}
