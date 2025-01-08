export function FutureActionData() {
    return {
        name: "future_action",
        label: "Future Action",
        type: "object",
        objectType: "future_action",
        propertiesSchema: [
            {
                name: "enabled",
                type: "boolean",
                label: "Enabled",
                description: "Whether the future action is enabled.",
            },
            {
                name: "action",
                type: "string",
                label: "Action",
                description: "The action to be performed.",
            },
            {
                name: "new_status",
                type: "string",
                label: "New Status",
                description: "The new status of the post.",
            },
            {
                name: "date",
                type: "integer",
                label: "Date",
                description: "The date when the future action will be performed in Unix timestamp format.",
            },
            {
                name: "date_string",
                type: "datetime",
                label: "Date String",
                description: "The date when the future action will be performed.",
            },
            {
                name: "terms",
                type: "terms_array",
                label: "Terms",
                description: "The terms to be used in the future action.",
            }
        ]
    }
}

export default FutureActionData;
