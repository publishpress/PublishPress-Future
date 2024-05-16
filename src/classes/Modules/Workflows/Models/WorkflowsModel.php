<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\Module;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowsModelInterface;
use WP_Query;

class WorkflowsModel implements WorkflowsModelInterface
{
    public function getPublishedWorkflowsIds($limit = -1): array
    {
        $args = [
            'post_type' => Module::POST_TYPE_WORKFLOW,
            'post_status' => 'publish',
            'posts_per_page' => $limit,
            'fields' => 'ids',
        ];

        $query = new WP_Query($args);

        return $query->posts;
    }

    public function getPublishedWorkflowsWithLegacyTriggerAsOptions(): array
    {
        return $this->getPublishedWorkflowsWithMetadataAsOptions(WorkflowModel::META_KEY_HAS_LEGACY_TRIGGER, 1);
    }

    public function getPublishedWorkflowsWithManualTrigger(): array
    {
        $workflows = $this->getPublishedWorkflowsWithMetadataAsOptions(WorkflowModel::META_KEY_HAS_MANUAL_TRIGGER, 1);

        $result = [];
        foreach ($workflows as &$workflow) {
            $workflowModel = new WorkflowModel();
            $workflowModel->load($workflow['value']);

            $triggers = $workflowModel->getTriggerNodes();

            $resultItem = [
                'workflowId' => $workflow['value'],
                'label' => $workflow['label'],
            ];

            foreach ($triggers as $trigger) {
                if ($trigger['data']['name'] !== CoreOnManuallyEnabledForPost::NODE_NAME) {
                    continue;
                }

                $resultItem['label'] = $trigger['data']['settings']['checkboxLabel'] ?? $workflow['label'];
            }

            $result[] = $resultItem;
        }

        return $result;
    }

    public function getPublishedWorkflowsWithMetadataAsOptions($metaKey, $metaValue): array
    {
        $args = [
            'post_type' => Module::POST_TYPE_WORKFLOW,
            'post_status' => 'publish',
            'posts_per_page' => 100,
            'meta_query' => [
                [
                    'key' => sanitize_key($metaKey),
                    'value' => (int)$metaValue,
                ],
            ],
        ];

        $query = new WP_Query($args);

        $workflows = [];

        foreach ($query->posts as $workflow) {
            $workflows[] = [
                'value' => $workflow->ID,
                'label' => $workflow->post_title
            ];
        }

        return $workflows;
    }
}
