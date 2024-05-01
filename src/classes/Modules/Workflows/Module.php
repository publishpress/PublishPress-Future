<?php

namespace PublishPress\FuturePro\Modules\Workflows;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Node;
use PublishPress\FuturePro\Modules\Workflows\Domain\LegacyAction\TriggerWorkflow;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;

class Module implements InitializableInterface
{
    public const POST_TYPE_WORKFLOW = "ppfuture_workflow";

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var RestApiManagerInterface
     */
    private $restApiManager;

    private $nodeTypesModel;

    /**
     * @var CronSchedulesModelInterface
     */
    private $cronSchedulesModel;

    /**
     * @var WorkflowEngineInterface
     */
    private $workflowEngine;

    public function __construct(
        HookableInterface $hooksFacade,
        RestApiManagerInterface $restApiManager,
        NodeTypesModelInterface $nodeTypesModel,
        CronSchedulesModelInterface $cronSchedulesModel,
        WorkflowEngineInterface $workflowEngine
    ) {
        $this->hooks = $hooksFacade;
        $this->restApiManager = $restApiManager;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->workflowEngine = $workflowEngine;

        $this->workflowEngine->start();
    }

    public function initialize()
    {
        $this->hooks->addAction(CoreHooksAbstract::ACTION_ADMIN_MENU, [
            $this,
            "adminMenu",
        ]);
        $this->hooks->addAction(CoreHooksAbstract::ACTION_INIT_PLUGIN, [
            $this,
            "registerPostType",
        ]);
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, "enqueueScriptsEditor"]
        );
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, "enqueueScriptsList"]
        );
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, "enqueueScriptsLegacyAction"]
        );
        $this->hooks->addAction(CoreHooksAbstract::ACTION_REST_API_INIT, [
            $this->restApiManager,
            "register",
        ]);
        $this->hooks->addAction(CoreHooksAbstract::ACTION_LOAD_POST_PHP, [
            $this,
            "redirectToWorkflowEditor",
        ]);
        $this->hooks->addAction(CoreHooksAbstract::ACTION_LOAD_POST_NEW_PHP, [
            $this,
            "redirectToWorkflowEditor",
        ]);
        $this->hooks->addAction(
            "manage_" . self::POST_TYPE_WORKFLOW . "_posts_columns",
            [$this, "addCustomColumns"]
        );
        $this->hooks->addAction(
            "manage_" . self::POST_TYPE_WORKFLOW . "_posts_custom_column",
            [$this, "renderTriggersColumn"],
            10,
            2
        );
        $this->hooks->addAction(
            "manage_" . self::POST_TYPE_WORKFLOW . "_posts_custom_column",
            [$this, "renderPreviewColumn"],
            10,
            2
        );
        $this->hooks->addFilter(
            HooksAbstract::FILTER_PREPARE_POST_EXPIRATION_OPTS,
            [$this, "preparePostExpirationOpts"],
            10,
            2
        );
    }

    public function redirectToWorkflowEditor()
    {
        global $typenow, $pagenow;

        if ($typenow !== self::POST_TYPE_WORKFLOW) {
            return;
        }

        $url = admin_url("admin.php?page=future_workflow_editor");

        if ($pagenow === "post.php") {
            $postId = (int) $_GET["post"];

            if (empty($postId)) {
                return;
            }

            $url = add_query_arg("workflow", $postId, $url);
        } elseif ($pagenow !== "post-new.php") {
            return;
        }

        if (isset($_GET["action"]) && "trash" === $_GET["action"]) {
            return;
        }

        wp_redirect($url);
        exit();
    }

    public function adminMenu()
    {
        global $submenu;

        $indexAllWorkflows = array_search(
            "edit.php?post_type=ppfuture_workflow",
            array_column($submenu["publishpress-future"], 2)
        );

        $submenu["publishpress-future"][$indexAllWorkflows][0] = __(
            "Workflows",
            "publishpress-future-pro"
        );

        add_submenu_page(
            "edit.php?post_type=" . self::POST_TYPE_WORKFLOW,
            "My Custom Post Type Editor",
            "My Custom Post Type",
            "edit_posts",
            "future_workflow_editor",
            [$this, "renderEditorPage"]
        );
    }

    public function registerPostType()
    {
        register_post_type(self::POST_TYPE_WORKFLOW, [
            "labels" => [
                "name" => __("Future Workflows", "publishpress-future-pro"),
                "singular_name" => __("Future Workflow", "publishpress-future-pro"),
                "add_new" => __("Add New", "publishpress-future-pro"),
                "add_new_item" => __(
                    "Add New Workflow",
                    "publishpress-future-pro"
                ),
                "edit_item" => __("Edit Workflow", "publishpress-future-pro"),
                "new_item" => __("New Workflow", "publishpress-future-pro"),
                "view_item" => __("View Workflow", "publishpress-future-pro"),
                "search_items" => __(
                    "Search Workflows",
                    "publishpress-future-pro"
                ),
                "not_found" => __(
                    "No Workflows found",
                    "publishpress-future-pro"
                ),
                "not_found_in_trash" => __(
                    "No Workflows found in Trash",
                    "publishpress-future-pro"
                ),
                "parent_item_colon" => __(
                    "Parent Workflow:",
                    "publishpress-future-pro"
                ),
                "all_items" => __("All Workflows", "publishpress-future-pro"),
                "archives" => __(
                    "Workflow Archives",
                    "publishpress-future-pro"
                ),
                "insert_into_item" => __(
                    "Insert into workflow",
                    "publishpress-future-pro"
                ),
                "uploaded_to_this_item" => __(
                    "Uploaded to this workflow",
                    "publishpress-future-pro"
                ),
                "filter_items_list" => __(
                    "Filter workflows list",
                    "publishpress-future-pro"
                ),
                "items_list_navigation" => __(
                    "Workflows list navigation",
                    "publishpress-future-pro"
                ),
                "items_list" => __("Future Workflows list", "publishpress-future-pro"),
                "item_published" => __(
                    "Workflow published.",
                    "publishpress-future-pro"
                ),
                "item_published_privately" => __(
                    "Workflow published privately.",
                    "publishpress-future-pro"
                ),
                "item_reverted_to_draft" => __(
                    "Workflow reverted to draft.",
                    "publishpress-future-pro"
                ),
                "item_scheduled" => __(
                    "Workflow scheduled.",
                    "publishpress-future-pro"
                ),
                "item_updated" => __(
                    "Workflow updated.",
                    "publishpress-future-pro"
                ),
            ],
            "public" => false,
            "show_ui" => true,
            "show_in_menu" => "publishpress-future",
            "show_in_nav_menus" => false,
            "show_in_admin_bar" => true,
            "menu_position" => 20,
            "menu_icon" => "dashicons-randomize",
            "hierarchical" => false,
            "supports" => ["title"],
            "has_archive" => false,
            "rewrite" => false,
            "query_var" => false,
            "can_export" => true,
            "delete_with_user" => false,
            "show_in_rest" => true,
            "rest_base" => "workflows",
        ]);
    }

    public function renderEditorPage()
    {
        $workflowId = isset($_GET["workflow"]) ? (int) $_GET["workflow"] : 0;

        require_once __DIR__ . "/Views/editor.html.php";
    }

    public function addCustomColumns($columns)
    {
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

        $workflowFlow = get_post_meta($postId, "_workflow_flow", true);
        $workflowFlow = json_decode($workflowFlow, true);

        $triggers = [];

        if (empty($workflowFlow) || !isset($workflowFlow["nodes"])) {
            echo __("—", "publishpress-future-pro");
            return;
        }

        foreach ($workflowFlow["nodes"] as $node) {
            if (
                NodeTypesModel::NODE_TYPE_TRIGGER ===
                $node["data"]["elementarType"]
            ) {
                $triggers[] = $node["data"]["label"];
            }
        }

        echo implode(", ", $triggers);
    }

    public function renderPreviewColumn($column, $postId)
    {
        if ("workflow_preview" !== $column) {
            return;
        }

        $screenshot = get_the_post_thumbnail_url($postId, "thumbnail");

        if (empty($screenshot)) {
            echo __("No screenshot", "publishpress-future-pro");
        } else {
            $screenshotFull = get_the_post_thumbnail_url($postId, "full");
            require __DIR__ . "/Views/preview-column.html.php";
        }
    }

    public function enqueueScriptsList($hook)
    {
        if ("edit.php" !== $hook) {
            return;
        }

        global $post_type;
        if (self::POST_TYPE_WORKFLOW !== $post_type) {
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

    public function enqueueScriptsLegacyAction($hook)
    {
        wp_enqueue_style("wp-components");

        wp_enqueue_script("wp-components");
        wp_enqueue_script("wp-plugins");
        wp_enqueue_script("wp-element");
        wp_enqueue_script("wp-data");

        wp_enqueue_script(
            "future_workflow_legacy_action_script",
            plugins_url(
                "/src/assets/js/legacy-action.js",
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

        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithLegacyTriggerAsOptions();

        wp_localize_script(
            "future_workflow_legacy_action_script",
            "futureWorkflows",
            [
                "workflows" => $workflows,
            ]
        );
    }

    public function enqueueScriptsEditor($hook)
    {
        if ("admin_page_future_workflow_editor" !== $hook) {
            return;
        }

        global $post_type;
        if (empty($post_type)) {
            $post_type = self::POST_TYPE_WORKFLOW;
        }

        wp_enqueue_style("wp-components");
        wp_enqueue_style("wp-edit-post");
        wp_enqueue_style("wp-editor");

        wp_enqueue_style(
            "future_workflow_admin_style",
            plugins_url(
                "/src/assets/css/workflow-editor.css",
                PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE
            ),
            ["wp-components", "wp-edit-post", "wp-editor"],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION
        );

        wp_enqueue_script("wp-url");
        wp_enqueue_script("wp-element");
        wp_enqueue_script("wp-components");
        wp_enqueue_script("wp-data");

        wp_enqueue_script(
            "future_workflow_admin_script",
            plugins_url(
                "/src/assets/js/workflow-editor.js",
                PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE
            ),
            [
                "wp-element",
                "wp-components",
                "wp-url",
                "wp-data",
                "wp-api-fetch",
            ],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        wp_localize_script(
            "future_workflow_admin_script",
            "futureWorkflowEditor",
            [
                "isWP65OrLater" => version_compare(
                    get_bloginfo("version"),
                    "6.5",
                    ">="
                ),
                "apiUrl" => rest_url("publishpress-future/v1"),
                "workflowId" => isset($_GET["workflow"])
                    ? (int) $_GET["workflow"]
                    : 0,
                "nonce" => wp_create_nonce("wp_rest"),
                "nodeTypeCategories" => $this->nodeTypesModel->getCategories(),
                "currentUserId" => get_current_user_id(),
                "nodeTypes" => [
                    "triggers" => array_values(
                        $this->nodeTypesModel->convertInstancesToArray(
                            $this->nodeTypesModel->getTriggers(),
                            NodeTypesModel::NODE_TYPE_TRIGGER
                        )
                    ),
                    "actions" => array_values(
                        $this->nodeTypesModel->convertInstancesToArray(
                            $this->nodeTypesModel->getActions(),
                            NodeTypesModel::NODE_TYPE_ACTION
                        )
                    ),
                    "flows" => array_values(
                        $this->nodeTypesModel->convertInstancesToArray(
                            $this->nodeTypesModel->getFlows(),
                            NodeTypesModel::NODE_TYPE_FLOW
                        )
                    ),
                ],
                "cronSchedules" => $this->cronSchedulesModel->getCronSchedulesAsOptions(),
            ]
        );
    }

    public function preparePostExpirationOpts($opts, $postId)
    {
        $validViews = [
            'quick-edit',
            'bulk-edit',
        ];

        if (!isset($_REQUEST['future_action_view']) || ! in_array($_REQUEST['future_action_view'], $validViews)) {
            return $opts;
        }

        if (!isset($_REQUEST['future_action_action']) || TriggerWorkflow::ACTION_NAME !== $_REQUEST['future_action_action']) {
            return $opts;
        }

        $workflowId = isset($_REQUEST['future_action_pro_workflow']) ? (int) $_REQUEST['future_action_pro_workflow'] : 0;

        if (empty($workflowId)) {
            return $opts;
        }

        $opts['workflowId'] = $workflowId;
        $workflowModel = new WorkflowModel();
        $workflowModel->load($workflowId);

        $opts['workflowTitle'] = $workflowModel->getTitle();

        return $opts;
    }
}
