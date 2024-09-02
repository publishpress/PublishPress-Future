<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Core\HooksAbstract as FreeHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Migrations\V40000WorkflowScheduledStepsSchema;

class Migrations implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $migrationsFactory;

    private $pluginVersion;

    public function __construct(
        HookableInterface $hooks,
        \Closure $migrationsFactory,
        string $pluginVersion
    ) {
        $this->hooks = $hooks;
        $this->migrationsFactory = $migrationsFactory;
        $this->pluginVersion = $pluginVersion;
    }

    public function initialize()
    {
        $this->hooks->addAction(FreeHooksAbstract::FILTER_MIGRATIONS, [
            $this,
            "filterMigrations",
        ]);

        $this->hooks->addAction(
            FreeHooksAbstract::ACTION_UPGRADE_PLUGIN,
            [$this, 'runMigrations']
        );
    }

    public function filterMigrations($migrations)
    {
        $migration = $this->migrationsFactory;
        $migration = $migration();

        $migrations = array_merge($migrations, $migration);

        return $migrations;
    }

    public function runMigrations(string $version)
    {
        $version = get_option('publishpressFutureProVersion');

        if (empty($version)) {
            $version = '0.0.0';
        }

        if (version_compare($version, '4.0.0', '<')) {
            $this->hooks->doAction(V40000WorkflowScheduledStepsSchema::HOOK);
        }

        if ($version !== $this->pluginVersion) {
            update_option('publishpressFutureProVersion', $this->pluginVersion);
        }
    }
}
