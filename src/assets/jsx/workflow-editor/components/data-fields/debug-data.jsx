import { sprintf, __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import { DatePicker } from "@wordpress/components";
import { TextControl, Tooltip } from "@wordpress/components";
import { Dashicon, Popover, Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { ToggleControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function DebugData({ name, label, defaultValue, onChange, variables = [] }) {

    let debugOptions = [
        { label: __("All received input", "publishpress-future-pro"), value: "all-input" },
    ];

    if (variables.length > 0) {
        variables.forEach((variable) => {
            debugOptions.push({
                label: variable.label,
                value: variable.name,
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
                <SelectControl
                    label={__("Data to output", "publishpress-future-pro")}
                    options={debugOptions}
                    value={defaultValue?.dataToOutput || defaultDebugOption}
                    onChange={(value) => onChangeSetting({ settingName: "dataToOutput", value })}
                />
            </VStack>
        </>
    );
}

export default DebugData;
