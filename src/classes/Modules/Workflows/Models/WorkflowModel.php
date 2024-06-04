<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Module;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowModelInterface;
use Exception;
use PublishPress\Future\Core\DI\Container;
use PublishPress\FuturePro\Core\ServicesAbstract;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction;
use WP_Post;
use WP_Query;

use function PublishPress\FuturePro\logError;

class WorkflowModel implements WorkflowModelInterface
{
    public const META_KEY_FLOW = '_workflow_flow';

    public const META_KEY_PREFIX_NODE_EXECUTION_COUNT = '_node_execution_count_';

    public const META_KEY_HAS_LEGACY_TRIGGER = '_workflow_has_legacy_trigger';

    public const META_KEY_HAS_MANUAL_TRIGGER = '_workflow_has_manual_trigger';

    private $post;

    private $flow = [];

    private $hasLegacyActionTrigger = null;

    private $hasManualSelectionTrigger = null;

    private $allNodeTypes = null;

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

    public function isActive(): bool
    {
        return $this->post->post_status === 'publish';
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

    private function updateManualSelectionMetadata()
    {
        $this->hasManualSelectionTrigger = $this->checkHasManualSelectionTriggerInTheFlow();

        if ($this->hasManualSelectionTrigger) {
            update_post_meta($this->post->ID, self::META_KEY_HAS_MANUAL_TRIGGER, '1');
        } else {
            delete_post_meta($this->post->ID, self::META_KEY_HAS_MANUAL_TRIGGER);
        }
    }

    public function getModifiedAt(): string
    {
        return $this->post->post_modified;
    }

    public function save()
    {
        wp_update_post($this->post);

        update_post_meta($this->post->ID, self::META_KEY_FLOW, wp_json_encode($this->flow));

        $this->updateLegacyActionMetadata();
        $this->updateManualSelectionMetadata();
    }

    public function delete()
    {
        wp_delete_post($this->post->ID);

        $this->reset();
    }

    private function getAllNodeTypes(): array
    {
        if (is_null($this->allNodeTypes)) {
            // FIXME: Use dependency injection
            $hooks = Container::getInstance()->get(ServicesAbstract::HOOKS);

            // Ensure the flow is updated with the latest node types
            $nodeTypesModel = new NodeTypesModel($hooks);
            $this->allNodeTypes = $nodeTypesModel->getAllNodeTypesIndexedByName();
        }

        return $this->allNodeTypes;
    }

    public function getFlow(bool $updateNodes = false): array
    {
        try {
            if (empty($this->flow)) {
                $this->flow = get_post_meta($this->post->ID, self::META_KEY_FLOW, true);
                $this->flow = json_decode($this->flow, true);

                if (! is_array($this->flow)) {
                    $this->flow = [];
                }

                if ($updateNodes) {
                    if (empty($this->flow)) {
                        return $this->flow;
                    }

                    // Check if the nodes are updated and update them if necessary
                    $nodes = $this->flow['nodes'] ?? [];
                    $nodesUpdated = false;
                    foreach ($nodes as &$node) {
                        if (! $this->isNodeUpdated($node)) {
                            $node = $this->updateNode($node);
                            $nodesUpdated = true;
                        }
                    }
                    if ($nodesUpdated) {
                        $this->flow['nodes'] = $nodes;
                    }
                }
            }
        } catch (Exception $e) {
            $this->flow = [];

            logError('Error getting the workflow', $e);
        }

        return $this->flow;
    }

    private function getNodeTypeByname(string $name)
    {
        $nodeTypes = $this->getAllNodeTypes();

        $nodeType = $nodeTypes[$name] ?? null;

        if (is_null($nodeType)) {
            throw new Exception('Node type not found: ' . esc_html($name));
        }

        return $nodeType;
    }

    private function isNodeUpdated(array $node): bool
    {
        $nodeType = $this->getNodeTypeByname($node['data']['name'] ?? '');
        $nodeVersion = $this->getNodeVersion($node);

        if (! $nodeType) {
            return false;
        }

        return $nodeVersion === $nodeType->getVersion();
    }

    private function getNodeVersion(array $node): int
    {
        return (int)($node['data']['version'] ?? 0);
    }

    private function getUnstranslatedString(string $string): string
    {
        // Force the WP locale to en_US to get the untranslated string
        $currentLocale = get_locale();
        switch_to_locale('en_US');

        $untranslatedString = __($string, 'publishpress-future-pro');

        // Restore the original locale
        switch_to_locale($currentLocale);

        return $untranslatedString;
    }

    private function updateNode(array $node): array
    {
        $nodeType = $this->getNodeTypeByname($node['data']['name']);
        $nodeVersion = $this->getNodeVersion($node);

        if ($nodeType->getVersion() < $nodeVersion) {
            // TODO: What to do when the node type is downgraded? Should we have a check in the version of the builder?
            return $node;
        }
        // phpcs:ignore Squiz.PHP.CommentedOutCode.Found
        // if ($nodeType->getVersion() > $nodeVersion) {
        //     // Update the version
        //     $node['data']['version'] = $nodeType->getVersion();
        // }

        return $node;
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

    public function setScreenshot(string $dataImage)
    {
        // Delete existing screenshot files
        $existingScreenshotId = get_post_thumbnail_id($this->post->ID);
        if ($existingScreenshotId) {
            wp_delete_attachment($existingScreenshotId, true);
        }

        // Sanitize the baseurl to make sure it has data:image/png;base64
        if (strpos($dataImage, 'data:image/png;base64') !== 0) {
            return;
        }

        // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
        $image_data = file_get_contents($dataImage);

        if ($image_data !== false) {
            $imageFileName = 'workflow-screenshot-' . $this->post->ID . '.png';

            $upload = wp_upload_bits($imageFileName, null, $image_data);
            if ($upload['error'] === false) {
                $attachment = [
                    'post_mime_type' => $upload['type'],
                    'post_title' => basename($upload['file']),
                    'post_content' => '',
                    'post_status' => 'inherit'
                ];
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
            $routineTree[$triggerNode['id']] = $this->getRoutineNodesTree(
                $edges,
                $nodesById,
                $triggerNode['id'],
                $nodeTypes
            );
        }

        return $routineTree;
    }

    private function getRoutineNodesTree($edges, $nodes, $sourceNodeId, $nodeTypes, $edgeId = null)
    {
        $node = $nodes[$sourceNodeId];
        $elementarType = $node['data']['elementarType'] ?? null;
        $nodeName = $node['data']['name'] ?? null;
        $nodeTypeInstance = $nodeTypes[$elementarType][$nodeName] ?? null;

        if (is_null($nodeTypeInstance)) {
            logError(
                sprintf(
                    'Node type not found. Workflow: %1$d; ElementarType: %2$s; NodeName; %3$s; SourceNodeId: %4$s',
                    $this->post->ID,
                    $elementarType,
                    $nodeName,
                    $sourceNodeId
                )
            );

            return [];
        }
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
                    $tree['next'][$socket['id']][] = $this->getRoutineNodesTree(
                        $edges,
                        $nodes,
                        $edge['target'],
                        $nodeTypes,
                        $edge['id']
                    );
                }
            }
        }

        return $tree;
    }

