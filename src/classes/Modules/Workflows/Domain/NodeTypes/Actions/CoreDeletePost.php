<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreDeletePost implements NodeTypeInterface
{
    public function getType(): string
    {
        return "genericAction";
    }

    public function getName(): string
    {
        return "core/delete-post";
    }

    public function getLabel(): string
    {
        return __("Delete Post", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action deletes a post.", "publishpress-future-pro");
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

    public function getOutputSchema(): array
    {
        return [];
    }
}
