<?php

namespace Tests\Modules\Workflows\Models;


class DeprecatedTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function setUp() :void
    {
        // Before...
        parent::setUp();

        // Your set up methods here.
    }

    public function tearDown() :void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    public function testDeprecatedClassesStillExist()
    {
        $classes = [
            // Deprecated class in v3.4.4
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\GeneralAction',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\PostAction',
            // Deprecated classes in v4.0.0
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\WorkflowEditor',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\WorkflowsList',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\ScheduledActions',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\SampleWorkflows',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\PostsList',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\PostType',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\RestApi',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\Migrations',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\ManualPostTrigger',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Controllers\\FutureLegacyAction',
            'PublishPress\\FuturePro\\Modules\\Workflows\\DBTableSchemas\\WorkflowScheduledStepsSchema',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\DataType\\PostQuery',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\InputValidators\\PostQuery',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\CronStep',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\GeneralStep',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunnerProcessors\\PostStep',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostChangeStatus',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostDeactivateWorkflow',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostDelete',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostStick',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsAdd',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsRemove',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostTermsSet',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CorePostUnstick',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Actions\\CoreSendEmail',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\CorePostQuery',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\CoreSchedule',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\IfElse',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Advanced\\RayDebug',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnAdminInit',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnCronSchedule',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnInit',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnManuallyEnabledForPost',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnPostUpdated',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\CoreOnSavePost',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\NodeRunners\\Triggers\\FutureLegacyAction',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\ArrayResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\BooleanResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\DatetimeResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\EmailResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\IntegerResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\NodeResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\PostResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\SiteResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\VariableResolvers\\StringResolver',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\WorkflowEngine',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\WorkflowVariablesHandler',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\LegacyAction\\TriggerWorkflow',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostChangeStatus',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostDeactivateWorkflow',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostDelete',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostStick',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsAdd',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsRemove',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostTermsSet',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CorePostUnstick',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Actions\\CoreSendEmail',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\CorePostQuery',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\CoreSchedule',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\IfElse',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Advanced\\RayDebug',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnAdminInit',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnCronSchedule',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnInit',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnManuallyEnabledForPost',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnPostUpdated',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\CoreOnSavePost',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\NodeTypes\\Triggers\\FutureLegacyAction',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Migrations\\V40000WorkflowScheduledStepsSchema',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\CronSchedulesModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\NodeTypesModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\PostModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\PostStatusesModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\PostTypesModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\ScheduledActionModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\ScheduledActionsModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\TaxonomiesModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\WorkflowModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\WorkflowScheduledStepModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Models\\WorkflowsModel',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Rest\\RestApiManager',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Rest\\RestApiV1',
        ];

        foreach ($classes as $class) {
            $this->assertTrue(class_exists($class), "Class $class does not exist");
        }
    }

    public function testDeprecatedTraitsStillExist()
    {
        $traits = [
            // Deprecated traits in v4.0.0
            'PublishPress\\FuturePro\\Modules\\Workflows\\Domain\\Engine\\Traits\\InfiniteLoopPreventer',
        ];

        foreach ($traits as $trait) {
            $this->assertTrue(trait_exists($trait), "Trait $trait does not exist");
        }
    }

    public function testDeprecatedInterfacesStillExist()
    {
        $interfaces = [
            // Deprecated interfaces in v4.0.0
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\AsyncNodeRunnerInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\AsyncNodeRunnerProcessorInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\CronSchedulesModelInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\DataTypeInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\InputValidatorsInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\ModelInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\NodeInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\NodeRunnerInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\NodeRunnerMapperInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\NodeRunnerProcessorInterface',
            'PublishPress\\FuturePro\\Modules\\Workflows\\Interfaces\\NodeTriggerRunnerInterface',
        ];

        foreach ($interfaces as $interface) {
            $this->assertTrue(interface_exists($interface), "Interface $interface does not exist");
        }
    }
}
