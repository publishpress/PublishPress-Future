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
                name: "label",
                type: "string",
                label: "Label",
            }
        ],
    };
}

export default NodeData;
