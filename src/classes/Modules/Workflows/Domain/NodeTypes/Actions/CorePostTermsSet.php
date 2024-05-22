<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CorePostTermsSet implements NodeTypeInterface
{
    const NODE_NAME = "action/core.replace-post-terms";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_ACTION;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getBaseSlug(): string
    {
        return "replacePostTerms";
    }

    public function getLabel(): string
    {
        return __("Replace all terms to post", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action replaces all terms to posts.", "publishpress-future-pro");
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
                "label" => __("Post", "publishpress-future-pro"),
                "description" => __("The post to update.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "post",
                        "type" => "postInput",
                        "label" => __("Post", "publishpress-future-pro"),
                        "description" => __("Select the variable that contains the post to update. It can be a post instance or the post ID.", "publishpress-future-pro"),
                    ],
                ],
            ],
            [
                "label" => __("New terms", "publishpress-future-pro"),
                "description" => __("The terms that will be added to the posts after removing all the others.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "taxonomyTerms",
                        "type" => "taxonomyTerms",
                        "label" => __("Terms", "publishpress-future-pro"),
                        "description" => __("The terms that will be added to the posts.", "publishpress-future-pro"),
                    ],
                ]
            ],
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Node input", "publishpress-future-pro"),
                "description" => __("The input data for this node.", "publishpress-future-pro"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAction";
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
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
