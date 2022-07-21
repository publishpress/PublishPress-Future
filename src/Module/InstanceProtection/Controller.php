<?php

namespace PublishPressFuture\Module\InstanceProtection;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\Paths;
use PublishPressInstanceProtection\InstanceChecker;
use PublishPressInstanceProtection\Config as InstanceProtectionConfig;

class Controller implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var Paths
     */
    private $paths;

    /**
     * @var InstanceChecker
     */
    private $pluginChecker;

    /**
     * @param HookableInterface $hooks
     * @param Paths
     */
    public function __construct(HookableInterface $hooks, Paths $paths)
    {
        $this->hooks = $hooks;
        $this->paths = $paths;
    }

    public function initialize()
    {
        $this->pluginChecker = $this->factoryInstanceProtectionChecker();
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

            return new InstanceChecker($pluginCheckerConfig);
        }

        return null;
    }
}
