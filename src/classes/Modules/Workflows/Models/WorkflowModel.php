<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Module;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowModelInterface;
use Exception;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction;
use WP_Post;
use WP_Query;

class WorkflowModel implements WorkflowModelInterface
{
    public const META_KEY_FLOW = '_workflow_flow';

    public const META_KEY_HAS_LEGACY_TRIGGER = '_workflow_has_legacy_trigger';

    private $post;

    private $flow = [];

    private $hasLegacyActionTrigger = null;

    public function load(int $id): bool
    {
        $this->reset();

        $post = get_post($id);

        if ((! ($post instanceof WP_Post)) || $post->post_type !== Module::POST_TYPE_WORKFLOW) {
            return false;
        }

        $this->post = $post;

        return true;
    }

    private function reset(): void
    {
        $this->post = null;
        $this->flow = [];
    }

    public function getId(): int
    {
        return $this->post->ID;
    }

    public function getTitle(): string
    {
        return $this->post->post_title;
    }

    public function setTitle(string $title)
    {
        $this->post->post_title = sanitize_text_field($title);
    }

    public function getDescription(): string
    {
        return $this->post->post_content;
    }

    public function setDescription(string $description)
    {
        $this->post->post_content = $description;
    }

    public function getStatus(): string
    {
        return $this->post->post_status;
    }

    public function setStatus(string $status)
    {
        $this->post->post_status = sanitize_key($status);
    }

    private function updateLegacyActionMetadata()
    {
        $this->hasLegacyActionTrigger = $this->checkHasLegacyActionTriggerInTheFlow();

        if ($this->hasLegacyActionTrigger) {
            update_post_meta($this->post->ID, self::META_KEY_HAS_LEGACY_TRIGGER, '1');
        } else {
            delete_post_meta($this->post->ID, self::META_KEY_HAS_LEGACY_TRIGGER);
        }
    }

    public function getModifiedAt(): string
    {
        return $this->post->post_modified;
    }

    public function save()
    {
        wp_update_post($this->post);

        update_post_meta($this->post->ID, self::META_KEY_FLOW, json_encode($this->flow));

        $this->updateLegacyActionMetadata();
    }

    public function delete()
    {
        wp_delete_post($this->post->ID);

        $this->reset();
    }

    public function getFlow(): array
    {
        if (empty($this->flow)) {
            try {
                $this->flow = get_post_meta($this->post->ID, self::META_KEY_FLOW, true);
                $this->flow = json_decode($this->flow, true);

                if (! is_array($this->flow)) {
                    $this->flow = [];
                }
            } catch (Exception $e) {
                $this->flow = [];
            }
        }

        return $this->flow;
    }

    public function setFlow(array $flow)
    {
        $this->flow = $flow;
    }

    public function createNew($reuseAutoDraft = true): int
    {
        $this->reset();

        $id = 0;

        if ($reuseAutoDraft) {
            // Get the first auto-draft workflow created by the user in the current session
            $query = new WP_Query([
                'post_type' => Module::POST_TYPE_WORKFLOW,
                'post_status' => 'auto-draft',
                'author' => get_current_user_id(),
                'posts_per_page' => 1,
            ]);

            if ($query->have_posts()) {
                $query->the_post();

                $id = get_the_ID();
            }
        }

        if (empty($id)) {
            $this->post = [
                'post_title' => __('New Workflow', 'publishpress-future-pro'),
                'post_status' => 'auto-draft',
                'post_type' => Module::POST_TYPE_WORKFLOW,
            ];

            $id = wp_insert_post($this->post);
        }

        $this->load($id);

        return $id;
    }

