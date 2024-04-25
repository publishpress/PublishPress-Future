<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Module;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowModelInterface;
use Exception;
use WP_Post;
use WP_Query;

class WorkflowModel implements WorkflowModelInterface
{
    public const META_KEY_DICTIONARY = '_workflow_dictionary';

    public const META_KEY_FLOW = '_workflow_flow';

    private $post;

    private $flow = [];

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

    public function save()
    {
        wp_update_post($this->post);

        update_post_meta($this->post->ID, self::META_KEY_FLOW, json_encode($this->flow));
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
    /**
     *
     * $flow = [
    'nodes' => [
        0 => [
            'id' => 'node_1713970801125',
            'type' => 'genericTrigger',
            'position' => [
                'x' => 12,
                'y' => 12,
            ],
            'data' => [
                'elementarType' => 'trigger',
                'label' => 'Post is saved',
                'description' => 'This trigger is fired when a post is saved.',
                'settingsSchema' => [
                    0 => [...],,
                ],
                'category' => 'post',
                'icon' => [
                    'src' => 'media-document',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
                'version' => '1',
                'outputSchema' => [
                    0 => [...],,
                    1 => [...],,
                ],
                'settings' => [
                    'post_query' => [...],,
                ],
            ],
            'width' => 150,
            'height' => 50,
            'selected' => false,
            'dragging' => false,
            'positionAbsolute' => [
                'x' => 12,
                'y' => 12,
            ],
            'targetPosition' => 'top',
            'sourcePosition' => 'bottom',
            '$H' => 284,
            'x' => 12,
            'y' => 12,
        ],
        1 => [
            'id' => 'node_1713970807794',
            'type' => 'genericAction',
            'position' => [
                'x' => 12,
                'y' => 122,
            ],
            'data' => [
                'elementarType' => 'action',
                'label' => 'Ray - Debug',
                'description' => 'This action sends the flow data to Ray.',
                'settingsSchema' => [
                    0 => [...],,
                ],
                'category' => 'debug',
                'icon' => [
                    'src' => 'fa6-fabug',
                    'background' => '#ffffff',
                    'foreground' => '#1e1e1e',
                ],
                'version' => '1',
                'outputSchema' => [],,
            ],
            'width' => 150,
            'height' => 50,
            'selected' => false,
            'positionAbsolute' => [
                'x' => 12,
                'y' => 122,
            ],
            'dragging' => false,
            'targetPosition' => 'top',
            'sourcePosition' => 'bottom',
            '$H' => 286,
            'x' => 12,
            'y' => 122,
        ],
    ],
    'edges' => [
        0 => [
            'source' => 'node_1713970801125',
            'sourceHandle' => 'socket-output',
            'target' => 'node_1713970807794',
            'targetHandle' => 'socket-input',
            'animated' => false,
            'markerEnd' => [
                'type' => 'arrowclosed',
            ],
            'style' => [
                'strokeWidth' => 2,
            ],
            'id' => 'reactflow__edge-node_1713970801125socket-output-node_1713970807794socket-input',
        ],
    ],
    'viewport' => [
        'x' => 340.5,
        'y' => 412.5,
        'zoom' => 2,
    ],
]
     *
     *
     *
     */
    public function getTriggerNodes(): array
    {
        $abstractFlow = $this->getFlow();

        if (empty($abstractFlow))  {
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

    public function getARTFromFlow(): array
    {
        $abstractFlow = $this->getFlow();
        ray($abstractFlow);

        // The abstract routine tree
        $art = [];

        if (empty($abstractFlow))  {
            return [];
        }

        $edges = $abstractFlow['edges'] ?? [];

        $workflowTriggers = $this->getTriggerNodes();

        // Build the dictionary of nodes, by node ID
        $nodesDictionary = [];
        foreach ($abstractFlow['nodes'] as $node) {
            $nodesDictionary[$node['id']] = $node;
        }

        // Build the abstract routine tree for each trigger node
        foreach ($workflowTriggers as $triggerNode) {
            $subRoutine = [];
            foreach ($edges as $edge) {
                $source = $edge['source'];
                $target = $edge['target'];

                if ($source === $triggerNode['id']) {
                    $subRoutine[] = $target;
                }
            }

            $art[$triggerNode['id']] = $subRoutine;
        }

        rd($art);

        return $art;
    }
}
