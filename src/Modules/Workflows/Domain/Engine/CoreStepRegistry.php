<?php

/**
 * Core workflow step definitions and their runner factories.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\AddPostMeta;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\AddPostTerm;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\AppendDebugLog;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\ChangePostStatus;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\Conditional;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\DeactivatePostWorkflow;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\DeletePost;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\DeletePostMeta;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\DoAction;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\DuplicatePost;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\QueryPosts;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\RemovePostTerm;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\ScheduleDelay;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\SendEmail;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\SendInSiteNotification;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\SendRay;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\SetPostTerm;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\StickPost;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\UnstickPost;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\UpdatePost;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\UpdatePostMeta;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\UserInteraction;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\AddPostMetaRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\AddPostTermRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\AppendDebugLogRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\ChangePostStatusRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\ConditionalRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\DeactivatePostWorkflowRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\DeletePostMetaRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\DeletePostRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\DoActionRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\QueryPostsRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\RemovePostTermRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\ScheduleDelayRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\SendEmailRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\SendRayRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\SetPostTermRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\StickPostRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\UnstickPostRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\UpdatePostMetaRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\UpdatePostRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners\UserInteractionRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnAdminInit;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnCustomAction;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnInit;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnLegacyActionTrigger;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostAuthorChange;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostCreate;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostMetaChange;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostPublish;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostRowAction;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostSave;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostSchedule;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostStatusChange;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostUpdate;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostWorkflowEnable;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnSchedule;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnTermsAdded;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnUserRoleChange;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnAdminInitRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnCustomActionRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnInitRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnLegacyActionTriggerRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostAuthorChangeRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostCreateRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostMetaChangeRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostPublishRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostRowActionRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostSaveRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostScheduleRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostStatusChangeRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostUpdateRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnPostWorkflowEnableRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnScheduleRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnTermsAddedRunner;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners\OnUserRoleChangeRunner;
use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;

/**
 * One entry per core step. Node type names come from the definition class.
 *
 * @since 4.3.1
 */
class CoreStepRegistry
{
    public const BUCKET_TRIGGER = 'trigger';

    public const BUCKET_ACTION = 'action';

    public const BUCKET_ADVANCED = 'advanced';

    public const GATE_ALWAYS = 'always';

    public const GATE_EXPERIMENTAL = 'experimental';

    public const GATE_RAY = 'ray';

    public const GATE_NONE = 'none';

    /**
     * @var array
     */
    private $entries = [];

    /**
     * @since 4.3.1
     */
    public function __construct()
    {
        $this->registerTriggerSteps();
        $this->registerActionSteps();
        $this->registerAdvancedSteps();
    }

    /**
     * Definition instances for one bucket, in the default editor order.
     *
     * Experimental and Ray gates are applied here. Runner gates are separate.
     *
     * @param string            $bucket
     * @param HookableInterface $hooks
     * @param bool              $experimentalEnabled
     * @return StepTypeInterface[]
     * @since 4.3.1
     */
    public function getDefinitions(string $bucket, HookableInterface $hooks, bool $experimentalEnabled): array
    {
        $definitions = [];

        foreach ($this->entries as $nodeName => $entry) {
            if ($entry['bucket'] !== $bucket) {
                continue;
            }

            if (! $this->definitionIsAvailable($entry, $experimentalEnabled)) {
                continue;
            }

            $factory = $entry['definition'];

            if ($entry['requiresHooks']) {
                $definitions[$nodeName] = $factory($hooks);
                continue;
            }

            $definitions[$nodeName] = $factory();
        }

        return $definitions;
    }

    /**
     * Node type name => definition class, including gated steps.
     *
     * @return array
     * @since 4.3.1
     */
    public function getDefinitionClassesByNodeName(): array
    {
        $classes = [];

        foreach ($this->entries as $nodeName => $entry) {
            $classes[$nodeName] = $entry['definitionClass'];
        }

        return $classes;
    }

    /**
     * @param string $nodeName
     * @return bool
     * @since 4.3.1
     */
    public function runnerUsesExperimentalGate(string $nodeName): bool
    {
        if (! isset($this->entries[$nodeName])) {
            return false;
        }

        return $this->entries[$nodeName]['runnerGate'] === self::GATE_EXPERIMENTAL;
    }

