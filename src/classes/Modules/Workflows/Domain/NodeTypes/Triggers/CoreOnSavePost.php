<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;

class CoreOnSavePost implements NodeTypeInterface
{
    public function getType(): string
    {
        return "genericTrigger";
    }

    public function getName(): string
    {
        return "core/save-post";
    }

    public function getLabel(): string
    {
        return __("Post is saved", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger is fired when a post is saved.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "media-document";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "post";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Post Query", "publishpress-future-pro"),
                "description" => __("The query defines the posts that will trigger this action.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "post_query",
                        "type" => "post_query",
                        "label" => __("Post query", "publishpress-future-pro"),
                        "description" => __(
                            "The query defines the posts that will trigger this action.",
                            "publishpress-future-pro"
                        ),
                    ],
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'post',
                'type' => 'post',
                'title' => __("New Post", "publishpress-future-pro"),
                'description' => __("The post that was saved, with the new properties.", "publishpress-future-pro"),
            ],
            [
                'name' => 'old_post',
                'type' => 'post',
                'title' => __("Old Post", "publishpress-future-pro"),
                'description' => __("The post that was saved, with the old properties.", "publishpress-future-pro"),
            ]
        ];
    }
}

/*
QUERY:

* post id (one or more)
* post type (one or more - search, or allow custom typed values)
* post status (one or more)
* post author (one or more)
* post author role (one or more)
* post author capability (one or more)
* post taxonomy (one or more, taxonomy and terms)
* post title (equals, contains, starts with, ends with)
* post content (equals, contains, starts with, ends with)
* post excerpt (equals, contains, starts with, ends with)
* post date (before, after, between)
* post modified date (before, after, between)
* post parent
* post slug (equals, contains, starts with, ends with)
* meta data (key, value, compare)
* user meta data (key, value, compare)
* user role (one or more)
* user capability (one or more)
* user email (equals, contains, starts with, ends with)
* user login (equals, contains, starts with, ends with)
* user nicename (equals, contains, starts with, ends with)
*/

/*
[
    "post_id" => [
        "type" => "string",
        "title" => __("Post ID", "publishpress-future-pro"),
        "description" => __("The ID of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_status" => [
        "type" => "string",
        "title" => __("Post Status", "publishpress-future-pro"),
        "description" => __("The status of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_type" => [
        "type" => "string",
        "title" => __("Post Type", "publishpress-future-pro"),
        "description" => __("The type of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_author" => [
        "type" => "string",
        "title" => __("Post Author", "publishpress-future-pro"),
        "description" => __("The author of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_author_role" => [
        "type" => "string",
        "title" => __("Post Author Role", "publishpress-future-pro"),
        "description" => __("The role of the author of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_taxonomy" => [
        "type" => "string",
        "title" => __("Post Taxonomy", "publishpress-future-pro"),
        "description" => __("The taxonomy of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_title" => [
        "type" => "string",
        "title" => __("Post Title", "publishpress-future-pro"),
        "description" => __("The title of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_content" => [
        "type" => "string",
        "title" => __("Post Content", "publishpress-future-pro"),
        "description" => __("The content of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_excerpt" => [
        "type" => "string",
        "title" => __("Post Excerpt", "publishpress-future-pro"),
        "description" => __("The excerpt of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_date" => [
        "type" => "string",
        "title" => __("Post Date", "publishpress-future-pro"),
        "description" => __("The date of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_modified_date" => [
        "type" => "string",
        "title" => __("Post Modified Date", "publishpress-future-pro"),
        "description" => __("The modified date of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_parent" => [
        "type" => "string",
        "title" => __("Post Parent", "publishpress-future-pro"),
        "description" => __("The parent of the post that was saved.", "publishpress-future-pro"),
    ],
    "post_slug" => [
        "type" => "string",
        "title" => __("Post Slug", "publishpress-future-pro"),
        "description" => __("The slug of the post that was saved.", "publishpress-future-pro"),
    ],
    "meta_data" => [
        "type" => "string",
        "title" => __("Meta Data", "publishpress-future-pro"),
        "description" => __("The meta data of the post that was saved.", "publishpress-future-pro"),
    ],
    */
