import { sprintf, __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import { DatePicker } from "@wordpress/components";
import { TextControl, Tooltip } from "@wordpress/components";
import { Dashicon, Popover, Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { ToggleControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function Text({ name, label, defaultValue, onChange, variables = [] }) {

    const onChangeSetting = ({ value }) => {
        if (onChange) {
            onChange(name, value);
        }
    }

    if (!defaultValue) {
        defaultValue = '';
    }

    return (
        <>
            <VStack>
                <TextControl
                    label={label}
                    value={defaultValue || ""}
                    onChange={(value) => onChangeSetting({ value })}
                />
            </VStack>
        </>
    );
}

export default Text;
