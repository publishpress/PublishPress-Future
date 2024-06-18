<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreSchedule implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/core.schedule";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_ADVANCED;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "schedule";
    }

    public function getLabel(): string
    {
        return __("Schedule", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __(
            "This step facilitates action scheduling, allowing configuration of specific or relative future dates, recurrence, and execution limits.", // phpcs:ignore Generic.Files.LineLength.TooLong
            "publishpress-future-pro"
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
                "label" => __("Schedule", "publishpress-future-pro"),
                "description" => __("The scheduled time for this action.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "schedule",
                        "type" => "dateOffset",
                        "label" => __("Date offset", "publishpress-future-pro"),
                    ],
                ],
                "settings" => [
                    "allowRecurrence" => true,
                ]
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
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Step input", "publishpress-future-pro"),
                "description" => __("The input data for this step.", "publishpress-future-pro"),
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
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
