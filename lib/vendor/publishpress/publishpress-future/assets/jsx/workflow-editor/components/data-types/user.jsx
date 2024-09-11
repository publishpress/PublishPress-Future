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
            },
            {
                name: "user_email",
                type: "email",
                label: "Email",
            },
            {
                name: "user_login",
                type: "string",
                label: "User Login",
            },
            {
                name: "display_name",
                type: "string",
                label: "Display Name",
            },
            {
                name: "roles",
                type: "array",
                label: "Roles",
            },
            {
                name: "caps",
                type: "object",
                label: "Capabilities",
            },
            {
                name: "user_registered",
                type: "datetime",
                label: "Registration Date",
            }
        ],
    };
}

export default UserData;
