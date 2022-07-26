<?php

namespace PublishPressFuture\Core;

class ActionHooksAbstract
{
    const FILTER_MODULES_LIST = 'publishpressfuture.core/modules/list';

    const INIT_PLUGIN = 'publishpressfuture.core/init';

    const INIT_MODULES = 'publishpressfuture.core/init/modules';

    const AFTER_INIT_MODULE = 'publishpressfuture.core/init/module/after';

    const DEACTIVATE_PLUGIN = 'publishpressfuture.core/deactivate';

    const ACTIVATE_PLUGIN = 'publishpressfuture.core/activate';
}
