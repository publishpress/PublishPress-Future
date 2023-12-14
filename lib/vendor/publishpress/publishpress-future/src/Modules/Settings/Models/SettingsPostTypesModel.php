<?php
/**
 * Copyright (c) 2022-2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;
use PublishPress\Future\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class SettingsPostTypesModel
{
    public function getPostTypes()
    {
        $container = Container::getInstance();
        $postTypesModel = new PostTypesModel($container);

        return $postTypesModel->getPostTypes();
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

            $terms = isset($defaults['terms']) ? $defaults['terms'] : [];
            if (is_string($terms)) {
                $terms = explode(',', $terms);
            }
            $terms = array_map('intval', $terms);
            $terms = array_filter($terms, function($value) {return (int)$value > 0;});
            $termsName = array_map(function($termId) {
                $term = get_term($termId);

                if (! $term instanceof \WP_Term) {
                    return '';
                }

                return $term->name;
            }, $terms);

            $settings[$postType] = [
                'label' => esc_html($postTypeObject->label),
                'active' => (! isset($defaults['activeMetaBox']) && in_array($postType, array('post', 'page'), true))
                    || (isset($defaults['activeMetaBox']) && (! in_array((string)$defaults['activeMetaBox'], ['inactive', '0']))),
                'howToExpire' => isset($defaults['expireType']) ? $defaults['expireType'] : '',
                'autoEnabled' => isset($defaults['autoEnable']) && $defaults['autoEnable'] == 1,
                'taxonomy' => isset($defaults['taxonomy']) ? $defaults['taxonomy'] : false,
                'terms' => $terms,
                'termsName' => $termsName,
                'emailNotification' => isset($defaults['emailnotification']) ? $defaults['emailnotification'] : '',
                'defaultExpireType' => isset($defaults['default-expire-type']) ? $defaults['default-expire-type'] : '',
                'defaultExpireOffset' => isset($defaults['default-custom-date']) ? $defaults['default-custom-date'] : '',
                'globalDefaultExpireOffset' => $settingsFacade->getGeneralDateTimeOffset(),
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
