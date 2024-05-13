<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;
use PublishPress\FuturePro\Modules\Workflows\Models\PostStatusesModel;
use PublishPress\FuturePro\Modules\Workflows\Models\PostTypesModel;
use PublishPress\FuturePro\Modules\Workflows\Models\TaxonomiesModel;
use PublishPress\FuturePro\Modules\Workflows\Module;

class WorkflowEditor implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    /**
     * @var CronSchedulesModelInterface
     */
    private $cronSchedulesModel;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        CronSchedulesModelInterface $cronSchedulesModel
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cronSchedulesModel = $cronSchedulesModel;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_RENDER_WORKFLOW_EDITOR_PAGE,
            [$this, "renderEditorPage"]
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, "enqueueScriptsEditor"]
        );

        $this->hooks->addAction(CoreHooksAbstract::ACTION_LOAD_POST_PHP, [
            $this,
            "redirectToWorkflowEditor",
        ]);

        $this->hooks->addAction(CoreHooksAbstract::ACTION_LOAD_POST_NEW_PHP, [
            $this,
            "redirectToWorkflowEditor",
        ]);
    }

    public function renderEditorPage()
    {
        $workflowId = isset($_GET["workflow"]) ? (int) $_GET["workflow"] : 0;

        require_once __DIR__ . "/../Views/editor.html.php";
    }

    public function redirectToWorkflowEditor()
    {
        global $typenow, $pagenow;

        if ($typenow !== Module::POST_TYPE_WORKFLOW) {
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

    public function enqueueScriptsEditor($hook)
    {
        if ("admin_page_future_workflow_editor" !== $hook) {
            return;
        }

        global $post_type;
        if (empty($post_type)) {
            $post_type = Module::POST_TYPE_WORKFLOW;
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
        wp_enqueue_script("wp-plugins");

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
                "wp-plugins",
            ],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        $postTypesModel = new PostTypesModel();
        $postTypes = $postTypesModel->getPostTypesAsOptions();

        $postStatusesModel = new PostStatusesModel();
        $postStatuses = $postStatusesModel->getPostStatusesAsOptions();

        $taxonomiesModel = new TaxonomiesModel();
        $taxonomies = $taxonomiesModel->getTaxonomiesAsOptions();

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
                "postTypes" => $postTypes,
                "postStatuses" => $postStatuses,
                "taxonomies" => $taxonomies,
            ]
        );
    }
}
