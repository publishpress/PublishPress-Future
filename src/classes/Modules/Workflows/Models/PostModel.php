<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\PostModelInterface;
use WP_Post;

class PostModel implements PostModelInterface
{
    const META_KEY_WORKFLOW_MANUALLY_TRIGGERED = '_workflow_manually_triggered';

    private $post;

    public function load(int $id): bool
    {
        $this->reset();

        $post = get_post($id);

        if ((! ($post instanceof WP_Post))) {
            return false;
        }

        $this->post = $post;

        return true;
    }

    private function reset(): void
    {
        $this->post = null;
    }

    public function getId(): int
    {
        return $this->post->ID;
    }

    public function getTitle(): string
    {
        return $this->post->post_title;
    }

    public function getManuallyEnabledWorkflows(): array
    {
        $workflowIds = get_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED, false);
        $workflowIds = array_map('intval', $workflowIds);

        return $workflowIds;
    }

    public function setManuallyEnabledWorkflows(array $workflowIds): void
    {
        delete_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED);

        foreach ($workflowIds as $workflowId) {
            add_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED, $workflowId, false);
        }
    }
}
