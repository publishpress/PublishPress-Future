export function UserData() {
    return {
        name: "user",
        label: "User",
        type: "object",
        objectType: "user",
        propertiesSchema: [
            {
                name: "ID",
                type: "integer",
                label: "ID",
                description: "The unique identifier for the user.",
            },
            {
                name: "user_email",
                type: "email",
                label: "Email",
                description: "The email address of the user.",
            },
            {
                name: "user_login",
                type: "string",
                label: "Login",
                description: "The login name of the user.",
            },
            {
                name: "display_name",
                type: "string",
                label: "Display name",
                description: "The display name of the user.",
            },
            {
                name: "roles",
                type: "array",
                label: "Roles",
                description: "The roles of the user.",
            },
            {
                name: "caps",
                type: "object",
                label: "Capabilities",
                description: "The capabilities of the user.",
            },
            {
                name: "user_registered",
                type: "datetime",
                label: "Registration date",
                description: "The date when the user was registered.",
            },
            {
                name: "meta",
                type: "meta",
                label: "Metadata",
                description: "The metadata of the user.",
            },
        ],
    };
}

export default UserData;
