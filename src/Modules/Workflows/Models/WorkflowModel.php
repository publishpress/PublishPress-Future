<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use PublishPress\Future\Modules\Workflows\Module;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowModelInterface;
use Exception;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction;
use PublishPress\Future\Modules\Workflows\HooksAbstract as WorkflowsHooksAbstract;
use WP_Post;
use WP_Query;

use function PublishPress\Future\logError;
use function wp_json_encode;
use function get_post;

class WorkflowModel implements WorkflowModelInterface
{
    public const META_KEY_HAS_LEGACY_TRIGGER = '_pp_workflow_has_legacy_trigger';

    public const META_KEY_HAS_MANUAL_TRIGGER = '_pp_workflow_has_manual_trigger';

    public const META_KEY_DEBUG_RAY_SHOW_QUERIES = '_pp_workflow_debug_ray_show_queries';

    public const META_KEY_DEBUG_RAY_SHOW_EMAILS = '_pp_workflow_debug_ray_show_emails';

    public const META_KEY_DEBUG_RAY_SHOW_WORDPRESS_ERRORS = '_pp_workflow_debug_ray_show_wordpress_errors';

    public const STATUS_ENABLED = 'publish';

    public const STATUS_DISABLED = 'draft';

    private $post;

    /**
     * @var array
     */
    private $flow = null;

    private $hasLegacyActionTrigger = null;

    private $hasManualSelectionTrigger = null;

    private $allNodeTypes = null;

    private $debugRayShowQueries = null;

    private $debugRayShowEmails = null;

