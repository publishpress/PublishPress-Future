export function MetaData() {
    return {
        name: "meta",
        label: "Metadata",
        primitiveType: "object",
        propertiesSchema: [
            {
                name: "id",
                type: "integer",
                label: "ID",
                description: "The unique identifier for the metadata.",
            },
            {
                name: "key",
                type: "string",
                label: "Key",
                description: "The key of the metadata.",
            },
            {
                name: "value",
                type: "mixed",
                label: "Value",
                description: "The value of the metadata.",
            },
            {
                name: "single",
                type: "boolean",
                label: "Single",
                description: "Whether the metadata is a single value.",
            }
        ],
    };
}

export default MetaData;
