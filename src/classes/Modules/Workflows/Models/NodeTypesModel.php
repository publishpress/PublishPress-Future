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
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\RayDebug;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Flows\CoreSchedule;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnAdminInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostUpdated;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;

class NodeTypesModel implements NodeTypesModelInterface
{
    public const NODE_TYPE_ACTION = "action";

    public const NODE_TYPE_TRIGGER = "trigger";

    public const NODE_TYPE_FLOW = "flow";

    public const NODE_VERSION = "1";

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
                    "className" => $instance->getCSSClass(),
                    "version" => $instance->getVersion(),
                    "outputSchema" => $instance->getOutputSchema(),
                    "socketSchema" => $instance->getSocketSchema(),
                ],
                $type
            );
        }

        return $instancesCopy;
    }

    private function getDefaultTriggers()
    {
        $triggersInstances = [
            CoreOnSavePost::NODE_NAME => new CoreOnSavePost(),
            CoreOnPostUpdated::NODE_NAME => new CoreOnPostUpdated(),
            CoreOnInit::NODE_NAME => new CoreOnInit(),
            CoreOnAdminInit::NODE_NAME => new CoreOnAdminInit(),
            FutureLegacyAction::NODE_NAME => new FutureLegacyAction($this->hooks),
        ];

        return $triggersInstances;
    }

    private function getDefaultActions()
    {
        $actionsInstances = [
            CorePostDelete::NODE_NAME => new CorePostDelete(),
            CorePostStick::NODE_NAME => new CorePostStick(),
            CorePostUnstick::NODE_NAME => new CorePostUnstick(),
            CorePostTermsAdd::NODE_NAME => new CorePostTermsAdd(),
            CorePostTermsSet::NODE_NAME => new CorePostTermsSet(),
            CorePostTermsRemove::NODE_NAME => new CorePostTermsRemove(),
            CorePostChangeStatus::NODE_NAME => new CorePostChangeStatus(),
        ];

        if (function_exists('ray')) {
            $actionsInstances[RayDebug::NODE_NAME] = new RayDebug();
        }

        return $actionsInstances;
    }

    private function getDefaultFlows()
    {
        $flowsInstances = [
            // IfElse::NODE_NAME => new IfElse(),
            CoreSchedule::NODE_NAME => new CoreSchedule(),
        ];

        return $flowsInstances;
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

    public function getTriggers(): array
    {
        if (!empty($this->triggers)) {
            return $this->triggers;
        }

        $this->triggers = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_TRIGGERS,
            $this->getDefaultTriggers()
        );

        return $this->triggers;
    }

    public function getActions(): array
    {
        if (!empty($this->actions)) {
            return $this->actions;
        }

        $this->actions = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ACTIONS,
            $this->getDefaultActions()
        );

        return $this->actions;
    }

    public function getFlows(): array
    {
        if (!empty($this->flows)) {
            return $this->flows;
        }

        $this->flows = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_FLOWS,
            $this->getDefaultFlows()
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
