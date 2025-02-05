import { __ } from "@wordpress/i18n";
import {
    useState,
    useEffect,
    useCallback
} from "@wordpress/element";
import {
    Button,
    __experimentalHStack as HStack,
    CheckboxControl
} from "@wordpress/components";
import SettingPopover from "../../setting-popover";


export const ToggleInlineSetting = ({
    name,
    label,
    valuePreview,
    onClosePopover,
    checkboxLabel,
    defaultValue,
    onChange,
    children
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        setIsPopoverOpen(false);
    }, []);

    const closePopover = useCallback(() => {
        setIsPopoverOpen(false);

        if (onClosePopover) {
            onClosePopover();
        }
    }, [onClosePopover]);

    const onChangeCheckbox = useCallback((value) => {
        defaultValue.update = value;
        onChange(name, defaultValue);
    }, [onChange, name, defaultValue]);

    return (
        <>
            <HStack className="workflow-editor-panel__row">
                <div className="workflow-editor-panel__row-label">{label}</div>
                <div className="workflow-editor-panel__row-control">
                    <Button
                        variant="link"
                        onClick={() => setIsPopoverOpen(true)}
                    >
                        {valuePreview}
                    </Button>
                </div>
            </HStack>

            {isPopoverOpen && (
                <SettingPopover
                    onClose={closePopover}
                    className={`workflow-editor-inspector-${name}-popover`}
                    title={label}
                >
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
                </SettingPopover>
            )}
        </>
    )
}

export default ToggleInlineSetting;
