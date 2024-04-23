import { __ } from "@wordpress/i18n";
import BaseField from "./base-field";
import { SelectControl, CheckboxControl, __experimentalNumberControl as NumberControl } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { DatePicker } from "@wordpress/components";

export function Recurrence({ field, settings, onChange }) {
    const cronSchedulesOptions = [
        { label: __("Non-repeating", "publishpress-future-pro"), value: "off" },
        ...futureWorkflowEditor.cronSchedules
    ];

    const [fieldSettings, setFieldSettings] = useState(settings);

    const recurrenceIsEnabled = fieldSettings.recurrence !== "off" && fieldSettings.recurrence !== undefined;

    return (
        <BaseField description={field.description}>
            <SelectControl
                label={__("Repeating", "publishpress-future-pro")}
                options={cronSchedulesOptions}
                value={fieldSettings.recurrence || "off"}
                onChange={(value) => {
                    const newSettings = {
                        ...settings,
                        recurrence: value,
                    };

                    setFieldSettings(newSettings);

                    if (onChange) {
                        onChange(field.name, newSettings);
                    }
                }}
            />

            {(fieldSettings.recurrence !== "off" && fieldSettings.recurrence !== undefined) && (
                <SelectControl
                    label={__("Repeat until", "publishpress-future-pro")}
                    options={[
                        { label: __("Forever", "publishpress-future-pro"), value: "forever" },
                        { label: __("Until specific date", "publishpress-future-pro"), value: "until" },
                        { label: __("For a number of times", "publishpress-future-pro"), value: "times" },
                    ]}
                    value={fieldSettings.repeatUntil || "forever"}
                    onChange={(value) => {
                        const newSettings = {
                            ...settings,
                            repeatUntil: value,
                        };

                        setFieldSettings(newSettings);

                        if (onChange) {
                            onChange(field.name, newSettings);
                        }
                    }}
                />
            )}

            {(recurrenceIsEnabled && fieldSettings.repeatUntil === "until") && (
                <DatePicker
                    currentDate={fieldSettings.untilDate}
                    onChange={(date) => {
                        const newSettings = {
                            ...settings,
                            untilDate: date,
                        };

                        setFieldSettings(newSettings);

                        if (onChange) {
                            onChange(field.name, newSettings);
                        }
                    }}
                />
            )}

            {(recurrenceIsEnabled && fieldSettings.repeatUntil === "times") && (
                <BaseField>
                    <NumberControl
                        label={__("Repeat for", "publishpress-future-pro")}
                        value={fieldSettings.times || 5}
                        onChange={(value) => {
                            const newSettings = {
                                ...settings,
                                times: value,
                            };

                            setFieldSettings(newSettings);

                            if (onChange) {
                                onChange(field.name, newSettings);
                            }
                        }}
                    />
                </BaseField>
            )}
        </BaseField>
    );
}

export default Recurrence;
