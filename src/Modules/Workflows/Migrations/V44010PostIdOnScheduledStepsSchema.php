<?php

namespace PublishPress\Future\Modules\Workflows\Migrations;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class V44010PostIdOnScheduledStepsSchema implements MigrationInterface
{
    public const HOOK = HooksAbstract::ACTION_MIGRATE_POST_ID_ON_SCHEDULED_STEPS;

    private $hooksFacade;

    /**
     * @var DBTableSchemaInterface
     */
    private $workflowScheduledStepsSchema;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooksFacade
     */
    public function __construct(
        HookableInterface $hooksFacade,
        DBTableSchemaInterface $workflowScheduledStepsSchema
    ) {
        $this->hooksFacade = $hooksFacade;
        $this->workflowScheduledStepsSchema = $workflowScheduledStepsSchema;

        $this->hooksFacade->addAction(self::HOOK, [$this, 'migrate']);
        $this->hooksFacade->addAction(
            ExpiratorHooks::FILTER_ACTION_SCHEDULER_LIST_COLUMN_HOOK,
            [$this, 'formatLogActionColumn'],
            10,
            2
        );
    }

    public function migrate()
    {
        if (!$this->workflowScheduledStepsSchema->isTableHealthy()) {
            $this->workflowScheduledStepsSchema->fixTable();
        }
    }

    /**
     * @param string $text
     * @param array $row
     * @return string
     */
    public function formatLogActionColumn($text, $row)
    {
        if ($row['hook'] === self::HOOK) {
            return __('Migrate post_id on scheduled steps schema after v4.4.1', 'publishpress-future');
        }

        return $text;
    }
}
