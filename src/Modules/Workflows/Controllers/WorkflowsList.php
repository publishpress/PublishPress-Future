<?php

namespace PublishPress\Future\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as FutureCoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\StepTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Module;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use Throwable;

class WorkflowsList implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var StepTypesModelInterface
     */
    private $stepTypesModel;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var SettingsFacade
     */
    private $settingsFacade;

    public function __construct(
        HookableInterface $hooks,
        StepTypesModelInterface $stepTypesModel,
        LoggerInterface $logger,
        SettingsFacade $settingsFacade
    ) {
        $this->hooks = $hooks;
        $this->stepTypesModel = $stepTypesModel;
        $this->logger = $logger;
        $this->settingsFacade = $settingsFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_MENU,
            [$this, "adminMenu"],
            20
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_INIT,
            [$this, "fixWorkflowEditorPageTitle"]
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS,
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
            [$this, "renderStatusColumn"],
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

        $this->hooks->addAction(
            'admin_footer',
            [$this, "addScheduledActionsButton"]
        );
    }

    public function adminMenu()
    {
        try {
            global $submenu;

            if (!isset($submenu["publishpress-future"])) {
                return;
            }

            $this->renameWorkflowsSubmenu();

            add_submenu_page(
                '',
                "Action Workflow Editor",
                "Action Workflow Editor",
                "manage_options",
                "future_workflow_editor",
                [$this, "renderEditorPage"]
            );
        } catch (Throwable $th) {
            $this->logger->error('Error adding workflows menu: ' . $th->getMessage());
        }
    }

    private function renameWorkflowsSubmenu()
    {
        global $submenu;

        $indexAllWorkflows = array_search(
            "edit.php?post_type=" . Module::POST_TYPE_WORKFLOW,
            array_column($submenu["publishpress-future"], 2)
        );

        $submenu["publishpress-future"][$indexAllWorkflows][0] = __("Action Workflows", "post-expirator");
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

        wp_enqueue_style(
            'pp-future-workflows-list',
            Plugin::getAssetUrl('css/workflows-list.css'),
            [],
            PUBLISHPRESS_FUTURE_VERSION
        );
    }

    public function addCustomColumns($columns)
    {
        $columns["workflow_status"] = __("Status", "post-expirator");

        $columns["workflow_triggers"] = __(
            "Triggers",
            "post-expirator"
        );

        // Move the date column to the end
        if (isset($columns["date"])) {
            $date = $columns["date"];
            unset($columns["date"]);
            $columns["date"] = $date;
        }

        return $columns;
    }

    public function renderStatusColumn($column, $postId)
    {
        if ("workflow_status" !== $column) {
            return;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($postId);

        $workflowStatus = $workflowModel->getStatus();
        $isActive = $workflowStatus === 'publish';

        $title = $isActive ? __('Deactivate', 'post-expirator') : __('Activate', 'post-expirator');

        $icon = $isActive ? 'yes' : 'no';
        $iconClass = $isActive ? 'active' : 'inactive';

        $toggleUrl = esc_url(
            wp_nonce_url(
                add_query_arg(
                    [
                        'pp_action' => 'change_workflow_status',
                        'workflow_id' => $postId,
                        'status' => $isActive ? 'draft' : 'publish'
                    ],
                    admin_url('edit.php?post_type=' . Module::POST_TYPE_WORKFLOW)
                ),
                'change_workflow_status_' . $postId
            )
        );

        echo sprintf(
            '<a href="%s"><i class="pp-future-workflow-status-icon dashicons dashicons-%s %s" title="%s"></i> </a>',
            esc_url($toggleUrl),
            esc_attr($icon),
            esc_attr($iconClass),
            esc_attr($title)
        );
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
                StepTypesModel::STEP_TYPE_TRIGGER ===
                $node["data"]["elementaryType"]
            ) {
                $nodeType = $this->stepTypesModel->getStepType($node["data"]["name"]);

                if (empty($nodeType)) {
                    $triggers[] = esc_html($node["data"]["name"]);
                } else {
                    $triggers[] = $nodeType->getLabel();
                }
            }
        }

        echo esc_html(implode(", ", $triggers));
    }

    public function updateWorkflowStatus()
    {
        try {
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
        } catch (Throwable $th) {
            $this->logger->error('Error updating workflow status: ' . $th->getMessage());
        }

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

    public function addWorkflowStatusToTitle($title, $id = null)
    {
        if (!function_exists('get_current_screen') || empty($id)) {
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

        return $title;
    }

    public function fixWorkflowEditorPageTitle()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (!isset($_GET['page']) || 'future_workflow_editor' !== $_GET['page']) {
            return;
        }

        global $title;

        $title = __("Action Workflow Editor", "post-expirator");
    }

    public function addScheduledActionsButton()
    {
        if (!is_admin()) {
            return;
        }

        global $current_screen;

        if (!isset($current_screen)) {
            return;
        }

        if (
            Module::POST_TYPE_WORKFLOW !== $current_screen->post_type
            && 'toplevel_page_publishpress-future' !== $current_screen->id
        ) {
            return;
        }

        $url = admin_url('admin.php?page=publishpress-future-scheduled-actions');

        $customButton = sprintf(
            '<a href="%s" class="page-title-action">%s</a>',
            esc_url($url),
            esc_html__('Scheduled Actions', 'post-expirator')
        );

        $titleClass = 'toplevel_page_publishpress-future' === $current_screen->id
            ? 'pp-settings-title'
            : 'page-title-action';

        // Insert the button into the DOM via JavaScript
        // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
        echo '<script type="text/javascript">
            jQuery(document).ready(function($) {
                $(".wrap .' . esc_js($titleClass) . ':first").after(\'' . $customButton . '\');
            });
        </script>';
        // phpcs:enable
    }
}
