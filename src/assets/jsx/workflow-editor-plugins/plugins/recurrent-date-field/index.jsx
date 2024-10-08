import {
    Fill,
    TreeSelect,
    TextControl,
    DatePicker,
    __experimentalNumberControl as NumberControl
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
        { name: __("Custom interval", "post-expirator"), id: "custom" },
        ...cronScheduleOptions
    ];

    const repeatUntilOptions = [
        { name: __("Forever", "post-expirator"), id: "forever" },
        { name: __("Specific date", "post-expirator"), id: "date" },
        { name: __("For a number of times", "post-expirator"), id: "times" },
    ];

    const recurrenceUnitOptions = [
        { name: __("Seconds", "post-expirator"), id: "seconds" },
        { name: __("Minutes", "post-expirator"), id: "minutes" },
        { name: __("Hours", "post-expirator"), id: "hours" },
        { name: __("Days", "post-expirator"), id: "days" },
        { name: __("Weeks", "post-expirator"), id: "weeks" },
        { name: __("Months", "post-expirator"), id: "months" },
        { name: __("Years", "post-expirator"), id: "years" },
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
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                            <TreeSelect
                                label={__("Unit of time", "post-expirator")}
                                tree={recurrenceUnitOptions}
                                value={defaultValue.repeatIntervalUnit || "seconds"}
                                onChange={(value) => onChangeSetting({ settingName: "repeatIntervalUnit", value })}
                                style={{ width: '130px' }}
                            />
                            <NumberControl
                                label={__("Interval", "post-expirator")}
                                value={defaultValue.repeatInterval}
                                onChange={(value) => onChangeSetting({ settingName: "repeatInterval", value })}
                            />
                        </div>
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
