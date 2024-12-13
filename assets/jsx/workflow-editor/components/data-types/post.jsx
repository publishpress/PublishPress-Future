export function PostData() {
    return {
        name: "post",
        label: "Post",
        type: "object",
        objectType: "post",
        propertiesSchema: [
            {
                name: "title",
                type: "string",
                label: "Title",
                description: "The title of the post.",
            },
            {
                name: "content",
                type: "string",
                label: "Content",
                description: "The content of the post.",
            },
            {
                name: "content_text",
                type: "string",
                label: "Content (Plain Text)",
                description: "The content of the post in plain text.",
            },
            {
                name: "excerpt",
                type: "string",
                label: "Excerpt",
                description: "The excerpt of the post.",
            },
            {
                name: "status",
                type: "string",
                label: "Post Status",
                description: "The status of the post.",
            },
            {
                name: "type",
                type: "string",
                label: "Post Type",
                description: "The type of the post.",
            },
            {
                name: "id",
                type: "integer",
                label: "ID",
                description: "The unique identifier for the post.",
            },
            {
                name: "date",
                type: "datetime",
                label: "Publish Date",
                description: "The date when the post was published.",
            },
            {
                name: "modified",
                type: "datetime",
                label: "Modification Date",
                description: "The date when the post was last modified.",
            },
            {
                name: "permalink",
                type: "string",
                label: "Permalink",
                description: "The permalink of the post.",
            },
            {
                name: "author",
                type: "user",
                label: "Author",
                description: "The author of the post.",
            },
            {
                name: "meta",
                type: "meta",
                label: "Metadata",
                description: "The metadata of the post.",
            },
        ],
    };
}

export default PostData;
