import { sprintf, __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import { DatePicker } from "@wordpress/components";
import { TextControl, Tooltip } from "@wordpress/components";
import { Dashicon, Popover, Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { ToggleControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function RayColor({ name, label, defaultValue, onChange, variables = [] }) {

    const colorOptions = [
        { label: __("No color", "publishpress-future-pro"), value: "default" },
        { label: __("Green", "publishpress-future-pro"), value: "green" },
        { label: __("Orange", "publishpress-future-pro"), value: "orange" },
        { label: __("Red", "publishpress-future-pro"), value: "red" },
        { label: __("Blue", "publishpress-future-pro"), value: "blue" },
        { label: __("Purple", "publishpress-future-pro"), value: "purple" },
        { label: __("Gray", "publishpress-future-pro"), value: "gray" },
    ];

    const defaultColor = "default";

    const onChangeSetting = ({ value }) => {
        if (onChange) {
            onChange(name, value);
        }
    }

    return (
        <>
            <VStack>
                <SelectControl
                    label={label}
                    options={colorOptions}
                    value={defaultValue || defaultColor}
                    onChange={(value) => onChangeSetting({ value })}
                />
            </VStack>
        </>
    );
}

export default RayColor;
