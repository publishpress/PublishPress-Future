import { sprintf, __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import { DatePicker } from "@wordpress/components";
import { TextControl, Tooltip } from "@wordpress/components";
import { Dashicon, Popover, Button } from "@wordpress/components";
import { useState } from "@wordpress/element";

export function DateOffset({ name, label, defaultValue, onChange }) {

    const baseDateOptions = [
        { label: __("Input post", "publishpress-future-pro"), value: "input" },
        { label: __("Event date", "publishpress-future-pro"), value: "event" },
        { label: __("Specific date", "publishpress-future-pro"), value: "specific" },
    ];
    const defaultBaseDate = "event";

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
            <SelectControl
                label={__("Base date", "publishpress-future-pro")}
                options={baseDateOptions}
                value={defaultValue?.baseDate || defaultBaseDate}
                onChange={(value) => onChangeSetting({ settingName: "baseDate", value })}
            />

            {defaultValue.baseDate === "specific" && (
                <DatePicker
                    currentDate={defaultValue?.specificDate || ""}
                    onChange={(value) => onChangeSetting({ settingName: "specificDate", value })}
                />
            )}

            {defaultValue.baseDate !== "specific" && (
                <>
                    <TextControl
                        label={__("Offset", "publishpress-future-pro")}
                        value={defaultValue?.offset || ""}
                        onChange={(value) => onChangeSetting({ settingName: "offset", value })}
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
    );
}

export default DateOffset;
