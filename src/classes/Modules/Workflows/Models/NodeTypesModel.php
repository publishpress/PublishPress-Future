<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeStatus;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsAdd;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDelete;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsRemove;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsSet;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostStick;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostUnstick;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\CorePostQuery;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\RayDebug;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostUpdated;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;

class NodeTypesModel implements NodeTypesModelInterface
{
    public const NODE_TYPE_ACTION = "action";

    public const NODE_TYPE_TRIGGER = "trigger";

    public const NODE_TYPE_ADVANCED = "advanced";

    public const NODE_VERSION = "1";

    public const DEFAULT_ICON_BACKGROUND = "#ffffff";

    public const DEFAULT_ICON_FOREGROUND = "#1e1e1e";

    private $hooks;

    private $categories = [];

    private $triggerNodes = [];

    private $actionNodes = [];

    private $advancedNodes = [];

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
                "name" => "future",
                "label" => __("PublishPress Future", "publishpress-future-pro"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "site",
                "label" => __("Site", "publishpress-future-pro"),
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
            [
                "name" => "async",
                "label" => __("Asynchronous", "publishpress-future-pro"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "debug",
                "label" => __("Debug", "publishpress-future-pro"),
                "icon" => [
                    "src" => "debug",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "db-query",
                "label" => __("Data Query", "publishpress-future-pro"),
                "icon" => [
                    "src" => "db-query",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "messages",
                "label" => __("Messages", "publishpress-future-pro"),
                "icon" => [
                    "src" => "messages",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],

            ]
        ];
    }

    public function convertInstancesToArray($instances, $type): array
    {
        $instancesCopy = $instances;

        foreach ($instancesCopy as &$instance) {
            $instanceClass = get_class($instance);

            $instance = $this->applyDefaultParams(
                [
                    "type" => $instance->getReactFlowNodeType(),
                    "elementaryType" => $instance->getElementaryType(),
                    "name" => $instanceClass::getNodeTypeName(),
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
                    "validationSchema" => $instance->getValidationSchema(),
                    "className" => $instance->getCSSClass(),
                    "version" => $instance->getVersion(),
                    "outputSchema" => $instance->getOutputSchema(),
                    "handleSchema" => $instance->getHandleSchema(),
                    "baseSlug" => $instance->getBaseSlug(),
                ],
                $type
            );
        }

        return $instancesCopy;
    }

    private function getDefaultTriggerNodes()
    {
        $nodesInstances = [
            CoreOnSavePost::getNodeTypeName() => new CoreOnSavePost(),
            CoreOnPostUpdated::getNodeTypeName() => new CoreOnPostUpdated(),
            CoreOnManuallyEnabledForPost::getNodeTypeName() => new CoreOnManuallyEnabledForPost(),
            FutureLegacyAction::getNodeTypeName() => new FutureLegacyAction($this->hooks),
        ];

        return $nodesInstances;
    }

    private function getDefaultActionNodes()
    {
        $nodesInstances = [
            CorePostDelete::getNodeTypeName() => new CorePostDelete(),
            CorePostStick::getNodeTypeName() => new CorePostStick(),
            CorePostUnstick::getNodeTypeName() => new CorePostUnstick(),
            CorePostTermsAdd::getNodeTypeName() => new CorePostTermsAdd(),
            CorePostTermsSet::getNodeTypeName() => new CorePostTermsSet(),
            CorePostTermsRemove::getNodeTypeName() => new CorePostTermsRemove(),
            CorePostChangeStatus::getNodeTypeName() => new CorePostChangeStatus(),
            CoreSendEmail::getNodeTypeName() => new CoreSendEmail(),
        ];

        return $nodesInstances;
    }

    private function getDefaultAdvancedNodes()
    {
        $nodesInstances = [
            CoreSchedule::getNodeTypeName() => new CoreSchedule(),
            CorePostQuery::getNodeTypeName() => new CorePostQuery(),
        ];

        if (function_exists('ray')) {
            $nodesInstances[RayDebug::getNodeTypeName()] = new RayDebug();
        }

        return $nodesInstances;
    }

    private function applyDefaultParams(array $node, string $type): array
    {
        $normalized = [];

        $defaultNodeAttributes = [
            "id" => "",
            "type" => $type,
            "elementaryType" => "",
            "name" => "",
            "label" => "",
            "description" => "",
            "baseSlug" => "node",
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
            "version" => self::NODE_VERSION,
            "settingsSchema" => [],
            "outputSchema" => [],
            "className" => "react-flow__node-genericNode",
            "handleSchema" => [],
        ];

        return array_merge($defaultNodeAttributes, $node);
    }

    public function getTriggerNodes(): array
    {
        if (!empty($this->triggerNodes)) {
            return $this->triggerNodes;
        }

        $this->triggerNodes = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_TRIGGER_NODES,
            $this->getDefaultTriggerNodes()
        );

        return $this->triggerNodes;
    }

    public function getActionNodes(): array
    {
        if (!empty($this->actionNodes)) {
            return $this->actionNodes;
        }

        $this->actionNodes = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ACTION_NODES,
            $this->getDefaultActionNodes()
        );

        return $this->actionNodes;
    }

    public function getAdvancedNodes(): array
    {
        if (!empty($this->advancedNodes)) {
            return $this->advancedNodes;
        }

        $this->advancedNodes = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ADVANCED_NODES,
            $this->getDefaultAdvancedNodes()
        );

        return $this->advancedNodes;
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

    public function getAllNodeTypesIndexedByName(): array
    {
        $nodeTypes = array_merge(
            $this->getTriggerNodes(),
            $this->getActionNodes(),
            $this->getAdvancedNodes()
        );

        $indexed = [];

        foreach ($nodeTypes as $nodeType) {
            $nodeTypeClass = get_class($nodeType);
            $indexed[$nodeTypeClass::getNodeTypeName()] = $nodeType;
        }

        return $indexed;
    }

    public function getNodeType(string $name): ?NodeTypeInterface
    {
        $nodes = $this->getAllNodeTypesIndexedByName();

        return $nodes[$name] ?? null;
    }

    public function getStrings(): array
    {
        $nodeTypes = $this->getAllNodeTypesIndexedByName();

        $strings = [];
        foreach ($nodeTypes as $nodeType) {
            $nodeTypeClass = get_class($nodeType);

            $strings[$nodeTypeClass::getNodeTypeName()] = [
                'label' => $nodeType->getLabel(),
                'description' => $nodeType->getDescription(),
            ];
        }

        return $strings;
    }
}
