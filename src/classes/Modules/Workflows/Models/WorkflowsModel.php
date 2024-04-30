<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

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
        $metaKey = WorkflowModel::META_KEY_HAS_LEGACY_TRIGGER;

        $args = [
            'post_type' => Module::POST_TYPE_WORKFLOW,
            'post_status' => 'publish',
            'posts_per_page' => 100,
            'meta_query' => [
                [
                    'key' => $metaKey,
                    'value' => '1',
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
