<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class RayDebug implements NodeTypeInterface
{
    public function getType(): string
    {
        return "genericAction";
    }

    public function getName(): string
    {
        return "ray/debug";
    }

    public function getLabel(): string
    {
        return __("Ray - Debug", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action sends the flow data to Ray.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "fa6-fabug";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "debug";
    }

    public function getSettingsSchema(): array
    {
        return [];
    }

    public function getOutputSchema(): array
    {
        return [];
    }
}
