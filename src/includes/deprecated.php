<?php

use function Avifinfo\read;

class_alias(
    'PublishPress\FuturePro\\Core\\HooksAbstract',
    'PublishPressFuturePro\\Core\\HooksAbstract'
);

class_alias(
    'PublishPress\FuturePro\\Core\\PluginInitializator',
    'PublishPressFuturePro\\Core\\PluginInitializator'
);

class_alias(
    'PublishPress\FuturePro\\Core\\ServicesAbstract',
    'PublishPressFuturePro\\Core\\ServicesAbstract'
);

class_alias(
    'PublishPress\FuturePro\\Controllers\\CustomStatusesController',
    'PublishPressFuturePro\\Controllers\\CustomStatusesController'
);

class_alias(
    'PublishPress\\FuturePro\\Controllers\\EddIntegrationController',
    'PublishPressFuturePro\\Controllers\\EddIntegrationController'
);

class_alias(
    'PublishPress\\FuturePro\\Controllers\\SettingsController',
    'PublishPressFuturePro\\Controllers\\SettingsController'
);

class_alias(
    'PublishPress\\FuturePro\\Models\\CustomStatusesModel',
    'PublishPressFuturePro\\Models\\CustomStatusesModel'
);

class_alias(
    'PublishPress\\FuturePro\\Models\\SettingsModel',
    'PublishPressFuturePro\\Models\\SettingsModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\GeneralStep',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\GeneralAction'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\GeneralStep',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\GeneralStep'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\PostStep',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\PostAction'
);


class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\PostStep',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\PostStep'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\WorkflowsList',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\WorkflowsList'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\WorkflowEditor',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\WorkflowEditor'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\ScheduledActions',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\ScheduledActions'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\SampleWorkflows',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\SampleWorkflows'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\PostsList',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\PostsList'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\PostType',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\PostType'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\RestApi',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\RestApi'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\ManualPostTrigger',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\ManualPostTrigger'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Controllers\\FutureLegacyAction',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\FutureLegacyAction'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\DBTableSchemas\\WorkflowScheduledStepsSchema',
    'PublishPress\\FuturePro\\Modules\\Workflows\\DBTableSchemas\\WorkflowScheduledStepsSchema'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\DataType\\PostQuery',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\DataType\\PostQuery'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\InputValidators\\PostQuery',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\InputValidators\\PostQuery'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\CronStep',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\CronStep'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostChangeStatus',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostChangeStatus'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostDeactivateWorkflow',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostDeactivateWorkflow'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostDelete',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostDelete'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostStick',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostStick'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsAdd',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsAdd'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsRemove',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsRemove'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsSet',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsSet'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostUnstick',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostUnstick'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CoreSendEmail',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CoreSendEmail'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\CorePostQuery',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\CorePostQuery'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\CoreSchedule',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\CoreSchedule'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\IfElse',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\IfElse'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\RayDebug',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\RayDebug'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnAdminInit',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnAdminInit'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnCronSchedule',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnCronSchedule'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnInit',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnInit'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnManuallyEnabledForPost',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnManuallyEnabledForPost'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnPostUpdated',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnPostUpdated'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnSavePost',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnSavePost'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\FutureLegacyAction',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\FutureLegacyAction'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\ArrayResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\ArrayResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\BooleanResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\BooleanResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\DatetimeResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\DatetimeResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\EmailResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\EmailResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\IntegerResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\IntegerResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\NodeResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\NodeResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\PostResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\PostResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\SiteResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\SiteResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\StringResolver',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\StringResolver'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\WorkflowEngine',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\WorkflowEngine'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\Engine\\WorkflowVariablesHandler',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\WorkflowVariablesHandler'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\LegacyAction\\TriggerWorkflow',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\LegacyAction\\TriggerWorkflow'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostChangeStatus',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostChangeStatus'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostDeactivateWorkflow',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostDeactivateWorkflow'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostDelete',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostDelete'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostStick',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostStick'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsAdd',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsAdd'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsRemove',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsRemove'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsSet',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsSet'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostUnstick',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostUnstick'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CoreSendEmail',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CoreSendEmail'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\CorePostQuery',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\CorePostQuery'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\CoreSchedule',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\CoreSchedule'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\IfElse',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\IfElse'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\RayDebug',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\RayDebug'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnAdminInit',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnAdminInit'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnCronSchedule',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnCronSchedule'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnInit',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnInit'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnManuallyEnabledForPost',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnManuallyEnabledForPost'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnPostUpdated',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnPostUpdated'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnSavePost',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnSavePost'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\FutureLegacyAction',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\FutureLegacyAction'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Migrations\\V40000WorkflowScheduledStepsSchema',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Migrations\\V40000WorkflowScheduledStepsSchema'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\CronSchedulesModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\CronSchedulesModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\NodeTypesModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\NodeTypesModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\PostModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\PostModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\PostStatusesModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\PostStatusesModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\PostTypesModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\PostTypesModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\ScheduledActionModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\ScheduledActionModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\ScheduledActionsModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\ScheduledActionsModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\TaxonomiesModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\TaxonomiesModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\WorkflowModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\WorkflowModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\WorkflowScheduledStepModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\WorkflowScheduledStepModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Models\\WorkflowsModel',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\WorkflowsModel'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Rest\\RestApiManager',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Rest\\RestApiManager'
);

class_alias(
    'PublishPress\\Future\\Modules\\Workflows\\Rest\\RestApiV1',
    'PublishPress\\FuturePro\\Modules\\Workflows\\Rest\\RestApiV1'
);

require_once __DIR__ . '/deprecated/traits/InfiniteLoopPreventer.php';
require_once __DIR__ . '/deprecated/interfaces/AsyncNodeRunnerInterface.php';
require_once __DIR__ . '/deprecated/interfaces/AsyncNodeRunnerProcessorInterface.php';
require_once __DIR__ . '/deprecated/interfaces/CronSchedulesModelInterface.php';
require_once __DIR__ . '/deprecated/interfaces/DataTypeInterface.php';
require_once __DIR__ . '/deprecated/interfaces/InputValidatorsInterface.php';
require_once __DIR__ . '/deprecated/interfaces/ModelInterface.php';
require_once __DIR__ . '/deprecated/interfaces/NodeInterface.php';
require_once __DIR__ . '/deprecated/interfaces/NodeRunnerInterface.php';
require_once __DIR__ . '/deprecated/interfaces/NodeRunnerMapperInterface.php';
require_once __DIR__ . '/deprecated/interfaces/NodeRunnerProcessorInterface.php';
require_once __DIR__ . '/deprecated/interfaces/NodeTriggerRunnerInterface.php';

