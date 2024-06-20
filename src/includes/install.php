<?php

/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPress\FuturePro;

use PublishPress\FuturePro\Core\HooksAbstract;

use function PublishPress\Future\install as installFree;

defined('ABSPATH') or die('No direct script access allowed.');

function install(): void
{
    // Action for the Free plugin activation.
    installFree();

    // Action for the Pro plugin activation.
    do_action(HooksAbstract::ACTION_ACTIVATE_PLUGIN);
}
