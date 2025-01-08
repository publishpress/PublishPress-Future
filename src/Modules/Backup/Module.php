<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Modules\Backup;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Modules\Backup\Controllers\BackupAdminPage;
use PublishPress\Future\Modules\Backup\Controllers\BackupRestApi;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    private HookableInterface $hooks;

    private string $pluginVersion;

    private SettingsFacade $settingsFacade;

    private LoggerInterface $logger;

    public function __construct(
        HookableInterface $hooks,
        string $pluginVersion,
        SettingsFacade $settingsFacade,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->pluginVersion = $pluginVersion;
        $this->settingsFacade = $settingsFacade;
        $this->logger = $logger;
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        $controllers = [
            new BackupAdminPage(
                $this->hooks,
                $this->settingsFacade
            ),
            new BackupRestApi(
                $this->hooks,
                $this->pluginVersion,
                $this->settingsFacade,
                $this->logger
            ),
        ];

        foreach ($controllers as $controller) {
            $controller->initialize();
        }
    }
}
