<?php

/**
 * Copyright (c) 2024, Ramble Ventures
 */

namespace PublishPress\Future\Modules\Backup;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Modules\Backup\Controllers\BackupAdminPage;
use PublishPress\Future\Modules\Backup\Controllers\BackupRestApi;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    private HookableInterface $hooks;

    private string $pluginVersion;

    public function __construct(HookableInterface $hooks, string $pluginVersion)
    {
        $this->hooks = $hooks;
        $this->pluginVersion = $pluginVersion;
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        $controllers = [
            new BackupAdminPage(
                $this->hooks
            ),
            new BackupRestApi(
                $this->hooks,
                $this->pluginVersion
            ),
        ];

        foreach ($controllers as $controller) {
            $controller->initialize();
        }
    }
}
