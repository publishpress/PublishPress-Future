<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnCustomAction implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.custom-action";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "onCustomAction";
    }

    public function getLabel(): string
    {
        return __("On custom action", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates upon a custom WordPress action hook. Use it to integrate with other plugins or custom code.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "action";
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
        return "site";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Action", "post-expirator"),
                "description" => __(
                    "Specify the hook that will trigger this action.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "hook",
                        "type" => "text",
                        "label" => __("Hook", "post-expirator"),
                        "description" => __(
                            "The hook that will trigger this action.",
                            "post-expirator"
                        ),
                        "default" => "",
                    ],
                    [
                        "name" => "args",
                        "type" => "actionArgs",
                        "label" => __("Action arguments", "post-expirator"),
                        "description" => __(
                            "The arguments to pass to the action. These arguments will be available as variables in subsequent workflow steps.",
                            "post-expirator"
                        ),
                        "default" => [],
                    ],
                ]
            ]
        ];
    }

    public function getValidationSchema(): array
    {
        return [
            "connections" => [
                "rules" => [
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "dataType",
                        "type" => "nameValuePairList",
                        "field" => "args",
                        "label" => __("Action arguments", "post-expirator"),
                    ],
                ]
            ]
        ];
    }

    public function getStepScopedVariablesSchema(): array
    {
        return [];
    }

    public function getOutputSchema(): array
    {
        return [];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "label" => __("Next", "post-expirator"),
                ]
            ]
        ];
    }

    public function isProFeature(): bool
    {
        return true;
    }
}
