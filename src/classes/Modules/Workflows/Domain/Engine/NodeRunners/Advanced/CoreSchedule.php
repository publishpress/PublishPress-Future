<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\ArrayResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\DatetimeResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\EmailResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule as NodeTypeCoreSchedule;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use WP_CLI\Fetchers\Post;

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

    /**
     * @var WorkflowVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var string
     */
    private $pluginVersion;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        CronInterface $cron,
        CronSchedulesModelInterface $cronSchedulesModel,
        NodeTypesModelInterface $nodeTypesModel,
        WorkflowVariablesHandlerInterface $variablesHandler,
        string $pluginVersion
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->cron = $cron;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->variablesHandler = $variablesHandler;
        $this->pluginVersion = $pluginVersion;
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
                    $timestamp = $this->variablesHandler->parseNestedVariableValue(
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
        $compactedArgs = [
            'pluginVersion' => $this->pluginVersion,
            'step' => $step,
            'contextVariables' => $contextVariables,
        ];

        foreach ($compactedArgs['contextVariables'] as $context => &$variables) {
            if (is_array($variables)) {
                foreach ($variables as &$variableResolver) {
                    if (is_object($variableResolver)) {
                        $diff = null;
                        if ($variableResolver->getType() === 'post') {
                            $diff = $this->getPostDifferences($variableResolver->getVariable(), get_post($variableResolver->getValue('ID')));
                        }

                        $variableResolver = $variableResolver->compact();

                        if ($diff) {
                            $variableResolver['diff'] = $diff;
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

        // Before v3.4.1 the pluginVersion was not included in the compacted arguments
        $isLegacyCompact = ! isset($compactArguments['pluginVersion']);

        /**
         * Example of the different types of compacted arguments, LEGACY is the format
         * before v3.4.1.
         *
         * ----------------------------------------
         * LEGACY compacted arguments:
         *
         *   ...
         *   "contextVariables": {
         *      "global": {
         *          "workflow": 1417,
         *          "user": 1,
         *          "site": "Future Pro Workflow Dev",
         *          "trigger": "onPostUpdated_ebtrjpm"
         *      },
         *      "onPostUpdated1": {
         *          "postId": 1402,
         *          "postBefore": {
         *              "class": "WP_Post",
         *              "id": 1402,
         *              "diff": {
         *                  "post_title": "Custom Development??",
         *                  "post_status": "draft",
         *                  "post_modified": "2024-06-27 15:10:06",
         *                  "post_modified_gmt": "2024-06-27 18:10:06"
         *              }
         *          },
         *          "postAfter": {
         *              "class": "WP_Post",
         *              "id": 1402,
         *              "diff": []
         *          }
         *      }
         *  }
         *  ...
         * ----------------------------------------
         * NEW compacted arguments:
         *
         *  "contextVariables": {
         *    "global": {
         *        "workflow": {
         *            "type": "workflow",
         *            "value": 1417
         *        },
         *        "user": {
         *            "type": "user",
         *            "value": 1
         *        },
         *        "site": {
         *            "type": "site",
         *            "value": "Future Pro Workflow Dev"
         *        },
         *        "trigger": {
         *            "type": "node",
         *            "value": {
         *                "id": "onPostUpdated_ebtrjpm",
         *                "name": "trigger\/core.post-updated",
         *                "label": "Post is updated",
         *                "activation_timestamp": "2024-06-27 18:19:24"
         *            }
         *        }
         *    },
         *    "onPostUpdated1": {
         *        "postId": {
         *            "type": "integer",
         *            "value": 1402
         *        },
         *        "postBefore": {
         *            "type": "post",
         *            "value": 1402,
         *            "diff": {
         *                "post_title": "Custom Development??",
         *                "post_status": "draft",
         *                "post_modified": "2024-06-27 15:16:56",
         *                "post_modified_gmt": "2024-06-27 18:16:56"
         *            }
         *        },
         *        "postAfter": {
         *            "type": "post",
         *            "value": 1402
         *        }
         *    }
         *}
         */

        foreach ($compactArguments['contextVariables'] as $context => $variables) {
            foreach ($variables as $variableName => $value) {
                $type = 'unknown';

                if ($isLegacyCompact) {
                    if ($variableName === 'workflow') {
                        $type = 'worfklow';
                    } elseif ($variableName === 'user') {
                        $type = 'user';
                    } elseif ($variableName === 'site') {
                        $type = 'site';
                    } elseif ($variableName === 'trigger') {
                        $type = 'node';
                    } elseif (is_array($value)) {
                        $type = 'array';

                        if (isset($value['class'])) {
                            if ($value['class'] === 'WP_Post') {
                                $type = 'post';
                            } elseif ($value['class'] === 'WP_User') {
                                $type = 'user';
                            }
                        }
                    } elseif (is_numeric($value)) {
                        $type = 'integer';
                    } elseif (is_string($value)) {
                        $type = 'string';
                    }
                } else {
                    $type = $value['type'] ?? 'unknown';
                }

                $resolversMap = [
                    'array' => ArrayResolver::class,
                    'boolean' => BooleanResolver::class,
                    'datetime' => DatetimeResolver::class,
                    'email' => EmailResolver::class,
                    'integer' => IntegerResolver::class,
                    'node' => NodeResolver::class,
                    'post' => PostResolver::class,
                    'site' => SiteResolver::class,
                    'user' => UserResolver::class,
                    'workflow' => WorkflowResolver::class,
                ];


                if (! $isLegacyCompact) {
                    $resolverArgument = $value['value'] ?? null;
                } else {
                    $resolverArgument = $value;
                }

                switch($type) {
                    case 'post':
                        if ($isLegacyCompact) {
                            $postId = (int)$value['id'];
                        } else {
                            $postId = (int)$value['value'];
                        }

                        $resolverArgument = get_post($postId);

                        break;
                    case 'user':
                        if ($isLegacyCompact) {
                            $userId = (int)$value;
                        } else {
                            $userId = (int)$value['value'];
                        }

                        $resolverArgument = get_user_by('id', $userId);
                        break;
                    case 'workflow':
                        if ($isLegacyCompact) {
                            $workflowId = (int)$value;
                        } else {
                            $workflowId = (int)$value['value'];
                        }

                        $workflowModel = new WorkflowModel();
                        $workflowModel->load($workflowId);
                        $resolverArgument = [
                            'id' => $workflowModel->getId(),
                            'title' => $workflowModel->getTitle(),
                            'description' => $workflowModel->getDescription(),
                            'modified_at' => $workflowModel->getModifiedAt(),
                        ];
                        break;
                }

                if (isset($resolversMap[$type])) {
                    $resolverClass = $resolversMap[$type];

                    if ($type === 'site') {
                        $expandedArgs['contextVariables'][$context][$variableName] = new $resolverClass();
                    } else {
                        $expandedArgs['contextVariables'][$context][$variableName] = new $resolverClass($resolverArgument);
                    }
                } else {
                    $expandedArgs['contextVariables'][$context][$variableName] = $value;
                }
            }
        }

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
        $workflowModel->load($args['contextVariables']['global']['workflow']->id);

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
