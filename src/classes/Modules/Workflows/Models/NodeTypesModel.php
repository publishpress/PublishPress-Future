<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;


class NodeTypesModel implements NodeTypesModelInterface
{
    const NODE_TYPE_ACTION = 'action';

    const NODE_TYPE_TRIGGER = 'trigger';

    const NODE_TYPE_FLOW = 'flow';

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
                'name' => 'post',
                'label' => __('Post', 'publishpress-future-pro'),
                'icon' => [
                    'src' => 'document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
            ],
            [
                'name' => 'conditional',
                'label' => __('Conditional', 'publishpress-future-pro'),
                'icon' => [
                    'src' => 'document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
            ],
        ];
    }

    private function getDefaultTriggers()
    {
        return [
            [
                'type' => 'defaultTrigger',
                'name' => 'core/save-post',
                'label' => __('Post is saved', 'publishpress-future-pro'),
                'category' => 'post',
                'frecency' => 1,
                'icon' => [
                    'src' => 'document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
            ],
        ];
    }

    private function getDefaultActions()
    {
        return [
            [
                'type' => 'defaultAction',
                'name' => 'core/update-post',
                'label' => __('Update Post', 'publishpress-future-pro'),
                'category' => 'post',
                'frecency' => 1,
                'icon' => [
                    'src' => 'document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
            ],
            [
                'type' => 'defaultAction',
                'name' => 'core/delete-post',
                'label' => __('Delete Post', 'publishpress-future-pro'),
                'category' => 'post',
                'frecency' => 1,
                'icon' => [
                    'src' => 'document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
            ],
        ];
    }

    private function getDefaultFlows()
    {
        return [
            [
                'type' => 'flowIfElse',
                'name' => 'core/if-else',
                'label' => __('If/Else', 'publishpress-future-pro'),
                'category' => 'conditional',
                'frecency' => 1,
                'icon' => [
                    'src' => 'document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
            ]
        ];
    }

    private function applyDefaultParams(array $nodes, string $type): array
    {
        $normalized = [];

        $defaultNodeAttributes = [
            'id' => '',
            'type' => $type,
            'name' => '',
            'label' => '',
            'initiatlAttributes' => [],
            'category' => '',
            'disabled' => false,
            'isDisabled' => false,
            'frecency' => 1,
            'icon' => [
                'src' => 'document',
                'background' => '#ffffff',
                'foreground' => '#1e1e1e',
            ],
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
            $this->hooks->applyFilters(HooksAbstract::FILTER_WORKFLOW_TRIGGERS, $this->getDefaultTriggers()),
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
            $this->hooks->applyFilters(HooksAbstract::FILTER_WORKFLOW_ACTIONS, $this->getDefaultActions()),
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
            $this->hooks->applyFilters(HooksAbstract::FILTER_WORKFLOW_FLOWS, $this->getDefaultFlows()),
            self::NODE_TYPE_FLOW
        );

        return $this->flows;
    }

    public function getCategories(): array
    {
        if (!empty($this->categories)) {
            return $this->categories;
        }

        $this->categories = $this->hooks->applyFilters(HooksAbstract::FILTER_WORKFLOW_NODE_CATEGORIES, $this->getDefaultCategories());

        return $this->categories;
    }
}
