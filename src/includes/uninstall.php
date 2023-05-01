<?php

/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPressFuturePro {

    use PublishPressFuture\Core\DI\Container;
    use PublishPressFuture\Core\DI\ServicesAbstract;
    use PublishPressFuturePro\Core\HooksAbstract;

    defined('ABSPATH') or die('No direct script access allowed.');

    function uninstall()
    {
        // Deactivate the Pro plugin.
        do_action(HooksAbstract::ACTION_DEACTIVATE_PLUGIN);

        // Deactivate the Free plugin.
        $container = Container::getInstance();
        $container->get(ServicesAbstract::PLUGIN)->deactivatePlugin();
    }
}
