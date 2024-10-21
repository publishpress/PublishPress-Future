import { __ } from "@wordpress/i18n";
import { TreeSelect } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function DebugData({ name, label, defaultValue, onChange, variables = [] }) {
    let debugOptions = [
        { name: __("All received input", "post-expirator"), id: "all-input" },
    ];

    if (variables.length > 0) {
        variables.forEach((variable) => {
            debugOptions.push({
                name: variable.name,
                id: variable.id,
                children: variable.children,
            });
        });
    }

    const defaultDebugOption = "all-input";

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
                    label={__("Data to output", "post-expirator")}
                    tree={debugOptions}
                    selectedId={defaultValue?.dataToOutput || defaultDebugOption}
                    onChange={(value) => onChangeSetting({ settingName: "dataToOutput", value })}
                />
            </VStack>
        </>
    );
}

export default DebugData;
