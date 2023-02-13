<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\VersionNotices;


use PublishPressFuture\Core\Paths;
use PublishPressFuture\Framework\ModuleInterface;

class Module implements ModuleInterface
{
    /**
     * @var string
     */
    private $basePath;

    public function __construct($basePath)
    {
        $this->basePath = $basePath;
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        if (is_admin() && !defined('PUBLISHPRESS_FUTURE_SKIP_VERSION_NOTICES')) {
            if (!defined('PP_VERSION_NOTICES_LOADED')) {
                $includesPath = $this->basePath . 'vendor/publishpress/wordpress-version-notices/includes.php';

                if (file_exists($includesPath)) {
                    require_once $includesPath;
                }
            }

            add_action(
                'plugins_loaded',
                function () {
                    if (current_user_can('install_plugins')) {
                        add_filter(
                            \PPVersionNotices\Module\TopNotice\Module::SETTINGS_FILTER,
                            function ($settings) {
                                $settings['publishpress-future'] = [
                                    'message' => 'You\'re using PublishPress Future Free. The Pro version has more features and support. %sUpgrade to Pro%s',
                                    'link'    => 'https://publishpress.com/links/future-banner',
                                    'screens' => [
                                        ['base' => 'admin', 'id' => 'edit-author', 'taxonomy' => 'author'],
                                        ['base' => 'term', 'id' => 'edit-author', 'taxonomy' => 'author'],
                                        ['base' => 'edit', 'id' => 'edit-ppma_boxes', 'post_type' => 'ppma_boxes'],
                                        ['base' => 'post', 'id' => 'ppma_boxes', 'post_type' => 'ppma_boxes'],
                                        ['base' => 'edit', 'id' => 'edit-ppmacf_field', 'post_type' => 'ppmacf_field'],
                                        ['base' => 'post', 'id' => 'ppmacf_field', 'post_type' => 'ppmacf_field'],
                                        [
                                            'base' => 'authors_page_ppma-modules-settings',
                                            'id'   => 'authors_page_ppma-modules-settings'
                                        ],
                                    ]
                                ];

                                return $settings;
                            }
                        );

                        add_filter(
                            'pp_version_notice_menu_link_settings',
                            function ($settings) {
                                $settings['publishpress-future'] = [
                                    'parent' => 'publishpress-future',
                                    'label'  => 'Upgrade to Pro',
                                    'link'   => 'https://publishpress.com/links/future-menu',
                                ];

                                return $settings;
                            }
                        );
                    }
                }
            );
        }
    }
}
