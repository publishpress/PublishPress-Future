export function TermsArrayData() {
    return {
        name: "terms_array",
        label: "Terms Array",
        primitiveType: "object",
        propertiesSchema: [
            {
                name: "ids",
                type: "array",
                label: "List of terms IDs",
                description: "A list of terms IDs.",
            },
            {
                name: "labels",
                type: "array",
                label: "List of terms labels",
                description: "A list of terms labels.",
            },
        ]
    }
}

export default TermsArrayData;
