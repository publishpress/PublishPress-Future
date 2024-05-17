<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\Future\Core\HooksAbstract as FutureCoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Models\PostModel;

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
    }

    public function registerQuickEditCustomBox($columnName, $postType)
    {
        // Check there are workflows with the manual post trigger
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithManualTrigger();

        if (empty($workflows)) {
            return;
        }

        require __DIR__ . "/../Views/manual-trigger-quick-edit.html.php";
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

        // Trigger the action to trigger those workflows
        foreach ($manuallyEnabledWorkflows as $workflowId) {
            $this->hooks->doAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, (int)$postId, (int)$workflowId);
        }
    }

    public function enqueueQuickEditScripts()
    {
        wp_enqueue_style("wp-components");

        wp_enqueue_script("wp-components");
        wp_enqueue_script("wp-plugins");
        wp_enqueue_script("wp-element");
        wp_enqueue_script("wp-data");

        wp_enqueue_script(
            "future_workflow_manual_selection_script",
            plugins_url(
                "/src/assets/js/workflow-manual-selection.js",
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
            "future_workflow_manual_selection_script",
            "futureWorkflowManualSelection",
            [
                "nonce" => wp_create_nonce("wp_rest"),
                "apiUrl" => rest_url("publishpress-future/v1"),
            ]
        );
    }
}