    private $debugRayShowWordPressErrors = null;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct()
    {
        $container = Container::getInstance();

        // FIXME: Use dependency injection
        $this->hooks = $container->get(ServicesAbstract::HOOKS);
        $this->nodeTypesModel = $container->get(ServicesAbstract::NODE_TYPES_MODEL);
    }

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
        $this->flow = null;
        $this->hasLegacyActionTrigger = null;
        $this->hasManualSelectionTrigger = null;
        $this->allNodeTypes = null;
        $this->debugRayShowEmails = null;
        $this->debugRayShowQueries = null;
        $this->debugRayShowWordPressErrors = null;
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
        return $this->post->post_excerpt;
    }

    public function setDescription(string $description)
    {
        $this->post->post_excerpt = $description;
    }

    public function getStatus(): string
    {
        return $this->post->post_status;
    }

    public function setStatus(string $status)
    {
        $this->post->post_status = sanitize_key($status);
    }

    public function publish()
    {
        $this->setStatus(self::STATUS_ENABLED);
        $this->post->post_date = current_time('mysql');
        $this->post->post_date_gmt = current_time('mysql');
        $this->save();
    }

    public function unpublish()
    {
        $this->setStatus(self::STATUS_DISABLED);
        $this->save();
    }

    public function isActive(): bool
    {
        return $this->post->post_status === self::STATUS_ENABLED;
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

    private function updateDebugRayMetadata()
    {
        update_post_meta(
            $this->post->ID,
            self::META_KEY_DEBUG_RAY_SHOW_QUERIES,
            $this->debugRayShowQueries ? '1' : '0'
        );
        update_post_meta(
            $this->post->ID,
            self::META_KEY_DEBUG_RAY_SHOW_EMAILS,
            $this->debugRayShowEmails ? '1' : '0'
        );
        update_post_meta(
            $this->post->ID,
            self::META_KEY_DEBUG_RAY_SHOW_WORDPRESS_ERRORS,
            $this->debugRayShowWordPressErrors ? '1' : '0'
        );
    }

    public function getModifiedAt(): string
    {
        return $this->post->post_modified;
    }

    public function save()
    {
        wp_update_post($this->post);

        $this->updateLegacyActionMetadata();
        $this->updateManualSelectionMetadata();
        $this->updateDebugRayMetadata();
    }

    public function delete()
    {
        wp_delete_post($this->post->ID);
        $this->reset();

        /**
         * @param int $workflowId
         */
        $this->hooks->doAction(WorkflowsHooksAbstract::ACTION_WORKFLOW_DELETED, $this->post->ID);
    }

    private function getAllNodeTypesByType(): array
    {
        if (is_null($this->allNodeTypes)) {
            // Ensure the flow is updated with the latest node types
            // FIXME: Use dependency injection
            $nodeTypesModel = Container::getInstance()->get(ServicesAbstract::NODE_TYPES_MODEL);
            $this->allNodeTypes = $nodeTypesModel->getAllNodeTypesIndexedByName();
        }

        return $this->allNodeTypes;
    }

    public function getFlow(bool $updateNodes = false): array
    {
        try {
            if (empty($this->flow)) {
                $this->flow = json_decode($this->post->post_content, true);

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
        $nodeTypes = $this->getAllNodeTypesByType();

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

        $untranslatedString = __($string, 'post-expirator');

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
        // Update the editor version in the flow
        $flow['editorVersion'] = PUBLISHPRESS_FUTURE_VERSION;

        $this->flow = $flow;
        $this->post->post_content = wp_json_encode($this->flow);
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
                'post_title' => __('New Workflow', 'post-expirator'),
                'post_status' => 'auto-draft',
                'post_type' => Module::POST_TYPE_WORKFLOW,
            ];

            $id = wp_insert_post($this->post);
        }

        $this->load($id);

        return $id;
    }

    private function getScreenshotsFolder()
    {
        $uploadDir = wp_get_upload_dir();
        $uploadDir = $uploadDir['basedir'];

        return $uploadDir . '/publishpress-future/workflows/';
    }

    private function prepareScreenshotsFolder()
    {
        $screenshotDir = $this->getScreenshotsFolder();

        if (!file_exists($screenshotDir)) {
            // WordPress VIP false positive, since we are making the directory in the uploads folder
            // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.directory_mkdir
            mkdir($screenshotDir, 0777, true);
        }

        return $screenshotDir;
    }

    private function getScreenshotFileName(): string
    {
        return 'workflow-screenshot-' . $this->post->ID . '.png';
    }

    private function deleteScreenshotFile()
    {
        $screenshotDir = $this->getScreenshotsFolder();
        $screenshotFile = $screenshotDir . $this->getScreenshotFileName();

        if (file_exists($screenshotFile)) {
            // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_unlink
            unlink($screenshotFile);
        }
    }

    private function deleteLegacyScreenshotFile()
    {
        $existingScreenshotId = get_post_thumbnail_id($this->post->ID);

        if ($existingScreenshotId) {
            wp_delete_attachment($existingScreenshotId, true);
        }
    }

    public function convertLegacyScreenshots(): void
    {
        $existingScreenshotId = get_post_thumbnail_id($this->post->ID);

        if ($existingScreenshotId) {
            $existingScreenshotFile = get_attached_file($existingScreenshotId);

            if ($existingScreenshotFile) {
                $screenshotDir = $this->getScreenshotsFolder();
                $screenshotFile = $screenshotDir . $this->getScreenshotFileName();

                if (file_exists($existingScreenshotFile)) {
                    // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_rename
                    rename($existingScreenshotFile, $screenshotFile);
                }

                $this->deleteLegacyScreenshotFile();
                $this->createScreenshotThumbnails($screenshotFile);
            }
        }
    }

    private function createScreenshotThumbnails($screenshotFile)
    {
        if (!file_exists($screenshotFile)) {
            return;
        }

        if (! function_exists('image_make_intermediate_size')) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        // Create 4 versions of the screenshot: 150x150, 258x300, 768x892, 882x1024
        $sizes = [
            $this->getImageDimensionsBySize('thumbnail'),
            $this->getImageDimensionsBySize('medium'),
            $this->getImageDimensionsBySize('large'),
            $this->getImageDimensionsBySize('full'),
        ];

        foreach ($sizes as $size) {
            $thumbnail = image_make_intermediate_size($screenshotFile, $size[0], $size[1], true);

            if ($thumbnail) {
                // Move the thumbnail to the uploads dir
                $thumbnailDir = $this->getScreenshotsFolder();
                $thumbnailFile = $thumbnailDir . basename($thumbnail['file']);

                if (file_exists($thumbnail['file'])) {
                    // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_rename
                    rename($thumbnail['file'], $thumbnailFile);
                }
            }
        }
    }

    private function getImageDimensionsBySize($size)
    {
        $sizes = [
            'full' => [882, 1024],
            'large' => [768, 892],
            'medium' => [258, 300],
            'thumbnail' => [150, 150],
        ];

        return $sizes[$size] ?? $sizes['full'];
    }

    public function setScreenshotFromBase64(string $dataImage)
    {
        $this->deleteLegacyScreenshotFile();
        $this->prepareScreenshotsFolder();
        $this->deleteScreenshotFile();

        // Sanitize the baseurl to make sure it has data:image/png;base64
        if (strpos($dataImage, 'data:image/png;base64') !== 0) {
            return;
        }

        // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
        $imageData = file_get_contents($dataImage);

        if ($imageData !== false) {
            $imageFileName = 'workflow-screenshot-' . $this->post->ID . '.png';

            $upload = wp_upload_bits($imageFileName, null, $imageData);
            if ($upload['error'] === false) {
                // Put the uploaded file into the screenshots dir
                $screenshotDir = $this->getScreenshotsFolder();
                $screenshotFile = $screenshotDir . $this->getScreenshotFileName();

                if (file_exists($upload['file'])) {
                    // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.file_ops_rename
                    rename($upload['file'], $screenshotFile);
                }

                $this->createScreenshotThumbnails($screenshotFile);
            }
        }
    }

    public function setScreenshotFromFile(string $filePath)
    {
        // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
        $dataImage = 'data:image/png;base64,' . base64_encode(file_get_contents($filePath));

        $this->setScreenshotFromBase64($dataImage);
    }

    public function getScreenshotUrl($size = 'full'): string
    {
        $screenshotDir = $this->getScreenshotsFolder();
        $screenshotFile = $screenshotDir . $this->getScreenshotFileName();

        if (!file_exists($screenshotFile)) {
            return '';
        }

        $dimensions = $this->getImageDimensionsBySize($size);
        $dimensions = $dimensions[0] . 'x' . $dimensions[1];
        $screenshotFile = $screenshotDir . basename($screenshotFile, '.png') . '-' . $dimensions . '.png';

        $screenshotUrl = str_replace(ABSPATH, site_url('/'), $screenshotFile);

        return $screenshotUrl;
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
            if ($node['data']['elementaryType'] === NodeTypesModel::NODE_TYPE_TRIGGER) {
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
        $elementaryType = $node['data']['elementaryType'] ?? null;
        $nodeName = $node['data']['name'] ?? null;
        $nodeTypeInstance = $nodeTypes[$elementaryType][$nodeName] ?? null;

        if (is_null($nodeTypeInstance)) {
            logError(
                sprintf(
                    'Node type not found. Workflow: %1$d; ElementaryType: %2$s; NodeName; %3$s; SourceNodeId: %4$s',
                    $this->post->ID,
                    $elementaryType,
                    $nodeName,
                    $sourceNodeId
                )
            );

            return [];
        }
        $handleSchema = $nodeTypeInstance->getHandleSchema();

        $tree = ['node' => $node,];

        if ($edgeId) {
            $tree['edgeId'] = $edgeId;
        }

        $tree['next'] = [];

        foreach ($handleSchema['source'] as $handle) {
            foreach ($edges as $edge) {
                if ($edge['source'] === $sourceNodeId && $edge['sourceHandle'] === $handle['id']) {
                    if (! isset($tree['next'][$handle['id']])) {
                        $tree['next'][$handle['id']] = [];
                    }
                    $tree['next'][$handle['id']][] = $this->getRoutineNodesTree(
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
        return $this->checkHasTriggerInTheFlow(FutureLegacyAction::getNodeTypeName());
    }

    private function checkHasManualSelectionTriggerInTheFlow(): bool
    {
        return $this->checkHasTriggerInTheFlow(CoreOnManuallyEnabledForPost::getNodeTypeName());
    }

    private function checkHasTriggerInTheFlow(string $triggerName): bool
    {
        $workflowTriggers = $this->getTriggerNodes();

        foreach ($workflowTriggers as $triggerNode) {
            if (
                $triggerNode['data']['elementaryType'] === NodeTypesModel::NODE_TYPE_TRIGGER
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

    public function setDebugRayShowQueries(bool $debugRayShowQueries)
    {
        $this->debugRayShowQueries = $debugRayShowQueries;
    }

    public function setDebugRayShowEmails(bool $debugRayShowEmails)
    {
        $this->debugRayShowEmails = $debugRayShowEmails;
    }

    public function setDebugRayShowWordPressErrors(bool $debugRayShowWordPressErrors)
    {
        $this->debugRayShowWordPressErrors = $debugRayShowWordPressErrors;
    }

    public function isDebugRayShowQueriesEnabled(): bool
    {
        if (null === $this->debugRayShowQueries) {
            $this->debugRayShowQueries = get_post_meta(
                $this->post->ID,
                self::META_KEY_DEBUG_RAY_SHOW_QUERIES,
                true
            ) === '1';
        }

        return $this->debugRayShowQueries;
    }

    public function isDebugRayShowEmailsEnabled(): bool
    {
        if (null === $this->debugRayShowEmails) {
            $this->debugRayShowEmails = get_post_meta(
                $this->post->ID,
                self::META_KEY_DEBUG_RAY_SHOW_EMAILS,
                true
            ) === '1';
        }

        return $this->debugRayShowEmails;
    }

    public function isDebugRayShowWordPressErrorsEnabled(): bool
    {
        if (null === $this->debugRayShowWordPressErrors) {
            $this->debugRayShowWordPressErrors = get_post_meta(
                $this->post->ID,
                self::META_KEY_DEBUG_RAY_SHOW_WORDPRESS_ERRORS,
                true
            ) === '1';
        }

        return $this->debugRayShowWordPressErrors;
    }

    private function getManualSelectionTrigger()
    {
        $workflowTriggers = $this->getTriggerNodes();

        foreach ($workflowTriggers as $triggerNode) {
            if (
                $triggerNode['data']['elementaryType'] === NodeTypesModel::NODE_TYPE_TRIGGER
                && $triggerNode['data']['name'] === CoreOnManuallyEnabledForPost::getNodeTypeName()
            ) {
                return $triggerNode;
            }
        }

        return null;
    }

    public function getManualSelectionLabel(): string
    {
        $manualSelectionTrigger = $this->getManualSelectionTrigger();

        if (empty($manualSelectionTrigger)) {
            return $this->getTitle();
        }

        return $manualSelectionTrigger['data']['settings']['checkboxLabel'] ?? $this->getTitle();
    }

    public function getPartialRoutineTreeFromNodeId(string $nodeId): array
    {
        $nodeTypes = $this->nodeTypesModel->getAllNodeTypesByType();
        $routineTree = $this->getRoutineTree($nodeTypes);

        return $this->getStepFromRoutineTreeRecursively($routineTree, $nodeId);
    }

    private function getStepFromRoutineTreeRecursively(array $routineTree, string $nodeId): array
    {
        foreach ($routineTree as $node) {
            if ($node['node']['id'] === $nodeId) {
                return $node;
            }

            if (isset($node['next'])) {
                foreach ($node['next'] as $nextNode) {
                    $step = $this->getStepFromRoutineTreeRecursively($nextNode, $nodeId);
                    if (! empty($step)) {
                        return $step;
                    }
                }
            }
        }
    }
}
