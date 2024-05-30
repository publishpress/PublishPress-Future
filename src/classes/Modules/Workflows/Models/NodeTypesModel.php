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
                    "src" => "fa6-fabug",
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
            $instance = $this->applyDefaultParams(
                [
                    "type" => $instance->getType(),
                    "elementarType" => $instance->getElementarType(),
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
                    "validationSchema" => $instance->getValidationSchema(),
                    "className" => $instance->getCSSClass(),
                    "version" => $instance->getVersion(),
                    "outputSchema" => $instance->getOutputSchema(),
                    "socketSchema" => $instance->getSocketSchema(),
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
            CoreOnSavePost::NODE_NAME => new CoreOnSavePost(),
            CoreOnPostUpdated::NODE_NAME => new CoreOnPostUpdated(),
            CoreOnManuallyEnabledForPost::NODE_NAME => new CoreOnManuallyEnabledForPost(),
            FutureLegacyAction::NODE_NAME => new FutureLegacyAction($this->hooks),
        ];

        return $nodesInstances;
    }

    private function getDefaultActionNodes()
    {
        $nodesInstances = [
            CorePostDelete::NODE_NAME => new CorePostDelete(),
            CorePostStick::NODE_NAME => new CorePostStick(),
            CorePostUnstick::NODE_NAME => new CorePostUnstick(),
            CorePostTermsAdd::NODE_NAME => new CorePostTermsAdd(),
            CorePostTermsSet::NODE_NAME => new CorePostTermsSet(),
            CorePostTermsRemove::NODE_NAME => new CorePostTermsRemove(),
            CorePostChangeStatus::NODE_NAME => new CorePostChangeStatus(),
            CoreSendEmail::NODE_NAME => new CoreSendEmail(),
        ];

        return $nodesInstances;
    }

    private function getDefaultAdvancedNodes()
    {
        $nodesInstances = [
            CoreSchedule::NODE_NAME => new CoreSchedule(),
            CorePostQuery::NODE_NAME => new CorePostQuery(),
        ];

        if (function_exists('ray')) {
            $nodesInstances[RayDebug::NODE_NAME] = new RayDebug();
        }

        return $nodesInstances;
    }

    private function applyDefaultParams(array $node, string $type): array
    {
        $normalized = [];

        $defaultNodeAttributes = [
            "id" => "",
            "type" => $type,
            "elementarType" => "",
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
            "version" => self::NODE_VERSION,
            "settingsSchema" => [],
            "outputSchema" => [],
            "className" => "react-flow__node-genericNode",
            "socketSchema" => [],
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
            $indexed[$nodeType->getName()] = $nodeType;
        }

        return $indexed;
    }

    public function getNodeType(string $name): ?NodeTypeInterface
    {
        $nodes = $this->getAllNodeTypesIndexedByName();

        return $nodes[$name] ?? null;
    }
}
