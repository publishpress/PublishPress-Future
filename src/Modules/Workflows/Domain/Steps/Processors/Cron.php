<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Processors;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\ArrayResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\DatetimeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\EmailResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\FutureActionResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncStepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionModel;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowScheduledStepModel;
use Throwable;

class Cron implements AsyncStepProcessorInterface
{
    public const DEFAULT_REPEAT_UNTIL_TIMES = 99999999999;

    public const WHEN_TO_RUN_NOW = 'now';

    /**
     * @deprecated version 4.0.0
     */
    public const WHEN_TO_RUN_EVENT = 'event';

    public const WHEN_TO_RUN_DATE = 'date';

    public const WHEN_TO_RUN_OFFSET = 'offset';

    public const DATE_SOURCE_CALENDAR = 'calendar';

    public const DATE_SOURCE_EVENT = 'event';

    public const DATE_SOURCE_STEP = 'step';

    public const DATE_SOURCE_CUSTOM = 'custom';

    public const SCHEDULE_RECURRENCE_SINGLE = 'single';

    public const SCHEDULE_RECURRENCE_CUSTOM = 'custom';

    public const REPEAT_UNTIL_DATE = 'date';

    public const REPEAT_UNTIL_TIMES = 'times';

    public const UNSCHEDULE_FUTURE_ACTION_DELAY = 5;

    public const DUPLICATE_HANDLING_CREATE_NEW = 'create-new';
    public const DUPLICATE_HANDLING_REPLACE = 'replace';

    public const DUPLICATE_HANDLING_DEFAULT = self::DUPLICATE_HANDLING_REPLACE;

    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var StepProcessorInterface
     */
    private $generalProcessor;

    /**
     * @var CronInterface
     */
    private $cron;

    /**
     * @var CronSchedulesModelInterface
     */
    private $cronSchedulesModel;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var string
     */
    private $pluginVersion;

