<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\HooksAbstract as CoreAbstractHooks;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Modules\Settings\HooksAbstract;
use PublishPressFuture\Modules\Settings\Models\SettingsPostTypesModel;
use PublishPressFuture\Modules\Settings\SettingsFacade;

class Controller implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SettingsFacade
     */
    private $settings;

    /**
     * @var array $defaultData
     */
    private $defaultData;

    /**
     * @var callable
     */
    private $settingsPostTypesModeFactory;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param callable $settingsPostTypesModeFactory
     */
    public function __construct(HookableInterface $hooks, $settings, $settingsPostTypesModeFactory)
    {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModeFactory = $settingsPostTypesModeFactory;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ACTIVATE_PLUGIN,
            [$this, 'onActionActivatePlugin']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_DEACTIVATE_PLUGIN,
            [$this, 'onActionDeactivatePlugin']
        );
        $this->hooks->addFilter(
            HooksAbstract::FILTER_DEBUG_ENABLED,
            [$this, 'onFilterDebugEnabled']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, 'onAdminEnqueueScript']
        );
    }

    public function onActionActivatePlugin()
    {
        $this->settings->setDefaultSettings();
    }

    public function onActionDeactivatePlugin()
    {
        if ($this->settings->getSettingPreserveData()) {
            return;
        }

        $this->hooks->doAction(HooksAbstract::ACTION_DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }

    public function onFilterDebugEnabled($enabled = false)
    {
        return $this->settings->getDebugIsEnabled($enabled);
    }

    public function onAdminEnqueueScript()
    {
        if (
            (isset($_GET['page']) && $_GET['page'] === 'publishpress-future')
            && (isset($_GET['tab']) && $_GET['tab'] === 'defaults')
        ) {
            wp_enqueue_script(
                'publishpressfuture-settings-panel',
                POSTEXPIRATOR_BASEURL . 'assets/js/settings-post-types.js',
                ['react', 'react-dom'],
                POSTEXPIRATOR_VERSION,
                true
            );

            $settingsPostTypesModeFactory = $this->settingsPostTypesModeFactory;
            $model = $settingsPostTypesModeFactory();

            wp_localize_script(
                'publishpressfuture-settings-panel',
                'publishpressFutureConfig',
                [
                    'text' => [
                        'settingsSectionTitle' => __('Default Expiration Values', 'post-expirator'),
                        'settingsSectionDescription' => __(
                            'Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.',
                            'post-expirator'
                        ),
                        'fieldLabelActive' => __('Active', 'post-expirator'),
                        'fieldLabelInactive' => __('Inactive', 'post-expirator'),
                        'fieldLabelActiveDescription' => __('Select whether the PublishPress Future meta box is active for this post type.', 'post-expirator'),
                        'fieldLabelHowToExpire' => __('How to expire', 'post-expirator'),
                        'fieldLabelHowToExpireDescription' => __('Select the default expire action for the post type.', 'post-expirator'),
                    ],
                    'settings' => $model->getPostTypesSettings(),
                    'expireTypeList' => [
                        ['value' => 'draft', 'label' => __('Draft', 'post-expirator')],
                        ['value' => 'delete', 'label' => __('Delete', 'post-expirator')],
                        ['value' => 'trash', 'label' => __('Trash', 'post-expirator')],
                        ['value' => 'private', 'label' => __('Private', 'post-expirator')],
                        ['value' => 'stick', 'label' => __('Stick', 'post-expirator')],
                        ['value' => 'unstick', 'label' => __('Unstick', 'post-expirator')],
                        ['value' => 'category', 'label' => __('Taxonomy: Replace', 'post-expirator')],
                        ['value' => 'category-add', 'label' => __('Taxonomy: Add', 'post-expirator')],
                        ['value' => 'category-remove', 'label' => __('Taxonomy: Remove', 'post-expirator')],
                    ]
                ]
            );
        }
    }
}
