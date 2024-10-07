<?php

namespace PublishPress\Future\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstract;

class Settings implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var DBTableSchemaInterface
     */
    private $workflowScheduledStepsSchema;

    public function __construct(HookableInterface $hooks, DBTableSchemaInterface $workflowScheduledStepsSchema)
    {
        $this->hooks = $hooks;
        $this->workflowScheduledStepsSchema = $workflowScheduledStepsSchema;
    }

    public function initialize()
    {
        // Quick Edit
        $this->hooks->addAction(
            SettingsHooksAbstract::ACTION_FIX_DB_SCHEMA,
            [$this, 'fixDbSchema']
        );

        $this->hooks->addFilter(
            SettingsHooksAbstract::FILTER_SCHEMA_IS_HEALTHY,
            [$this, 'isSchemaHealthy']
        );
    }

    public function fixDbSchema(): void
    {
        $this->workflowScheduledStepsSchema->fixTable();
    }

    public function isSchemaHealthy($isHealthy): bool
    {
        return $isHealthy && $this->workflowScheduledStepsSchema->isTableHealthy();
    }
}
