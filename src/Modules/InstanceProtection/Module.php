<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\InstanceProtection;


use PublishPress\Future\Core\Paths;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPressInstanceProtection\Config;
use PublishPressInstanceProtection\InstanceChecker;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    public function __construct(Paths $paths, $pluginSlug, $pluginName)
    {
        $includeFile = $paths->getVendorDirPath()
            . '/publishpress/publishpress-instance-protection/include.php';

        if (is_readable($includeFile)) {
            // phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable
            require_once $includeFile;
        }

        if (! class_exists('PublishPressInstanceProtection\\Config')) {
            return null;
        }

        $pluginCheckerConfig = new Config();
        $pluginCheckerConfig->pluginSlug = $pluginSlug;
        $pluginCheckerConfig->pluginName = $pluginName;

        new InstanceChecker($pluginCheckerConfig);
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
    }
}
