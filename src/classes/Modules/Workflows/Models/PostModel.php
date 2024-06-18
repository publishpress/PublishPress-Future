<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\InputValidators\PostQuery;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\PostModelInterface;
use WP_Post;

class PostModel implements PostModelInterface
{
    public const META_KEY_WORKFLOW_MANUALLY_TRIGGERED = '_pp_workflow_manually_triggered';

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

    public function getValidWorkflowsWithManualTrigger(int $postId): array
    {
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithManualTrigger();

        $postModel = new PostModel();
        $postModel->load($postId);
        $postQueryValidator = new PostQuery();

        $validatedWorkflows = [];

        foreach ($workflows as &$workflow) {
            $workflowId = $workflow['workflowId'];

            $workflowModel = new WorkflowModel();
            $workflowModel->load($workflowId);

            // Validate the trigger's post query
            $triggers = $workflowModel->getTriggerNodes();
            foreach ($triggers as $trigger) {
                if ($trigger['data']['name'] !== CoreOnManuallyEnabledForPost::getNodeTypeName()) {
                    continue;
                }

                if ($postQueryValidator->validate(['post' => $this->post, 'node' => $trigger])) {
                    $validatedWorkflows[] = $workflow;
                }
            }
        }

        return $validatedWorkflows;
    }

    public function getManuallyEnabledWorkflows(): array
    {
        $selectedWorkflowIds = get_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED, false);
        $selectedWorkflowIds = array_map('intval', $selectedWorkflowIds);

        return $selectedWorkflowIds;
    }

    public function setManuallyEnabledWorkflows(array $workflowIds): void
    {
        delete_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED);

        foreach ($workflowIds as $workflowId) {
            $workflowId = (int)$workflowId;
            add_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED, $workflowId, false);
        }
    }
}
