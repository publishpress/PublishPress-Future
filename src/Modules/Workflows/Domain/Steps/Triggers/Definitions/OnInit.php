<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Domain\Steps\AbstractStepType;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnInit extends AbstractStepType
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.init";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_TRIGGER;
    }

    public function getBaseSlug(): string
    {
        return "onInit";
    }

    public function getLabel(): string
    {
        return __("On site init", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates upon site initialization.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "website";
    }

    public function getCategory(): string
    {
        return "site";
    }

    public function getSettingsSchema(): array
    {
        return [];
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
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
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