    /**
     * @param string $nodeName
     * @param bool   $experimentalEnabled
     * @return bool
     * @since 4.3.1
     */
    public function shouldBuildRunner(string $nodeName, bool $experimentalEnabled): bool
    {
        if (! isset($this->entries[$nodeName])) {
            return false;
        }

        $entry = $this->entries[$nodeName];

        if ($entry['runnerGate'] === self::GATE_NONE || $entry['runner'] === null) {
            return false;
        }

        if ($entry['runnerGate'] === self::GATE_EXPERIMENTAL) {
            return $experimentalEnabled;
        }

        return true;
    }

    /**
     * @param string $nodeName
     * @param array  $context
     * @return object
     * @since 4.3.1
     */
    public function buildRunner(string $nodeName, array $context)
    {
        $factory = $this->entries[$nodeName]['runner'];

        return $factory($context);
    }

    /**
     * @param array $entry
     * @param bool  $experimentalEnabled
     * @return bool
     * @since 4.3.1
     */
    private function definitionIsAvailable(array $entry, bool $experimentalEnabled): bool
    {
        if ($entry['definitionGate'] === self::GATE_EXPERIMENTAL) {
            return $experimentalEnabled;
        }

        if ($entry['definitionGate'] === self::GATE_RAY) {
            return function_exists('ray');
        }

        return true;
    }

    /**
     * @param string        $definitionClass
     * @param string        $bucket
     * @param callable      $definition
     * @param callable|null $runner
     * @param string        $definitionGate
     * @param string        $runnerGate
     * @param bool          $requiresHooks
     * @return void
     * @since 4.3.1
     */
    private function register(
        string $definitionClass,
        string $bucket,
        callable $definition,
        $runner,
        string $definitionGate = self::GATE_ALWAYS,
        string $runnerGate = self::GATE_ALWAYS,
        bool $requiresHooks = false
    ): void {
        $nodeName = $definitionClass::getNodeTypeName();

        $this->entries[$nodeName] = [
            'definitionClass' => $definitionClass,
            'bucket' => $bucket,
            'definition' => $definition,
            'runner' => $runner,
            'definitionGate' => $definitionGate,
            'runnerGate' => $runnerGate,
            'requiresHooks' => $requiresHooks,
        ];
    }

