import { __ } from "@wordpress/i18n";
import { TextControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function Text({ name, label, defaultValue, onChange, settings, variables = [] }) {

    const onChangeSetting = ({ value }) => {
        if (onChange) {
            onChange(name, value);
        }
    }

    if (!defaultValue) {
        defaultValue = '';
    }

    const placeholder = settings?.placeholder || '';

    return (
        <>
            <VStack>
                <TextControl
                    label={label}
                    value={defaultValue || ""}
                    onChange={(value) => onChangeSetting({ value })}
                    placeholder={placeholder}
                />
            </VStack>
        </>
    );
}

export default Text;
