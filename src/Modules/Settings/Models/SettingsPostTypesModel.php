<?php
/**
 * Copyright (c) 2022-2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings\Models;

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Settings\HooksAbstract;

class SettingsPostTypesModel
{
    public function getPostTypes()
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
            $container = Container::getInstance();
            $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

            $defaults = $settingsFacade->getPostTypeDefaults($postType);

            $terms = isset($defaults['terms']) ? explode(',', $defaults['terms']) : [];
            $terms = array_map('intval', $terms);
            $terms = array_filter($terms, function($value) {return (int)$value > 0;});

            $settings[$postType] = [
                'label' => esc_html($postTypeObject->label),
                'active' => (! isset($defaults['activeMetaBox']) && in_array($postType, array('post', 'page'), true))
                    || (isset($defaults['activeMetaBox']) && $defaults['activeMetaBox'] !== 'inactive'),
                'howToExpire' => isset($defaults['expireType']) ? $defaults['expireType'] : '',
                'autoEnabled' => isset($defaults['autoEnable']) && $defaults['autoEnable'] == 1,
                'taxonomy' => isset($defaults['taxonomy']) ? $defaults['taxonomy'] : false,
                'terms' => $terms,
                'emailNotification' => isset($defaults['emailnotification']) ? $defaults['emailnotification'] : '',
                'defaultExpireType' => isset($defaults['default-expire-type']) ? $defaults['default-expire-type'] : '',
                'defaultExpireOffset' => isset($defaults['default-custom-date']) ? $defaults['default-custom-date'] : '',
                'globalDefaultExpireOffset' => $placeholder = $settingsFacade->getDefaultDateCustom(),
            ];

            $settings = apply_filters(
                HooksAbstract::FILTER_SETTINGS_POST_TYPE,
                $settings,
                $postType
            );
        }

        return $settings;
    }

    public function updatePostTypesSettings($postType, $settings)
    {
        \update_option('expirationdateDefaults' . ucfirst($postType), $settings);
    }
}
