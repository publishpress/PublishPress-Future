<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;

class CoreSchedule implements NodeTypeInterface
{
    public function getType(): string
    {
        return "genericAction";
    }

    public function getName(): string
    {
        return "core/schedule";
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

    public function getCategory(): string
    {
        return "async";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Schedule", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "schedule",
                        "type" => "date_offset",
                        "label" => __("Date offset", "publishpress-future-pro"),
                        "description" => __("The scheduled time for this action.", "publishpress-future-pro"),
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
}
