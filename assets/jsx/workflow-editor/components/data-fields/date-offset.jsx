import { sprintf, __ } from "@wordpress/i18n";
import {
    TreeSelect,
    DatePicker,
    TextControl,
    PanelRow,
    Popover,
    Button,
    ToggleControl,
    __experimentalVStack as VStack,
} from "@wordpress/components";
import { VariablesTreeSelect } from "../variables-tree-select";
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../editor-store";
import { FEATURE_ADVANCED_SETTINGS } from "../../constants";
import { filterVariableOptionsByDataType } from "../../utils";
import { DateOffsetPreview } from "../../../components/DateOffsetPreview";
import { Icon } from "@wordpress/components";

/**
 *  When to execute:
 *   - now - As soon as possible after event
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
export function DateOffset({ name, label, defaultValue, onChange, variables = [], settings }) {
    variables = filterVariableOptionsByDataType(variables, ['datetime']);

    const defaultSpecificDate = new Date();
    defaultSpecificDate.setDate(defaultSpecificDate.getDate() + 3);

    const defaultRepeatDate = new Date();
    defaultRepeatDate.setDate(defaultRepeatDate.getDate() + 7);

    defaultValue = {
        whenToRun: "now",
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

    const {
        isAdvancedSettingsEnabled,
    } = useSelect((select) => {
        return {
            isAdvancedSettingsEnabled: select(editorStore).isFeatureActive(FEATURE_ADVANCED_SETTINGS),
        };
    });

    const whenToRunOptions = [
        { name: __("As soon as possible", "post-expirator"), id: "now" },
        { name: __("On a specific date", "post-expirator"), id: "date" },
        { name: __("Relative to a specific date", "post-expirator"), id: "offset" },
    ];

    let dateSourceOptions = [
        { name: __("Selected in the calendar", "post-expirator"), id: "calendar" },
        { name: __("When the trigger is activated", "post-expirator"), id: "event"},
        { name: __("When the step is activated", "post-expirator"), id: "step"},
        ...variables
    ];

    // Filter out hidden date sources
    if (settings && settings?.hideDateSources) {
        dateSourceOptions = dateSourceOptions.filter((option) => {
            return !settings.hideDateSources.includes(option.id);
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
        { name: __("Non-repeating", "post-expirator"), id: "single" },
        { name: __("Custom interval in seconds", "post-expirator"), id: "custom" },
        ...cronScheduleOptions
    ];

    const repeatUntilOptions = [
        { name: __("Forever", "post-expirator"), id: "forever" },
        { name: __("Specific date", "post-expirator"), id: "date" },
        { name: __("For a number of times", "post-expirator"), id: "times" },
    ];


    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isPreviewValid, setIsPreviewValid] = useState(true);
    const [previewMessage, setPreviewMessage] = useState('');
    const toggleHelp = () => setIsHelpVisible((state) => !state);
    const hideHelp = () => setIsHelpVisible(false);

    const onHasValidationError = (errorMessage) => {
        if (errorMessage) {
            setPreviewMessage(errorMessage);
            setIsPreviewValid(false);
        } else {
            setPreviewMessage('');
            setIsPreviewValid(true);
        }
    }

    const onValidationStarted = () => {
    }

    const onValidationFinished = (isValid) => {
        setIsPreviewValid(isValid);

        if (isValid) {
            setPreviewMessage('');
        }
    }

    const hidePreventDuplicateScheduling = settings?.hidePreventDuplicateScheduling;

    return (
        <>
            <VStack>
                <TreeSelect
                    label={__("When to run", "post-expirator")}
                    tree={whenToRunOptions}
                    selectedId={defaultValue.whenToRun}
                    onChange={(value) => onChangeSetting({ settingName: "whenToRun", value })}
                />

                {(defaultValue.whenToRun === 'date' || defaultValue.whenToRun === 'offset') && (
                    <>
                        <VariablesTreeSelect
                            label={__("Date source", "post-expirator")}
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
                                    label={__("Offset", "post-expirator")}
                                    value={defaultValue.dateOffset}
                                    onChange={(value) => onChangeSetting({ settingName: "dateOffset", value })}
                                />

                                <DateOffsetPreview
                                    offset={defaultValue.dateOffset}
                                    label={__("Date Preview", "post-expirator")}
                                    labelDatePreview={__("Current Date", "post-expirator")}
                                    labelOffsetPreview={__("Computed Date", "post-expirator")}
                                    setValidationErrorCallback={onHasValidationError}
                                    setHasPendingValidationCallback={onValidationStarted}
                                    setHasValidDataCallback={onValidationFinished}
                                    compactView={true}
                                />

                                {! isPreviewValid && (
                                    <div className="publishpress-future-notice publishpress-future-notice-error">
                                        {__("Error: ", "post-expirator")} {previewMessage}
                                    </div>
                                )}

                                <Button variant="link" onClick={toggleHelp}>
                                    {__("Click for more information", "post-expirator")}
                                    {isHelpVisible && (
                                        <Popover>
                                            <div className="settings-field-help-popover">
                                                <Button variant="tertiary" icon={'no-alt'} />

                                                <div dangerouslySetInnerHTML={{
                                                    __html: sprintf(
                                                        __("For more information on formatting, see the %sPHP strtotime function%s. For example, you could enter %s+1 month%s or %s+1 week 2 days 4 hours 2 seconds%s or %snext Thursday%s. Please use only phrases in English.", "post-expirator"),
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

                {isAdvancedSettingsEnabled && (
                    <>
                        {!hidePreventDuplicateScheduling && (
                            <PanelRow>
                                <TextControl
                                    label={__("Unique ID Expression", "post-expirator")}
                                    value={defaultValue.uniqueIdExpression}
                                    onChange={(value) => onChangeSetting({ settingName: "uniqueIdExpression", value })}
                                    help={__("Define a custom expression for a unique task ID. Use placeholders like {{onSavePost1.post.ID}} or {{global.user.ID}} to make sure the ID is unique.", "post-expirator")}
                                />
                            </PanelRow>
                        )}

                        <TextControl
                            label={__("Priority", "post-expirator")}
                            value={defaultValue.priority}
                            onChange={(value) => onChangeSetting({ settingName: "priority", value })}
                            help={__("Sets the execution priority of the scheduled step. Lower numbers indicate higher priority and are executed first.", "post-expirator")} // phpcs:ignore Generic.Files.LineLength.TooLong
                        />
                    </>
                )}
            </VStack>
        </>
    );
}

export default DateOffset;
