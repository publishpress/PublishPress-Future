export function WorkflowData() {
    return {
        name: "workflow",
        label: "Future Workflow",
        type: "object",
        objectType: "workflow",
        propertiesSchema: [
            {
                name: "id",
                type: "integer",
                label: "ID",
            },
            {
                name: "title",
                type: "string",
                label: "Title",
            },
            {
                name: "description",
                type: "string",
                label: "Description",
            },
            {
                name: "modified_at",
                type: "datetime",
                label: "Modification Date",
            },
            {
                name: "steps",
                type: "node",
                label: "Steps",
            }
        ],
    };
}

export default WorkflowData;
