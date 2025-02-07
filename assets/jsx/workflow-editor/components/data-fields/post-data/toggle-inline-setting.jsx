import { __ } from "@wordpress/i18n";
import {
    useCallback
} from "@wordpress/element";
import {
    Button,
    __experimentalHStack as HStack,
    CheckboxControl
} from "@wordpress/components";
import SettingPopover from "../../setting-popover";
import InlineSetting from "./inline-setting";

export const ToggleInlineSetting = ({
    name,
    label,
    valuePreview,
    onClosePopover,
    checkboxLabel,
    defaultValue,
    onChange,
    children,
    onUncheckUpdate
}) => {
    const onChangeCheckbox = useCallback((value) => {
        defaultValue.update = value;
        onChange(name, defaultValue);

        if ((! value) && onUncheckUpdate) {
            onUncheckUpdate();
        }
    }, [onChange, name, defaultValue, onUncheckUpdate]);

    return (
        <>
            <InlineSetting
                name={name}
                label={label}
                valuePreview={valuePreview}
                onClosePopover={onClosePopover}
                children={(
                    <>
                        <CheckboxControl
                            label={checkboxLabel}
                            checked={defaultValue.update}
                            onChange={onChangeCheckbox}
                        />

                        {defaultValue.update && (
                            <>
                                {children}
                            </>
                        )}
                    </>
                )}
            />
        </>
    )
}

export default ToggleInlineSetting;
