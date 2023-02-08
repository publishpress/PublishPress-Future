<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Modules\Expirator\HooksAbstract as HooksAbstractFree;

abstract class HooksAbstract
{
    public const ACTION_INIT_PLUGIN = 'publishpressfuturepro_init_plugin';

    public const ACTION_POST_EXPIRED = HooksAbstractFree::ACTION_POST_EXPIRED;

    public const FILTER_CONTROLLERS_LIST = 'publishpressfuturepro_list_modules';

    public const FILTER_EXPIRATION_ACTION_FACTORY = HooksAbstractFree::FILTER_EXPIRATION_ACTION_FACTORY;

    public const ACTION_ACTIVATE_PLUGIN = 'publishpressfuturepro_activate_plugin';

    public const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuturepro_deactivate_plugin';

    public const ADMIN_MENU = 'admin_menu';

    public const ADMIN_INIT = 'admin_init';
}
