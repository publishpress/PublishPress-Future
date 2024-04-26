<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreOnPostUpdated implements NodeTypeInterface
{
    const NODE_NAME = "trigger/core.post-updated";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
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
        return __("Post is updated", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger is fired when a post is updated.", "publishpress-future-pro");
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
        return "post";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Post Query", "publishpress-future-pro"),
                "description" => __("The query defines the posts that will trigger this action.", "publishpress-future-pro"),
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
        return [
            [
                'name' => 'postId',
                'type' => 'integer',
                'label' => __("Post ID", "publishpress-future-pro"),
                'description' => __("The post ID of the updated post.", "publishpress-future-pro"),
            ],
            [
                'name' => 'postBefore',
                'type' => 'post',
                'label' => __("Post Before", "publishpress-future-pro"),
                'description' => __("The post that was saved, with the old properties.", "publishpress-future-pro"),
            ],
            [
                'name' => 'postAfter',
                'type' => 'post',
                'label' => __("Post After", "publishpress-future-pro"),
                'description' => __("The post that was saved, with the new properties.", "publishpress-future-pro"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getSocketSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                ]
            ]
        ];
    }
}
