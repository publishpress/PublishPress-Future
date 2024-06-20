<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule as NodeTypeCoreSchedule;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

class CoreSchedule implements NodeRunnerInterface
{
    public const DEFAULT_REPEAT_UNTIL_TIMES = 99999;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var CronInterface
     */
    private $cron;

    /**
     * @var CronSchedulesModelInterface
     */
    private $cronSchedulesModel;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        CronInterface $cron,
        CronSchedulesModelInterface $cronSchedulesModel,
        NodeTypesModelInterface $nodeTypesModel
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->cron = $cron;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->nodeTypesModel = $nodeTypesModel;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreSchedule::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $node = $this->nodeRunnerProcessor->getNodeFromStep($step);
        $nodeSettings = $this->nodeRunnerProcessor->getNodeSettings($node);

        if (! isset($nodeSettings['schedule'])) {
            $nodeSettings['schedule'] = [];
        }

        $recurrence = $nodeSettings['schedule']['recurrence'] ?? 'single';
        $whenToRun = $nodeSettings['schedule']['whenToRun'] ?? 'now';

        // Schedule
        if ('single' === $recurrence && 'now' === $whenToRun) {
            $timestamp = 0;
        } else {
            $timestamp = $this->getSchedulingTimestamp($nodeSettings, $contextVariables);
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
        // $actionUID = $this->getScheduledActionUniqueId($node, $contextVariables);

        $actionArgs = [$this->compactArguments($step, $contextVariables)];

        if ('single' === $recurrence) {
            if ($whenToRun === 'now') {
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
    }

    private function getScheduledActionUniqueId(array $node, array $contextVariables)
    {
        $uniqueId = [];
        $uniqueId[] = $node['id'];

        foreach ($contextVariables as $key => $value) {
            if (is_scalar($value)) {
                $uniqueId[] = $key . '-' . $value;
            } elseif (is_array($value)) {
                // Look for any index ID, id
                if (isset($value['id'])) {
                    $uniqueId[] = $key . '-' . $value['id'];
                } elseif (isset($value['ID'])) {
                    $uniqueId[] = $key . '-' . $value['ID'];
                }
            } elseif (is_object($value)) {
                if (get_class($value) === 'WP_Post') {
                    $uniqueId[] = $value->ID;
                } elseif (get_class($value) === 'WP_User') {
                    $uniqueId[] = $value->ID;
                } elseif (isset($value->id)) {
                    $uniqueId[] = $key . '-' . $value->id;
                } elseif (isset($value->ID)) {
                    $uniqueId[] = $key . '-' . $value->ID;
                }
            }
        }

        return implode('-', $uniqueId);
    }

    private function getSchedulingTimestamp(array $nodeSettings, array $contextVariables)
    {
        $scheduleSettings = $nodeSettings['schedule'];

        $whenToRun = $scheduleSettings['whenToRun'] ?? 'now';
        $dateSource = $scheduleSettings['dateSource'] ?? 'calendar';

        $timestamp = 0;
        switch ($whenToRun) {
            case 'now':
                $timestamp = time();
                break;
            case 'date':
            case 'offset':
                if ($dateSource === 'calendar') {
                    $timestamp = strtotime($scheduleSettings['specificDate']);
                } elseif ($dateSource === 'event') {
                    $timestamp = time();
                } else {
                    $timestamp = $this->nodeRunnerProcessor->getVariableValueFromContextVariables(
                        $dateSource,
                        $contextVariables
                    );
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

        return $timestamp;
    }

    private function compactArguments(array $step, array $contextVariables): array
    {
        $compactedArgs = [];
        $compactedArgs['step'] = $step;
        $compactedArgs['contextVariables'] = $contextVariables;
        $compactedArgs['contextVariables']['global'] = [];
        $compactedArgs['contextVariables']['global']['workflow'] =
            $this->nodeRunnerProcessor->getWorkflowIdFromContextVariables($contextVariables);
        $compactedArgs['contextVariables']['global']['user'] = $contextVariables['global']['user']['id'] ?? '0';
        $compactedArgs['contextVariables']['global']['site'] = get_bloginfo('site_id');
        $compactedArgs['contextVariables']['global']['trigger'] = $contextVariables['global']['trigger']['id'] ?? '0';

        foreach ($compactedArgs['contextVariables'] as $context => &$variables) {
            if (is_array($variables)) {
                foreach ($variables as $key => &$value) {
                    if (is_object($value)) {
                        $className = get_class($value);
                        if ('WP_Post' === $className) {
                            $value = [
                                'class' => 'WP_Post',
                                'id' => $value->ID,
                                'diff' => $this->getPostDifferences($value, get_post($value->ID)),
                            ];
                        } elseif ('WP_User' === $className) {
                            $value = [
                                'class' => 'WP_User',
                                'id' => $value->ID,
                            ];
                        }
                    }
                }
            }
        }

        return $compactedArgs;
    }

    private function getPostDifferences($post1, $post2)
    {
        $differences = [];

        foreach ($post1 as $key => $value) {
            if (! isset($post2->$key)) {
                $differences[$key] = $value;
            } elseif ($post2->$key !== $value) {
                $differences[$key] = $value;
            }
        }

        return $differences;
    }

    private function expandArguments(array $compactArguments): array
    {
        $expandedArgs = [
            'step' => $compactArguments['step'],
            'contextVariables' => [],
        ];

        foreach ($compactArguments['contextVariables'] as $context => $variables) {
            foreach ($variables as $variableName => $value) {
                if (is_array($value) && isset($value['class'])) {
                    if ($value['class'] === 'WP_Post') {
                        $expandedArgs['contextVariables'][$context][$variableName] = get_post($value['id']);

                        if (! empty($value['diff'])) {
                            foreach ($value['diff'] as $diffKey => $diffValue) {
                                ($expandedArgs['contextVariables'][$context][$variableName])->$diffKey = $diffValue;
                            }
                        }
                    } elseif ($value['class'] === 'WP_User') {
                        $expandedArgs['contextVariables'][$context][$variableName] = get_user_by('id', $value['id']);
                    } else {
                        $expandedArgs['contextVariables'][$context][$variableName] = $value;
                    }
                } else {
                    $expandedArgs['contextVariables'][$context][$variableName] = $value;
                }
            }
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($compactArguments['contextVariables']['global']['workflow']);

        $expandedArgs['contextVariables']['global']['workflow'] = [
            'id' => $workflowModel->getId(),
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'modified_at' => $workflowModel->getModifiedAt(),
        ];

        $user = get_user_by('id', $compactArguments['contextVariables']['global']['user']);
        $expandedArgs['contextVariables']['global']['user'] = [];
        if (is_object($user)) {
            $expandedArgs['contextVariables']['global']['user'] = [
                'id' => $user->ID,
                'user_email' => $user->user_email,
                'user_login' => $user->user_login,
                'display_name' => $user->display_name,
                'roles' => $user->roles,
                'caps' => $user->caps,
                'user_registered' => $user->user_registered,
            ];
        }

        $expandedArgs['contextVariables']['global']['site'] = [
            'url' => get_site_url(),
            'home_url' => get_home_url(),
            'admin_email' => get_option('admin_email'),
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
        ];

        $triggers = $workflowModel->getTriggerNodes();
        $triggerId = $compactArguments['contextVariables']['global']['trigger'];
        $triggerNode = null;

        foreach ($triggers as $trigger) {
            if ($trigger['id'] === $triggerId) {
                $triggerNode = $trigger;
                break;
            }
        }

        $triggerLabel = '';

        if (isset($triggerNode['data']['label'])) {
            $triggerLabel = $triggerNode['data']['label'];
        }

        if (empty($triggerLabel)) {
            $triggerNodeType = $this->nodeTypesModel->getNodeType($triggerNode['data']['name']);
            if (is_object($triggerNodeType)) {
                $triggerLabel = $triggerNodeType->getLabel();
            }
        }

        if (empty($triggerLabel)) {
            $triggerLabel = $triggerNode['data']['label'] ?? 'Unknown';
        }

        $expandedArgs['contextVariables']['global']['trigger'] = [
            'id' => $triggerId,
            'name' => $triggerNode['data']['name'] ?? 'unknown',
            'label' => $triggerLabel,
        ];

        return $expandedArgs;
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
        $workflowModel->load($args['contextVariables']['global']['workflow']['id']);

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
            } elseif ($repeatUntil === 'times') {
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

        $this->nodeRunnerProcessor->runNextSteps($args['step'], $args['contextVariables']);

        if ($unscheduleRecurringAction) {
            $this->cancelExpiredScheduledAction($compactedArgs);
        }
    }
}
