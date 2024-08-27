<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as FutureCoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Module;

class WorkflowsList implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
    }

    public function initialize()
    {
        $this->hooks->addAction(CoreHooksAbstract::ACTION_ADMIN_MENU, [
            $this,
            "adminMenu",
        ]);

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, "enqueueScriptsList"]
        );

        $this->hooks->addAction(
            "manage_" . Module::POST_TYPE_WORKFLOW . "_posts_columns",
            [$this, "addCustomColumns"]
        );

        $this->hooks->addAction(
            "manage_" . Module::POST_TYPE_WORKFLOW . "_posts_custom_column",
            [$this, "renderTriggersColumn"],
            10,
            2
        );

        $this->hooks->addAction(
            "manage_" . Module::POST_TYPE_WORKFLOW . "_posts_custom_column",
            [$this, "renderPreviewColumn"],
            10,
            2
        );

        $this->hooks->addAction(
            "manage_" . Module::POST_TYPE_WORKFLOW . "_posts_custom_column",
            [$this, "renderStatusColumn"],
            10,
            2
        );

        $this->hooks->addAction(
            FutureCoreHooksAbstract::ACTION_ADMIN_INIT,
            [$this, "updateWorkflowStatus"]
        );
    }

    public function adminMenu()
    {
        global $submenu;

        if (!isset($submenu["publishpress-future"])) {
            return;
        }

        $indexAllWorkflows = array_search(
            "edit.php?post_type=ppfuture_workflow",
            array_column($submenu["publishpress-future"], 2)
        );

        $submenu["publishpress-future"][$indexAllWorkflows][0] = __(
            "Action Workflows",
            "publishpress-future-pro"
        );

        add_submenu_page(
            "edit.php?post_type=" . Module::POST_TYPE_WORKFLOW,
            "Action Workflows",
            "Action Workflows",
            "edit_posts",
            "future_workflow_editor",
            [$this, "renderEditorPage"]
        );
    }

    public function renderEditorPage()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_RENDER_WORKFLOW_EDITOR_PAGE);
    }

    public function enqueueScriptsList($hook)
    {
        if ("edit.php" !== $hook) {
            return;
        }

        global $post_type;
        if (Module::POST_TYPE_WORKFLOW !== $post_type) {
            return;
        }

        wp_enqueue_style("wp-jquery-ui-dialog");
        wp_enqueue_script("jquery-ui-dialog");

        wp_enqueue_script(
            "future_workflow_list_script",
            plugins_url(
                "/src/assets/js/workflow-list.js",
                PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE
            ),
            ["jquery", "jquery-ui-dialog"],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );
    }

    public function addCustomColumns($columns)
    {
        $columns["workflow_status"] = __("Status", "publishpress-future-pro");
        $columns["workflow_triggers"] = __(
            "Triggers",
            "publishpress-future-pro"
        );
        $columns["workflow_preview"] = __("Preview", "publishpress-future-pro");

        // Move the date column to the end
        $date = $columns["date"];
        unset($columns["date"]);
        $columns["date"] = $date;

        return $columns;
    }

    public function renderTriggersColumn($column, $postId)
    {
        if ("workflow_triggers" !== $column) {
            return;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($postId);

        $workflowFlow = $workflowModel->getFlow();

        $triggers = [];

        if (empty($workflowFlow) || !isset($workflowFlow["nodes"])) {
            esc_html_e("—", "publishpress-future-pro");
            return;
        }

        foreach ($workflowFlow["nodes"] as $node) {
            if (
                NodeTypesModel::NODE_TYPE_TRIGGER ===
                $node["data"]["elementaryType"]
            ) {
                $nodeType = $this->nodeTypesModel->getNodeType($node["data"]["name"]);

                if (empty($nodeType)) {
                    $triggers[] = esc_html($node["data"]["name"]);
                } else {
                    $triggers[] = $nodeType->getLabel();
                }
            }
        }

        echo esc_html(implode(", ", $triggers));
    }

    public function renderPreviewColumn($column, $postId)
    {
        if ("workflow_preview" !== $column) {
            return;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($postId);

        $workflowModel->convertLegacyScreenshots();

        $screenshot = $workflowModel->getScreenshotUrl('thumbnail');
        $screenshotFull = $workflowModel->getScreenshotUrl();

        if (empty($screenshotFull)) {
            esc_html_e("No screenshot", "publishpress-future-pro");
            return;
        }

        require __DIR__ . "/../Views/preview-column.html.php";
    }

    public function renderStatusColumn($column, $postId)
    {
        if ("workflow_status" !== $column) {
            return;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($postId);

        $workflowStatus = $workflowModel->getStatus();

        $toggleUrl = wp_nonce_url(
            add_query_arg(
                [
                    'pp_action' => 'change_workflow_status',
                    'workflow_id' => $postId,
                    'status' => ('draft' === $workflowStatus) ? 'publish' : 'draft'
                ],
                admin_url('edit.php?post_type=' . Module::POST_TYPE_WORKFLOW)
            ),
            'change_workflow_status_' . $postId
        );

        $buttonClass = ('draft' === $workflowStatus) ? 'status-draft' : 'status-published';
        $buttonText = ('draft' === $workflowStatus) ? __("Deactivated", "publishpress-future-pro") : __("Activated", "publishpress-future-pro");

        $icon = ('draft' === $workflowStatus) ? '<span class="dashicons dashicons-no"></span>' : '<span class="dashicons dashicons-yes"></span>'; // X for draft, checkmark for published
        $title = ('draft' === $workflowStatus) ? __('Click to activate this workflow', 'publishpress-future-pro') : __('Click to deactivate this workflow', 'publishpress-future-pro');

        printf(
            '<a href="%s" class="button %s change-workflow-status" title="%s">%s <span class="change-workflow-status-text">%s</span></a>',
            esc_url($toggleUrl),
            esc_attr($buttonClass),
            esc_attr($title),
            $icon,
            esc_html($buttonText)
        );
    }

    public function updateWorkflowStatus()
    {
        if (!isset($_GET['pp_action']) || 'change_workflow_status' !== $_GET['pp_action']) {
            return;
        }

        if (!isset($_GET['workflow_id'])) {
            return;
        }

        if (!isset($_GET['status'])) {
            return;
        }

        if (!isset($_GET['_wpnonce'])) {
            return;
        }

        if (!wp_verify_nonce($_GET['_wpnonce'], 'change_workflow_status_' . $_GET['workflow_id'])) {
            return;
        }

        $workflowId = (int) $_GET['workflow_id'];
        $workflowStatus = sanitize_key($_GET['status']);

        $workflowModel = new WorkflowModel();
        $workflowModel->load($workflowId);

        if ('publish' === $workflowStatus) {
            $workflowModel->publish();
        } else {
            $workflowModel->unpublish();
        }

        wp_redirect(
            esc_url(
                add_query_arg(
                    'post_type',
                    Module::POST_TYPE_WORKFLOW,
                    admin_url('edit.php')
                )
            )
        );
        exit;
    }
}
