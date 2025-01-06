<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use Exception;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ScheduledActionsModelInterface;

class ScheduledActionsModel implements ScheduledActionsModelInterface
{
    public function deleteOrphanWorkflowArgs(): void
    {
        global $wpdb;

        $container = Container::getInstance();

        /**
         * @var DBTableSchemaInterface $tableSchema
         */
        $tableSchema = $container->get(ServicesAbstract::DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA);

        if (! $tableSchema->isTableExistent()) {
            return;
        }

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM %i AS scheduled_steps
                WHERE NOT EXISTS(
                    SELECT 1 FROM %i AS scheduler_actions
                    WHERE scheduled_steps.action_id = scheduler_actions.action_id
                )",
                $tableSchema->getTableName(),
                $wpdb->prefix . 'actionscheduler_actions'
            )
        );
    }

    public function deleteExpiredScheduledSteps(): void
    {
        global $wpdb;

        $container = Container::getInstance();

        /**
         * @var SettingsFacade $settingsFacade
         */
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $tableSchema = $wpdb->prefix . 'actionscheduler_actions';

        $retention = $settingsFacade->getScheduledWorkflowStepsCleanupRetention();

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM %i WHERE scheduled_date_gmt < %s",
                $tableSchema,
                gmdate('Y-m-d H:i:s', time() - ($retention * DAY_IN_SECONDS))
            )
        );

        $this->deleteOrphanWorkflowArgs();
    }

    public function hasRowWithActionUIDHash(string $actionUIDHash): bool
    {
        global $wpdb;

        $container = Container::getInstance();

        /**
         * @var DBTableSchemaInterface $tableSchema
         */
        $tableSchema = $container->get(ServicesAbstract::DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA);

        if (! $tableSchema->isTableExistent()) {
            return false;
        }

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT a.*
                FROM %i AS a
                LEFT JOIN %i AS b ON a.action_id = b.action_id
                WHERE a.action_uid_hash = %s AND b.status IN (%s, %s)",
                $tableSchema->getTableName(),
                $wpdb->prefix . 'actionscheduler_actions',
                $actionUIDHash,
                'pending',
                'in-progress'
            )
        );

        $hasRow = !is_null($row);

        return $hasRow;
    }

    public function cancelWorkflowScheduledActions(int $workflowId): void
    {
        global $wpdb;

        $container = Container::getInstance();

        /**
         * @var DBTableSchemaInterface $tableSchema
         */
        $tableSchema = $container->get(ServicesAbstract::DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA);

        if (! $tableSchema->isTableExistent()) {
            return;
        }

        // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}actionscheduler_actions AS asa
                INNER JOIN {$tableSchema->getTableName()} AS wss ON asa.action_id = wss.action_id
                SET asa.status = 'canceled'
                WHERE wss.workflow_id = %d AND asa.status = 'pending'",
                $workflowId
            )
        );

        // Remove execution data for the workflow
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->postmeta}
                WHERE (
                    meta_key LIKE '" . WorkflowScheduledStepModel::META_FINISHED_PREFIX . "%%'
                    OR meta_key LIKE '" . WorkflowScheduledStepModel::META_LAST_RUN_AT_PREFIX . "%%'
                    OR meta_key LIKE '" . WorkflowScheduledStepModel::META_RUN_COUNT_PREFIX . "%%'
                ) AND post_id = %d",
                $workflowId
            )
        );
        // phpcs:enable
    }

    public function cancelRecurringScheduledActions(int $workflowId, string $stepId): void
    {
        global $wpdb;

        // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->query(
            // The workflow ID needs to be cast to a string because it's a JSON field.
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}actionscheduler_actions AS asa
                SET asa.status = 'canceled'
                WHERE JSON_EXTRACT(asa.args, '$[0].workflowId') = %s
                    AND JSON_EXTRACT(asa.args, '$[0].stepId') = %s
                    AND asa.status = 'pending'",
                $workflowId,
                $stepId
            )
        );
        // phpcs:enable
    }
}
