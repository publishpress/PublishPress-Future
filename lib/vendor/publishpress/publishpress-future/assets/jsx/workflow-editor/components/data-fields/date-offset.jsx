import { sprintf, __ } from "@wordpress/i18n";
import {
    TreeSelect,
    DatePicker,
    TextControl,
    PanelRow,
    Popover,
    Button,
    __experimentalVStack as VStack,
} from "@wordpress/components";
import { VariablesTreeSelect } from "../variables-tree-select";
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../editor-store";
import { FEATURE_ADVANCED_SETTINGS } from "../../constants";
import { filterVariableOptionsByDataType } from "../../utils";
import { DateOffsetPreview } from "../../../components/DateOffsetPreview";
import { Slot } from "@wordpress/components";
import ProFeatureButton from "../pro-feature-button";
import Recurrence from "./recurrence";
import ProFeatureField from "../pro-feature-field";

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
        repeatIntervalUnit: "seconds",
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

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const [isHelpVisible, setIsHelpVisible] = useState(false);
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

    const isPro = futureWorkflowEditor.isPro || false;

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

                {! isPro && (
                    <ProFeatureField link="https://publishpress.com/links/future-workflow-inspector">
                        <Recurrence label={__("Repeating Action", "post-expirator")} disabled={true} />
                    </ProFeatureField>
                )}

                <Slot name="DateOffsetAfterDateSourceField" fillProps={{
                    onChangeSetting,
                    defaultValue,
                }} />

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
