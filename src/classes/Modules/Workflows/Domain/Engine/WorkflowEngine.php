<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerMapperInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;

class WorkflowEngine implements WorkflowEngineInterface
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
     * @var \Closure
     */
    private $nodeRunnerFactory;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        \Closure $nodeRunnerFactory
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->nodeRunnerFactory = $nodeRunnerFactory;

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_LOAD);
        $this->hooks->addAction(
            HooksAbstract::ACTION_EXECUTE_NODE,
            [$this, 'executeNodeRoutine'],
            10,
            3
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
            [$this, "executeAsyncNodeRoutine"],
            10
        );
    }

    public function start()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_START);

        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsIds();

        $nodeTypes = [
            "action" => $this->nodeTypesModel->getActions(),
            "trigger" => $this->nodeTypesModel->getTriggers(),
            "flow" => $this->nodeTypesModel->getFlows(),
        ];

        // Setup the workflow triggers
        foreach ($workflows as $workflowId) {
            $workflow = new WorkflowModel();
            $workflow->load($workflowId);

            $globalVariables = $this->getGlobalVariables($workflow);

            $triggerNodes = $workflow->getTriggerNodes();

            $routineTree = $workflow->getRoutineTree($nodeTypes);

            $triggerRunner = null;
            foreach ($triggerNodes as $triggerNode) {
                $triggerName = $triggerNode['data']['name'];
                $triggerId = $triggerNode['id'];

                $triggerRunner = call_user_func($this->nodeRunnerFactory, $triggerName);

                if (is_null($triggerRunner)) {
                    if (defined('WP_DEBUG') && WP_DEBUG) {
                        error_log("[PublishPress Future Pro] Trigger not found: $triggerName");
                    }

                    continue;
                }

                // Ignore if there is no routine tree for this trigger
                if (! isset($routineTree[$triggerId])) {
                    continue;
                }

                // Update the trigger global variables
                $globalVariables['trigger'] = [
                    'id' => $triggerId,
                    'name' => $triggerName,
                    'label' => $triggerNode['data']['label'],
                ];

                // Setup the trigger
                $triggerRunner->setup($workflowId, $triggerNode, $routineTree[$triggerId], $globalVariables);
            }
        }
    }

    private function getGlobalVariables($workflow)
    {
        $globals = [];

        $globals['workflow'] = [
            'id' => $workflow->getId(),
            'title' => $workflow->getTitle(),
            'description' => $workflow->getDescription(),
            'modified_at' => $workflow->getModifiedAt(),
        ];


        $userData = [];
        $currentUser = wp_get_current_user();
        if ($currentUser->exists()) {
            $userData = [
                'id' => $currentUser->ID,
                'user_email' => $currentUser->user_email,
                'user_login' => $currentUser->user_login,
                'display_name' => $currentUser->display_name,
                'roles' => $currentUser->roles,
                'caps' => $currentUser->caps,
                'user_registered' => $currentUser->user_registered,
            ];
        }
        $globals['user'] = $userData;

        $globals['site'] = [
            'url' => get_site_url(),
            'home_url' => get_home_url(),
            'admin_email' => get_option('admin_email'),
            'name' => get_option('blogname'),
            'description' => get_option('blogdescription'),
        ];

        $globals['trigger'] = [
            'id' => 0,
            'name' => '',
            'label' => '',
        ];

        return $globals;
    }

    public function executeNodeRoutine($step, $input, $globalVariables)
    {
        $node = $step['node'];
        $nodeName = $node['data']['name'];

        $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);

        if (is_null($nodeRunner)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PublishPress Future Pro] Node runner not found: {$nodeName}");
            }

            return;
        }

        $nodeRunner->setup($step, $input, $globalVariables);
    }

    public function executeAsyncNodeRoutine($args)
    {
        $nodeRunner = call_user_func($this->nodeRunnerFactory, $args['step']['node']['data']['name']);
        $nodeRunner->actionCallback($args);
    }
}
