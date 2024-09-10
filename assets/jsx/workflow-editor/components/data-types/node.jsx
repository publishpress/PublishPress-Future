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
            },
            {
                name: "name",
                type: "string",
                label: "Name",
            },
            {
                name: "slug",
                type: "string",
                label: "Slug",
            },
            {
                name: "label",
                type: "string",
                label: "Label",
            },
            {
                name: "activation_timestamp",
                type: "string",
                label: "Activation Time",
            }
        ],
    };
}

export default NodeData;
