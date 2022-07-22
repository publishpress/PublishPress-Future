<?php

namespace PublishPressFuture\Core;

class HooksAbstract
{
    const FILTER_MODULES_LIST = 'publishpressfuture.core/modules/list';

    const ACTION_PLUGIN_INIT = 'publishpressfuture.core/init';

    const ACTION_PLUGIN_INIT_MODULES = 'publishpressfuture.core/init/modules';

    const ACTION_PLUGIN_AFTER_INIT_MODULE = 'publishpressfuture.core/init/module/after';

    const ACTION_DEACTIVATE_PLUGIN = 'publishpressfuture.core/deactivate';

    const ACTION_ACTIVATE_PLUGIN = 'publishpressfuture.core/activate';
}
