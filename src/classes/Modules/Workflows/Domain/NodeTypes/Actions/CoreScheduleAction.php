<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreScheduleAction implements NodeTypeInterface
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
        return __("This action schedules another action.", "publishpress-future-pro");
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
        return "post";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Post Query", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "post_query",
                        "type" => "post_query",
                        "label" => __("Post query", "publishpress-future-pro"),
                        "description" => __(
                            "The query defines the posts that will trigger this action.",
                            "publishpress-future-pro"
                        ),
                    ],
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
    }
}
