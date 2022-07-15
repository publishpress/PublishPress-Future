<?php

namespace PublishPressFuture\Module\InstanceProtection;

use PublishPressFuture\Core\HookFacadeInterface;

class Controller
{
    /**
     * @var HookFacadeInterface
     */
    private $actionsFacade;

    /**
     * @param HookFacadeInterface $actionsFacade
     */
    public function __construct(HookFacadeInterface $actionsFacade)
    {
        $this->actionsFacade = $actionsFacade;
    }

    public function init()
    {
        // $includeFileRelativePath = '/publishpress/publishpress-instance-protection/include.php';

        // if (is_readable(__DIR__ . '/vendor' . $includeFileRelativePath)) {
        //     require_once __DIR__ . '/vendor' . $includeFileRelativePath;
        // } else if (defined('POSTEXPIRATOR_VENDOR_PATH') && is_readable(POSTEXPIRATOR_VENDOR_PATH . $includeFileRelativePath)) {
        //     require_once POSTEXPIRATOR_VENDOR_PATH . $includeFileRelativePath;
        // }

        // if (class_exists('PublishPressInstanceProtection\\Config')) {
        //     $pluginCheckerConfig = new InstanceProtectionConfig();
        //     $pluginCheckerConfig->pluginSlug = 'post-expirator';
        //     $pluginCheckerConfig->pluginName = 'PublishPress Future';

        //     $pluginChecker = new InstanceChecker($pluginCheckerConfig);
        // }
    }
}
