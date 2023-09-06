<?php

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Models\SettingsModel;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

defined('ABSPATH') or die('No direct script access allowed.');

class EddIntegrationController implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $templatesPath;
    /**
     * @var \PublishPress\FuturePro\Models\SettingsModel
     */
    private $settingsModel;
    private $eddContainer;

    public function __construct(
        HookableInterface $hooks,
        SettingsModel $settingsModel,
        $templatesPath,
        $eddContainer
    ) {
        $this->hooks = $hooks;
        $this->templatesPath = $templatesPath;
        $this->settingsModel = $settingsModel;
        $this->eddContainer = $eddContainer;
    }


    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_INIT,
            [$this, 'initializeUpdateManager']
        );
    }

    public function initializeUpdateManager()
    {
        return $this->eddContainer['update_manager'];
    }
}
