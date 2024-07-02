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
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        $workflowId = (int)($_GET["workflow"] ?? 0);

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
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $postId = (int) $_GET["post"] ?? 0;

            if (empty($postId)) {
                return;
            }

            $url = add_query_arg("workflow", $postId, $url);
        } elseif ($pagenow !== "post-new.php") {
            return;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        $action = $_GET["action"] ?? "";
        if ("trash" === $action) {
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
        wp_enqueue_style("wp-notices");

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
        wp_enqueue_script("wp-notices");

        wp_enqueue_script(
            "future_workflow_editor_script",
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
                "wp-i18n",
                "wp-notices",
            ],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        wp_set_script_translations(
            'future_workflow_editor_script',
            'publishpress-future-pro',
            PUBLISHPRESS_FUTURE_PRO_BASE_PATH . '/languages'
        );

        $postTypesModel = new PostTypesModel();
        $postTypes = $postTypesModel->getPostTypesAsOptions();

        $postStatusesModel = new PostStatusesModel();
        $postStatuses = $postStatusesModel->getPostStatusesAsOptions();

        $taxonomiesModel = new TaxonomiesModel();
        $taxonomies = $taxonomiesModel->getTaxonomiesAsOptions();

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        $workflowId = (int)($_GET["workflow"] ?? 0);

        wp_localize_script(
            "future_workflow_editor_script",
            "futureWorkflowEditor",
            [
                "isWP65OrLater" => version_compare(
                    get_bloginfo("version"),
                    "6.5",
                    ">="
                ),
                "apiUrl" => rest_url("publishpress-future/v1"),
                "pluginVersion" => PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
                "assetsUrl" => PUBLISHPRESS_FUTURE_PRO_ASSETS_URL,
                "workflowId" => $workflowId,
                "nonce" => wp_create_nonce("wp_rest"),
                "nodeTypeCategories" => $this->nodeTypesModel->getCategories(),
                "currentUserId" => get_current_user_id(),
                "nodeTypes" => [
                    "triggers" => array_values(
                        $this->nodeTypesModel->convertInstancesToArray(
                            $this->nodeTypesModel->getTriggerNodes(),
                            NodeTypesModel::NODE_TYPE_TRIGGER
                        )
                    ),
                    "actions" => array_values(
                        $this->nodeTypesModel->convertInstancesToArray(
                            $this->nodeTypesModel->getActionNodes(),
                            NodeTypesModel::NODE_TYPE_ACTION
                        )
                    ),
                    "advanced" => array_values(
                        $this->nodeTypesModel->convertInstancesToArray(
                            $this->nodeTypesModel->getAdvancedNodes(),
                            NodeTypesModel::NODE_TYPE_ADVANCED
                        )
                    ),
                ],
                "cronSchedules" => $this->cronSchedulesModel->getCronSchedulesAsOptions(),
                "postTypes" => $postTypes,
                "postStatuses" => $postStatuses,
                "taxonomies" => $taxonomies,
                "welcomeGuidePages" => $this->getWelcomeGuidePages(),
            ]
        );
    }

    // phpcs:disable Generic.Files.LineLength.TooLong
    private function getWelcomeGuidePages()
    {
        return [
            [
                "title" => __("Welcome to the workflow editor", 'publishpress-future-pro'),
                "content" => __("In the PublishPress Workflow Editor, each workflow step is presented as a distinct 'node' in the workflow.", 'publishpress-future-pro'),
                "image" => '1-welcome-to-editor',
            ],
            [
                "title" => __("Use your imagination", 'publishpress-future-pro'),
                "content" => __("You're free to create very distinct workflows in your site, according to your needs.", 'publishpress-future-pro'),
                "image" => '2-use-imagination',
            ],
            [
                "title" => __("A basic workflow", 'publishpress-future-pro'),
                "content" => __("Every workflow requires at least two steps connected to each other: one trigger and one action.", 'publishpress-future-pro'),
                "image" => '3-basic-workflow',
            ],
            [
                "title" => __("Add steps to your workflow", 'publishpress-future-pro'),
                "content" => __("Drag and drop steps to add them to your workflow. Connect the steps to create a workflow.", 'publishpress-future-pro'),
                "image" => '4-add-steps',
            ],
            [
                "title" => __("Output and input", 'publishpress-future-pro'),
                "content" => __("Linked steps can pass data forward as input to the next step.", 'publishpress-future-pro'),
                "image" => '5-output-input',
            ],
            [
                "title" => __("Customize the workflow", 'publishpress-future-pro'),
                "content" => __("Click on a step to customize it. You can change the step's settings in the right sidebar.", 'publishpress-future-pro'),
                "image" => '6-customize-workflow',
            ],
            [
                "title" => __("Workflow validation", 'publishpress-future-pro'),
                "content" => __("Error messages will appear for any unfilled required settings, missed connections, or invalid values. Select the step to view the corresponding error in the sidebar.", 'publishpress-future-pro'),
                "image" => '7-workflow-validation',
            ],
            [
                "title" => __("Publish your workflow", 'publishpress-future-pro'),
                "content" => __("When you're ready, click the publish button to make your workflow live.", 'publishpress-future-pro'),
                "image" => '8-publish-workflow',
            ],
            [
                "title" => __("Need help?", 'publishpress-future-pro'),
                "content" => __("If you have any questions or need help, click the help button in the top right corner to access the support resources.", 'publishpress-future-pro'),
                "image" => '9-need-help',
            ],
        ];
    }
    // phpcs:enable Generic.Files.LineLength.TooLong
}
