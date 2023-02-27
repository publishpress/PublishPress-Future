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
                $includesPath = $this->basePath . '/vendor/publishpress/wordpress-version-notices/includes.php';

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
                                    'message' => __( 'You\'re using PublishPress Future Free. The Pro version has more features and support. %sUpgrade to Pro%s', 'post-expirator' ),
                                    'link'    => 'https://publishpress.com/links/future-banner',
                                    'screens' => [
                                        [
                                            'base' => 'toplevel_page_publishpress-future',
                                            'id'   => 'toplevel_page_publishpress-future'
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
                                    'label'  => __( 'Upgrade to Pro', 'post-expirator' ),
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
