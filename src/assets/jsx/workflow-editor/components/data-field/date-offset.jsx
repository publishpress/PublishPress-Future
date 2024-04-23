import { __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";

export function DateOffset({ name, label, defaultValue, onChange }) {

    const baseDateOptions = [
        { label: "Input post", value: "input" },
        { label: "Event date", value: "event" },
        { label: "Specific date", value: "specific" },
    ];
    const defaultBaseDate = "event";

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <SelectControl
            label={label}
            options={baseDateOptions}
            value={defaultValue?.baseDate || defaultBaseDate}
            onChange={(value) => onChangeSetting({ settingName: "baseDate", value })}
        />

        // {settings.baseDate === "specific" && (
        //     <DatePicker
        //         label={__("Specific date", "publishpress-future-pro")}
        //         value={settings.specificDate || ""}
        //         onChange={(value) => {
        //             const newSettings = {
        //                 ...settings,
        //                 specificDate: value,
        //             };

        //             if (onChange) {
        //                 onChange(field.name, newSettings);
        //             }
        //         }}
        //     />
        // )}
    );
}

export default DateOffset;
