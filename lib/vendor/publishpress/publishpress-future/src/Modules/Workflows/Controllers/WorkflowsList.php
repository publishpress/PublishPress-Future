<?php

namespace PublishPress\Future\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as FutureCoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Module;

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
            "post_row_actions",
            [$this, "renderStatusAction"],
            10,
            2
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
            FutureCoreHooksAbstract::ACTION_ADMIN_INIT,
            [$this, "updateWorkflowStatus"]
        );

        $this->hooks->addAction(
            'the_title',
            [$this, "addWorkflowStatusToTitle"],
            10,
            2
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
            "post-expirator"
        );

        add_submenu_page(
            "edit.php?post_type=" . Module::POST_TYPE_WORKFLOW,
            "Action Workflows",
            "Action Workflows",
            "manage_options",
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

        // wp_enqueue_style("wp-jquery-ui-dialog");
        // wp_enqueue_script("jquery-ui-dialog");

        // wp_enqueue_script(
        //     "future_workflow_list_script",
        //     Plugin::getScriptUrl('workflowList'),
        //     [
        //         "jquery",
        //         "jquery-ui-dialog",
        //     ],
        //     PUBLISHPRESS_FUTURE_VERSION,
        //     true
        // );
    }

    public function addCustomColumns($columns)
    {
        $columns["workflow_triggers"] = __(
            "Triggers",
            "post-expirator"
        );
        $columns["workflow_preview"] = __("Preview", "post-expirator");

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
            esc_html_e("—", "post-expirator");
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
            esc_html_e("No screenshot", "post-expirator");
            return;
        }

        require __DIR__ . "/../Views/preview-column.html.php";
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

        if (!wp_verify_nonce(sanitize_key($_GET['_wpnonce']), 'change_workflow_status_' . (int) $_GET['workflow_id'])) {
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

    public function renderStatusAction($actions, $post)
    {
        if (Module::POST_TYPE_WORKFLOW !== $post->post_type) {
            return $actions;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($post->ID);

        $workflowStatus = $workflowModel->getStatus();

        $toggleUrl = wp_nonce_url(
            add_query_arg(
                [
                    'pp_action' => 'change_workflow_status',
                    'workflow_id' => $post->ID,
                    'status' => ('draft' === $workflowStatus) ? 'publish' : 'draft'
                ],
                admin_url('edit.php?post_type=' . Module::POST_TYPE_WORKFLOW)
            ),
            'change_workflow_status_' . $post->ID
        );

        $statuses = [
            'draft' => [
                'action' => 'activate',
                'text' => __('Activate', 'post-expirator'),
                'title' => __('Activate', 'post-expirator'),
                'status' => 'publish',
            ],
            'publish' => [
                'action' => 'deactivate',
                'text' => __('Deactivate', 'post-expirator'),
                'title' => __('Deactivate', 'post-expirator'),
                'status' => 'draft',
            ]
        ];

        $statusData = isset($statuses[$workflowStatus]) ? $statuses[$workflowStatus] : [];

        if (empty($statusData)) {
            return $actions;
        }

        $actions = [
            $statusData['action'] => sprintf(
                '<a href="%s" class="pp-future-workflow-%s-inline" title="%s">%s</a>',
                esc_url(
                    wp_nonce_url(
                        add_query_arg(
                            [
                                'pp_action' => 'change_workflow_status',
                                'workflow_id' => $post->ID,
                                'status' => $statusData['status']
                            ],
                            admin_url('edit.php?post_type=' . Module::POST_TYPE_WORKFLOW)
                        ),
                        'change_workflow_status_' . $post->ID
                    )
                ),
                $statusData['action'],
                $statusData['text'],
                $statusData['title']
            ),
        ] + $actions;

        return $actions;
    }

    public function addWorkflowStatusToTitle($title, $id)
    {
        if (!function_exists('get_current_screen')) {
            return $title;
        }

        $currentScreen = get_current_screen();

        if (
            !is_admin() || (
                // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            (!isset($_GET['post_type']) || $_GET['post_type'] !== Module::POST_TYPE_WORKFLOW) &&
                ($currentScreen && $currentScreen->id !== 'edit-' . Module::POST_TYPE_WORKFLOW)
            )
        ) {
            return $title;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($id);

        if (empty($workflowModel)) {
            return $title;
        }

        $workflowStatus = $workflowModel->getStatus();

        if ('publish' === $workflowStatus) {
            $title = ' ▶ ' . $title;
        }

        return $title;
    }
}
