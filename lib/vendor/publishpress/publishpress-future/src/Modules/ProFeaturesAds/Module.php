<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\ProFeaturesAds;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract;
use PublishPress\Future\Framework\ModuleInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var string
     */
    private $pluginVersion;

    public function __construct(HookableInterface $hooks, string $baseUrl, string $pluginVersion)
    {
        $this->hooks = $hooks;
        $this->baseUrl = $baseUrl;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        $this->hooks->addAction(HooksAbstract::ACTION_ADMIN_MENU, [$this, 'adminMenu']);
        $this->hooks->addAction(HooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS, [$this, 'enqueueScripts']);
    }

    public function adminMenu()
    {
        add_submenu_page(
            'publishpress-future',
            __('Action Workflows', 'publishpress-future'),
            __('Action Workflows', 'publishpress-future'),
            'manage_options',
            'publishpress_future_pro_features_ads',
            [$this, 'actionWorkflowsAdPage']
        );
    }

    public function enqueueScripts()
    {
        $currentScreen = get_current_screen();

        if ($currentScreen->id !== 'future_page_publishpress_future_pro_features_ads') {
            return;
        }

        wp_enqueue_style(
            'publishpress-future-pro-features-ads',
            $this->baseUrl . '/assets/css/pro-features-ads.css',
            [],
            $this->pluginVersion
        );
    }

    public function actionWorkflowsAdPage()
    {
        $baseUrl = $this->baseUrl;

        require_once __DIR__ . '/views/actions-workflows-page.html.php';
    }
}
