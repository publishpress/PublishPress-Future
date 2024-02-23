/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { SettingRow } from "&publishpress-free/components";
import {
    settings,
    text
} from "&config.pro-settings";

import { CheckboxControl, Tooltip } from "&wp.components";
import { Fragment } from "&wp.element";

const SectionTitle = (props) => {
    return (
        <h3>{props.children}</h3>
    );
};

const MetadataMapTable = (props) => {
    const handleMetadataMapChange = (originalMetaKey, mappedMetaKey) => {
        let newMetadataMapping = {...props.metadataMapping};

        if (!newMetadataMapping) {
            newMetadataMapping = {};
        }

        newMetadataMapping[originalMetaKey] = mappedMetaKey;

        props.onChangeMetadataMapping(newMetadataMapping);
    }

    return (
        <table className="wp-list-table widefat fixed striped table-view-list">
            <thead>
                <tr>
                    {props.columns.map(
                        (column) => {
                            return (
                                <th key={column}>{column}</th>
                            );
                        }
                    )}
                </tr>
            </thead>
            <tbody>
                {props.metadataFields.map(
                    (field) => {
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
                                        value={props.metadataMapping[field.originalKey] ? props.metadataMapping[field.originalKey] : ''}
                                        placeholder={field.originalKey}
                                        onChange={(e) => handleMetadataMapChange(field.originalKey, e.target.value)}
                                        />
                                </td>
                            </tr>
                        );
                    }
                )}
            </tbody>
        </table>
    );
};

const HelpText = (props) => {
    return (
        <p className="description">{props.children}</p>
    );
};

const FieldRow = (props) => {
    let className = 'publishpress-settings-field-row';

    if (props.className) {
        className += ' ' + props.className;
    }

    return (
        <div className={className}>{props.children}</div>
    );
};

export const addMetadataSettings = (settingsRows, props, settingActive, useState) => {
    let defaultEnabledMetadaMapping = false;
    if (settings.metadataMappingStatus) {
        defaultEnabledMetadaMapping = settings.metadataMappingStatus[props.postType] || false;
    }

    let defaultHideMetabox = false;
    if (settings.metadataHideMetabox) {
        defaultHideMetabox = settings.metadataHideMetabox[props.postType] || false;
    }

    let defaultMetadataMapping = {};
    if (settings.metadataMapping) {
        defaultMetadataMapping = settings.metadataMapping[props.postType] || {};
    }

    const [enableMetadataMapping, setEnableMetadataMapping] = useState(defaultEnabledMetadaMapping);
    const [hideMetabox, setHideMetabox] = useState(defaultHideMetabox);
    const [metadataMapping, setMetadataMapping] = useState(defaultMetadataMapping);

    const handleMetadataMapStatusChange = (checked) => {
        setEnableMetadataMapping(checked);
    };

    const handleMetaboxStatusChange = (checked) => {
        setHideMetabox(checked);
    };

    if (settingActive) {
        settingsRows.push(
            <SettingRow label={text.enableMetadataDrivenScheduling} key={'metadata_mapping'}>
                <FieldRow>
                    <CheckboxControl
                        name={'expirationdate_metadata_mapping_enabled[' + props.postType + ']'}
                        id={'expirationdate_metadata_mapping_enabled_' + props.postType}
                        value={'1'}
                        label={text.enableMetadataDrivenSchedulingDesc}
                        checked={enableMetadataMapping}
                        onChange={(checked) => handleMetadataMapStatusChange(checked)}
                        />
                    <HelpText>{text.enableMetadataDrivenSchedulingHelp}</HelpText>
                </FieldRow>

                {enableMetadataMapping &&
                    <Fragment>
                        <FieldRow>
                            <CheckboxControl
                                name={'expirationdate_hide_metabox[' + props.postType + ']'}
                                id={'expirationdate_hide_metabox_' + props.postType}
                                value={'1'}
                                label={text.hideMetabox}
                                checked={hideMetabox}
                                onChange={(checked) => handleMetaboxStatusChange(checked)}
                                />

                            <HelpText>{text.hideMetaboxHelp}</HelpText>
                        </FieldRow>

                        <FieldRow className="expirationdate_metadata_metakeys">
                            <SectionTitle>{text.metadataMapping}</SectionTitle>
                            <MetadataMapTable
                                columns={[
                                    text.description,
                                    text.originalKey,
                                    text.mappedKey
                                ]}
                                postType={props.postType}
                                metadataFields={publishpressFutureProSettings.metadataFields}
                                metadataMapping={metadataMapping}
                                onChangeMetadataMapping={(newMetadataMapping) => setMetadataMapping(newMetadataMapping)}
                            />

                            <HelpText>
                                {text.enableMetadataMappingHelp}
                                <br />
                                <a href="{text.readmoreMetadataMappingHelpUrl" target="_blank">{text.readmoreMetadataMappingHelp}</a>
                            </HelpText>
                        </FieldRow>
                    </Fragment>
                }
            </SettingRow>
        );
    }

    return settingsRows;
};


