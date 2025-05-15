import { __ } from "@wordpress/i18n";
import {
    useMemo
} from "@wordpress/element";
import InlineSetting from "../inline-setting";
import { TextControl, SelectControl, Button } from "@wordpress/components";

export const ArgumentItem = ({
    name,
    label,
    popoverLabel,
    defaultValue,
    onChange,
    variables = [],
    checkboxLabel,
    onClosePopover,
    isLoading,
    autoOpen
}) => {
    defaultValue = {
        name: "",
        value: "integer",
        type: "integer",
        ...defaultValue
    };

    const dataTypeOptions = [
        { label: __('Integer', 'post-expirator'), value: 'integer' },
        { label: __('String', 'post-expirator'), value: 'string' },
        { label: __('Boolean', 'post-expirator'), value: 'boolean' },
        { label: __('Object', 'post-expirator'), value: 'object' },
        { label: __('Array', 'post-expirator'), value: 'array' },
        { label: __('Post', 'post-expirator'), value: 'post' },
        { label: __('User', 'post-expirator'), value: 'user' },
    ];

    const onChangeName = (value) => {
        value = value.replace(/[^a-zA-Z0-9_]/g, '').trim();
        onChange({ ...defaultValue, name: value, type: value });
    }

    const onChangeValue = (value) => {
        onChange({ ...defaultValue, value: value, type: value });
    }

    const getDataTypeLabel = () => {
        const dataType = defaultValue?.type || defaultValue?.value;
        return dataTypeOptions.find(option => option.value === dataType)?.label;
    }

    return (
        <InlineSetting
            name={name}
            label={label}
            popoverLabel={popoverLabel}
            valuePreview={`${defaultValue.name}: (${getDataTypeLabel()})`}
            onClosePopover={onClosePopover}
            isLoading={isLoading}
            autoOpen={autoOpen}
        >
            <>
                <TextControl
                    value={defaultValue.name}
                    onChange={onChangeName}
                    autoFocus={autoOpen}
                />
                <SelectControl
                    value={defaultValue?.type || defaultValue?.value}
                    options={dataTypeOptions}
                    onChange={onChangeValue}
                />
            </>
        </InlineSetting>
    )
}

export default ArgumentItem;
