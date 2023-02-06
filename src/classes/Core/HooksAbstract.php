<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Core\HooksAbstract as HooksAbstractFree;

abstract class HooksAbstract
{
    public const ACTION_INIT_PLUGIN = 'publishpressfuturepro_init_plugin';

    public const FILTER_CONTROLLERS_LIST = 'publishpressfuturepro_list_modules';

    public const FILTER_EXPIRATION_ACTION_FACTORY = HooksAbstractFree::FILTER_EXPIRATION_ACTION_FACTORY;
}
