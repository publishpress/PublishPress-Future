/*
 * Copyright (c) 2024 Ramble Ventures
 */
import { SettingRow } from "&publishpress-free/components";
import {
    settings,
    customPostStatuses,
    text
} from "&config.pro-settings";
import { CheckboxControl, Button } from "@wordpress/components";

export const addCustomStatusSettings = (settingsRows, props, settingActive, useState) => {
    let defaultEnabledCustomStatuses = [];
    if (settings.enabledCustomStatuses) {
        defaultEnabledCustomStatuses = settings.enabledCustomStatuses[props.postType] || [];
    }

    const [enabledCustomStatuses, setEnabledCustomStatuses] = useState(defaultEnabledCustomStatuses);

    const handleCustomStatusesChange = (postStatus, checked) => {
        let newEnabledCustomStatuses = [...enabledCustomStatuses];

        if (checked) {
            newEnabledCustomStatuses.push(postStatus);
        } else {
            newEnabledCustomStatuses = newEnabledCustomStatuses.filter((status) => status !== postStatus);
        }

        // Remove duplicates.
        newEnabledCustomStatuses = [...new Set(newEnabledCustomStatuses)];

        setEnabledCustomStatuses(newEnabledCustomStatuses);
    };

    const handleSelectAll = (event) => {
        event.preventDefault();

        setEnabledCustomStatuses(customPostStatuses.map((postStatus) => postStatus.value));
    };

    const handleUnselectAll = (event) => {
        event.preventDefault();

        setEnabledCustomStatuses([]);
    };

    if (settingActive) {
        if (customPostStatuses.length === 0) {
            return settingsRows;
        }

        const postStatusesCheckboxes = customPostStatuses.map((postStatus) => {
            const checked = enabledCustomStatuses.includes(postStatus.value);
            const fieldId = 'expirationdate_custom-statuses-' + props.postType + '-' + postStatus.value;

            return (
                <CheckboxControl
                    key={fieldId}
                    name={'expirationdate_custom-statuses-' + props.postType + '[]'}
                    id={fieldId}
                    value={postStatus.value}
                    label={postStatus.label}
                    checked={checked || false}
                    onChange={(checked) => handleCustomStatusesChange(postStatus.value, checked)}
                    title={postStatus.value}
                />
            );
        });

        settingsRows.push(
            <SettingRow label={text.enableCustomStatuses} key={'custom-statuses'}>
                <div>
                    <label>{text.enableCustomStatusesDesc}</label>
                </div>
                <div className={'future_pro_checkbox_selection_control'}>
                    <Button variant="link" onClick={handleSelectAll}>{text.selectAll}</Button> | <Button variant="link" onClick={handleUnselectAll}>{text.unselectAll}</Button>
                </div>

                {postStatusesCheckboxes}
            </SettingRow>
        );
    }

    return settingsRows;
};


