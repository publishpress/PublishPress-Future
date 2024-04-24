import { __ } from "@wordpress/i18n";
import BaseField from "./base-field";
import {
    SelectControl,
    __experimentalNumberControl as NumberControl
} from "@wordpress/components";
import { DatePicker } from "@wordpress/components";

export function Recurrence({ name, label, defaultValue, onChange }) {
    const cronSchedulesOptions = [
        { label: __("Non-repeating", "publishpress-future-pro"), value: "off" },
        ...futureWorkflowEditor.cronSchedules
    ];

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const recurrenceIsEnabled = defaultValue?.recurrence !== "off" && defaultValue?.recurrence !== undefined;

    return (
        <>
            <SelectControl
                label={__("Repeating", "publishpress-future-pro")}
                options={cronSchedulesOptions}
                value={defaultValue?.recurrence || "off"}
                onChange={(value) => onChangeSetting({ settingName: "recurrence", value })}
            />

            {(defaultValue?.recurrence !== "off" && defaultValue?.recurrence !== undefined) && (
                <SelectControl
                    label={__("Repeat until", "publishpress-future-pro")}
                    options={[
                        { label: __("Forever", "publishpress-future-pro"), value: "forever" },
                        { label: __("Until specific date", "publishpress-future-pro"), value: "until" },
                        { label: __("For a number of times", "publishpress-future-pro"), value: "times" },
                    ]}
                    value={defaultValue?.repeatUntil || "forever"}
                    onChange={(value) => onChangeSetting({ settingName: "repeatUntil", value })}
                />
            )}

            {(recurrenceIsEnabled && defaultValue?.repeatUntil === "until") && (
                <DatePicker
                    currentDate={defaultValue?.repeatUntilDate}
                    onChange={(value) => onChangeSetting({ settingName: "repeatUntilDate", value })}
                />
            )}

            {(recurrenceIsEnabled && defaultValue?.repeatUntil === "times") && (
                <BaseField>
                    <NumberControl
                        label={__("Repeat for", "publishpress-future-pro")}
                        value={defaultValue?.times || 5}
                        onChange={(value) => onChangeSetting({ settingName: "repeatTimes", value })}
                    />
                </BaseField>
            )}
        </>
    );
}

export default Recurrence;
