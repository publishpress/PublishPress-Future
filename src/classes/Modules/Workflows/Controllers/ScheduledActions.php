<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract as WorkflowsHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionModel;
use PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowScheduledStepModel;

class ScheduledActions implements InitializableInterface
{
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

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        CronInterface $cron
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cron = $cron;
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

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, 'enqueueScripts'],
            10,
            2
        );

        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_INIT,
            [$this, 'scheduleOrphanWorkflowArgsCleanup'],
            20
        );

        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_SCHEDULER_STORED_ACTION,
            [$this, 'storeWorkflowCompactedArgsForStoredAction'],
            10
        );
    }

    public function showTitleInHookColumn($title, $row)
    {
        $actionModel = new ScheduledActionModel();
        $actionModel->loadByActionId($row['ID']);

        $hook = $actionModel->getHook();

        switch ($hook) {
            case WorkflowsHooksAbstract::ACTION_ASYNC_EXECUTE_NODE:
                $title = __('Workflow scheduled step', 'publishpress-future-pro');
                break;

            case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                $title = __('Unschedule workflow recurring scheduled step', 'publishpress-future-pro');
                break;

            case WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS:
                $title = __('Cleanup orphan workflow scheduled step arguments', 'publishpress-future-pro');
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

                    if (! isset($args['contextVariables']['global']['workflow'])) {
                        return $html;
                    }

                    $argsText = '';

                    // Before v3.4.1 the plugin version was not set in the arguments
                    if (isset($args['pluginVersion'])) {
                        $workflowId = $args['contextVariables']['global']['workflow']['value'] ?? 0;
                    } else {
                        $workflowId = $args['contextVariables']['global']['workflow'] ?? 0;
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

                    $argsText = '<strong>' . __('Workflow:', 'publishpress-future-pro') . '</strong> '
                        . $workflowTitle . '<br>';

                    if (isset($args['pluginVersion'])) {
                        $argsText .= '<strong>' . __('Trigger: ', 'publishpress-future-pro') . '</strong>'
                            . $args['contextVariables']['global']['trigger']['value']['label'] . '<br>';

                        // Check if the trigger is related to a post
                        if (isset($args['contextVariables']['global']['trigger']['value']['slug'])) {
                            $nodeSlug = $args['contextVariables']['global']['trigger']['value']['slug'];

                            if (isset($args['contextVariables'][$nodeSlug]['postId'])) {
                                $postId = $args['contextVariables'][$nodeSlug]['postId']['value'];
                                $post = get_post($postId);

                                if ($post instanceof \WP_Post) {
                                    $postPermaling = get_permalink($post->ID);
                                    $argsText .= '<strong>' . __('Post:', 'publishpress-future-pro')
                                        . '</strong> <a target="_blank" href="' . esc_url($postPermaling) . '">'
                                        . $post->post_title . '</a><br>';
                                }
                            }
                        }
                    } else {
                        $argsText .= '<strong>' . __('Trigger: ', 'publishpress-future-pro') . '</strong>'
                            . $args['contextVariables']['global']['trigger']['label'] . '<br>';
                    }

                    $argsText .= '<strong>' . __('Steps:', 'publishpress-future-pro') . '</strong><br>' . $nextNodes;

                    $html = $argsText;
                    break;

                case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                    $html = __('Workflow recurring scheduled action', 'publishpress-future-pro');
                    break;
            }
        } catch (\Exception $e) {
            // TODO: Log error
        }

        return $html;
    }

    public function enqueueScripts($hook)
    {
        if ('future_page_publishpress-future-scheduled-actions' !== $hook) {
            return;
        }

        wp_enqueue_style(
            "future_actions_admin_style",
            plugins_url(
                "/src/assets/css/future-actions.css",
                PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE
            ),
            ["wp-components", "wp-edit-post", "wp-editor"],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION
        );
    }

    public function scheduleOrphanWorkflowArgsCleanup()
    {
        $this->hooks->addAction(
            WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS,
            [$this, 'deleteOrphanWorkflowArgs']
        );

        /**
         * @param int $interval
         * @return int
         */
        $interval = $this->hooks->applyFilters(
            WorkflowsHooksAbstract::FILTER_ORPHAN_WORKFLOW_ARGS_CLEANUP_INTERVAL,
            DAY_IN_SECONDS
        );

        $this->cron->scheduleRecurringActionInSeconds(
            time() + $interval,
            $interval,
            WorkflowsHooksAbstract::ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS,
            [],
            true
        );
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
}
