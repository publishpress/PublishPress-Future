<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class IfElse implements NodeTypeInterface
{
    const NODE_NAME = "flow/core.if-else";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_FLOW;
    }

    public function getType(): string
    {
        return "flowIfElse";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
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

    public function getOutputSchema(): array
    {
        return [];
    }
}
