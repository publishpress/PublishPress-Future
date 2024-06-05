<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Domain\LegacyAction\TriggerWorkflow;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class FutureLegacyAction implements NodeTypeInterface
{
    public const NODE_NAME = "trigger/future.legacy-action";

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

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getType(): string
    {
        return "trigger";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getBaseSlug(): string
    {
        return "futureLegacyAction";
    }

    public function getLabel(): string
    {
        return __("Future action", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when a Future Action on posts is set to execute this workflow.",
            "publishpress-future-pro"
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
        return "future";
    }

    public function getSettingsSchema(): array
    {
        return [];
    }

    public function getValidationSchema(): array
    {
        return [
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "postQuery.postType",
                        "label" => __("Post Type", "publishpress-future-pro"),
                    ],
                    [
                        "rule" => "dataType",
                        "field" => "postQuery.postId",
                        "type" => "integerList",
                        "label" => __("Post ID", "publishpress-future-pro"),
                    ],
                ],
            ],
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
                'label' => __("Action Post", "publishpress-future-pro"),
                'description' => __("The post that was saved triggering the action.", "publishpress-future-pro"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getSocketSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }

    public function addExpirationAction(array $actions): array
    {
        $actions[TriggerWorkflow::ACTION_NAME] = TriggerWorkflow::getLabel();

        return $actions;
    }

    public function createExpirationAction($action, $actionName, $postModel, $container)
    {
        if ($actionName === TriggerWorkflow::ACTION_NAME) {
            $action = new TriggerWorkflow($this->hooks, $postModel, $container);
        }

        return $action;
    }
}