    private function checkHasLegacyActionTriggerInTheFlow(): bool
    {
        return $this->checkHasTriggerInTheFlow(FutureLegacyAction::NODE_NAME);
    }

    private function checkHasManualSelectionTriggerInTheFlow(): bool
    {
        return $this->checkHasTriggerInTheFlow(CoreOnManuallyEnabledForPost::NODE_NAME);
    }

    private function checkHasTriggerInTheFlow(string $triggerName): bool
    {
        $workflowTriggers = $this->getTriggerNodes();

        foreach ($workflowTriggers as $triggerNode) {
            if (
                $triggerNode['data']['elementarType'] === NodeTypesModel::NODE_TYPE_TRIGGER
                && $triggerNode['data']['name'] === $triggerName
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

    public function resetNodeExecutionCount(string $nodeId)
    {
        delete_post_meta($this->post->ID, self::META_KEY_PREFIX_NODE_EXECUTION_COUNT . $nodeId);
    }

    public function incrementNodeExecutionCount(string $nodeId): int
    {
        $executionCount = $this->getNodeExecutionCount($nodeId);
        $executionCount++;

        update_post_meta($this->post->ID, self::META_KEY_PREFIX_NODE_EXECUTION_COUNT . $nodeId, $executionCount);

        return $executionCount;
    }

    public function getNodeExecutionCount(string $nodeId): int
    {
        return (int) get_post_meta($this->post->ID, self::META_KEY_PREFIX_NODE_EXECUTION_COUNT . $nodeId, true);
    }
}
