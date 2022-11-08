<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\InstanceProtection;


use PublishPressFuture\Core\Paths;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressInstanceProtection\Config;
use PublishPressInstanceProtection\InstanceChecker;

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
