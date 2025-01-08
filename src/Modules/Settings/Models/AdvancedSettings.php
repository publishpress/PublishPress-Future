<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Modules\Settings\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;
use PublishPress\Future\Modules\Settings\HooksAbstract;
use PublishPress\Future\Core\HookableInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class AdvancedSettings
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SettingsFacade
     */
    private $settings;

    public function __construct()
    {
        $container = Container::getInstance();

        $this->hooks = $container->get(ServicesAbstract::HOOKS);
        $this->settings = $container->get(ServicesAbstract::SETTINGS);
    }


}
