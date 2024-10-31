<?php

namespace PublishPress\Future\Modules\Workflows\Controllers;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use PublishPress\Future\Modules\Workflows\HooksAbstract as WorkflowsHooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionModel;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowScheduledStepModel;
use Throwable;

class ScheduledActions implements InitializableInterface
{
    /**
     * The default interval in seconds that the setup should be skipped.
     *
     * @var int
     */
    public const DEFAULT_SETUP_INTERVAL = 5;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    /**
     * @var CronInterface
     */
    private $cron;

    /**
     * @var SettingsFacade
     */
    private $settingsFacade;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        CronInterface $cron,
        SettingsFacade $settingsFacade,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cron = $cron;
        $this->settingsFacade = $settingsFacade;
        $this->logger = $logger;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            HooksAbstract::FILTER_ACTION_SCHEDULER_LIST_COLUMN_HOOK,
            [$this, 'showTitleInHookColumn'],
            10,
            2
        );

        $this->hooks->addFilter(
            WorkflowsHooksAbstract::FILTER_ACTION_SCHEDULER_LIST_COLUMN_ARGS,
            [$this, 'showArgsInArgsColumn'],
            10,
            2
        );

        $this->hooks->addFilter(
            WorkflowsHooksAbstract::FILTER_ACTION_SCHEDULER_LIST_COLUMN_RECURRENCE,
            [$this, 'showRecurrenceInRecurrenceColumn'],
            10,
            2
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS,
            [$this, 'enqueueScripts'],
            10,
            2
        );

        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_INIT,
            [$this, 'scheduleOrphanWorkflowArgsCleanup'],
            21
        );

        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_INIT,
            [$this, 'scheduleFinishedScheduledStepsCleanup'],
            21
        );


        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS,
            [$this, 'deleteOrphanWorkflowArgs']
        );

        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_CLEANUP_FINISHED_SCHEDULED_STEPS,
            [$this, 'deleteExpiredScheduledSteps']
        );

        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_SCHEDULER_STORED_ACTION,
            [$this, 'storeWorkflowCompactedArgsForStoredAction'],
            10
        );
    }

    private function getStepFromActionId(string $actionId): array
    {
        $actionModel = new ScheduledActionModel();
        $actionModel->loadByActionId((int) $actionId);

        $args = $actionModel->getArgs();

        if (empty($args)) {
            return [];
        }

        if (isset($args[0])) {
            $args = $args[0];
        }

        if (ScheduledActionModel::argsAreOnNewFormat((array) $args)) {
            try {
                $scheduledStepModel = new WorkflowScheduledStepModel();
                $scheduledStepModel->loadByActionId($actionModel->getActionId());

                $args = $scheduledStepModel->getArgs();
            } catch (Exception $e) {
                return [];
            }
        }

        if (! isset($args['runtimeVariables']['global']['workflow'])) {
            return [];
        }

        $stepIsCompact = ! isset($args['step']['next']);

        if ($stepIsCompact) {
            $workflowModel = new WorkflowModel();
            $workflowModel->load($args['runtimeVariables']['global']['workflow']['value'] ?? 0);

            $step = $workflowModel->getNodeById($args['step']['nodeId']);
        } else {
            $step = isset($args['step']) ? $args['step'] : [];
        }

        return $step;
    }

    public function showTitleInHookColumn($title, $row)
    {
        $actionModel = new ScheduledActionModel();
        $actionModel->loadByActionId($row['ID']);

        $hook = $actionModel->getHook();

        switch ($hook) {
            case WorkflowsHooksAbstract::ACTION_ASYNC_EXECUTE_NODE:
                $step = $this->getStepFromActionId($row['ID']);

                if (empty($step)) {
                    break;
                }

                $stepModel = new WorkflowScheduledStepModel();
                $stepModel->loadByActionId($row['ID']);

                $title = $stepModel->getIsRecurring() ?
                    __('Workflow repeating scheduled step', 'post-expirator') :
                    __('Workflow scheduled step', 'post-expirator');

                break;

            case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                $title = __('Unschedule workflow recurring scheduled step', 'post-expirator');
                break;

            case WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS:
                $title = __('Cleanup orphan workflow scheduled step arguments', 'post-expirator');
                break;

            case WorkflowsHooksAbstract::ACTION_CLEANUP_FINISHED_SCHEDULED_STEPS:
                $title = sprintf(
                    __('Clean up completed scheduled steps older than %d days', 'post-expirator'),
                    $this->settingsFacade->getScheduledWorkflowStepsCleanupRetention()
                );
                break;
        }

        return $title;
    }

    public function showArgsInArgsColumn($html, $row)
    {
        try {
            $actionId = $row['ID'];

            $actionModel = new ScheduledActionModel();
            $actionModel->loadByActionId($actionId);

            $hook = $actionModel->getHook();
            $args = $actionModel->getArgs();

            if (empty($args)) {
                return $html;
            }

            if (isset($args[0])) {
                $args = $args[0];
            }

            switch ($hook) {
                case WorkflowsHooksAbstract::ACTION_ASYNC_EXECUTE_NODE:
                    if (ScheduledActionModel::argsAreOnNewFormat((array) $args)) {
                        $scheduledStepModel = new WorkflowScheduledStepModel();
                        $scheduledStepModel->loadByActionId($actionId);

                        $args = $scheduledStepModel->getArgs();
                    }

                    if (! isset($args['runtimeVariables']['global']['workflow'])) {
                        return $html;
                    }

                    $argsText = '';

                    // Before v3.4.1 the plugin version was not set in the arguments
                    if (isset($args['pluginVersion'])) {
                        $workflowId = $args['runtimeVariables']['global']['workflow']['value'] ?? 0;
                    } else {
                        $workflowId = $args['runtimeVariables']['global']['workflow'] ?? 0;
                    }

                    $workflowModel = new WorkflowModel();
                    $workflowModel->load($workflowId);

                    $workflowTitle = $workflowModel->getTitle();
                    $stepIsCompact = ! isset($args['step']['next']);

                    $step = null;
                    if ($stepIsCompact) {
                        $step = $workflowModel->getPartialRoutineTreeFromNodeId($args['step']['nodeId']);
                    } else {
                        $step = $args['step'];
                    }

                    // The step is not found anymore in the workflow.
                    if (
                        empty($step)
                        || ! isset($step['node'])
                        || ! isset($step['node']['data'])
                        || ! isset($step['node']['data']['name'])
                    ) {
                        $html = '<span style="color: red;">' . __('Step not found in workflow.', 'post-expirator') . '</span>';

                        $html .= '<br>';
                        $html .= '<strong>' . __('Workflow:', 'post-expirator') . '</strong> '
                            . $workflowTitle . '<br>';

                        $html .= '<strong>' . __('Step:', 'post-expirator') . '</strong> '
                            . $args['step']['nodeId'];

                        return $html;
                    }

                    $next = $step['next'] ?? [];

                    $nodeType = $this->nodeTypesModel->getNodeType($step['node']['data']['name']);

                    $sourceHandles = [];
                    if (! is_null($nodeType)) {
                        $handlesSchema = $nodeType->getHandleSchema();

                        foreach ($handlesSchema['source'] as $handle) {
                            $sourceHandles[$handle['id']] = $handle['label'];
                        }
                    }

                    $nextNodes = '<ul class="future-workflows-outputs">';
                    foreach ($next as $handleId => $handlerNodes) {
                        $handleLabel = $sourceHandles[$handleId] ?? $handleId;
                        $nextNodes .= '<li class="future-workflow-step-handler">' . $handleLabel . ':</li>';
                        $nextNodes .= '<ul>';
                        foreach ($handlerNodes as $nextStep) {
                            $stepLabel = '';
                            if (isset($nextStep['node']['data']['label'])) {
                                $stepLabel = $nextStep['node']['data']['label'];
                            }

                            if (empty($stepLabel)) {
                                $stepNodeType = $this->nodeTypesModel->getNodeType($nextStep['node']['data']['name']);
                                if (is_object($stepNodeType)) {
                                    $stepLabel = $stepNodeType->getLabel();
                                }
                            }

                            if (empty($stepLabel)) {
                                $stepLabel = $nextStep['node']['data']['name'];
                            }

                            $nextNodes .= '<li>' . $stepLabel . '</li>';
                        }
                        $nextNodes .= '</ul>';
                    }
                    $nextNodes .= '</ul>';

                    $argsText = '<strong>' . __('Workflow:', 'post-expirator') . '</strong> '
                        . $workflowTitle . '<br>';

                    if (isset($args['pluginVersion'])) {
                        $argsText .= '<strong>' . __('Trigger: ', 'post-expirator') . '</strong>'
                            . $args['runtimeVariables']['global']['trigger']['value']['label'] . '<br>';

                        // Check if the trigger is related to a post
                        if (isset($args['runtimeVariables']['global']['trigger']['value']['slug'])) {
                            $nodeSlug = $args['runtimeVariables']['global']['trigger']['value']['slug'];

                            if (isset($args['runtimeVariables'][$nodeSlug]['postId'])) {
                                $postId = $args['runtimeVariables'][$nodeSlug]['postId']['value'];
                                $post = get_post($postId);

                                if ($post instanceof \WP_Post) {
                                    $postPermaling = get_permalink($post->ID);
                                    $argsText .= '<strong>' . __('Post:', 'post-expirator')
                                        . '</strong> <a target="_blank" href="' . esc_url($postPermaling) . '">'
                                        . $post->post_title . '</a><br>';
                                }
                            }
                        }
                    } else {
                        $argsText .= '<strong>' . __('Trigger: ', 'post-expirator') . '</strong>'
                            . $args['runtimeVariables']['global']['trigger']['label'] . '<br>';
                    }

                    $argsText .= '<strong>' . __('Steps:', 'post-expirator') . '</strong><br>' . $nextNodes;

                    $html = $argsText;
                    break;

                case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                    $html = __('Workflow recurring scheduled action', 'post-expirator');
                    break;
            }
        } catch (Throwable $e) {
            $this->logger->error(
                sprintf('Error showing args in args column: %s', $e->getMessage())
            );
        }

        return $html;
    }

    public function showRecurrenceInRecurrenceColumn($recurrence, $row)
    {
        $step = $this->getStepFromActionId($row['ID']);

        if (empty($step)) {
            return $recurrence;
        }

        // Show the recurrence information
        $stepModel = new WorkflowScheduledStepModel();
        $stepModel->loadByActionId($row['ID']);

        if (! $stepModel->getIsRecurring()) {
            return $recurrence;
        }

        $repeatUntil = $stepModel->getRepeatUntil();

        // Repeat until forever
        if ($repeatUntil === 'forever') {
            return $recurrence;
        }

        // Repeat until a specific date
        if ($repeatUntil === 'date') {
            $dateFormat = get_option('date_format');
            $timeFormat = get_option('time_format');
            $dateTimeFormat = $dateFormat . ' ' . $timeFormat;

            $formattedDate = wp_date($dateTimeFormat, strtotime($stepModel->getRepeatUntilDate()));

            return sprintf(
                // translators: %1$s: recurrence, %2$s: date
                __('%1$s until %2$s', 'post-expirator'),
                $recurrence,
                $formattedDate
            );
        }

        // Repeat until a specific number of times
        if ($repeatUntil === 'times') {
            $recurrence = sprintf(
                // translators: %1$s: recurrence, %2$d: repeat times
                __('%1$s for %2$d times', 'post-expirator'),
                $recurrence,
                $stepModel->getRepeatTimes()
            );

            // Check how many times the step has been executed
            $executedTimes = $stepModel->getRunCount();

            $recurrence .= ' ' . sprintf(
                // translators: %1$s: executed times, %2$d: total repeat times
                __('[%1$s/%2$d]', 'post-expirator'),
                $executedTimes,
                $stepModel->getRepeatTimes()
            );

            return $recurrence;
        }

        return $recurrence;
    }

    private function getExecutedTimes(array $step): int
    {
        $executedTimes = 0;

        return $executedTimes;
    }

    public function enqueueScripts($hook)
    {
        if ('future_page_publishpress-future-scheduled-actions' !== $hook) {
            return;
        }

        wp_enqueue_style(
            "future_actions_admin_style",
            plugins_url(
                "assets/css/future-actions.css",
                PUBLISHPRESS_FUTURE_PLUGIN_FILE
            ),
            ["wp-components", "wp-edit-post", "wp-editor"],
            PUBLISHPRESS_FUTURE_VERSION
        );
    }

    public function scheduleOrphanWorkflowArgsCleanup()
    {
        try {
            /**
             * @param int $interval
            * @return int
            */
            $interval = $this->hooks->applyFilters(
                WorkflowsHooksAbstract::FILTER_ORPHAN_WORKFLOW_ARGS_CLEANUP_INTERVAL,
                DAY_IN_SECONDS
            );

            if (! $this->verifyOperationTimeout('orphan_workflow_args_cleanup', $interval)) {
                return;
            }

            $this->cron->clearScheduledAction(
                WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS,
                [],
                false
            );

            $this->cron->scheduleRecurringActionInSeconds(
                time() + $interval,
                $interval,
                WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS,
                [],
                true
            );
        } catch (Throwable $th) {
            $this->logger->error('Error scheduling orphan workflow args cleanup: ' . $th->getMessage());
        }
    }

    public function scheduleFinishedScheduledStepsCleanup()
    {
        try {
            /**
             * @param int $interval
             * @return int
             */
            $interval = $this->hooks->applyFilters(
                WorkflowsHooksAbstract::FILTER_FINISHED_SCHEDULED_STEPS_CLEANUP_INTERVAL,
                DAY_IN_SECONDS
            );

            if (! $this->verifyOperationTimeout('finished_scheduled_steps_cleanup', $interval)) {
                return;
            }

            $this->cron->clearScheduledAction(
                WorkflowsHooksAbstract::ACTION_CLEANUP_FINISHED_SCHEDULED_STEPS,
                [],
                false
            );

            $this->cron->scheduleRecurringActionInSeconds(
                time() + $interval,
                $interval,
                WorkflowsHooksAbstract::ACTION_CLEANUP_FINISHED_SCHEDULED_STEPS,
                [],
                true
            );
        } catch (Throwable $th) {
            $this->logger->error('Error scheduling finished scheduled steps cleanup: ' . $th->getMessage());
        }
    }

    /**
     * Delete orphan workflow args.
     *
     * @return void
     */
    public function deleteOrphanWorkflowArgs()
    {
        (new ScheduledActionsModel())->deleteOrphanWorkflowArgs();
    }

    public function deleteExpiredScheduledSteps()
    {
        (new ScheduledActionsModel())->deleteExpiredScheduledSteps();
    }

    /*
     * Method called when a scheduled action is stored. We use this to replicate some runtime
     * data from the context variables to the scheduled step model. Used specifically when the
     * recurrent scheduled step is scheduled.
     *
     * @param int $actionId
     * @return void
     */
    public function storeWorkflowCompactedArgsForStoredAction($actionId)
    {
        $actionModel = new ScheduledActionModel();
        $actionModel->loadByActionId($actionId);

        if ($actionModel->getHook() !== WorkflowsHooksAbstract::ACTION_ASYNC_EXECUTE_NODE) {
            return;
        }

        $args = $actionModel->getArgs();
        $oldActionId = $args[0]['actionId'] ?? 0;

        if (empty($oldActionId)) {
            return;
        }

        $oldScheduledStepModel = new WorkflowScheduledStepModel();
        $oldScheduledStepModel->loadByActionId($oldActionId);

        if (empty($oldScheduledStepModel->getActionId())) {
            return;
        }

        $oldScheduledArgs = $oldScheduledStepModel->getArgs();

        if (empty($oldScheduledArgs)) {
            return;
        }

        $newScheduledStepModel = new WorkflowScheduledStepModel();
        $newScheduledStepModel->setActionId($actionId);
        $newScheduledStepModel->setWorkflowId($oldScheduledStepModel->getWorkflowId());
        $newScheduledStepModel->setStepId($oldScheduledStepModel->getStepId());
        $newScheduledStepModel->setActionUID($oldScheduledStepModel->getActionUID());
        $newScheduledStepModel->setIsCompressed($oldScheduledStepModel->getIsCompressed());
        $newScheduledStepModel->setIsRecurring($oldScheduledStepModel->getIsRecurring());
        $newScheduledStepModel->setArgs($oldScheduledArgs);
        $newScheduledStepModel->setRepeatUntilDate($oldScheduledStepModel->getRepeatUntilDate());
        $newScheduledStepModel->setRepeatTimes($oldScheduledStepModel->getRepeatTimes());
        $newScheduledStepModel->setRepeatUntil($oldScheduledStepModel->getRepeatUntil());
        $newScheduledStepModel->insert();
    }

    private function verifyOperationTimeout(string $actionUid, int $timeout = null): bool
    {
        $transientKey = 'publishpressfuture_' . $actionUid;

        if (is_null($timeout)) {
            $timeout = self::DEFAULT_SETUP_INTERVAL;
        }

        /**
         * @param int $defaultTimeout
         *
         * @return int
         */
        $transientTimeout = $this->hooks->applyFilters(
            WorkflowsHooksAbstract::FILTER_CLEANUP_SCHEDULED_TRANSIENT_TIMEOUT,
            $timeout
        );

        if (get_transient($transientKey)) {
            return false;
        }

        set_transient($transientKey, true, $transientTimeout);

        return true;
    }
}
