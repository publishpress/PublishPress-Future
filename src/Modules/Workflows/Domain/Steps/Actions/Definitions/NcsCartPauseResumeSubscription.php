<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class NcsCartPauseResumeSubscription implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.ncscart-subscription-pause-resume";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_ACTION;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "ncsCartPauseResumeSubscription";
    }

    public function getLabel(): string
    {
        return __("Pause or resume Cart subscription", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step pauses or resumes a PublishPress Cart subscription.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "cart";
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
        return "publishpress-cart";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Subscription", "post-expirator"),
                "description" => __("The subscription to pause or resume.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "subscriptionId",
                        "type" => "expression",
                        "label" => __("Subscription ID", "post-expirator"),
                        "description" => __("The ID of the Cart subscription.", "post-expirator"),
                    ],
                    [
                        "name" => "action",
                        "type" => "select",
                        "label" => __("Action", "post-expirator"),
                        "settings" => [
                            "options" => [
                                ["value" => "pause", "label" => __("Pause", "post-expirator")],
                                ["value" => "resume", "label" => __("Resume", "post-expirator")],
                            ],
                        ],
                        "default" => "pause",
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
                    ["rule" => "hasIncomingConnection"],
                ],
            ],
            "settings" => [
                "rules" => [
                    ["rule" => "required", "field" => "subscriptionId"],
                ],
            ],
        ];
    }

    public function getStepScopedVariablesSchema(): array
    {
        return [];
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
        return "react-flow__node-genericAction";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [["id" => "input"]],
            "source" => [["id" => "output", "label" => __("Next", "post-expirator")]],
        ];
    }

    public function isProFeature(): bool
    {
        return false;
    }
}
