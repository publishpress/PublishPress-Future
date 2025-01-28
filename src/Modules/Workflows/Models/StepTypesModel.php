<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypesModelInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDeactivateWorkflow;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeStatus;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsAdd;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDelete;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsRemove;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsSet;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostStick;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostUnstick;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CorePostQuery;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\RayDebug;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\ConditionalSplit;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\LogAdd;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnAdminInit;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnCronSchedule;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnInit;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostMetaChanged;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostPublished;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostStatusChanged;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostUpdated;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostScheduled;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostMetaAdd;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostMetaDelete;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostMetaUpdate;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;

class StepTypesModel implements StepTypesModelInterface
{
    public const STEP_TYPE_ACTION = "action";

    public const STEP_TYPE_TRIGGER = "trigger";

    public const STEP_TYPE_ADVANCED = "advanced";

    public const STEP_VERSION = "1";

    public const DEFAULT_ICON_BACKGROUND = "#ffffff";

    public const DEFAULT_ICON_FOREGROUND = "#1e1e1e";

    private $hooks;

    private $categories = [];

    private $triggerSteps = [];

    private $actionSteps = [];

    private $advancedSteps = [];

    /**
     * @var SettingsFacade
     */
    private $settingsFacade;

    public function __construct(HooksFacade $hooks, SettingsFacade $settingsFacade)
    {
        $this->hooks = $hooks;
        $this->settingsFacade = $settingsFacade;
    }

    private function getDefaultCategories()
    {
        return [
            [
                "name" => "post",
                "label" => __("Post", "post-expirator"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "future",
                "label" => __("PublishPress Future", "post-expirator"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "site",
                "label" => __("Site", "post-expirator"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "flow",
                "label" => __("Flow Control", "post-expirator"),
                "icon" => [
                    "src" => "route",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "async",
                "label" => __("Asynchronous", "post-expirator"),
                "icon" => [
                    "src" => "media-document",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "debug",
                "label" => __("Debug", "post-expirator"),
                "icon" => [
                    "src" => "debug",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "db-query",
                "label" => __("Data Query", "post-expirator"),
                "icon" => [
                    "src" => "db-query",
                    "background" => self::DEFAULT_ICON_BACKGROUND,
                    "foreground" => self::DEFAULT_ICON_FOREGROUND,
                ],
            ],
            [
                "name" => "messages",
                "label" => __("Messages", "post-expirator"),
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

        /**
         * @var StepTypeInterface $instance
         */
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
                    "isProFeature" => $instance->isProFeature(),
                ],
                $type
            );
        }

        return $instancesCopy;
    }

    private function getDefaultTriggerSteps()
    {
        $nodesInstances = [
            CoreOnSavePost::getNodeTypeName() => new CoreOnSavePost(),
            CoreOnPostUpdated::getNodeTypeName() => new CoreOnPostUpdated(),
            CoreOnPostPublished::getNodeTypeName() => new CoreOnPostPublished(),
            CoreOnPostScheduled::getNodeTypeName() => new CoreOnPostScheduled(),
            CoreOnPostStatusChanged::getNodeTypeName() => new CoreOnPostStatusChanged(),
            CoreOnManuallyEnabledForPost::getNodeTypeName() => new CoreOnManuallyEnabledForPost(),
            FutureLegacyAction::getNodeTypeName() => new FutureLegacyAction($this->hooks),
            CoreOnCronSchedule::getNodeTypeName() => new CoreOnCronSchedule(),
            CoreOnPostMetaChanged::getNodeTypeName() => new CoreOnPostMetaChanged(),
        ];

        if ($this->settingsFacade->getExperimentalFeaturesStatus()) {
            $nodesInstances[CoreOnInit::getNodeTypeName()] = new CoreOnInit();
            $nodesInstances[CoreOnAdminInit::getNodeTypeName()] = new CoreOnAdminInit();
        }

        return $nodesInstances;
    }

    private function getDefaultActionSteps()
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
            CorePostDeactivateWorkflow::getNodeTypeName() => new CorePostDeactivateWorkflow(),
            CorePostMetaAdd::getNodeTypeName() => new CorePostMetaAdd(),
            CorePostMetaDelete::getNodeTypeName() => new CorePostMetaDelete(),
            CorePostMetaUpdate::getNodeTypeName() => new CorePostMetaUpdate(),
        ];

        return $nodesInstances;
    }

    private function getDefaultAdvancedSteps()
    {
        $nodesInstances = [
            CoreSchedule::getNodeTypeName() => new CoreSchedule(),
            CorePostQuery::getNodeTypeName() => new CorePostQuery(),
            ConditionalSplit::getNodeTypeName() => new ConditionalSplit(),
            LogAdd::getNodeTypeName() => new LogAdd(),
        ];

        if (function_exists('ray')) {
            $nodesInstances[RayDebug::getNodeTypeName()] = new RayDebug();
        }

        return $nodesInstances;
    }

    private function applyDefaultParams(array $step, string $type): array
    {
        $normalized = [];

        $defaultStepAttributes = [
            "id" => "",
            "type" => $type,
            "elementaryType" => "",
            "name" => "",
            "label" => "",
            "description" => "",
            "baseSlug" => "step",
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
            "version" => self::STEP_VERSION,
            "settingsSchema" => [],
            "outputSchema" => [],
            "className" => "react-flow__node-genericNode",
            "handleSchema" => [],
            "isProFeature" => false,
        ];

        return array_merge($defaultStepAttributes, $step);
    }

    public function getTriggerSteps(): array
    {
        if (!empty($this->triggerSteps)) {
            return $this->triggerSteps;
        }

        $this->triggerSteps = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_TRIGGER_STEPS,
            $this->getDefaultTriggerSteps()
        );

        /** @deprecated 4.3.1 */
        $this->triggerSteps = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_TRIGGER_NODES,
            $this->triggerSteps
        );


        return $this->triggerSteps;
    }

    public function getActionSteps(): array
    {
        if (!empty($this->actionSteps)) {
            return $this->actionSteps;
        }

        $this->actionSteps = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ACTION_STEPS,
            $this->getDefaultActionSteps()
        );

        /** @deprecated 4.3.1 */
        $this->actionSteps = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ACTION_NODES,
            $this->actionSteps
        );

