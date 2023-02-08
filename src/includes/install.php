<?php

/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPressFuturePro {

    use PublishPressFuturePro\Core\HooksAbstract;
    use PublishPressFuturePro\Models\WorkflowLogModel;

    function install()
    {
        do_action(HooksAbstract::ACTION_ACTIVATE_PLUGIN);
    }
}
