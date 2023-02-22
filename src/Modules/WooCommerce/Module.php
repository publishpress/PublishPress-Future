<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\WooCommerce;


use PublishPressFuture\Framework\ModuleInterface;

class Module implements ModuleInterface
{
    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var string
     */
    private $pluginVersion;


    public function __construct($baseUrl, $pluginVersion)
    {
        $this->baseUrl = $baseUrl;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueueStyle']);
    }

    public function enqueueStyle()
    {
        $currentScreen = get_current_screen();

        if (! is_admin()) {
            return;
        }

        if ($currentScreen->base !== 'edit') {
            return;
        }

        if ($currentScreen->post_type !== 'product') {
            return;
        }

        wp_enqueue_style(
            'publishpress-future-woocommerce',
            $this->baseUrl . 'assets/css/woocommerce.css',
            array(),
            $this->pluginVersion,
            false
        );
    }
}
