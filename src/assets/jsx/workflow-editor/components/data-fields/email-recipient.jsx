import { __ } from "@wordpress/i18n";
import { TreeSelect } from "@wordpress/components";
import { TextControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function EmailRecipient({ name, label, defaultValue, onChange, variables = [] }) {

    let recipientOptions = [
        { name: __("Custom addressses", "publishpress-future-pro"), id: "custom" },
    ];

    if (variables.length > 0) {
        variables.forEach((variable) => {
            recipientOptions.push({
                name: variable.name,
                id: variable.id,
                children: variable.children,
            });
        });
    }

    const defaultRecipient = "global.site.admin_email";

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <>
            <VStack>
                <TreeSelect
                    label={__("Email Recipient", "publishpress-future-pro")}
                    tree={recipientOptions}
                    selectedId={defaultValue?.recipient || defaultRecipient}
                    onChange={(value) => onChangeSetting({ settingName: "recipient", value })}
                />

                {defaultValue?.recipient === "custom" && (
                    <TextControl
                        label={__("Custom Email Addresses", "publishpress-future-pro")}
                        value={defaultValue?.custom || ""}
                        onChange={(value) => onChangeSetting({ settingName: "custom", value })}
                    />
                )}
            </VStack>
        </>
    );
}

export default EmailRecipient;