    /**
     * @var WorkflowEngineInterface
     */
    private $workflowEngine;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    public function __construct(
        HooksFacade $hooks,
        StepProcessorInterface $stepProcessor,
        CronInterface $cron,
        CronSchedulesModelInterface $cronSchedulesModel,
        WorkflowEngineInterface $engine,
        string $pluginVersion,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->generalProcessor = $stepProcessor;
        $this->cron = $cron;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->workflowEngine = $engine;
        $this->variablesHandler = $engine->getVariablesHandler();
        $this->pluginVersion = $pluginVersion;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public function setup(array $step, callable $actionCallback): void
    {
        try {
            $stepSlug = $step['node']['data']['slug'];

            $node = $this->getNodeFromStep($step);
            $nodeSettings = $this->getNodeSettings($node);

            if (! isset($nodeSettings['schedule'])) {
                $nodeSettings['schedule'] = [];
            }

            $recurrence = $nodeSettings['schedule']['recurrence'] ?? self::SCHEDULE_RECURRENCE_SINGLE;
            $whenToRun = $nodeSettings['schedule']['whenToRun'] ?? self::WHEN_TO_RUN_NOW;
            $duplicateHandling = $nodeSettings['schedule']['duplicateHandling'] ?? self::DUPLICATE_HANDLING_DEFAULT;

            // Schedule
            if (self::SCHEDULE_RECURRENCE_SINGLE === $recurrence && self::WHEN_TO_RUN_NOW === $whenToRun) {
                $timestamp = 0;
            } else {
                $timestamp = $this->getSchedulingTimestamp($nodeSettings);
            }

            if (is_null($timestamp)) {
                $this->addDebugLogMessage('No timestamp found, skipping step %s', $stepSlug);

                return;
            }

            $priority = (int)($nodeSettings['schedule']['priority'] ?? 10);

            if (empty($priority)) {
                $priority = 10;
            }

            $isSingleAction = self::SCHEDULE_RECURRENCE_SINGLE === $recurrence;

            $actionUID = $this->getScheduledActionUniqueId($node);
            $actionUIDHash = md5($actionUID);
            $scheduledActionId = 0;

            $workflowId = $this->variablesHandler->getVariable('global.workflow.id');

            $actionArgs = [
                'workflowId' => $workflowId,
                'stepId' => $node['id'],
                'stepLabel' => $node['data']['label'] ?? null,
                'stepName' => $node['data']['name'],
                'pluginVersion' => $this->pluginVersion,
                // This is not always set, only for some post-related triggers. Used to keep the post ID as reference.
                'postId' => $this->variablesHandler->getVariable('global.trigger.postId'),
            ];

            $compactedArgs = $this->compactArguments($step);

            $scheduledActionsModel = new ScheduledActionsModel();

            $hasFinished = WorkflowScheduledStepModel::getMetaIsFinished($workflowId, $actionUIDHash);
            $runCount = WorkflowScheduledStepModel::getMetaRunCount($workflowId, $actionUIDHash);

            // Do not run single actions that have already run
            if ($isSingleAction && $runCount > 0) {
                $this->addDebugLogMessage(
                    'Step %s is a single action and has already run, skipping',
                    $stepSlug
                );

                return;
            }

            // If the action is already finished, we don't need to schedule it again.
            if ($hasFinished) {
                $this->addDebugLogMessage(
                    'Step %s has already finished, skipping',
                    $stepSlug
                );

                return;
            }

            switch ($duplicateHandling) {
                case self::DUPLICATE_HANDLING_CREATE_NEW:
                    // If the action is already scheduled, we should create a new one.
                    $this->addDebugLogMessage(
                        'Step %s is already scheduled based on its ID, creating a new one',
                        $stepSlug
                    );

                    // TODO: Make sure the action is not duplicated for the same step and execution ID.
                    // Is the execution ID the same for multiple calls to the same action hook?
                    // Use a session ID instead?
                    break;

                case self::DUPLICATE_HANDLING_REPLACE:
                    // If the action is already scheduled, we should replace it.
                    $this->addDebugLogMessage(
                        'Step %s is already scheduled based on its ID, unscheduling to replace it',
                        $stepSlug
                    );

                    $actionId = $scheduledActionsModel->getActionIdByActionUIDHash($actionUIDHash);

                    if ($actionId) {
                        $scheduledActionsModel->cancelActionById($actionId);
                    }

                    break;
            }

            if ($isSingleAction) {
                if (self::WHEN_TO_RUN_NOW === $whenToRun) {
                    $scheduledActionId = $this->cron->scheduleAsyncAction(
                        HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
                        [$actionArgs],
                        false,
                        $priority
                    );

                    $this->addDebugLogMessage(
                        'Step "%s" scheduled for immediate execution with async action ID: %d',
                        $stepSlug,
                        $scheduledActionId
                    );
                } else {
                    // Schedule a single action
                    $scheduledActionId = $this->cron->scheduleSingleAction(
                        $timestamp,
                        HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
                        [$actionArgs],
                        false,
                        $priority
                    );

                    $this->addDebugLogMessage(
                        'Step %s scheduled as a single action with ID %d',
                        $stepSlug,
                        $scheduledActionId
                    );
                }
            } else {
                if (self::SCHEDULE_RECURRENCE_CUSTOM === $recurrence) {
                    $interval = (int)$nodeSettings['schedule']['repeatInterval'] ?? 0;

                    /**
                     * @param int $interval
                     * @param array $nodeSettings
                     * @param RuntimeVariablesHandlerInterface $variablesHandler
                     *
                     * @return int
                     */
                    $interval = $this->hooks->applyFilters(
                        HooksAbstract::FILTER_INTERVAL_IN_SECONDS,
                        $interval,
                        $nodeSettings,
                        $this->variablesHandler
                    );
                } else {
                    $recurrence = preg_replace('/^cron_/', '', $recurrence);

                    $interval = $this->cronSchedulesModel->getCronScheduleValueByName($recurrence);
                }

                if ($interval > 0) {
                    // Schedule a recurring action
                    $scheduledActionId = $this->cron->scheduleRecurringActionInSeconds(
                        $timestamp,
                        $interval,
                        HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
                        [$actionArgs],
                        false,
                        $priority
                    );

                    $this->addDebugLogMessage(
                        'Step %s scheduled as recurring action with ID %d',
                        $stepSlug,
                        $scheduledActionId
                    );
                } else {
                    $this->addDebugLogMessage(
                        'Cannot schedule recurring step %s: Interval value must be greater than 0.',
                        $stepSlug
                    );
                }
            }

            // If the action is scheduled, we need to set the action ID in the scheduled step arguments
            if ($scheduledActionId > 0) {
                /*
                 * Setting the action ID is crucial for retrieving scheduled step arguments
                 * from the wp_ppfuture_workflow_scheduled_steps table, specifically for recurring actions.
                 * This step ensures that runtime data in the runtimeVariables field is properly
                 * passed from the just-executed action to any new recurring instances.
                 * Without this, we would lose important context between recurring executions.
                 */
                $argsModel = new ScheduledActionModel();
                $argsModel->loadByActionId($scheduledActionId);
                $argsModel->setActionIdOnArgs();
                $argsModel->update();

                $scheduledStepModel = new WorkflowScheduledStepModel();
                $scheduledStepModel->setActionId($scheduledActionId);
                $scheduledStepModel->setWorkflowId($workflowId);
                $scheduledStepModel->setStepId($node['id']);
                $scheduledStepModel->setActionUID($actionUID);
                $scheduledStepModel->setArgs($compactedArgs);
                $scheduledStepModel->setRunCount(0);
                $scheduledStepModel->setIsRecurring(! $isSingleAction);

                if (! $isSingleAction) {
                    $scheduledStepModel->setRepeatUntil($nodeSettings['schedule']['repeatUntil'] ?? 'forever');
                    $scheduledStepModel->setRepeatTimes((int)$nodeSettings['schedule']['repeatTimes'] ?? 0);
                    $scheduledStepModel->setRepeatUntilDate($nodeSettings['schedule']['repeatUntilDate'] ?? '');
                }

                $scheduledStepModel->insert();

                $this->addDebugLogMessage(
                    'Successfully stored workflow step arguments for step "%s" with scheduled action ID %d',
                    $stepSlug,
                    $scheduledActionId
                );
            } else {
                $this->addDebugLogMessage(
                    'Failed to schedule action for step %s - no action ID was generated',
                    $stepSlug
                );
            }
        } catch (Throwable $e) {
            $this->addErrorLogMessage('Failed to schedule workflow step "%s"', $stepSlug);

            throw $e;
        }
    }

    private function getSchedulingTimestamp(array $nodeSettings)
    {
        $scheduleSettings = $nodeSettings['schedule'];

        $whenToRun = $scheduleSettings['whenToRun'] ?? self::WHEN_TO_RUN_NOW;
        $dateSource = $scheduleSettings['dateSource'] ?? self::DATE_SOURCE_CALENDAR;

        $timestamp = 0;
        switch ($whenToRun) {
            case self::WHEN_TO_RUN_NOW:
            case self::WHEN_TO_RUN_EVENT:
                $timestamp = time();
                break;
            case self::WHEN_TO_RUN_DATE:
            case self::WHEN_TO_RUN_OFFSET:
                if (self::DATE_SOURCE_CALENDAR === $dateSource) {
                    $timestamp = strtotime($scheduleSettings['specificDate']);
                } elseif (self::DATE_SOURCE_EVENT === $dateSource) {
                    $timestamp = $this->variablesHandler->getVariable('global.trigger.activation_timestamp');
                } elseif (self::DATE_SOURCE_STEP === $dateSource) {
                    $timestamp = time();
                } elseif (self::DATE_SOURCE_CUSTOM === $dateSource) {
                    $timestamp = $this->variablesHandler->replacePlaceholdersInText($nodeSettings['schedule']['customDateSource']['expression']);
                } else {
                    $timestamp = $this->variablesHandler->getVariable($dateSource);
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

        if (self::WHEN_TO_RUN_OFFSET === $whenToRun) {
            $offset = $scheduleSettings['dateOffset'] ?? '';
            if (! empty($offset)) {
                $timestamp = strtotime($offset, (int)$timestamp);
            }
        }

        return $timestamp;
    }

    private function getScheduledActionUniqueId(array $node): string
    {
        $uniqueId = [
            'workflowId' => $this->variablesHandler->getVariable('global.workflow.id'),
            'stepId' => $node['id']
        ];

        if (isset($node['data']['settings']['schedule']['uniqueIdExpression'])) {
            $uniqueIdExpression = $node['data']['settings']['schedule']['uniqueIdExpression'];

            if (is_array($uniqueIdExpression)) {
                $uniqueIdExpression = $uniqueIdExpression['expression'];
            }

            if (! empty($uniqueIdExpression)) {
                $uniqueId = [
                    'custom' => $this->variablesHandler->replacePlaceholdersInText($uniqueIdExpression),
                ];
            }
        }

        return wp_json_encode($uniqueId);
    }

    public function compactArguments(array $step): array
    {
        $this->addDebugLogMessage(
            'Compacting step %s arguments',
            $step['node']['data']['slug']
        );

        $compactedArgs = [
            'pluginVersion' => $this->pluginVersion,
            'step' => [
                'nodeId' => $step['node']['id'],
            ],
            'runtimeVariables' => $this->variablesHandler->getAllVariables(),
        ];

        foreach ($compactedArgs['runtimeVariables'] as $context => &$variables) {
            if (is_array($variables)) {
                foreach ($variables as &$variableResolver) {
                    if (is_object($variableResolver)) {
                        $diff = null;
                        // TODO: Each variable resolver should have a method to compact itself and check diff, etc.
                        if ($variableResolver->getType() === 'post') {
                            $diff = $this->getPostDifferences(
                                $variableResolver->getVariable(),
                                get_post($variableResolver->getValue('ID'))
                            );
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

    public function expandArguments(array $compactArguments): array
    {
        $this->addDebugLogMessage(
            'Expanding step %s arguments',
            $compactArguments['step']['nodeId']
        );

        if (isset($compactArguments['step']['nodeId'])) {
            // New format where the step is compacted
            $nodeId = $compactArguments['step']['nodeId'];

            // Convert legacy context variables to runtime variables
            if (isset($compactArguments['contextVariables'])) {
                $compactArguments['runtimeVariables'] = $compactArguments['contextVariables'];
                unset($compactArguments['contextVariables']);
            }

            $workflowId = $compactArguments['runtimeVariables']['global']['workflow']['value'];

            $step = $this->getStepFromNodeId($workflowId, $nodeId);
        } else {
            // Old format, where the step is not compacted
            $step = $compactArguments['step'];
        }

        $expandedArgs = [
            'step' => $step,
            'runtimeVars' => [],
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
         *  "runtimeVariables": {
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

        foreach ($compactArguments['runtimeVariables'] as $context => $variables) {
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

                // FIXME: This should be moved to a variable resolver factory
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
                    'future_action' => FutureActionResolver::class,
                ];

                if (! $isLegacyCompact) {
                    $resolverArgument = $value['value'] ?? null;
                } else {
                    $resolverArgument = $value;
                }

                switch ($type) {
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

                    // TODO: Replace this with a factory
                    if ($type === 'site') {
                        $expandedArgs['runtimeVariables'][$context][$variableName] = new $resolverClass();
                    } elseif ($type === 'post') {
                        $expandedArgs['runtimeVariables'][$context][$variableName] = new $resolverClass(
                            $resolverArgument,
                            $this->hooks,
                            '',
                            $this->expirablePostModelFactory
                        );
                    } else {
                        $expandedArgs['runtimeVariables'][$context][$variableName] = new $resolverClass(
                            $resolverArgument
                        );
                    }
                } else {
                    $expandedArgs['runtimeVariables'][$context][$variableName] = $value;
                }
            }
        }

        return $expandedArgs;
    }

    private function markStepAsFinished(int $actionId): void
    {
        $scheduledStepModel = new WorkflowScheduledStepModel();
        $scheduledStepModel->loadByActionId($actionId);
        $scheduledStepModel->markAsFinished();
    }

    public function cancelScheduledStep(int $actionId, array $originalArgs): void
    {
        $scheduledActionModel = new ScheduledActionModel();
        $scheduledActionModel->loadByActionId($actionId);
        $scheduledActionModel->cancel();

        $this->cancelFutureRecurringActions($originalArgs['workflowId'], $originalArgs['stepId']);

        $this->addDebugLogMessage(
            'Step %s scheduled action cancelled',
            $originalArgs['stepId']
        );
    }

    private function cancelFutureRecurringActions(int $workflowId, string $stepId): void
    {
        $this->cron->scheduleSingleAction(
            time() + self::UNSCHEDULE_FUTURE_ACTION_DELAY,
            HooksAbstract::ACTION_UNSCHEDULE_RECURRING_STEP_ACTION,
            [
                'workflowId' => $workflowId,
                'stepId' => $stepId,
            ],
            false,
            10
        );

        $this->addDebugLogMessage(
            'Scheduled cleanup of future recurring actions for step %s',
            $stepId
        );
    }

    public function completeScheduledStep(int $actionId): void
    {
        $scheduledActionModel = new ScheduledActionModel();
        $scheduledActionModel->loadByActionId($actionId);
        $scheduledActionModel->complete();

        $this->markStepAsFinished($actionId);

        $this->addDebugLogMessage(
            'Successfully completed scheduled action ID %d',
            $actionId
        );
    }

    public function actionCallback(array $compactedArgs, array $originalArgs)
    {
        $expandedArgs = $this->expandArguments($compactedArgs);

        $this->variablesHandler->setAllVariables($expandedArgs['runtimeVariables']);

        // Check if the workflow is still active
        $workflowId = $this->variablesHandler->getVariable('global.workflow.id');

        $workflowModel = new WorkflowModel();
        $workflowModel->load($workflowId);

        $actionId = $this->workflowEngine->getCurrentAsyncActionId();

        if (! $workflowModel->isActive()) {
            // TODO: Log this into the scheduler log
            $this->cancelScheduledStep($actionId, $originalArgs);

            $this->addDebugLogMessage(
                'Workflow %d is inactive, cancelling scheduled action %s',
                $workflowId,
                $actionId
            );

            return;
        }

        $scheduledStepModel = new WorkflowScheduledStepModel();
        $scheduledStepModel->loadByActionId($actionId);

        $isRecurrent = $scheduledStepModel->getIsRecurring();
        $isFinished = $scheduledStepModel->isFinished();

        if ($isRecurrent && $isFinished) {
            $this->cancelScheduledStep($actionId, $originalArgs);
            return;
        }

        $markAsCompletedAfterExecution = false;
        $shouldExecute = true;

        if ($isRecurrent) {
            // Check if the node has a limit of executions. Default is 'forever'.
            $repeatUntil = $scheduledStepModel->getRepeatUntil();

            if ($repeatUntil === 'date') {
                $repeatUntilDate = strtotime($scheduledStepModel->getRepeatUntilDate() ?? '');
                $now = time();

                if ($repeatUntilDate <= $now) {
                    $markAsCompletedAfterExecution = true;
                }
            } elseif ($repeatUntil === 'times') {
                $runCount = (int)$scheduledStepModel->getRunCount();
                $runLimit = (int)$scheduledStepModel->getRepeatTimes() ?? self::DEFAULT_REPEAT_UNTIL_TIMES;

                // Will this be the last execution?
                if ($runCount >= $runLimit - 1) {
                    $markAsCompletedAfterExecution = true;
                }

                if ($runCount >= $runLimit) {
                    $shouldExecute = false;
                    $markAsCompletedAfterExecution = true;
                }
            }
        }

        if ($shouldExecute) {
            $this->addDebugLogMessage(
                'Executing step %s',
                $expandedArgs['step']['node']['data']['slug']
            );

            $this->variablesHandler->setAllVariables($expandedArgs['runtimeVariables']);
            $this->runNextSteps($expandedArgs['step']);

            $scheduledStepModel->incrementRunCount();
            $scheduledStepModel->updateLastRunAt();
            $scheduledStepModel->update();
        }

        if ($markAsCompletedAfterExecution) {
            $this->addDebugLogMessage(
                'Step scheduled action with ID %d completed',
                $actionId
            );

            $this->completeScheduledStep($actionId);
            $this->cancelFutureRecurringActions($workflowId, $originalArgs['stepId']);
            return;
        }
    }

    public function runNextSteps(array $step, string $branch = 'output'): void
    {
        $this->generalProcessor->runNextSteps($step, $branch);
    }

    public function getNextSteps(array $step, string $branch = 'output'): array
    {
        return $this->generalProcessor->getNextSteps($step, $branch);
    }

    public function getNodeFromStep(array $step)
    {
        return $this->generalProcessor->getNodeFromStep($step);
    }

    public function getSlugFromStep(array $step)
    {
        return $this->generalProcessor->getSlugFromStep($step);
    }

    public function getNodeSettings(array $node)
    {
        return $this->generalProcessor->getNodeSettings($node);
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        $this->addErrorLogMessage($message);
    }

    public function triggerCallbackIsRunning(): void
    {
        $this->generalProcessor->triggerCallbackIsRunning();
    }

    public function cancelWorkflowScheduledActions(int $workflowId): void
    {
        $scheduledActionsModel = new ScheduledActionsModel();
        $scheduledActionsModel->cancelWorkflowScheduledActions($workflowId);
    }

    private function getStepFromNodeId(int $workflowId, string $nodeId): array
    {
        $workflowModel = new WorkflowModel();
        $workflowModel->load($workflowId);
        $routineTree = $workflowModel->getPartialRoutineTreeFromNodeId($nodeId);

        return $routineTree;
    }

    public function prepareLogMessage(string $message, ...$args): string
    {
        return $this->generalProcessor->prepareLogMessage($message, ...$args);
    }

    public function executeSafelyWithErrorHandling(array $step, callable $callback, ...$args): void
    {
        $this->generalProcessor->executeSafelyWithErrorHandling($step, $callback, ...$args);
    }

    private function addDebugLogMessage(string $message, ...$args): void
    {
        $this->logger->debug($this->prepareLogMessage($message, ...$args));
    }

    private function addErrorLogMessage(string $message, ...$args): void
    {
        $this->logger->error($this->prepareLogMessage($message, ...$args));
    }
}
