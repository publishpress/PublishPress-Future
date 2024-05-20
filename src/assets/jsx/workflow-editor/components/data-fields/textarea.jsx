import { __ } from "@wordpress/i18n";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { TextareaControl } from "@wordpress/components";

export function Textarea({ name, label, defaultValue, onChange, variables = [] }) {

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
                <TextareaControl
                    label={label}
                    value={defaultValue || ""}
                    onChange={(value) => onChangeSetting({ value })}
                />
            </VStack>
        </>
    );
}

export default Textarea;
