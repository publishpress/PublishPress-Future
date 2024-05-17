<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CorePostTermsAdd implements NodeTypeInterface
{
    const NODE_NAME = "action/core.add-post-terms";

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

    public function getLabel(): string
    {
        return __("Add extra terms to post", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action adds extra terms to posts.", "publishpress-future-pro");
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
                "label" => __("Extra terms", "publishpress-future-pro"),
                "description" => __("The terms that will be added to the posts.", "publishpress-future-pro"),
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
