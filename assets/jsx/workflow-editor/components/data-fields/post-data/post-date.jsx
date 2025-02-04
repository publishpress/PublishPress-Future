import { __ } from "@wordpress/i18n";
import { useState, useEffect, useCallback, useMemo } from "@wordpress/element";
import {
    __experimentalVStack as VStack,
    Button,
} from "@wordpress/components";
import SettingPopover from "../../setting-popover";
import DateOffset from "../date-offset";

const formatDate = (date) => {
    if (date) {
        const dateFormat = futureWorkflowEditor.dateFormat;
        const timeFormat = futureWorkflowEditor.timeFormat;

        return wp.date.format(`${dateFormat} ${timeFormat}`, new Date(date));
    }

    return '';
}

export const PostDateControl = ({ name, label, defaultValue, onChange, variables = [], settings }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        setIsPopoverOpen(false);
    }, []);

    const closePopover = useCallback(() => {
        setIsPopoverOpen(false);
    }, []);

    const defaultSpecificDate = new Date();
    defaultSpecificDate.setDate(defaultSpecificDate.getDate() + 3);

    defaultValue = {
        dateStrategy: "",
        dateSource: "calendar",
        specificDate: defaultSpecificDate,
        dateOffset: "+7 days",
        ...defaultValue
    };

    const onChangeSetting = useCallback(({ settingName, value }) => {
        const newValue = { ...defaultValue, ...value };

        if (onChange) {
            onChange(name, newValue);
        }
    }, [defaultValue, name, onChange]);

    const valuePreview = useMemo(() => {
        if (defaultValue.dateStrategy !== '') {
            if (defaultValue?.dateStrategy === "date" || defaultValue?.dateStrategy === "offset") {
                let previewText = '';

                if (defaultValue?.specificDate && defaultValue?.dateSource === 'calendar') {
                    previewText = formatDate(defaultValue.specificDate);
                }

                if (defaultValue.dateSource === 'event') {
                    previewText = __('When the trigger is activated', 'post-expirator');
                }

                if (defaultValue.dateSource === 'step') {
                    previewText = __('When the step is activated', 'post-expirator');
                }

                if (defaultValue.dateSource === 'custom') {
                    const expression = defaultValue.customDateSource?.expression;

                    if (expression) {
                        previewText = expression;
                    } else {
                        previewText = __('Custom date source', 'post-expirator');
                    }
                }

                if (defaultValue.dateStrategy === "offset") {
                    previewText += `, ${defaultValue.dateOffset}`;
                }

                return previewText;
            }
        }

        return __('Unchanged', 'post-expirator');
    }, [defaultValue]);

    return (
        <>
            <div className="workflow-editor-panel__row-label">{label}</div>
            <div className="workflow-editor-panel__row-control">
                <Button
                    variant="link"
                    onClick={() => setIsPopoverOpen(true)}
                >
                    {valuePreview}
                </Button>
            </div>

            {isPopoverOpen && (
                <SettingPopover
                    onClose={closePopover}
                    className="workflow-editor-inspector-post-date-popover"
                    title={label}
                >
                    <VStack>
                        <DateOffset
                            name="postDate"
                            label={label}
                            defaultValue={defaultValue}
                            onChange={(settingName, value) => onChangeSetting({ settingName: "postDate", value })}
                            variables={variables}
                            settings={{
                                showEmptyDateOption: true,
                                emptyDateOptionLabel: __('Unchanged', 'post-expirator'),
                                hideDateStrategy: ['now'],
                            }}
                        />
                    </VStack>
                </SettingPopover>
            )}
        </>
    )
}

export default PostDateControl;
