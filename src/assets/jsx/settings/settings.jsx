/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import SettingRow from "post-expirator/assets/jsx/settings/components/SettingRow";

wp.hooks.addFilter(
    'expirationdate_settings_posttype',
    'publishpress/publishpress-future-pro/debug',
    (settingsRows, props, settingActive, useState) => {
        let defaultEnabledCustomStatuses = [];
        if (publishpressFutureProSettings.settings.enabledCustomStatuses) {
            defaultEnabledCustomStatuses = publishpressFutureProSettings.settings.enabledCustomStatuses[props.postType] || [];
        }

        const [enabledCustomStatuses, setEnabledCustomStatuses] = useState(defaultEnabledCustomStatuses);

        const handleCustomStatusesChange = (event) => {
            if (jQuery(event.target).is(':checked')) {
                setEnabledCustomStatuses([
                    ...enabledCustomStatuses,
                    event.target.value,
                ]);
            } else {
                setEnabledCustomStatuses(enabledCustomStatuses.filter((status) => status !== event.target.value));
            }
        };

        const handleSelectAll = (event) => {
            event.preventDefault();

            setEnabledCustomStatuses(publishpressFutureProSettings.customPostStatuses.map((postStatus) => postStatus.value));
        };

        const handleUnselectAll = (event) => {
            event.preventDefault();

            setEnabledCustomStatuses([]);
        };

        if (settingActive) {
            if (publishpressFutureProSettings.customPostStatuses.length === 0) {
                return settingsRows;
            }

            const postStatusesCheckboxes = publishpressFutureProSettings.customPostStatuses.map((postStatus) => {
                const checked = enabledCustomStatuses.includes(postStatus.value);
                const fieldId = 'expirationdate_custom-statuses-' + props.postType + '-' + postStatus.value;

                return (
                    <div className="pp-checkbox">
                        <input
                            type="checkbox"
                            name={'expirationdate_custom-statuses-' + props.postType + '[]'}
                            id={fieldId}
                            value={postStatus.value}
                            checked={checked}
                            onChange={handleCustomStatusesChange}
                            key={postStatus.value}
                        />
                        <label htmlFor={fieldId}>{postStatus.label}</label>
                    </div>
                );
            });

            settingsRows.push(
                <SettingRow label={publishpressFutureProSettings.text.enableCustomStatuses}>
                    <div>
                        <label>{publishpressFutureProSettings.text.enableCustomStatusesDesc}</label>
                    </div>
                    <div className={'future_pro_checkbox_selection_control'}>
                        <a href="#" onClick={handleSelectAll}>{publishpressFutureProSettings.text.selectAll}</a> <a href="#" onClick={handleUnselectAll}>{publishpressFutureProSettings.text.unselectAll}</a>
                    </div>

                    {postStatusesCheckboxes}
                </SettingRow>
            );
        }

        return settingsRows;
    }
);
