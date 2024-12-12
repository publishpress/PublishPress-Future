import { __ } from "@wordpress/i18n";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { ExpressionBuilder } from "./expression-builder";

export function DebugData({ name, label, defaultValue, onChange, variables = [] }) {
    let debugVariables = [
        {
            name: "input",
            label: __("All received input", "post-expirator"),
            description: __("All received input from the previous steps.", "post-expirator"),
        },
        ...variables,
    ];

    const defaultDebugOption = {expression: "{{input}}"};

    const onChangeSetting = (name, value) => {
        if (onChange) {
            onChange(name, value);
        }
    }

    // Convert legacy data to new data
    if (defaultValue?.dataToOutput) {
        defaultValue = {expression: `{{${defaultValue.dataToOutput}}}`};

        if (defaultValue.expression === '{{all-input}}') {
            defaultValue.expression = "{{input}}";
        }
    }

    if (defaultValue?.expression && defaultValue?.expression === '{{custom-data}}') {
        defaultValue = {expression: defaultValue.customData};
    }

    return (
        <>
            <VStack>
                <ExpressionBuilder
                    name={name}
                    label={label}
                    defaultValue={defaultValue || defaultDebugOption}
                    onChange={onChangeSetting}
                    variables={debugVariables}
                />
            </VStack>
        </>
    );
}

export default DebugData;
