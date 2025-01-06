import { __ } from "@wordpress/i18n";
import { ToggleControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function Toggle({ name, label, defaultValue, onChange, settings, variables = [] }) {

    const onChangeSetting = ({ value }) => {
        if (onChange) {
            onChange(name, value);
        }
    }

    return (
        <>
            <VStack>
                <ToggleControl
                    label={label}
                    checked={defaultValue || false}
                    onChange={(value) => onChangeSetting({ value })}
                />
            </VStack>
        </>
    );
}

export default Toggle;
