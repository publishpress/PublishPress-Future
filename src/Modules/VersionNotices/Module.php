<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\VersionNotices;


use PublishPress\Future\Core\Paths;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\WordpressVersionNotices\Module\TopNotice\Module as VersionNoticesModule;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    /**
     * @var Paths
     */
    private $paths;

    public function __construct(Paths $paths)
    {
        $this->paths = $paths->getBaseDirPath();
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        if (is_admin() && ! defined('PUBLISHPRESS_FUTURE_SKIP_VERSION_NOTICES')) {
            if (! defined('PP_VERSION_NOTICES_LOADED')) {
                $includesPath = $this->paths->getVendorDirPath(
                    ) . '/publishpress/wordpress-version-notices/includes.php';

                if (is_file($includesPath) && is_readable($includesPath)) {
                    // phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable
                    require_once $includesPath;
                }
            }

            if (current_user_can('install_plugins')) {
                add_filter(
                    VersionNoticesModule::SETTINGS_FILTER,
                    function ($settings) {
                        $settings['publishpress-future'] = [
                            'message' => __(
                                'You\'re using PublishPress Future Free. The Pro version has more features and support. %sUpgrade to Pro%s',
                                'post-expirator'
                            ),
                            'link' => 'https://publishpress.com/links/future-banner',
                            'screens' => [
                                [
                                    'base' => 'toplevel_page_publishpress-future',
                                    'id' => 'toplevel_page_publishpress-future'
                                ],
                                [
                                    'base' => 'future_page_publishpress-future-scheduled-actions',
                                    'id' => 'future_page_publishpress-future-scheduled-actions'
                                ]
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
                            'label' => __('Upgrade to Pro', 'post-expirator'),
                            'link' => 'https://publishpress.com/links/future-menu',
                        ];

                        return $settings;
                    }
                );
            }
        }
    }
}
