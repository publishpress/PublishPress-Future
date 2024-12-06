import { __ } from "@wordpress/i18n";
import { VariablesTreeSelect } from "../variables-tree-select";
import { TextareaControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { filterVariableOptionsByDataType } from "../../utils";

export function EmailRecipient({ name, label, defaultValue, onChange, settings, variables = [] }) {

    variables = filterVariableOptionsByDataType(variables, ['email']);

    let recipientOptions = [
        ...variables,
        { name: __("Custom Addresses", "post-expirator"), id: "custom" }
    ];

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (settingName === "recipient" && value !== "custom") {
            newValue.custom = "";
        }

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <>
            <VStack>
                <VariablesTreeSelect
                    tree={recipientOptions}
                    label={__("Email Recipient", "post-expirator")}
                    selectedId={defaultValue?.recipient}
                    onChange={(value) => onChangeSetting({ settingName: "recipient", value })}
                />

                {defaultValue?.recipient === "custom" && (
                    <TextareaControl
                        label={__("Custom Email Addresses", "post-expirator")}
                        value={defaultValue?.custom || ""}
                        onChange={(value) => onChangeSetting({ settingName: "custom", value })}
                    />
                )}
            </VStack>
        </>
    );
}

export default EmailRecipient;
