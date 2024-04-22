export function Post() {
    return {
        type: "post",
        label: "Post",
        propertiesSchema: {
            title: {
                type: "string",
                label: "Title",
            },
            content: {
                type: "string",
                label: "Content",
            },
            excerpt: {
                type: "string",
                label: "Excerpt",
            },
            status: {
                type: "string",
                label: "Status",
            },
            type: {
                type: "string",
                label: "Type",
            },
            id: {
                type: "integer",
                label: "ID",
            },
        },
    };
}

export default Post;
