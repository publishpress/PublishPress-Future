<?php
/**
 * Copyright (c) 2022-2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings\Models;

class SettingsPostTypesModel
{
    private function getPostTypes()
    {
        return postexpirator_get_post_types();
    }

    public function getPostTypesSettings()
    {
        $postTypes = $this->getPostTypes();

        $settings = [];

        foreach ($postTypes as $postType) {
            $postTypeObject = get_post_type_object($postType);

            // TODO: Use DI here!!
            $container = \PublishPressFuture\Core\DI\Container::getInstance();
            $settingsFacade = $container->get(\PublishPressFuture\Core\DI\ServicesAbstract::SETTINGS);

            $defaults = $settingsFacade->getPostTypeDefaults($postType);

            $settings[$postType] = [
                'label' => esc_html($postTypeObject->label),
                'active' => (! isset($defaults['activeMetaBox']) && in_array($postType, array('post', 'page'), true))
                    || (isset($defaults['activeMetaBox']) && $defaults['activeMetaBox'] !== 'inactive'),
                'howToExpire' => isset($defaults['expireType']) ? $defaults['expireType'] : '',
                'autoEnabled' => isset($defaults['autoEnable']) && $defaults['autoEnable'] == 1,
                'taxonomy' => isset($defaults['taxonomy']) ? $defaults['taxonomy'] : false,
                'emailNotification' => isset($defaults['emailnotification']) ? $defaults['emailnotification'] : '',
                'defaultExpireType' => isset($defaults['default-expire-type']) ? $defaults['default-expire-type'] : '',
            ];
        }

        return $settings;
    }
}
