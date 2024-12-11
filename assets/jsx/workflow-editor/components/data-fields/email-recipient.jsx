import { __ } from "@wordpress/i18n";
import { VariablesTreeSelect } from "../variables-tree-select";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { filterVariableOptionsByDataType } from "../../utils";
import ExpressionBuilder from "./expression-builder";

export function EmailRecipient({ name, label, defaultValue, onChange, settings, variables = [] }) {

    // variables = filterVariableOptionsByDataType(variables, ['email']);

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
                    <ExpressionBuilder
                        name={name + "-custom"}
                        label={__("Custom Email Addresses", "post-expirator")}
                        defaultValue={defaultValue || ""}
                        onChange={(settingsName, value) => onChangeSetting({ settingName: "custom", value: value.custom })}
                        propertyName="custom"
                        variables={variables}
                    />
                )}
            </VStack>
        </>
    );
}

export default EmailRecipient;
