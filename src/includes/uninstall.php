<?php

/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPress\FuturePro;

use PublishPress\Future\Core\HooksAbstract as HooksAbstractFree;

use function PublishPress\Future\uninstall as uninstallFree;

defined('ABSPATH') or die('No direct script access allowed.');

function uninstall(): void
{
    // Deactivate the Pro plugin.
    uninstallFree();

    // Deactivate the Free plugin.
    do_action(HooksAbstractFree::ACTION_DEACTIVATE_PLUGIN);
}
