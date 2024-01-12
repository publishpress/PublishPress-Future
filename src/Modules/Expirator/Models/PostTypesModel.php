<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Psr\Container\ContainerInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class PostTypesModel
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

    /**
     * Returns the post types that are supported.
     *
     * @internal
     *
     * @access private
     */
    public function getPostTypes(): array
    {
        $post_types = get_post_types(array('public' => true));
        $post_types = array_merge(
            $post_types,
            get_post_types(
                [
                    'public' => false,
                    'show_ui' => true,
                    '_builtin' => true
                ]
            )
        );

        // in case some post types should not be supported.
        $unset_post_types = apply_filters('postexpirator_unset_post_types', ['attachment','wp_navigation']);
        if ($unset_post_types) {
            foreach ($unset_post_types as $type) {
                unset($post_types[$type]);
            }
        }

        return $post_types;
    }
}
