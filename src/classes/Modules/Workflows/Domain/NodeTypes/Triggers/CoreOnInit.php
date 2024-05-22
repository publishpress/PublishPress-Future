<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreOnInit implements NodeTypeInterface
{
    const NODE_NAME = "trigger/core.init";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getType(): string
    {
        return "trigger";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getBaseSlug(): string
    {
        return "onInit";
    }

    public function getLabel(): string
    {
        return __("On Init", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger is fired when the site is initialized.", "publishpress-future-pro");
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
        return "site";
    }

    public function getSettingsSchema(): array
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

    public function getSocketSchema(): array
    {
        return [
            "target" => [],
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
