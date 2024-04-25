<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Module;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowsModelInterface;
use WP_Query;

class WorkflowsModel implements WorkflowsModelInterface
{
    public function getPublishedWorkflowsIds(): array
    {
        $args = [
            'post_type' => Module::POST_TYPE_WORKFLOW,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ];

        $query = new WP_Query($args);

        return $query->posts;
    }
}
