<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract as WorkflowsHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

class ScheduledActions implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;


    public function __construct(
        HookableInterface $hooks
    ) {
        $this->hooks = $hooks;
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
                if (! isset($args['globalVariables']['workflowId'])) {
                    return $args;
                }

                $workflowId = $args['globalVariables']['workflowId'] ?? 0;
                $workflowModel = new WorkflowModel();
                $workflowModel->load($workflowId);

                $workflowTitle = $workflowModel->getTitle();
                $next = $args['step']['next'] ?? [];

                $nextNodes = '<ul>';
                foreach ($next as $handler => $handlerNodes) {
                    $nextNodes .= '<li>' . $handler . ':</li>';
                    $nextNodes .= '<ul>';
                    foreach ($handlerNodes as $nextStep) {
                        $nextNodes .= '<li>' . $nextStep['node']['data']['label'] . '</li>';
                    }
                    $nextNodes .= '</ul>';
                }
                $nextNodes .= '</ul>';

                $argsText = __('Workflow:', 'publishpress-future-pro') . ' ' . $workflowTitle;
                $argsText .= __('Next nodes:', 'publishpress-future-pro') . '<br>' . $nextNodes;
                break;

            case WorkflowsHooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION:
                $argsText = __('Workflow recurring scheduled action', 'publishpress-future-pro');
                break;
        }

        return $argsText;
    }
}
