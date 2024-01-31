/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { SettingRow } from "&publishpress-free/components";
import {
    settings,
    text
} from "&config.pro-settings";

import { CheckboxControl, Tooltip } from "&wp.components";

export const addMetadataSettings = (settingsRows, props, settingActive, useState) => {
    let defaultEnabledMetadaMapping = [];
    if (settings.metadataMappingStatus) {
        defaultEnabledMetadaMapping = settings.metadataMappingStatus[props.postType] || false;
    }

    let defaultMetadataMapping = {};
    if (settings.metadataMapping) {
        defaultMetadataMapping = settings.metadataMapping[props.postType] || {};
    }

    const [enableMetadataMapping, setEnableMetadataMapping] = useState(defaultEnabledMetadaMapping);
    const [metadataMapping, setMetadataMapping] = useState(defaultMetadataMapping);

    const handleMetadataMapChange = (originalMetaKey, mappedMetaKey) => {
        let newMetadataMapping = {...metadataMapping};

        if (!newMetadataMapping) {
            newMetadataMapping = {};
        }

        newMetadataMapping[originalMetaKey] = mappedMetaKey;

        setMetadataMapping(newMetadataMapping);
    }

    const handleMetadataMapStatusChange = (checked) => {
        setEnableMetadataMapping(checked);
    };

    if (settingActive) {
        const metadataFields = publishpressFutureProSettings.metadataFields.map((field) => {
            return (
                <tr key={field.originalKey} className="future_pro_metadata_mapping_row">
                    <td>
                        <div className="mapping-label-container">
                            <label htmlFor={'expirationdate_metadata_mapping_' + props.postType + '_' + field.originalKey}>
                                {field.label}
                            </label>
                            <Tooltip text={field.description}>
                                <span className="dashicons dashicons-editor-help"></span>
                            </Tooltip>
                        </div>
                    </td>
                    <td>{field.originalKey}</td>
                    <td>
                        <input
                            type="text"
                            name={'expirationdate_metadata_mapping[' + props.postType + '][' + field.originalKey + ']'}
                            id={'expirationdate_metadata_mapping_' + props.postType + '_' + field.originalKey}
                            value={metadataMapping[field.originalKey] ? metadataMapping[field.originalKey] : ''}
                            placeholder={field.originalKey}
                            onChange={(e) => handleMetadataMapChange(field.originalKey, e.target.value)}
                            />
                    </td>
                </tr>
            );
        });

        settingsRows.push(
            <SettingRow label={text.enableMetadataMapping} key={'metadata_mapping'}>
                <div>
                    <CheckboxControl
                        name={'expirationdate_metadata_mapping_enabled[' + props.postType + ']'}
                        id={'expirationdate_metadata_mapping_enabled_' + props.postType}
                        value={'1'}
                        label={text.enableMetadataMappingDesc}
                        checked={enableMetadataMapping}
                        onChange={(checked) => handleMetadataMapStatusChange(checked)}
                        />
                </div>
                {enableMetadataMapping &&
                    <div className="expirationdate_metadata_metakeys">
                        <table className="wp-list-table widefat fixed striped table-view-list">
                            <thead>
                                <tr>
                                    <th>{text.description}</th>
                                    <th>{text.originalKey}</th>
                                    <th>{text.mappedKey}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metadataFields}
                            </tbody>
                        </table>

                        <p className="description">
                            {text.enableMetadataMappingHelp}
                        </p>

                        <p className="description">
                            <a href="{text.readmoreMetadataMappingHelpUrl" target="_blank">{text.readmoreMetadataMappingHelp}</a>
                        </p>
                    </div>
                }
            </SettingRow>
        );
    }

    return settingsRows;
};


