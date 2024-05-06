<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreSchedule implements NodeTypeInterface
{
    const NODE_NAME = "flow/core.schedule";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_FLOW;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getLabel(): string
    {
        return __("Schedule", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This flow allows you to schedule an action.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "media-document";
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
            ],
            [
                "label" => __("Recurrence", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "recurrence",
                        "type" => "recurrence",
                        "label" => __("Recurrence", "publishpress-future-pro"),
                        "description" => __("The recurrence for this action.", "publishpress-future-pro"),
                    ],
                ],
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericFlow";
    }

    public function getSocketSchema(): array
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
                ]
            ]
        ];
    }
}
