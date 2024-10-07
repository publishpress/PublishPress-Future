import {
    Fill,
    TreeSelect,
    TextControl,
    DatePicker
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function RecurrentDateField() {
    let cronScheduleOptions = futureWorkflowEditor.cronSchedules;

    cronScheduleOptions = cronScheduleOptions.map((schedule) => {
        return {
            name: schedule.label,
            id: `cron_${schedule.value}`,
        };
    });

    const recurrenceOptions = [
        { name: __("Non-repeating", "post-expirator"), id: "single" },
        { name: __("Custom interval in seconds", "post-expirator"), id: "custom" },
        ...cronScheduleOptions
    ];

    const repeatUntilOptions = [
        { name: __("Forever", "post-expirator"), id: "forever" },
        { name: __("Specific date", "post-expirator"), id: "date" },
        { name: __("For a number of times", "post-expirator"), id: "times" },
    ];

    return <Fill name="DateOffsetAfterDateSourceField">
        {
            ({defaultValue, onChangeSetting}) => (
                <>
                    <TreeSelect
                        label={__("Repeating Action", "post-expirator")}
                        tree={recurrenceOptions}
                        selectedId={defaultValue.recurrence}
                        onChange={(value) => onChangeSetting({ settingName: "recurrence", value })}
                    />

                    {(defaultValue.recurrence === "custom") && (
                        <TextControl
                            label={__("Interval in seconds", "post-expirator")}
                            value={defaultValue.repeatInterval}
                            onChange={(value) => onChangeSetting({ settingName: "repeatInterval", value })}
                        />
                    )}

                    {(defaultValue.recurrence !== "single") && (
                        <>
                            <TreeSelect
                                label={__("Repeat until", "post-expirator")}
                                tree={repeatUntilOptions}
                                selectedId={defaultValue.repeatUntil}
                                onChange={(value) => onChangeSetting({ settingName: "repeatUntil", value })}
                            />

                            {defaultValue.repeatUntil === 'times' && (
                                <TextControl
                                    label={__("Times to repeat", "post-expirator")}
                                    value={defaultValue.repeatTimes}
                                    onChange={(value) => onChangeSetting({ settingName: "repeatTimes", value })}
                                />
                            )}

                            {defaultValue.repeatUntil === 'date' && (
                                <DatePicker
                                    currentDate={defaultValue.repeatUntilDate}
                                    onChange={(value) => onChangeSetting({ settingName: "repeatUntilDate", value })}
                                />
                            )}
                        </>
                    )}
                </>
            )
        }
    </Fill>;
}
