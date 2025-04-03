<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Modules\Settings\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreAbstractHooks;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstract;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use Throwable;

defined('ABSPATH') or die('Direct access not allowed.');

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
     * @var \Closure
     */
    private $settingsPostTypesModelFactory;

    /**
     * @var \Closure
     */
    private $taxonomiesModelFactory;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;

    /**
     * @var \Closure
     */
    private $migrationsFactory;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param \Closure $settingsPostTypesModelFactory
     * @param \Closure $taxonomiesModelFactory
     * @param $actionsModel
     * @param \Closure $migrationsFactory
     * @param LoggerInterface $logger
     */
    public function __construct(
        HookableInterface $hooks,
        $settings,
        $settingsPostTypesModelFactory,
        $taxonomiesModelFactory,
        $actionsModel,
        $migrationsFactory,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModelFactory = $settingsPostTypesModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;
        $this->actionsModel = $actionsModel;
        $this->migrationsFactory = $migrationsFactory;
        $this->logger = $logger;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            SettingsHooksAbstract::FILTER_DEBUG_ENABLED,
            [$this, 'onFilterDebugEnabled']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ADMIN_ENQUEUE_SCRIPTS,
            [$this, 'onAdminEnqueueScript'],
            15
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ADMIN_INIT,
            [$this, 'processFormSubmission']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_INIT,
            [$this, 'initMigrations'],
            20
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

        $this->hooks->doAction(SettingsHooksAbstract::ACTION_DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }

    public function onFilterDebugEnabled($enabled = false)
    {
        return $this->settings->getDebugIsEnabled($enabled);
    }

    private function convertPostTypesListIntoOptionsList($list)
    {
        $optionsList = [];

        foreach ($list as $postType => $taxonomiesList) {
            $optionsList[$postType] = [];

            if (empty($taxonomiesList)) {
                continue;
            }

            foreach ($taxonomiesList as $taxonomySlug => $taxonomyObject) {
                $optionsList[$postType][] = ['value' => $taxonomySlug, 'label' => $taxonomyObject->label];
            }
        }

        return $optionsList;
    }

    public function onAdminEnqueueScript($screenId)
    {
        try {
            if ($screenId !== 'future_page_publishpress-future-settings') {
                return;
            }

            wp_enqueue_style(
                'pe-footer',
                Plugin::getAssetUrl('css/footer.css'),
                false,
                PUBLISHPRESS_FUTURE_VERSION
            );
            wp_enqueue_style(
                'pe-settings',
                Plugin::getAssetUrl('css/settings.css'),
                ['pe-footer'],
                PUBLISHPRESS_FUTURE_VERSION
            );
            wp_enqueue_style(
                'pe-jquery-ui',
                Plugin::getAssetUrl('css/lib/jquery-ui/jquery-ui.min.css'),
                ['pe-settings'],
                PUBLISHPRESS_FUTURE_VERSION
            );
            wp_enqueue_style(
                'pp-wordpress-banners-style',
                Plugin::getAssetUrl('vendor/wordpress-banners/css/style.css'),
                false,
                PUBLISHPRESS_FUTURE_VERSION
            );

            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            if (! isset($_GET['tab']) || $_GET['tab'] === 'advanced') {
                wp_enqueue_script(
                    'publishpress-future-settings-advanced-panel',
                    Plugin::getScriptUrl('settingsAdvanced'),
                    [
                        'wp-components',
                        'wp-url',
                        'wp-data',
                        'wp-element',
                        'wp-api-fetch',
                    ],
                    PUBLISHPRESS_FUTURE_VERSION,
                    true
                );

                wp_enqueue_script('wp-url');
                wp_enqueue_script('wp-element');
                wp_enqueue_script('wp-api-fetch');
                wp_enqueue_script('wp-data');

                wp_localize_script(
                    'publishpress-future-settings-advanced-panel',
                    'publishpressFutureSettingsAdvanced',
                    [
                        'text' => [
                            'scheduledStepsCleanup' => __('Scheduled Workflow Steps Cleanup', 'post-expirator'),
                            'scheduledStepsCleanupEnable' => __(
                                'Automatically remove scheduled workflow steps',
                                'post-expirator'
                            ),
                            'scheduledStepsCleanupEnableDesc' => __(
                                'Automatically remove scheduled workflow steps that have been marked as failed, completed, or cancelled.',
                                'post-expirator'
                            ),
                            'scheduledStepsCleanupDisable' => __(
                                'Retain all scheduled workflow steps',
                                'post-expirator'
                            ),
                            'scheduledStepsCleanupDisableDesc' => __(
                                'Retain all scheduled workflow steps indefinitely, including those marked as failed, completed, or cancelled. This may impact database performance over time.',
                                'post-expirator'
                            ),
                            'scheduledStepsCleanupRetention' => __('Retention', 'post-expirator'),
                            'scheduledStepsCleanupRetentionDesc' => __(
                                'The duration, in days, for which completed, failed, and canceled scheduled workflow steps will be preserved before automatic removal.',
                                'post-expirator'
                            ),
                            'days' => __('days', 'post-expirator'),
                        ],
                        'settings' => [
                            'scheduledStepsCleanupStatus' => $this->settings->getScheduledWorkflowStepsCleanupStatus(),
                            'scheduledStepsCleanupRetention' => $this->settings->getScheduledWorkflowStepsCleanupRetention(),
                        ],
                        'settingsTab' => $this->getCurrentTab(),
                    ]
                );
            }
        } catch (Throwable $th) {
            $this->logger->error('Error enqueuing scripts: ' . $th->getMessage());
        }
    }

    private function getCurrentTab()
    {
        $allowedTabs = [
            'diagnostics',
            'viewdebug',
            'advanced',
        ];

        $allowedTabs = $this->hooks->applyFilters(SettingsHooksAbstract::FILTER_ALLOWED_SETTINGS_TABS, $allowedTabs);

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : '';

        if (empty($tab) || ! in_array($tab, $allowedTabs, true)) {
            $tab = 'advanced';
        }

        return $tab;
    }

    public function processFormSubmission()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if (empty($_POST)) {
            return;
        }

        $tab = $this->getCurrentTab();

        $methodName = 'saveTab' . ucfirst($tab);
        if (method_exists($this, $methodName)) {
            call_user_func([$this, $methodName]);
        }

        $this->hooks->doAction(SettingsHooksAbstract::ACTION_SAVE_TAB_PREFIX . $tab);
    }

    public function initMigrations()
    {
        try {
            $factory = $this->migrationsFactory;
            $factory();
        } catch (Throwable $th) {
            $this->logger->error('Error initializing migrations: ' . $th->getMessage());
        }
    }

    private function convertTermsToIds($taxonomy, $terms)
    {
        if (empty($terms)) {
            return [];
        }

        $taxonomiesModelFactory = $this->taxonomiesModelFactory;
        $taxonomiesModel = $taxonomiesModelFactory();

        $terms = explode(',', $terms);
        $terms = array_map(function ($term) use ($taxonomy, $taxonomiesModel) {
            $term = \sanitize_text_field($term);
            $termId = $taxonomiesModel->getTermIdByName($taxonomy, $term);

            if (! $termId) {
                $termId = $taxonomiesModel->createTermAndReturnId(
                    $taxonomy,
                    $term
                );
            }

            return $termId;
        }, $terms);

        return $terms;
    }

    public function saveTabAdvanced()
    {
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $experimentalFeaturesStatus = isset($_POST['future-experimental-features'])
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        ? (int) $_POST['future-experimental-features']
        : 0;
        $this->settings->setExperimentalFeaturesStatus($experimentalFeaturesStatus);

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $stepScheduleCompressedArgsStatus = isset($_POST['future-step-schedule-compressed-args'])
            // phpcs:ignore WordPress.Security.NonceVerification.Missing
            ? (int) $_POST['future-step-schedule-compressed-args']
            : 0;
        $this->settings->setStepScheduleCompressedArgsStatus($stepScheduleCompressedArgsStatus);

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $stepScheduleCleanupStatus = isset($_POST['future-step-schedule-cleanup'])
            // phpcs:ignore WordPress.Security.NonceVerification.Missing
            ? (bool) $_POST['future-step-schedule-cleanup']
            : false;
        $this->settings->setScheduledWorkflowStepsCleanupStatus($stepScheduleCleanupStatus);

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $stepScheduleCleanupRetention = isset($_POST['future-step-schedule-cleanup-retention'])
            // phpcs:ignore WordPress.Security.NonceVerification.Missing
            ? (int) $_POST['future-step-schedule-cleanup-retention']
            : 30;

        if ($stepScheduleCleanupRetention < 1) {
            $stepScheduleCleanupRetention = 30;
        }

        $this->settings->setScheduledWorkflowStepsCleanupRetention($stepScheduleCleanupRetention);
    }
}
