<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Domain\LegacyAction\TriggerWorkflow;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;

class FutureLegacyAction implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/future.legacy-action";
    }

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;

        $this->hooks->addFilter(HooksAbstract::FILTER_EXPIRATION_ACTIONS, [$this, 'addExpirationAction']);
        $this->hooks->addFilter(
            HooksAbstract::FILTER_EXPIRATION_ACTION_FACTORY,
            [$this, 'createExpirationAction'],
            10,
            4
        );
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "futureLegacyAction";
    }

    public function getLabel(): string
    {
        return __("Manually enabled via Future Actions box", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger allows users to choose the workflow from the dropdown menu in the Future Actions options.",
            "post-expirator"
        );
    }

    public function getIcon(): string
    {
        return "media-document";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getVersion(): int
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

    public function getValidationSchema(): array
    {
        return [
            "connections" => [
                "rules" => [
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'post',
                'type' => 'post',
                'label' => __("Action Post", "post-expirator"),
                'description' => __("The post that was saved triggering the action.", "post-expirator"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "post-expirator"),
                ]
            ]
        ];
    }

    public function addExpirationAction(array $actions): array
    {
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithLegacyTriggerAsOptions();

        if (! empty($workflows)) {
            $actions[TriggerWorkflow::ACTION_NAME] = TriggerWorkflow::getLabel();
        }

        return $actions;
    }

    public function createExpirationAction($action, $actionName, $postModel, $container)
    {
        if ($actionName === TriggerWorkflow::ACTION_NAME) {
            $action = new TriggerWorkflow($this->hooks, $postModel, $container);
        }

        return $action;
    }

    public function isProFeature(): bool
    {
        return false;
    }
}