    public function setScreenshot(string $baseUrl)
    {
        // Delete existing screenshot files
        $existingScreenshotId = get_post_thumbnail_id($this->post->ID);
        if ($existingScreenshotId) {
            wp_delete_attachment($existingScreenshotId, true);
        }

        $image_data = file_get_contents($baseUrl);
        if ($image_data !== false) {
            $imageFileName = 'workflow-screenshot-' . $this->post->ID . '.png';

            $upload = wp_upload_bits($imageFileName, null, $image_data);
            if ($upload['error'] === false) {
                $attachment = array(
                    'post_mime_type' => $upload['type'],
                    'post_title' => basename($upload['file']),
                    'post_content' => '',
                    'post_status' => 'inherit'
                );
                $attach_id = wp_insert_attachment($attachment, $upload['file']);
                if (!is_wp_error($attach_id)) {
                    require_once(ABSPATH . 'wp-admin/includes/image.php');
                    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
                    wp_update_attachment_metadata($attach_id, $attach_data);
                    set_post_thumbnail($this->post->ID, $attach_id);
                }
            }
        }
    }

    public function getTriggerNodes(): array
    {
        $abstractFlow = $this->getFlow();

        if (empty($abstractFlow)) {
            return [];
        }

        // Build a list of trigger nodes
        $triggers = [];
        foreach ($abstractFlow['nodes'] as $node) {
            if ($node['data']['elementarType'] === NodeTypesModel::NODE_TYPE_TRIGGER) {
                $triggers[] = $node;
            }
        }

        if (empty($triggers)) {
            return [];
        }

        return $triggers;
    }

    public function getEdges(): array
    {
        $abstractFlow = $this->getFlow();

        if (empty($abstractFlow)) {
            return [];
        }

        return $abstractFlow['edges'] ?? [];
    }

    public function getRoutineTree(array $nodeTypes): array
    {
        $abstractFlow = $this->getFlow();

        if (empty($abstractFlow)) {
            return [];
        }

        $edges = $abstractFlow['edges'] ?? [];
        $nodes = $abstractFlow['nodes'] ?? [];

        $nodesById = [];
        foreach ($nodes as $node) {
            $nodesById[$node['id']] = $node;
        }

        $workflowTriggers = $this->getTriggerNodes();

        // Build the abstract routine tree for each trigger node
        $routineTree = [];
        foreach ($workflowTriggers as $triggerNode) {
            $routineTree[$triggerNode['id']] = $this->getRoutineNodesTree($edges, $nodesById, $triggerNode['id'], $nodeTypes);
        }

        return $routineTree;
    }

    private function getRoutineNodesTree($edges, $nodes, $sourceNodeId, $nodeTypes, $edgeId = null)
    {
        $node = $nodes[$sourceNodeId];
        $elementarType = $node['data']['elementarType'];
        $nodeName = $node['data']['name'];
        $nodeTypeInstance = $nodeTypes[$elementarType][$nodeName];
        $socketSchema = $nodeTypeInstance->getSocketSchema();

        $tree = ['node' => $node,];

        if ($edgeId) {
            $tree['edgeId'] = $edgeId;
        }

        $tree['next'] = [];

        foreach ($socketSchema['source'] as $socket) {
            foreach ($edges as $edge) {
                if ($edge['source'] === $sourceNodeId && $edge['sourceHandle'] === $socket['id']) {
                    if (! isset($tree['next'][$socket['id']])) {
                        $tree['next'][$socket['id']] = [];
                    }
                    $tree['next'][$socket['id']][] = $this->getRoutineNodesTree($edges, $nodes, $edge['target'], $nodeTypes, $edge['id']);
                }
            }
        }

        return $tree;
    }

    private function checkHasLegacyActionTriggerInTheFlow(): bool
    {
        $workflowTriggers = $this->getTriggerNodes();

        foreach ($workflowTriggers as $triggerNode) {
            if (
                $triggerNode['data']['elementarType'] === NodeTypesModel::NODE_TYPE_TRIGGER
                && $triggerNode['data']['name'] === FutureLegacyAction::NODE_NAME
            ) {
                return true;
            }
        }

        return false;
    }

    public function hasLegacyActionTrigger(): bool
    {
        if (is_null($this->hasLegacyActionTrigger)) {
            $this->updateLegacyActionMetadata();
        }

        return get_post_meta($this->post->ID, self::META_KEY_HAS_LEGACY_TRIGGER, true) === '1';
    }
}
