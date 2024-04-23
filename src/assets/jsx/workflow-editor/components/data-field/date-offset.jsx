import { __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";

export function DateOffset({ name, label, value, onChange }) {

    const baseDateOptions = [
        { label: "Input post", value: "input" },
        { label: "Event date", value: "event" },
        { label: "Specific date", value: "specific" },
    ];
    const defaultBaseDate = "event";

    return (
            <SelectControl
                label={label}
                options={baseDateOptions}
                value={value?.baseDate || defaultBaseDate}
                onChange={(value) => {
                    const newValue = {
                        ...newValue,
                        baseDate: value,
                    };

                    if (onChange) {
                        onChange(name, newValue);
                    }
                }}
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
