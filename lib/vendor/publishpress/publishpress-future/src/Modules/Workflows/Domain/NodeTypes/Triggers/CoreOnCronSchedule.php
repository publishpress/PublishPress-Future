<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CoreOnCronSchedule implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.cron-schedule";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "onCronSchedule";
    }

    public function getLabel(): string
    {
        return __("On cron schedule", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger activates upon a cron schedule, allowing recurrency.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "schedule";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getVersion(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "async";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Schedule", "publishpress-future-pro"),
                "description" => __("A schedule to activate the workflow.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "schedule",
                        "type" => "dateOffset",
                        "label" => __("Date offset", "publishpress-future-pro"),
                        "settings" => [
                            "hideDateSources" => [
                                "event",
                                "step",
                                "global.user.user_registered",
                            ],
                            "hidePreventDuplicateScheduling" => true,
                        ]
                    ],
                ],
            ],
        ];
    }

    public function getValidationSchema(): array
    {
        return [
            "connections" => [
                "rules" => [
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
