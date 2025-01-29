<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class ScheduleDelay implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/core.schedule";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_ADVANCED;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "scheduleDelay";
    }

    public function getLabel(): string
    {
        return __("Schedule delay", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step allows you to run the next part of a workflow at a specific time, or relative to another date. You can also use this step to repeat the next part of the workflow.", // phpcs:ignore Generic.Files.LineLength.TooLong
            "post-expirator"
        );
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
                "label" => __("Schedule", "post-expirator"),
                "description" => __("A scheduled delay between steps.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "schedule",
                        "type" => "dateOffset",
                        "label" => __("Date offset", "post-expirator"),
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
                        "rule" => "hasIncomingConnection",
                    ],
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ],
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "validExpression",
                        "field" => "schedule.uniqueIdExpression.expression",
                        "label" => __("Unique ID Expression", "post-expirator"),
                        "fieldLabel" => __("Schedule > Unique ID Expression", "post-expirator"),
                    ],
                ],
            ],
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Step input", "post-expirator"),
                "description" => __("The input data for this step.", "post-expirator"),
            ],
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAdvanced";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [
                [
                    "id" => "input",
                    "left" => "50%",
                ]
            ],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "post-expirator"),
                ]
            ]
        ];
    }

    public function isProFeature(): bool
    {
        return false;
    }
}
