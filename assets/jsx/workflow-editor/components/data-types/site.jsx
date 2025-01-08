export function SiteData() {
    return {
        name: "site",
        label: "Site",
        type: "object",
        objectType: "site",
        propertiesSchema: [
            {
                name: "id",
                type: "integer",
                label: "ID",
                description: "The unique identifier for the site.",
            },
            {
                name: "name",
                type: "string",
                label: "Name",
                description: "The name of the site.",
            },
            {
                name: "description",
                type: "string",
                label: "Description",
                description: "The description of the site.",
            },
            {
                name: "url",
                type: "string",
                label: "Site URL",
                description: "The URL of the site.",
            },
            {
                name: "home_url",
                type: "string",
                label: "Home URL",
                description: "The URL of the home page of the site.",
            },
            {
                name: "admin_email",
                type: "email",
                label: "Admin Email",
                description: "The email address of the site administrator.",
            },
            {
                name: "meta",
                type: "meta",
                label: "Metadata",
                description: "The metadata of the site.",
            },
        ],
    };
}

export default SiteData;
