<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\Future\Core\HooksAbstract as FutureCoreHooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\PostTypeModel;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Models\PostModel;
use PublishPress\FuturePro\Modules\Workflows\Models\PostTypesModel;

class ManualPostTrigger implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function initialize()
    {
        // Quick Edit
        $this->hooks->addAction(
            FutureCoreHooksAbstract::ACTION_QUICK_EDIT_CUSTOM_BOX,
            [$this, 'registerQuickEditCustomBox'],
            10,
            2
        );

        $this->hooks->addAction(
            FutureCoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'processQuickEditUpdate']
        );

        $this->hooks->addAction(
            FutureCoreHooksAbstract::ACTION_ADMIN_PRINT_SCRIPTS_EDIT,
            [$this, 'enqueueQuickEditScripts']
        );

        // Block Editor
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ENQUEUE_BLOCK_EDITOR_ASSETS,
            [$this, 'enqueueBlockEditorScripts']
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_REST_API_INIT,
            [$this, 'registerRestField']
        );
    }

    public function registerQuickEditCustomBox($columnName, $postType)
    {
        // Check there are workflows with the manual post trigger
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithManualTrigger();

        if (empty($workflows)) {
            return;
        }

        require_once __DIR__ . "/../Views/manual-trigger-quick-edit.html.php";
    }

    public function processQuickEditUpdate($postId)
    {
        // Don't run if this is an auto save
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Don't update data if the function is called for saving revision.
        $postType = get_post_type((int)$postId);
        if ($postType === 'revision') {
            return;
        }

        if (empty($_POST['future_workflow_view']) || $_POST['future_workflow_view'] !== 'quick-edit') {
            return;
        }

        $manuallyEnabledWorkflows = isset($_POST['future_workflow_manual_trigger']) ? $_POST['future_workflow_manual_trigger'] : [];

        $postModel = new PostModel();
        $postModel->load($postId);
        $postModel->setManuallyEnabledWorkflows($manuallyEnabledWorkflows);

        $this->triggerManuallyEnabledWorkflow($postId, $manuallyEnabledWorkflows);
    }

    private function triggerManuallyEnabledWorkflow($postId, $manuallyEnabledWorkflows)
    {
        // Trigger the action to trigger those workflows
        foreach ($manuallyEnabledWorkflows as $workflowId) {
            $this->hooks->doAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, (int)$postId, (int)$workflowId);
        }
    }

    public function enqueueQuickEditScripts()
    {
        // Only enqueue scripts if we are in the post list table
        if (get_current_screen()->id !== 'edit-post') {
            return;
        }

        wp_enqueue_style("wp-components");

        wp_enqueue_script("wp-components");
        wp_enqueue_script("wp-plugins");
        wp_enqueue_script("wp-element");
        wp_enqueue_script("wp-data");

        wp_enqueue_script(
            "future_workflow_manual_selection_script_quick_edit",
            plugins_url(
                "/src/assets/js/workflow-manual-selection-quick-edit.js",
                PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE
            ),
            [
                "wp-plugins",
                "wp-components",
                "wp-element",
                "wp-data",
            ],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        wp_localize_script(
            "future_workflow_manual_selection_script_quick_edit",
            "futureWorkflowManualSelection",
            [
                "nonce" => wp_create_nonce("wp_rest"),
                "apiUrl" => rest_url("publishpress-future/v1"),
            ]
        );
    }

    public function enqueueBlockEditorScripts()
    {
        global $post;

        if (! $post) {
            return;
        }

        $postModel = new PostModel();
        $postModel->load($post->ID);

        $workflowsWithManualTrigger = $postModel->getValidWorkflowsWithManualTrigger($post->ID);

        if (empty($workflowsWithManualTrigger)) {
            return;
        }

        wp_enqueue_style("wp-components");

        wp_enqueue_script("wp-components");
        wp_enqueue_script("wp-plugins");
        wp_enqueue_script("wp-element");
        wp_enqueue_script("wp-data");

        wp_enqueue_script(
            "future_workflow_manual_selection_script_block_editor",
            plugins_url(
                "/src/assets/js/workflow-manual-selection-block-editor.js",
                PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE
            ),
            [
                "wp-plugins",
                "wp-components",
                "wp-element",
                "wp-data",
            ],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        wp_localize_script(
            "future_workflow_manual_selection_script_block_editor",
            "futureWorkflowManualSelection",
            [
                "nonce" => wp_create_nonce("wp_rest"),
                "apiUrl" => rest_url("publishpress-future/v1"),
                "postId" => $post->ID,
            ]
        );
    }

    public function registerRestField()
    {
        $postTypesModel = new PostTypesModel();
        $postTypes = $postTypesModel->getPostTypes();

        foreach ($postTypes as $postType) {
            register_rest_field(
                $postType->name,
                'publishpress_future_workflow_manual_trigger',
                [
                    'get_callback' => function ($post) {
                        $post = get_post();

                        if (! $post) {
                            return [
                                'enabledWorkflows' => []
                            ];
                        }

                        $postModel = new PostModel();
                        $postModel->load($post->ID);

                        $enabledWorkflows = $postModel->getManuallyEnabledWorkflows();

                        return [
                            'enabledWorkflows' => $enabledWorkflows,
                        ];
                    },
                    'update_callback' => function ($manuallyEnabledWorkflows, $post) {
                        $postModel = new PostModel();
                        $postModel->load($post->ID);

                        $manuallyEnabledWorkflows = array_map('intval', $manuallyEnabledWorkflows);

                        $postModel->setManuallyEnabledWorkflows($manuallyEnabledWorkflows);

                        $this->triggerManuallyEnabledWorkflow($post->ID, $manuallyEnabledWorkflows);

                        return true;
                    },
                    'schema' => [
                        'description' => 'Workflow Manual Trigger',
                        'type' => 'object',
                    ]
                ]
            );
        }
    }
}
