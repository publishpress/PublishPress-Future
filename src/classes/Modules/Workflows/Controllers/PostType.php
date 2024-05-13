<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Module;

class PostType implements InitializableInterface
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
        $this->hooks->addAction(CoreHooksAbstract::ACTION_INIT_PLUGIN, [
            $this,
            "registerPostType",
        ]);
    }

    public function registerPostType()
    {
        register_post_type(Module::POST_TYPE_WORKFLOW, [
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
}