        return $this->actionSteps;
    }

    public function getAdvancedSteps(): array
    {
        if (!empty($this->advancedSteps)) {
            return $this->advancedSteps;
        }


        $this->advancedSteps = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ADVANCED_STEPS,
            $this->getDefaultAdvancedSteps()
        );

        /** @deprecated 4.3.1 */
        $this->advancedSteps = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ADVANCED_NODES,
            $this->advancedSteps
        );

        return $this->advancedSteps;
    }

    public function getCategories(): array
    {
        if (!empty($this->categories)) {
            return $this->categories;
        }

        $this->categories = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_STEP_CATEGORIES,
            $this->getDefaultCategories()
        );

        /** @deprecated 4.3.1 */
        $this->categories = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_NODE_CATEGORIES,
            $this->categories
        );

        return $this->categories;
    }

    public function getAllStepTypesIndexedByName(): array
    {
        $nodeTypes = $this->getAllStepTypes();

        $indexed = [];

        foreach ($nodeTypes as $nodeType) {
            $nodeTypeClass = get_class($nodeType);
            $indexed[$nodeTypeClass::getNodeTypeName()] = $nodeType;
        }

        return $indexed;
    }

    public function getStepType(string $name): ?StepTypeInterface
    {
        $nodes = $this->getAllStepTypesIndexedByName();

        return $nodes[$name] ?? null;
    }

    public function getStrings(): array
    {
        $nodeTypes = $this->getAllStepTypesIndexedByName();

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

    public function getAllStepTypes(): array
    {
        return array_merge(
            $this->getTriggerSteps(),
            $this->getActionSteps(),
            $this->getAdvancedSteps()
        );
    }

    public function getAllStepTypesByType(): array
    {
        return [
            self::STEP_TYPE_ACTION => $this->getActionSteps(),
            self::STEP_TYPE_TRIGGER => $this->getTriggerSteps(),
            self::STEP_TYPE_ADVANCED => $this->getAdvancedSteps(),
        ];
    }
}