    /**
     * @return void
     * @since 4.3.1
     */
    private function registerTriggerSteps(): void
    {
        $this->register(
            OnPostSave::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostSave();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                $inputValidatorPostQuery = call_user_func(
                    $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY_FACTORY),
                    $workflowExecutionId
                );

                return new OnPostSaveRunner(
                    $container->get(ServicesAbstract::HOOKS),
                    $generalStepProcessor,
                    $inputValidatorPostQuery,
                    $workflowLogger,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::WORKFLOW_EXECUTION_SAFEGUARD),
                    $executionContext
                );
            }
        );

        $this->register(
            OnPostUpdate::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostUpdate();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                $inputValidatorPostQuery = call_user_func(
                    $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY_FACTORY),
                    $workflowExecutionId
                );

                return new OnPostUpdateRunner(
                    $container->get(ServicesAbstract::HOOKS),
                    $generalStepProcessor,
                    $inputValidatorPostQuery,
                    $workflowLogger,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::POST_CACHE),
                    $container->get(ServicesAbstract::WORKFLOW_EXECUTION_SAFEGUARD),
                    $executionContext
                );
            }
        );

        $this->register(
            OnPostCreate::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostCreate();
            },
            static function (array $context) {
                return new OnPostCreateRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnPostPublish::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostPublish();
            },
            static function (array $context) {
                $container = $context['container'];
                $hooks = $context['hooks'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                $inputValidatorPostQuery = call_user_func(
                    $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY_FACTORY),
                    $workflowExecutionId
                );

                return new OnPostPublishRunner(
                    $hooks,
                    $generalStepProcessor,
                    $inputValidatorPostQuery,
                    $executionContext,
                    $workflowLogger,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::POST_CACHE),
                    $container->get(ServicesAbstract::WORKFLOW_EXECUTION_SAFEGUARD)
                );
            }
        );

        $this->register(
            OnPostSchedule::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostSchedule();
            },
            static function (array $context) {
                return new OnPostScheduleRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnPostStatusChange::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostStatusChange();
            },
            static function (array $context) {
                return new OnPostStatusChangeRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnPostWorkflowEnable::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostWorkflowEnable();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                $inputValidatorPostQuery = call_user_func(
                    $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY_FACTORY),
                    $workflowExecutionId
                );

                return new OnPostWorkflowEnableRunner(
                    $container->get(ServicesAbstract::HOOKS),
                    $postStepProcessor,
                    $inputValidatorPostQuery,
                    $executionContext,
                    $workflowLogger,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::WORKFLOW_EXECUTION_SAFEGUARD)
                );
            }
        );

        $this->register(
            OnLegacyActionTrigger::class,
            self::BUCKET_TRIGGER,
            static function (HookableInterface $hooks) {
                return new OnLegacyActionTrigger($hooks);
            },
            static function (array $context) {
                $container = $context['container'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                return new OnLegacyActionTriggerRunner(
                    $container->get(ServicesAbstract::HOOKS),
                    $generalStepProcessor,
                    $executionContext,
                    $workflowLogger,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY)
                );
            },
            self::GATE_ALWAYS,
            self::GATE_ALWAYS,
            true
        );

        $this->register(
            OnSchedule::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnSchedule();
            },
            static function (array $context) {
                return new OnScheduleRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnPostMetaChange::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostMetaChange();
            },
            static function (array $context) {
                return new OnPostMetaChangeRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnPostAuthorChange::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostAuthorChange();
            },
            static function (array $context) {
                return new OnPostAuthorChangeRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnPostRowAction::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnPostRowAction();
            },
            static function (array $context) {
                return new OnPostRowActionRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnUserRoleChange::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnUserRoleChange();
            },
            static function (array $context) {
                return new OnUserRoleChangeRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnTermsAdded::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnTermsAdded();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                $inputValidatorPostQuery = call_user_func(
                    $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY_FACTORY),
                    $workflowExecutionId
                );

                return new OnTermsAddedRunner(
                    $container->get(ServicesAbstract::HOOKS),
                    $generalStepProcessor,
                    $inputValidatorPostQuery,
                    $workflowLogger,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::POST_CACHE),
                    $container->get(ServicesAbstract::WORKFLOW_EXECUTION_SAFEGUARD),
                    $executionContext
                );
            }
        );

        $this->register(
            OnCustomAction::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnCustomAction();
            },
            static function (array $context) {
                return new OnCustomActionRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            OnInit::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnInit();
            },
            static function (array $context) {
                $container = $context['container'];

                return new OnInitRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger'],
                    $container->get(ServicesAbstract::WORKFLOW_ENGINE)
                );
            },
            self::GATE_EXPERIMENTAL,
            self::GATE_EXPERIMENTAL
        );

        $this->register(
            OnAdminInit::class,
            self::BUCKET_TRIGGER,
            static function () {
                return new OnAdminInit();
            },
            static function (array $context) {
                return new OnAdminInitRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            },
            self::GATE_EXPERIMENTAL,
            self::GATE_EXPERIMENTAL
        );
    }

    /**
     * @return void
     * @since 4.3.1
     */
    private function registerActionSteps(): void
    {
        $this->register(
            DeletePost::class,
            self::BUCKET_ACTION,
            static function () {
                return new DeletePost();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new DeletePostRunner(
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $workflowLogger
                );
            }
        );

        $this->register(
            StickPost::class,
            self::BUCKET_ACTION,
            static function () {
                return new StickPost();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new StickPostRunner(
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $workflowLogger
                );
            }
        );

        $this->register(
            UnstickPost::class,
            self::BUCKET_ACTION,
            static function () {
                return new UnstickPost();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new UnstickPostRunner(
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $workflowLogger
                );
            }
        );

        $this->register(
            AddPostTerm::class,
            self::BUCKET_ACTION,
            static function () {
                return new AddPostTerm();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new AddPostTermRunner(
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::ERROR),
                    $workflowLogger
                );
            }
        );

        $this->register(
            SetPostTerm::class,
            self::BUCKET_ACTION,
            static function () {
                return new SetPostTerm();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new SetPostTermRunner(
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::ERROR),
                    $workflowLogger
                );
            }
        );

        $this->register(
            RemovePostTerm::class,
            self::BUCKET_ACTION,
            static function () {
                return new RemovePostTerm();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new RemovePostTermRunner(
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $container->get(ServicesAbstract::ERROR),
                    $workflowLogger
                );
            }
        );

        $this->register(
            ChangePostStatus::class,
            self::BUCKET_ACTION,
            static function () {
                return new ChangePostStatus();
            },
            static function (array $context) {
                $container = $context['container'];
                $hooks = $context['hooks'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new ChangePostStatusRunner(
                    $hooks,
                    $postStepProcessor,
                    $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                    $workflowLogger
                );
            }
        );

        $this->register(
            SendEmail::class,
            self::BUCKET_ACTION,
            static function () {
                return new SendEmail();
            },
            static function (array $context) {
                $container = $context['container'];

                return new SendEmailRunner(
                    $context['generalStepProcessor'],
                    $container->get(ServicesAbstract::EMAIL),
                    $context['executionContext'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            DeactivatePostWorkflow::class,
            self::BUCKET_ACTION,
            static function () {
                return new DeactivatePostWorkflow();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];
                $executionContext = $context['executionContext'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new DeactivatePostWorkflowRunner(
                    $postStepProcessor,
                    $executionContext,
                    $workflowLogger
                );
            }
        );

        $this->register(
            AddPostMeta::class,
            self::BUCKET_ACTION,
            static function () {
                return new AddPostMeta();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new AddPostMetaRunner(
                    $postStepProcessor,
                    $workflowLogger
                );
            }
        );

        $this->register(
            DeletePostMeta::class,
            self::BUCKET_ACTION,
            static function () {
                return new DeletePostMeta();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new DeletePostMetaRunner(
                    $postStepProcessor,
                    $workflowLogger
                );
            }
        );

        $this->register(
            UpdatePostMeta::class,
            self::BUCKET_ACTION,
            static function () {
                return new UpdatePostMeta();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new UpdatePostMetaRunner(
                    $postStepProcessor,
                    $workflowLogger
                );
            }
        );

        $this->register(
            UpdatePost::class,
            self::BUCKET_ACTION,
            static function () {
                return new UpdatePost();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $workflowLogger = $context['workflowLogger'];

                $postStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::POST_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new UpdatePostRunner(
                    $postStepProcessor,
                    $workflowLogger
                );
            }
        );

        $this->register(
            SendInSiteNotification::class,
            self::BUCKET_ACTION,
            static function () {
                return new SendInSiteNotification();
            },
            null,
            self::GATE_ALWAYS,
            self::GATE_NONE
        );

        $this->register(
            DuplicatePost::class,
            self::BUCKET_ACTION,
            static function () {
                return new DuplicatePost();
            },
            null,
            self::GATE_ALWAYS,
            self::GATE_NONE
        );
    }

    /**
     * @return void
     * @since 4.3.1
     */
    private function registerAdvancedSteps(): void
    {
        $this->register(
            ScheduleDelay::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new ScheduleDelay();
            },
            static function (array $context) {
                $container = $context['container'];
                $workflowExecutionId = $context['workflowExecutionId'];
                $generalStepProcessor = $context['generalStepProcessor'];
                $executionContext = $context['executionContext'];

                $cronStepProcessor = call_user_func(
                    $container->get(ServicesAbstract::CRON_STEP_PROCESSOR_FACTORY),
                    $generalStepProcessor,
                    $workflowExecutionId
                );

                return new ScheduleDelayRunner(
                    $cronStepProcessor,
                    $executionContext
                );
            }
        );

        $this->register(
            QueryPosts::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new QueryPosts();
            },
            static function (array $context) {
                return new QueryPostsRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            Conditional::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new Conditional();
            },
            static function (array $context) {
                return new ConditionalRunner(
                    $context['generalStepProcessor'],
                    $context['executionContext'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            AppendDebugLog::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new AppendDebugLog();
            },
            static function (array $context) {
                return new AppendDebugLogRunner(
                    $context['generalStepProcessor'],
                    $context['executionContext'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            DoAction::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new DoAction();
            },
            static function (array $context) {
                return new DoActionRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            UserInteraction::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new UserInteraction();
            },
            static function (array $context) {
                return new UserInteractionRunner(
                    $context['generalStepProcessor'],
                    $context['workflowLogger']
                );
            }
        );

        $this->register(
            SendRay::class,
            self::BUCKET_ADVANCED,
            static function () {
                return new SendRay();
            },
            static function (array $context) {
                return new SendRayRunner(
                    $context['generalStepProcessor'],
                    $context['executionContext'],
                    $context['workflowLogger']
                );
            },
            self::GATE_RAY,
            self::GATE_ALWAYS
        );
    }
}
