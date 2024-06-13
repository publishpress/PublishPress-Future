<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract as WorkflowsHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

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


    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
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
    }

    public function showTitleInHookColumn($title, $row)
    {
        $actionModel = new ScheduledActionsModel();
        $actionModel->load($row['ID']);

        $hook = $actionModel->getHook();
        $args = $actionModel->getArgs();

        switch ($hook) {
            case WorkflowsHooksAbstract::ACTION_ASYNC_EXECUTE_NODE:
                $title = __('Workflow scheduled action', 'publishpress-future-pro');
                break;

            case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                $title = __('Unschedule workflow recurring scheduled action', 'publishpress-future-pro');
                break;
        }

        return $title;
    }

    public function showArgsInArgsColumn($args, $row)
    {
        $actionModel = new ScheduledActionsModel();
        $actionModel->load($row['ID']);

        $hook = $actionModel->getHook();
        $args = $actionModel->getArgs();

        if (empty($args)) {
            return $args;
        }

        if (isset($args[0])) {
            $args = $args[0];
        }

        $argsText = '';
        switch ($hook) {
            case WorkflowsHooksAbstract::ACTION_ASYNC_EXECUTE_NODE:
                if (! isset($args['contextVariables']['global']['workflow'])) {
                    return $args;
                }

                $workflowId = $args['contextVariables']['global']['workflow'] ?? 0;
                $workflowModel = new WorkflowModel();
                $workflowModel->load($workflowId);

                $workflowTitle = $workflowModel->getTitle();
                $next = $args['step']['next'] ?? [];

                $nodeType = $this->nodeTypesModel->getNodeType($args['step']['node']['data']['name']);

                $sourceSockets = [];
                if (! is_null($nodeType)) {
                    $socketsSchema = $nodeType->getSocketSchema();

                    foreach ($socketsSchema['source'] as $socket) {
                        $sourceSockets[$socket['id']] = $socket['label'];
                    }
                }

                $nextNodes = '<ul class="future-workflows-outputs">';
                foreach ($next as $socketId => $handlerNodes) {
                    $socketLabel = $sourceSockets[$socketId] ?? $socketId;
                    $nextNodes .= '<li class="future-workflow-step-handler">' . $socketLabel . ':</li>';
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

                $argsText = __('Workflow:', 'publishpress-future-pro') . ' ' . $workflowTitle;
                $argsText .= '<br>';
                $argsText .= __('Steps:', 'publishpress-future-pro') . '<br>' . $nextNodes;
                break;

            case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                $argsText = __('Workflow recurring scheduled action', 'publishpress-future-pro');
                break;
        }

        return $argsText;
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
}
