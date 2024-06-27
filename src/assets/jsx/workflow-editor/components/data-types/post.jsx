export function PostData() {
    return {
        name: "post",
        label: "Post",
        type: "object",
        objectType: "post",
        propertiesSchema: [
            {
                name: "post_title",
                type: "string",
                label: "Title",
            },
            {
                name: "post_content",
                type: "string",
                label: "Content",
            },
            {
                name: "post_excerpt",
                type: "string",
                label: "Excerpt",
            },
            {
                name: "post_status",
                type: "string",
                label: "Post Status",
            },
            {
                name: "post_type",
                type: "string",
                label: "Post Type",
            },
            {
                name: "id",
                type: "integer",
                label: "ID",
            },
            {
                name: "post_date",
                type: "datetime",
                label: "Publish Date",
            },
            {
                name: "post_modified",
                type: "datetime",
                label: "Modification Date",
            },
            {
                name: "permalink",
                type: "string",
                label: "Permalink",
            }
        ],
    };
}

export default PostData;
