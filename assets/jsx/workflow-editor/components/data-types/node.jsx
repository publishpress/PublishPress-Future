export function NodeData() {
    return {
        name: "node",
        label: "Workflow Node",
        type: "object",
        objectType: "node",
        propertiesSchema: [
            {
                name: "id",
                type: "integer",
                label: "ID",
                description: "The unique identifier for the node.",
            },
            {
                name: "name",
                type: "string",
                label: "Name",
                description: "The name of the node.",
            },
            {
                name: "slug",
                type: "string",
                label: "Slug",
                description: "The slug of the node.",
            },
            {
                name: "label",
                type: "string",
                label: "Label",
                description: "The label of the node.",
            },
            {
                name: "activation_timestamp",
                type: "string",
                label: "Activation Time",
                description: "The timestamp when the node was activated.",
            },
            {
                name: "postId",
                type: "integer",
                label: "Post ID",
                description: "The ID of the post that triggered the node.",
            }
        ],
    };
}

export default NodeData;
