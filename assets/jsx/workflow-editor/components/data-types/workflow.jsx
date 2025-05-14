export function WorkflowData() {
    return {
        name: "workflow",
        label: "Future Workflow",
        primitiveType: "object",
        propertiesSchema: [
            {
                name: "id",
                type: "integer",
                label: "ID",
                description: "The unique identifier for the workflow.",
            },
            {
                name: "title",
                type: "string",
                label: "Title",
                description: "The title of the workflow.",
            },
            {
                name: "description",
                type: "string",
                label: "Description",
                description: "The description of the workflow.",
            },
            {
                name: "modified_at",
                type: "datetime",
                label: "Modification Date",
                description: "The date when the workflow was last modified.",
            },
            {
                name: "meta",
                type: "meta",
                label: "Metadata",
                description: "The metadata of the workflow.",
                table: "_postmeta",
            },
            {
                name: "execution_id",
                type: "string",
                label: "Execution ID",
                description: "The unique identifier for the workflow execution.",
            },
            {
                name: "execution_trace",
                type: "array",
                label: "Execution Trace",
                description: "The trace of the workflow execution.",
                items: {
                    type: "string",
                },
            },
        ],
    };
}

export default WorkflowData;
