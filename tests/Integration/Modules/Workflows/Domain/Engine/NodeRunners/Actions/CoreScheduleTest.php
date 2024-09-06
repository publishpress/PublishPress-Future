<?php

namespace Tests\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced\CoreSchedule;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Models\PostModel;


class CoreScheduleTest extends \lucatume\WPBrowser\TestCase\WPTestCase
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

    public function testSetupSchedulesCronTask(): void
    {
        $postId = wp_insert_post([
            'post_title' => 'Test post',
            'post_content' => 'Test content',
            'post_status' => 'publish',
            'post_type' => 'post'
        ]);

        $runner = new CoreSchedule(
            $this->makeEmpty(
                AsyncNodeRunnerProcessorInterface::class,
                [
                    'getVariableValueFromContextVariables' => new WorkflowResolver(['id' => 0])
                ]
            )
        );

        $step = [
            "id" => "n1717542946349",
            "type" => "generic",
            "position" => [
                "x" => 20,
                "y" => 20
            ],
            "data" => [
                "name" => "advanced\/core.schedule",
                "elementaryType" => "advanced",
                "version" => 1,
                "slug" => "schedule1",
                "settings" => [
                    "schedule" => [
                        "whenToRun" => "offset",
                        "dateSource" => "onSavePost1.post.post_date",
                        "recurrence" => "single",
                        "repeatUntil" => "forever",
                        "repeatInterval" => "3600",
                        "repeatTimes" => "5",
                        "repeatUntilDate" => "2024-06-11T23 =>16 =>24.422Z",
                        "unique" => true,
                        "priority" => "10",
                        "specificDate" => "2024-06-07T23 =>16 =>24.422Z",
                        "dateOffset" => "+15 days"
                    ]
                ]
            ],
            "width" => 140,
            "height" => 65,
            "selected" => false,
            "positionAbsolute" => [
                "x" => 20,
                "y" => 20
            ],
            "dragging" => false,
            "targetPosition" => "top",
            "sourcePosition" => "bottom",
            "x" => 12,
            "y" => 132,
        ];

        $runner->setup(
            $step,

            [
                'post' => [
                    'variable' => 'onManualEnableForPost1.post',
                ],
                'workflow' => [
                    'variable' => 'global.workflow',
                ],
                'status' => [
                    'variable' => 'disable',
                ],
            ],
            [],
            [
                'global.workflow' => new WorkflowResolver(['id' => 0]),
            ]
        );
    }
}
