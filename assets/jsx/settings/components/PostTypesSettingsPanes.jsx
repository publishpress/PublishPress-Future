/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import TrueFalseField from "./fields/TrueFalseField";
import SettingRow from "./SettingRow";
import SettingsFieldset from "./SettingsFieldset";
import SettingsTable from "./SettingsTable";
import {Fragment} from "react";
import SelectField from "./fields/SelectField";
import TextField from "./fields/TextField";

const PostTypesSettingsPanes = function (props) {
    let panes = [];

    for (const [postType, postTypeSettings] of Object.entries(props.settings)) {
        panes.push(
            <SettingsFieldset legend={postTypeSettings.label}>
                <SettingsTable bodyChildren={
                    <Fragment>
                        <SettingRow label={props.text.fieldActive}>
                            <TrueFalseField
                                name={'expirationdate_activemeta-' + postType}
                                trueLabel={props.text.fieldActiveTrue}
                                trueValue={'active'}
                                falseLabel={props.text.fieldActiveFalse}
                                falseValue={'inactive'}
                                description={props.text.fieldActiveDescription}
                                selected={postTypeSettings.active}
                            />
                        </SettingRow>

                        <SettingRow label={props.text.fieldHowToExpire}>
                            <SelectField
                                name={'expirationdate_expiretype-' + postType}
                                className={'pe-howtoexpire'}
                                options={props.expireTypeList}
                                description={props.text.fieldHowToExpireDescription}
                                selected={postTypeSettings.howToExpire}
                            />
                        </SettingRow>

                        <SettingRow label={props.text.fieldAutoEnable}>
                            <TrueFalseField
                                name={'expirationdate_autoenable-' + postType}
                                trueLabel={props.text.fieldAutoEnableTrue}
                                trueValue={'1'}
                                falseLabel={props.text.fieldAutoEnableFalse}
                                falseValue={'0'}
                                description={props.text.fieldAutoEnableDescription}
                                selected={postTypeSettings.autoEnabled}
                            />
                        </SettingRow>

                        <SettingRow label={props.text.fieldTaxonomy}>
                            <SelectField
                                name={'expirationdate_taxonomy-' + postType}
                                options={props.taxonomiesList[postType]}
                                selected={postTypeSettings.taxonomy}
                                noItemFoundMessage={props.text.noItemsfound}
                                description={props.text.fieldTaxonomyDescription}
                            />
                        </SettingRow>

                        <SettingRow label={props.text.fieldWhoToNotify}>
                            <TextField
                                name={'expirationdate_emailnotification-' + postType}
                                className="large-text"
                                selected={postTypeSettings.emailNotification}
                                description={props.text.fieldWhoToNotifyDescription}
                            />
                        </SettingRow>
                    </Fragment>
                }
                />
            </SettingsFieldset>
        );
    }

    return (panes);
}

export default PostTypesSettingsPanes;
