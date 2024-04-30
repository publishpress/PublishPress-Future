<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Domain\LegacyAction\TriggerWorkflow;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class FutureLegacyAction implements NodeTypeInterface
{
    const NODE_NAME = "trigger/future.legacy-action";

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;

        $this->hooks->addFilter(HooksAbstract::FILTER_EXPIRATION_ACTIONS, [$this, 'addExpirationAction']);
        $this->hooks->addFilter(HooksAbstract::FILTER_EXPIRATION_ACTION_FACTORY, [$this, 'createExpirationAction'], 10, 4);
    }

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getLabel(): string
    {
        return __("Future Action", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger is fired when a future action is configured to execute this workflow.", "publishpress-future-pro");
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

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'post',
                'type' => 'post',
                'label' => __("Post", "publishpress-future-pro"),
                'description' => __("The post that was saved, with the new properties.", "publishpress-future-pro"),
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
