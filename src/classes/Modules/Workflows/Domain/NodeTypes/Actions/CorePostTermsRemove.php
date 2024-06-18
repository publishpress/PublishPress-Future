<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CorePostTermsRemove implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.remove-post-terms";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_ACTION;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "removePostTerms";
    }

    public function getLabel(): string
    {
        return __("Remove terms from the post", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action removes current taxonomy terms.", "publishpress-future-pro");
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
                        "description" => __(
                            "Select the variable that contains the post to update. It can be a post instance or the post ID.", // phpcs:ignore Generic.Files.LineLength.TooLong
                            "publishpress-future-pro"
                        ),
                    ],
                ],
            ],
            [
                "label" => __("Terms to remove", "publishpress-future-pro"),
                "description" => __("The terms that will be removed from the posts.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "taxonomyTerms",
                        "type" => "taxonomyTerms",
                        "label" => __("Terms", "publishpress-future-pro"),
                        "description" => __(
                            "The terms that will be removed from the posts.",
                            "publishpress-future-pro"
                        ),
                        "settings" => [
                            "optionToSelectAll" => true,
                            "labelOptionToSelectAll" => __("Remove all terms", "publishpress-future-pro"),
                        ],
                    ],
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
                ],
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "post.variable",
                    ],
                    [
                        "rule" => "required",
                        "field" => "taxonomyTerms.terms",
                        "label" => __("Terms", "publishpress-future-pro"),
                    ]
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
                "label" => __("Step input", "publishpress-future-pro"),
                "description" => __("The input data for this step.", "publishpress-future-pro"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAction";
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
