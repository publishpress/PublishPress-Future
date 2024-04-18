<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreUpdatePost implements NodeTypeInterface
{
    public function getType(): string
    {
        return "genericAction";
    }

    public function getName(): string
    {
        return "core/update-post";
    }

    public function getLabel(): string
    {
        return __("Update Post", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action updates a post.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "media-document";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "post";
    }

    public function getSettingsSchema(): array
    {
        return [];
    }
}
