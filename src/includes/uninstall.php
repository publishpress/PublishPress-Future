<?php

/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPress\FuturePro;

use PublishPress\Future\Core\HooksAbstract as HooksAbstractFree;
use PublishPress\FuturePro\Core\HooksAbstract;

defined('ABSPATH') or die('No direct script access allowed.');

function uninstall()
{
    // Deactivate the Pro plugin.
    do_action(HooksAbstract::ACTION_DEACTIVATE_PLUGIN);

    // Deactivate the Free plugin.
    do_action(HooksAbstractFree::ACTION_DEACTIVATE_PLUGIN);
}
