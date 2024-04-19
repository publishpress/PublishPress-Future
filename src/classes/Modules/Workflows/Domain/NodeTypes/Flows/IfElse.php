<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;

class IfElse implements NodeTypeInterface
{
    public function getType(): string
    {
        return "flowIfElse";
    }

    public function getName(): string
    {
        return "core/if-else";
    }

    public function getLabel(): string
    {
        return __("Condition", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This flow allows you to create a conditional branch.", "publishpress-future-pro");
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
        return "conditional";
    }

    public function getSettingsSchema(): array
    {
        return [];
    }
}
