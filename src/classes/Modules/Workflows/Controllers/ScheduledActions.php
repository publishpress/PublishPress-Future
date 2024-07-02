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

    public function showArgsInArgsColumn($html, $row)
    {
        $actionModel = new ScheduledActionsModel();
        $actionModel->load($row['ID']);

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
                $next = $args['step']['next'] ?? [];

                $nodeType = $this->nodeTypesModel->getNodeType($args['step']['node']['data']['name']);

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
}
