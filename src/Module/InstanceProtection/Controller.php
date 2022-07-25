<?php

namespace PublishPressFuture\Module\InstanceProtection;

use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\Paths;
use PublishPressInstanceProtection\InstanceChecker;
use PublishPressInstanceProtection\Config as InstanceProtectionConfig;

class Controller implements InitializableInterface
{
    /**
     * @var Paths
     */
    private $paths;

    /**
     * @param Paths $paths
     */
    public function __construct(Paths $paths)
    {
        $this->paths = $paths;
    }

    public function initialize()
    {
        $this->factoryInstanceProtectionChecker();
    }

    private function factoryInstanceProtectionChecker()
    {
        $vendorDirPath = $this->paths->getVendorDirPath() . '/publishpress/publishpress-instance-protection/include.php';

        if (is_readable($vendorDirPath)) {
            require_once $vendorDirPath;
        }

        if (class_exists('PublishPressInstanceProtection\\Config')) {
            $pluginCheckerConfig = new InstanceProtectionConfig();
            $pluginCheckerConfig->pluginSlug = 'post-expirator';
            $pluginCheckerConfig->pluginName = 'PublishPress Future';

            new InstanceChecker($pluginCheckerConfig);
        }
    }
}
