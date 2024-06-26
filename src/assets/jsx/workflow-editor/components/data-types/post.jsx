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
            },
            {
                name: "content",
                type: "string",
                label: "Content",
            },
            {
                name: "excerpt",
                type: "string",
                label: "Excerpt",
            },
            {
                name: "status",
                type: "string",
                label: "Post Status",
            },
            {
                name: "type",
                type: "string",
                label: "Post Type",
            },
            {
                name: "id",
                type: "integer",
                label: "ID",
            },
            {
                name: "date",
                type: "datetime",
                label: "Publish Date",
            },
            {
                name: "modified",
                type: "datetime",
                label: "Modifcation Date",
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
