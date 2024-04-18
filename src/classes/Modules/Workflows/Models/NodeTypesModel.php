<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CoreDeletePost;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CoreUpdatePost;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows\IfElse;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;

class NodeTypesModel implements NodeTypesModelInterface
{
    public const NODE_TYPE_ACTION = "action";

    public const NODE_TYPE_TRIGGER = "trigger";

    public const NODE_TYPE_FLOW = "flow";

    public const DEFAULT_ICON_BACKGROUND = "#ffffff";

    public const DEFAULT_ICON_FOREGROUND = "#1e1e1e";

    private $hooks;

    private $categories = [];

    private $triggers = [];

    private $actions = [];

    private $flows = [];

    public function __construct(HooksFacade $hooks)
    {
        $this->hooks = $hooks;
    }

    private function getDefaultCategories()
    {
        return [
            [
                "name" => "post",
                "label" => __("Post", "publishpress-future-pro"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "conditional",
                "label" => __("Conditional", "publishpress-future-pro"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
        ];
    }

    private function convertInstancesToArray($instances): array
    {
        return array_map(function ($instance) {
            return [
                "type" => $instance->getType(),
                "name" => $instance->getName(),
                "label" => $instance->getLabel(),
                "description" => $instance->getDescription(),
                "category" => $instance->getCategory(),
                "frecency" => $instance->getFrecency(),
                "icon" => [
                    "src" => $instance->getIcon(),
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
                "settingsSchema" => $instance->getSettingsSchema(),
            ];
        }, $instances);
    }

    private function getDefaultTriggers()
    {
        $triggersInstances = [new CoreOnSavePost()];

        return $this->convertInstancesToArray($triggersInstances);
    }

    private function getDefaultActions()
    {
        $actionsInstances = [new CoreDeletePost(), new CoreUpdatePost()];

        return $this->convertInstancesToArray($actionsInstances);
    }

    private function getDefaultFlows()
    {
        $flowsInstances = [new IfElse()];

        return $this->convertInstancesToArray($flowsInstances);
    }

    private function applyDefaultParams(array $nodes, string $type): array
    {
        $normalized = [];

        $defaultNodeAttributes = [
            "id" => "",
            "type" => $type,
            "name" => "",
            "label" => "",
            "description" => "",
            "initiatlAttributes" => [],
            "category" => "",
            "disabled" => false,
            "isDisabled" => false,
            "frecency" => 1,
            "icon" => [
                "src" => "media-document",
                "background" => "#ffffff",
                "foreground" => "#1e1e1e",
            ],
            "version" => "1",
            "settingsSchema" => [],
        ];

        foreach ($nodes as $index => $node) {
            $normalized[] = array_merge($defaultNodeAttributes, $node);
        }

        return $normalized;
    }

    public function getTriggers(): array
    {
        if (!empty($this->triggers)) {
            return $this->triggers;
        }

        $this->triggers = $this->applyDefaultParams(
            $this->hooks->applyFilters(
                HooksAbstract::FILTER_WORKFLOW_TRIGGERS,
                $this->getDefaultTriggers()
            ),
            self::NODE_TYPE_TRIGGER
        );

        return $this->triggers;
    }

    public function getActions(): array
    {
        if (!empty($this->actions)) {
            return $this->actions;
        }

        $this->actions = $this->applyDefaultParams(
            $this->hooks->applyFilters(
                HooksAbstract::FILTER_WORKFLOW_ACTIONS,
                $this->getDefaultActions()
            ),
            self::NODE_TYPE_ACTION
        );

        return $this->actions;
    }

    public function getFlows(): array
    {
        if (!empty($this->flows)) {
            return $this->flows;
        }

        $this->flows = $this->applyDefaultParams(
            $this->hooks->applyFilters(
                HooksAbstract::FILTER_WORKFLOW_FLOWS,
                $this->getDefaultFlows()
            ),
            self::NODE_TYPE_FLOW
        );

        return $this->flows;
    }

    public function getCategories(): array
    {
        if (!empty($this->categories)) {
            return $this->categories;
        }

        $this->categories = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_NODE_CATEGORIES,
            $this->getDefaultCategories()
        );

        return $this->categories;
    }
}
