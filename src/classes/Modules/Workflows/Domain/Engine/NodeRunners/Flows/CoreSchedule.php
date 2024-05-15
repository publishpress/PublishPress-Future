<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Flows;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows\CoreSchedule as NodeTypeCoreSchedule;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

class CoreSchedule implements NodeRunnerInterface
{
    const NODE_NAME = NodeTypeCoreSchedule::NODE_NAME;

    const DEFAULT_REPEAT_UNTIL_TIMES = 99999;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    /**
     * @var CronInterface
     */
    private $cron;

    /**
     * @var CronSchedulesModelInterface
     */
    private $cronSchedulesModel;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        CronInterface $cron,
        CronSchedulesModelInterface $cronSchedulesModel
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->cron = $cron;
        $this->cronSchedulesModel = $cronSchedulesModel;
    }

    public function setup(array $step, array $input = [], array $globalVariables = []): void
    {
        $node = $this->nodeRunnerPreparer->getNodeFromStep($step);
        $nodeSettings = $this->nodeRunnerPreparer->getNodeSettings($node);

        if (! isset($nodeSettings['schedule'])) {
            $nodeSettings['schedule'] = [];
        }

        $recurrence = $nodeSettings['schedule']['recurrence'] ?? 'single';
        $whenToRun = $nodeSettings['schedule']['whenToRun'] ?? 'event';

        // Schedule
        if ('single' === $recurrence && 'event' === $whenToRun) {
            $timestamp = 0;
        } else {
            $timestamp = $this->getSchedulingTimestamp($nodeSettings, $input, $globalVariables);
        }

        if (is_null($timestamp)) {
            return;
        }

        $priority = (int)($nodeSettings['schedule']['priority'] ?? 10);
        $unique = (bool)($nodeSettings['schedule']['unique'] ?? true);

        if (empty($priority)) {
            $priority = 10;
        }

        // TODO: Should we add a field to the node settings to define the variable or action ID expression?
        // $actionUID = $this->getScheduledActionUniqueId($node, $input);

        $actionArgs = [$this->compactArguments($step, $input, $globalVariables)];

        if ('single' === $recurrence) {
            if ($whenToRun === 'event') {
                $this->cron->scheduleAsyncAction(
                    HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
                    $actionArgs,
                    $unique,
                    $priority
                );
            } else {
                $this->cron->scheduleSingleAction(
                    $timestamp,
                    HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
                    $actionArgs,
                    $unique,
                    $priority
                );
            }
        } else {
            if ($recurrence === 'custom') {
                $interval = (int)$nodeSettings['schedule']['repeatInterval'] ?? 0;
            } else {
                $recurrence = preg_replace('/^cron_/', '', $recurrence);

                $interval = $this->cronSchedulesModel->getCronScheduleValueByName($recurrence);
            }

            if ($interval > 0) {
                $this->cron->scheduleRecurringActionInSeconds(
                    $timestamp,
                    $interval,
                    HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
                    $actionArgs,
                    $unique,
                    $priority
                );
            }
        }

        // $actionId = $this->cron->scheduleSingleAction(
        //     $timestamp,
        //     HooksAbstract::ACTION_RUN_WORKFLOW,
        //     [
        //         'postId' => $postId,
        //         'workflow' => 'expire'
        //     ]
        // );

        // if (! $actionId) {
        //     $this->logger->debug(
        //         sprintf(
        //             '%d  -> TRIED TO SCHEDULE ACTION using %s at %s (%s) with options %s',
        //             $postId,
        //             $this->cron->getIdentifier(),
        //             $this->datetime->getWpDate('r', $timestamp),
        //             $timestamp,
        //             // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
        //             print_r($opts, true)
        //         )
        //     );

        //     return;
        // }
    }

    private function getScheduledActionUniqueId(array $node, array $input)
    {
        $uniqueId = [];
        $uniqueId[] = $node['id'];

        foreach ($input as $key => $value) {
            if (is_scalar($value)) {
                $uniqueId[] = $key . '-' . $value;
            } else if (is_array($value)) {
                // Look for any index ID, id
                if (isset($value['id'])) {
                    $uniqueId[] = $key . '-' . $value['id'];
                } else if (isset($value['ID'])) {
                    $uniqueId[] = $key . '-' . $value['ID'];
                }
            } else if (is_object($value)) {
                if (get_class($value) === 'WP_Post') {
                    $uniqueId[] = $value->ID;
                } else if (get_class($value) === 'WP_User') {
                    $uniqueId[] = $value->ID;
                } else if (isset($value->id)) {
                    $uniqueId[] = $key . '-' . $value->id;
                } else if (isset($value->ID)) {
                    $uniqueId[] = $key . '-' . $value->ID;
                }
            }
        }

        return implode('-', $uniqueId);
    }

    private function getSchedulingTimestamp(array $nodeSettings, array $input, array $globalVariables)
    {
        $scheduleSettings = $nodeSettings['schedule'];

        $whenToRun = $scheduleSettings['whenToRun'] ?? 'event';
        $dateSource = $scheduleSettings['dateSource'] ?? 'calendar';

        $timestamp = 0;
        switch ($whenToRun) {
            case 'event':
                $timestamp = time();
                break;
            case 'date':
            case 'offset':
                if ($dateSource === 'calendar') {
                    $timestamp = strtotime($scheduleSettings['specificDate']);
                } else {
                    $dateSourceParts = explode('.', $dateSource);
                    $timestamp = $this->getVariableValue($dateSourceParts, [$input, $globalVariables]);
                }

                break;
        }

        if (is_numeric($timestamp)) {
            $timestamp = (int)$timestamp;
        } else {
            $timestamp = strtotime($timestamp);

            if ($timestamp === false) {
                $timestamp = null;
            }
        }

        if (empty($timestamp)) {
            return null;
        }

        if ($whenToRun === 'offset') {
            $offset = $scheduleSettings['dateOffset'] ?? '';
            if (! empty($offset)) {
                $timestamp = strtotime($offset, (int)$timestamp);
            }
        }

        // $timestamp = $this->convertLocalTimeToUtc($timestamp);

        return $timestamp;
    }

    private function compactArguments(array $step, array $input, array $globalVariables): array
    {
        $compactedArgs = [];
        $compactedArgs['step'] = $step;
        $compactedArgs['globalVariables'] = [];
        $compactedArgs['globalVariables']['workflowId'] = $this->nodeRunnerPreparer->getWorkflowIdFromGlobalVariables($globalVariables);
        $compactedArgs['globalVariables']['userId'] = $globalVariables['user']['id'] ?? '0';
        $compactedArgs['globalVariables']['siteId'] = get_bloginfo('site_id');
        $compactedArgs['globalVariables']['triggerNodeId'] = $globalVariables['trigger']['id'] ?? '0';

        $compactedInput = [];
        foreach ($input as $key => $value) {
            if (is_scalar($value)) {
                $compactedInput[$key] = $value;
            } else if (is_object($value)) {
                $className = get_class($value);
                if ('WP_Post' === $className) {
                    $compactedInput[$key] = [
                        'class' => 'WP_Post',
                        'id' => $value->ID,
                    ];
                } else if ('WP_User' === $className) {
                    $compactedInput[$key] = [
                        'class' => 'WP_User',
                        'id' => $value->ID,
                    ];
                } else {
                    $compactedInput[$key] = $value;
                }
            } else {
                $compactedInput[$key] = $value;
            }
        }
        $compactedArgs['input'] = $compactedInput;

        return $compactedArgs;
    }

    private function expandArguments(array $compactArguments): array
    {
        // $step, $input, $globalVariables
        $expandedArgs = [
            'step' => $compactArguments['step'],
        ];

        $expandedInput = [];
        foreach ($compactArguments['input'] as $key => $value) {
            if (is_array($value) && isset($value['class'])) {
                if ($value['class'] === 'WP_Post') {
                    $expandedInput[$key] = get_post($value['id']);
                } else if ($value['class'] === 'WP_User') {
                    $expandedInput[$key] = get_user_by('id', $value['id']);
                } else {
                    $expandedInput[$key] = $value;
                }
            } else {
                $expandedInput[$key] = $value;
            }
        }
        $expandedArgs['input'] = $expandedInput;

        $expandedArgs['globalVariables'] = [];


        $workflowModel = new WorkflowModel();
        $workflowModel->load($compactArguments['globalVariables']['workflowId']);

        $expandedArgs['globalVariables']['workflow'] = [
            'id' => $workflowModel->getId(),
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'modified_at' => $workflowModel->getModifiedAt(),
        ];

        $user = get_user_by('id', $compactArguments['globalVariables']['userId']);
        $expandedArgs['globalVariables']['user'] = [];
        if (is_object($user)) {
            $expandedArgs['globalVariables']['user'] = [
                'id' => $user->ID,
                'user_email' => $user->user_email,
                'user_login' => $user->user_login,
                'display_name' => $user->display_name,
                'roles' => $user->roles,
                'caps' => $user->caps,
                'user_registered' => $user->user_registered,
            ];
        }

        $expandedArgs['globalVariables']['site'] = [
            'url' => get_site_url(),
            'home_url' => get_home_url(),
            'admin_email' => get_option('admin_email'),
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
        ];

        $triggers = $workflowModel->getTriggerNodes();
        $triggerId = $compactArguments['globalVariables']['triggerNodeId'];
        $triggerNode = null;

        foreach ($triggers as $trigger) {
            if ($trigger['id'] === $triggerId) {
                $triggerNode = $trigger;
                break;
            }
        }

        $expandedArgs['globalVariables']['trigger'] = [
            'id' => $triggerId,
            'name' => $triggerNode['data']['name'] ?? 'unknown',
            'label' => $triggerNode['data']['label'] ?? 'Unknown',
        ];

        return $expandedArgs;
    }

    private function getVariableType(array $variableName, array $variablesLists): string
    {
        $variable = $this->getVariableFromListByName($variableName, $variablesLists);
        $type = '';

        if (is_array($variable)) {
            $type = 'array';
        } else if (is_object($variable)) {
            $type = get_class($variable);
        } else {
            $type = 'scalar';
        }

        return $type;
    }

    private function getVariableValue(array $variableName, array $variablesLists): mixed
    {
        $variableListsIndex = null;

        foreach ($variablesLists as $index => $variables) {
            if (array_key_exists($variableName[0], $variables)) {
                $variableListsIndex = $index;
                break;
            }
        }

        if ($variableListsIndex === null) {
            return null;
        }

        $variable = $this->getVariableFromListByName($variableName, $variablesLists);
        $variableName = array_slice($variableName, 1);

        if (count($variableName) === 0) {
            return $variable;
        }

        foreach ($variableName as $variablePart) {
            if (is_array($variable) && isset($variable[$variablePart])) {
                $variable = $variable[$variablePart];
            } else if (is_object($variable) && isset($variable->{$variablePart})) {
                $variable = $variable->{$variablePart};
            } else {
                $variable = null;
                break;
            }
        }

        return $variable;
    }

    private function getVariableFromListByName(array $variableName, array $variablesLists): mixed
    {
        $variableListsIndex = null;

        foreach ($variablesLists as $index => $variables) {
            if (array_key_exists($variableName[0], $variables)) {
                $variableListsIndex = $index;
                break;
            }
        }

        if ($variableListsIndex === null) {
            return null;
        }

        $selectedVariablesList = $variablesLists[$variableListsIndex];

        return $selectedVariablesList[$variableName[0]];;
    }

    private function cancelExpiredScheduledAction($args)
    {
        $this->cron->scheduleAsyncAction(
            HooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION,
            [HooksAbstract::ACTION_ASYNC_EXECUTE_NODE, $args],
            false,
            10
        );
    }

    public function actionCallback(array $compactedArgs)
    {
        $args = $this->expandArguments($compactedArgs);

        // Check if the workflow is still active
        $workflowModel = new WorkflowModel();
        $workflowModel->load($args['globalVariables']['workflow']['id']);

        if (! $workflowModel->isActive()) {
            // TODO: Log this into the scheduler log
            $this->cancelExpiredScheduledAction($compactedArgs);
            return;
        }

        $nodeId = $args['step']['node']['id'];
        $nodeSettings = $args['step']['node']['data']['settings'] ?? [];
        $scheduleSettings = $nodeSettings['schedule'] ?? [];
        $recurrence = $scheduleSettings['recurrence'] ?? 'single';

        $isRecurrent = $recurrence !== 'single';
        $unscheduleRecurringAction = false;

        if ($isRecurrent) {
            // Check if the node has a limit of executions
            $repeatUntil = $scheduleSettings['repeatUntil'] ?? '';

            if ($repeatUntil === 'date') {
                $date = strtotime($scheduleSettings['repeatUntilDate'] ?? '');
                $now = time();

                if ($date <= $now) {
                    $this->cancelExpiredScheduledAction($compactedArgs);
                    // TODO: Log this into the scheduler log
                    return;
                }
            } else if ($repeatUntil === 'times') {
                $executionCount = $workflowModel->incrementNodeExecutionCount($nodeId);
                $timesUntilExpire = (int)$scheduleSettings['repeatTimes'] ?? self::DEFAULT_REPEAT_UNTIL_TIMES;

                $unscheduleRecurringAction = $executionCount >= $timesUntilExpire;
                $abortExecution = $executionCount > $timesUntilExpire;

                if ($abortExecution) {
                    $this->cancelExpiredScheduledAction($compactedArgs);

                    // TODO: Log this into the scheduler log
                    return;
                }
            }
        }

        $this->nodeRunnerPreparer->runNextSteps(
            $args['step'],
            $args['input'],
            $args['globalVariables']
        );

        if ($unscheduleRecurringAction) {
            $this->cancelExpiredScheduledAction($compactedArgs);
        }
    }
}
