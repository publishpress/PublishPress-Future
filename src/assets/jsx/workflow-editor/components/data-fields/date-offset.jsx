import { sprintf, __ } from "@wordpress/i18n";
import {
    TreeSelect,
    DatePicker,
    TextControl
} from "@wordpress/components";
import { Popover, Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { ToggleControl } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";

/**
 *  When to execute:
 *   - event - As soon as possible after event
 *   - date - At a specific date
 *   - offset - After a specific date
 *
 *   Recurrence:
 *   - single - Non-repeating
 *   - custom - Interval in seconds
 *   - cron_... - Once a minute
 *   - cron_... - Daily
 *
 *   Until:
 *   - Forever
 *   - Until specific date
 *   - For a number of times
 *
 */
export function DateOffset({ name, label, defaultValue, onChange, variables = [] }) {
    const defaultSpecificDate = new Date();
    defaultSpecificDate.setDate(defaultSpecificDate.getDate() + 3);

    const defaultRepeatDate = new Date();
    defaultRepeatDate.setDate(defaultRepeatDate.getDate() + 7);

    defaultValue = {
        whenToRun: "event",
        dateSource: "calendar",
        recurrence: "single",
        repeatUntil: "forever",
        repeatInterval: "3600",
        repeatTimes: "5",
        repeatUntilDate: defaultRepeatDate,
        unique: true,
        priority: "10",
        specificDate: defaultSpecificDate,
        dateOffset: "+7 days",
        ...defaultValue
    };

    const whenToRunOptions = [
        { name: __("As soon as possible", "publishpress-future-pro"), id: "now" },
        { name: __("Specific date", "publishpress-future-pro"), id: "date" },
        { name: __("After a specific date", "publishpress-future-pro"), id: "offset" },
    ];


    const dateSourceOptions = [
        { name: __("Select in the calendar", "publishpress-future-pro"), id: "calendar" },
        { name: __("Event date", "publishpress-future-pro"), id: "event"}
    ];

    if (variables.length > 0) {
        variables.forEach((variable) => {
            dateSourceOptions.push({
                name: variable.name,
                id: variable.id,
                children: variable.children,
            });
        });
    }

    let cronScheduleOptions = futureWorkflowEditor.cronSchedules;
    cronScheduleOptions = cronScheduleOptions.map((schedule) => {
        return {
            name: schedule.label,
            id: `cron_${schedule.value}`,
        };
    });

    const recurrenceOptions = [
        { name: __("Non-repeating", "publishpress-future-pro"), id: "single" },
        { name: __("Custom interval in seconds", "publishpress-future-pro"), id: "custom" },
        ...cronScheduleOptions
    ];

    const repeatUntilOptions = [
        { name: __("Forever", "publishpress-future-pro"), id: "forever" },
        { name: __("Specific date", "publishpress-future-pro"), id: "date" },
        { name: __("For a number of times", "publishpress-future-pro"), id: "times" },
    ];


    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const toggleHelp = () => setIsHelpVisible((state) => !state);
    const hideHelp = () => setIsHelpVisible(false);


    return (
        <>
            <VStack>
                <ToggleControl
                    label={__("Avoid duplicated action", "publishpress-future-pro")}
                    checked={defaultValue.unique || false}
                    onChange={(value) => onChangeSetting({ settingName: "unique", value })}
                />

                <TreeSelect
                    label={__("When to run", "publishpress-future-pro")}
                    tree={whenToRunOptions}
                    selectedId={defaultValue.whenToRun}
                    onChange={(value) => onChangeSetting({ settingName: "whenToRun", value })}
                />

                {(defaultValue.whenToRun === 'date' || defaultValue.whenToRun === 'offset') && (
                    <>
                        <TreeSelect
                            label={__("Date source", "publishpress-future-pro")}
                            tree={dateSourceOptions}
                            selectedId={defaultValue.dateSource}
                            onChange={(value) => onChangeSetting({ settingName: "dateSource", value })}
                        />

                        {defaultValue.dateSource === 'calendar' && (
                            <DatePicker
                                currentDate={defaultValue.specificDate}
                                onChange={(value) => onChangeSetting({ settingName: "specificDate", value })}
                            />
                        )}

                        {defaultValue.whenToRun === 'offset' && (
                            <>
                                <TextControl
                                    label={__("Offset", "publishpress-future-pro")}
                                    value={defaultValue.dateOffset}
                                    onChange={(value) => onChangeSetting({ settingName: "dateOffset", value })}
                                />
                                <Button variant="link" onClick={toggleHelp}>
                                    {__("Click for more information")}
                                    {isHelpVisible && (
                                        <Popover>
                                            <div className="settings-field-help-popover">
                                                <Button variant="tertiary" icon={'no-alt'} onClick={hideHelp}>
                                                </Button>

                                                <div dangerouslySetInnerHTML={{
                                                    __html: sprintf(
                                                        __("For information on formatting, see %sPHP strtotime function%s . For example, you could enter %s+1 month%s or %s+1 week 2 days 4 hours 2 seconds%s or %snext Thursday%s. Please, use only terms in English.", "publishpress-future-pro"),
                                                        "<a href='https://www.php.net/manual/en/function.strtotime.php' target='_blank'>",
                                                        "</a>",
                                                        "<code>",
                                                        "</code>",
                                                        "<code>",
                                                        "</code>",
                                                        "<code>",
                                                        "</code>",
                                                    )
                                                }} />
                                            </div>
                                        </Popover>
                                    )}
                                </Button>
                            </>
                        )}
                    </>
                )}

                <TreeSelect
                    label={__("Recurrence", "publishpress-future-pro")}
                    tree={recurrenceOptions}
                    selectedId={defaultValue.recurrence}
                    onChange={(value) => onChangeSetting({ settingName: "recurrence", value })}
                />

                {(defaultValue.recurrence === "custom") && (
                    <TextControl
                        label={__("Interval in seconds", "publishpress-future-pro")}
                        value={defaultValue.repeatInterval}
                        onChange={(value) => onChangeSetting({ settingName: "repeatInterval", value })}
                    />
                )}

                {(defaultValue.recurrence !== "single") && (
                    <>
                        <TreeSelect
                            label={__("Repeat until", "publishpress-future-pro")}
                            tree={repeatUntilOptions}
                            selectedId={defaultValue.repeatUntil}
                            onChange={(value) => onChangeSetting({ settingName: "repeatUntil", value })}
                        />

                        {defaultValue.repeatUntil === 'times' && (
                            <TextControl
                                label={__("Times to repeat", "publishpress-future-pro")}
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

                <TextControl
                    label={__("Priority", "publishpress-future-pro")}
                    value={defaultValue.priority}
                    onChange={(value) => onChangeSetting({ settingName: "priority", value })}
                />
            </VStack>
        </>
    );
}

export default DateOffset;
