import { __ } from "@wordpress/i18n";
import { VariablesTreeSelect } from "../variables-tree-select";
import { TextControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function EmailRecipient({ name, label, defaultValue, onChange, settings, variables = [] }) {

    let recipientOptions = [
        { name: '', id: '' },
        { name: __("Custom addressses", "publishpress-future-pro"), id: "custom" },
        ...variables
    ];

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
                <VariablesTreeSelect
                    tree={recipientOptions}
                    label={__("Email Recipient", "publishpress-future-pro")}
                    selectedId={defaultValue?.recipient}
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
