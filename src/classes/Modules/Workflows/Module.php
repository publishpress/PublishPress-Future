<?php

namespace PublishPress\FuturePro\Modules\Workflows;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract;

class Module implements InitializableInterface
{
    public const POST_TYPE_WORKFLOW = 'ppfuture_workflow';

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooksFacade)
    {
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(HooksAbstract::ACTION_ADMIN_MENU, [$this, 'adminMenu']);
        $this->hooks->addAction(HooksAbstract::ACTION_INIT_PLUGIN, [$this, 'registerPostType']);
        $this->hooks->addAction(HooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT, [$this, 'enqueueScripts']);
        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'saveWorkflowMetadata']);

        add_action('load-post.php', function() {
            global $typenow, $pagenow;

            // Check if we're editing a post of the 'my_custom_post_type' type
            if ($typenow === self::POST_TYPE_WORKFLOW && $pagenow === 'post.php') {
                $postId = (int) $_GET['post'];

                // Redirect to our custom page
                wp_redirect(admin_url('admin.php?page=future_workflow_editor&workflow=' . $postId));
                exit;
            }
        });
    }

    public function adminMenu()
    {
        global $submenu;

        $indexAllWorkflows = array_search('edit.php?post_type=ppfuture_workflow', array_column($submenu['publishpress-future'], 2));

        $submenu['publishpress-future'][$indexAllWorkflows][0] = __('Workflows', 'publishpress-future-pro');

        add_submenu_page(
            'edit.php?post_type=' . self::POST_TYPE_WORKFLOW,
            'My Custom Post Type Editor',
            'My Custom Post Type',
            'edit_posts',
            'future_workflow_editor',
            [$this, 'renderEditorPage']
        );
    }

    public function registerPostType()
    {
        register_post_type(self::POST_TYPE_WORKFLOW, [
            'labels' => [
                'name' => __('Workflows', 'publishpress-future-pro'),
                'singular_name' => __('Workflow', 'publishpress-future-pro'),
                'add_new' => __('Add New', 'publishpress-future-pro'),
                'add_new_item' => __('Add New Workflow', 'publishpress-future-pro'),
                'edit_item' => __('Edit Workflow', 'publishpress-future-pro'),
                'new_item' => __('New Workflow', 'publishpress-future-pro'),
                'view_item' => __('View Workflow', 'publishpress-future-pro'),
                'search_items' => __('Search Workflows', 'publishpress-future-pro'),
                'not_found' => __('No Workflows found', 'publishpress-future-pro'),
                'not_found_in_trash' => __('No Workflows found in Trash', 'publishpress-future-pro'),
                'parent_item_colon' => __('Parent Workflow:', 'publishpress-future-pro'),
                'all_items' => __('All Workflows', 'publishpress-future-pro'),
                'archives' => __('Workflow Archives', 'publishpress-future-pro'),
                'insert_into_item' => __('Insert into workflow', 'publishpress-future-pro'),
                'uploaded_to_this_item' => __('Uploaded to this workflow', 'publishpress-future-pro'),
                'filter_items_list' => __('Filter workflows list', 'publishpress-future-pro'),
                'items_list_navigation' => __('Workflows list navigation', 'publishpress-future-pro'),
                'items_list' => __('Workflows list', 'publishpress-future-pro'),
                'item_published' => __('Workflow published.', 'publishpress-future-pro'),
                'item_published_privately' => __('Workflow published privately.', 'publishpress-future-pro'),
                'item_reverted_to_draft' => __('Workflow reverted to draft.', 'publishpress-future-pro'),
                'item_scheduled' => __('Workflow scheduled.', 'publishpress-future-pro'),
                'item_updated' => __('Workflow updated.', 'publishpress-future-pro'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => 'publishpress-future',
            'show_in_nav_menus' => false,
            'show_in_admin_bar' => true,
            'menu_position' => 20,
            'menu_icon' => 'dashicons-randomize',
            'hierarchical' => false,
            'supports' => ['title'],
            'has_archive' => false,
            'rewrite' => false,
            'query_var' => false,
            'can_export' => true,
            'delete_with_user' => false,
            'show_in_rest' => true,
            'rest_base' => 'workflows',
        ]);
    }

    public function renderEditorPage()
    {
        $workflowId = isset($_GET['workflow']) ? (int) $_GET['workflow'] : 0;

        if (empty($workflowId)) {
            return;
        }

        require_once __DIR__ . '/Views/editor.html.php';
    }

    public function enqueueScripts($hook)
    {
        if ('admin_page_future_workflow_editor' !== $hook) {
            return;
        }

        global $post_type;
        if (empty($post_type)) {
            $post_type = self::POST_TYPE_WORKFLOW;
        }

        wp_enqueue_style(
            'future_workflow_admin_ui_kit_style',
            plugins_url('/src/assets/libs/uikit-3.15.15/css/uikit.css', PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE),
            false,
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            'all'
        );

        wp_enqueue_script(
            'future_workflow_admin_ui_kit',
            plugins_url('/src/assets/libs/uikit-3.15.15/js/uikit.js', PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE),
            false,
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        wp_enqueue_script(
            'future_workflow_admin_ui_kit_icons',
            plugins_url('/src/assets/libs/uikit-3.15.15/js/uikit-icons.js', PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE),
            ['future_workflow_admin_ui_kit'],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        wp_enqueue_script('wp-url');
        wp_enqueue_script('wp-element');
        wp_enqueue_script('wp-components');
        wp_enqueue_script('wp-data');

        wp_enqueue_script(
            'future_workflow_admin_script',
            plugins_url('/src/assets/js/workflow-editor.js', PUBLISHPRESS_FUTURE_PRO_PLUGIN_FILE),
            [
                'future_workflow_admin_ui_kit',
                'future_workflow_admin_ui_kit_icons',
                'wp-element',
                'wp-components',
                'wp-url',
                'wp-data',
            ],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );
    }

    public function saveWorkflowMetadata($postId)
    {
        if (! isset($_POST['future_workflow_editor_nonce']) || ! wp_verify_nonce(
            $_POST['future_workflow_editor_nonce'],
            'future_workflow_editor'
        )) {
            return;
        }

        if (! current_user_can('edit_post', $postId)) {
            return;
        }

        remove_action('save_post', [$this, 'saveWorkflowMetadata']);

        $workflowData = sanitize_textarea_field($_POST['future_workflow_data']);

        wp_update_post(
            [
                'ID' => $postId,
                'post_content' => $workflowData
            ],
            true,
            false
        );

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'saveWorkflowMetadata']);
    }
}
