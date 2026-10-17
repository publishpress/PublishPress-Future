<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Domain\Steps\AbstractStepType;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnAdminInit extends AbstractStepType
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.admin-init";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_TRIGGER;
    }

    public function getBaseSlug(): string
    {
        return "onAdminInit";
    }

    public function getLabel(): string
    {
        return __("On admin init", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates upon the initialization of the admin site.", "post-expirator");
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
