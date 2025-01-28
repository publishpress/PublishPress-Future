import { sprintf, __ } from "@wordpress/i18n";
import {
    TreeSelect,
    DatePicker,
    TextControl,
    PanelRow,
    Popover,
    Button,
    __experimentalVStack as VStack,
    ToggleControl,
    __experimentalNumberControl as NumberControl,
} from "@wordpress/components";
import { VariablesTreeSelect } from "../variables-tree-select";
import { useState, useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../editor-store";
import { FEATURE_ADVANCED_SETTINGS } from "../../constants";
import { DateOffsetPreview } from "../../../components/DateOffsetPreview";
import { Slot } from "@wordpress/components";
import Recurrence from "./recurrence";
import ProFeatureField from "../pro-feature-field";
import ExpressionBuilder from "./expression-builder";
import { stripTags } from "../../../utils";

const whenToRunOptions = [
    { name: __("As soon as possible", "post-expirator"), id: "now" },
    { name: __("On a specific date", "post-expirator"), id: "date" },
    { name: __("Relative to a specific date", "post-expirator"), id: "offset" },
];

let dateSourceOptions = [
    { name: __("Selected in the calendar", "post-expirator"), id: "calendar" },
    { name: __("When the trigger is activated", "post-expirator"), id: "event"},
    { name: __("When the step is activated", "post-expirator"), id: "step"},
    { name: __("Custom date source", "post-expirator"), id: "custom"},
];

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
    const allVariables = useMemo(() => {
        return variables;
    }, [variables]);

    const defaultSpecificDate = new Date();
    defaultSpecificDate.setDate(defaultSpecificDate.getDate() + 3);

    const defaultRepeatDate = new Date();
    defaultRepeatDate.setDate(defaultRepeatDate.getDate() + 7);

    const defaultDuplicateHandling = 'replace';

    const variablesTree = variables.map((variable) => {
        const mapChildren = (children) => {
            if (!children) return undefined;

            return children.map(child => ({
                name: child.label,
                id: child.name,
                children: mapChildren(child.children)
            }));
        };

        return {
            name: variable.label,
            id: variable.name,
            children: mapChildren(variable.children)
        };
    });

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


    const validDateSources = ['calendar', 'event', 'step', 'custom'];
    const isLegacyDateSource = !validDateSources.includes(defaultValue.dateSource);

    if (isLegacyDateSource) {
        defaultValue.customDateSource = defaultValue.dateSource;
        defaultValue.dateSource = 'custom';
    }

    // Filter out hidden date sources
    if (settings && settings?.hideDateSources) {
        dateSourceOptions = dateSourceOptions.filter((option) => {
            return !settings.hideDateSources.includes(option.name);
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

    const allowDuplicate = (defaultValue.duplicateHandling || defaultDuplicateHandling) === 'create-new';
    const allowDuplicateHelp = (allowDuplicate) ?
        __("Allows scheduling tasks even if another task with the same identifier exists.", "post-expirator") :
        __("Prevents scheduling tasks when another task with the same identifier already exists.", "post-expirator");

    return (
        <>
            <VStack>
                <PanelRow>
                    <TreeSelect
                        label={__("When to run", "post-expirator")}
                        tree={whenToRunOptions}
                        selectedId={defaultValue.whenToRun}
                        onChange={(value) => onChangeSetting({ settingName: "whenToRun", value })}
                    />
                </PanelRow>

                {(defaultValue.whenToRun === 'date' || defaultValue.whenToRun === 'offset') && (
                    <>
                        <PanelRow>
                            <VariablesTreeSelect
                                label={__("Date source", "post-expirator")}
                                tree={dateSourceOptions}
                                selectedId={defaultValue.dateSource}
                                onChange={(value) => onChangeSetting({ settingName: "dateSource", value })}
                            />
                        </PanelRow>

                        {defaultValue.dateSource === 'calendar' && (
                            <PanelRow>
                                <DatePicker
                                    currentDate={defaultValue.specificDate}
                                    onChange={(value) => onChangeSetting({ settingName: "specificDate", value })}
                                />
                            </PanelRow>
                        )}

                        {defaultValue.dateSource === 'custom' && (
                            <PanelRow>
                                <ExpressionBuilder
                                    name="customDateSource"
                                    label={__("Custom date source", "post-expirator")}
                                    defaultValue={defaultValue.customDateSource}
                                    onChange={(settingName, value) => {
                                        onChangeSetting({ settingName: 'customDateSource', value });
                                    }}
                                    variables={allVariables}
                                    singleVariableOnly={true}
                                    readOnlyPreview={true}
                                    description={__("Click the button to choose a custom date source from variables that can provide a date.", "post-expirator")}
                                    wrapOnPreview={false}
                                    wrapOnEditor={false}
                                    oneLinePreview={true}
                                />
                            </PanelRow>
                        )}

                        {defaultValue.whenToRun === 'offset' && (
                            <>
                                <PanelRow>
                                    <TextControl
                                        label={__("Offset", "post-expirator")}
                                        value={defaultValue.dateOffset}
                                        onChange={(value) => onChangeSetting({ settingName: "dateOffset", value })}
                                    />
                                </PanelRow>

                                <PanelRow>
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
                                </PanelRow>

                                {! isPreviewValid && (
                                    <PanelRow>
                                        <div className="publishpress-future-notice publishpress-future-notice-error">
                                            {__("Error: ", "post-expirator")} {previewMessage}
                                        </div>
                                    </PanelRow>
                                )}

                                <PanelRow>
                                    <Button variant="link" onClick={toggleHelp}>
                                        {__("Click for more information", "post-expirator")}
                                        {isHelpVisible && (
                                            <Popover>
                                                <div className="settings-field-help-popover">
                                                    <Button variant="tertiary" icon={'no-alt'} />

                                                    <div dangerouslySetInnerHTML={{
                                                        __html: sprintf(
                                                            stripTags(
                                                                __("For more information on formatting, see the %sPHP strtotime function%s. For example, you could enter %s+1 month%s or %s+1 week 2 days 4 hours 2 seconds%s or %snext Thursday%s. Please use only phrases in English.", "post-expirator")
                                                            ),
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
                                </PanelRow>
                            </>
                        )}
                    </>
                )}

                {! isPro && (
                    <PanelRow>
                        <ProFeatureField link="https://publishpress.com/links/future-workflow-inspector">
                            <Recurrence label={__("Repeating Action", "post-expirator")} disabled={true} />
                        </ProFeatureField>
                    </PanelRow>
                )}

                <Slot name="DateOffsetAfterDateSourceField" fillProps={{
                    onChangeSetting,
                    defaultValue,
                }} />

                {isAdvancedSettingsEnabled && (
                    <>
                        {! hidePreventDuplicateScheduling && (
                            <>
                                <PanelRow>
                                    <ToggleControl
                                        label={__("Allow duplicate scheduled tasks", "post-expirator")}
                                        checked={allowDuplicate}
                                        onChange={(value) => {
                                            const newValue = (value) ? 'create-new' : 'replace';
                                            onChangeSetting({ settingName: "duplicateHandling", value: newValue });
                                        }}
                                        help={allowDuplicateHelp}
                                    />
                                </PanelRow>

                                <PanelRow>
                                    <ExpressionBuilder
                                        name="uniqueIdExpression"
                                        label={__("Unique Task Identifier", "post-expirator")}
                                        defaultValue={defaultValue.uniqueIdExpression ?? ''}
                                        onChange={(settingName, value) => {
                                            onChangeSetting({ settingName: 'uniqueIdExpression', value: value });
                                        }}
                                        variables={allVariables}
                                        description={__("Define a unique ID to detect and prevent duplicate tasks.", "post-expirator")}
                                        oneLinePreview={true}
                                        wrapOnPreview={false}
                                        wrapOnEditor={false}
                                        helpUrl="https://publishpress.com/docs/schedule-delay/#preventing-duplicate-scheduled-tasks-task-identification-guide"
                                    />
                                </PanelRow>

                            </>
                        )}

                        <PanelRow>
                            <NumberControl
                                label={__("Task Execution Order", "post-expirator")}
                                value={defaultValue.priority || 10}
                                onChange={(value) => onChangeSetting({ settingName: "priority", value })}
                                help={__("Controls when this task runs. Lower numbers run first. Default: 10 (normal priority).", "post-expirator")} // phpcs:ignore Generic.Files.LineLength.TooLong
                            />
                        </PanelRow>
                    </>
                )}
            </VStack>
        </>
    );
}

export default DateOffset;
