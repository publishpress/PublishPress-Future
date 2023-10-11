<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Psr\Container\ContainerInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class PostTypes
{
    /**
     * @var \PublishPress\Future\Modules\Settings\SettingsFacade
     */
    private $settingsModelFactory;

    public function __construct(ContainerInterface $container)
    {
        $this->settingsModelFactory = $container->get(ServicesAbstract::POST_TYPE_SETTINGS_MODEL_FACTORY);
    }

    public function getActivatedPostTypes(): array
    {
        $settingsModelFactory = $this->settingsModelFactory;
        $settingsModel = $settingsModelFactory();
        $settings = $settingsModel->getPostTypesSettings();

        $activePostTypes = array_filter($settings, function ($postTypeSettings) {
            return $postTypeSettings['active'];
        });

        return array_keys($activePostTypes);
    }
}
