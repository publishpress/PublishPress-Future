<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreOnSavePost implements NodeTypeInterface
{
    public function getType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getName(): string
    {
        return "core/save-post";
    }

    public function getLabel(): string
    {
        return __("Post is saved", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "document";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "post";
    }
}
