<?php
/**
 * Copyright (c) 2022-2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;
use PublishPress\Future\Modules\Settings\HooksAbstract;
use PublishPress\Future\Core\HookableInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class SettingsPostTypesModel
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

            $defaults = $this->settings->getPostTypeDefaults($postType);

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
                'globalDefaultExpireOffset' => $this->settings->getGeneralDateTimeOffset(),
                'newStatus' => isset($defaults['newStatus']) ? $defaults['newStatus'] : 'draft',
            ];

            $settings = $this->hooks->applyFilters(
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
