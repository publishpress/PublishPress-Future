<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreOnAdminInit implements NodeTypeInterface
{
    const NODE_NAME = "trigger/core.admin-init";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getType(): string
    {
        return "genericTrigger";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getLabel(): string
    {
        return __("On Admin Init", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger is fired when the admin is initialized.", "publishpress-future-pro");
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
}
