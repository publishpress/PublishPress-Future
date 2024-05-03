export function SiteData() {
    return {
        name: "site",
        label: "Site",
        type: "object",
        propertiesSchema: [
            {
                name: "url",
                type: "string",
                label: "Site URL",
            },
            {
                name: "home_url",
                type: "string",
                label: "Home URL",
            },
            {
                name: "admin_email",
                type: "string",
                label: "Admin Email",
            },
            {
                name: "name",
                type: "string",
                label: "Blog Name",
            },
            {
                name: "description",
                type: "string",
                label: "Blog Description",
            },
        ],
    };
}

export default SiteData;
