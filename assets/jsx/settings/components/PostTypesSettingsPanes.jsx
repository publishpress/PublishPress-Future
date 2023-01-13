/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import TrueFalseField from "./fields/TrueFalseField";
import SettingRow from "./SettingRow";
import SettingsFieldset from "./SettingsFieldset";
import SettingsTable from "./SettingsTable";
import {Fragment} from "react";
import SelectField from "./fields/SelectField";

const PostTypesSettingsPanes = function (props) {
    let panes = [];

    for (const [postType, postTypeSettings] of Object.entries(props.settings)) {
        panes.push(
            <SettingsFieldset legend={postTypeSettings.label}>
                <SettingsTable bodyChildren={
                    <Fragment>
                        <SettingRow label={props.text.fieldLabelActive}>
                            <TrueFalseField
                                name={'expirationdate_activemeta-' + postType}
                                trueLabel={props.text.fieldLabelActiveTrue}
                                trueValue={'active'}
                                falseLabel={props.text.fieldLabelActiveFalse}
                                falseValue={'inactive'}
                                description={props.text.fieldLabelActiveDescription}
                                selected={postTypeSettings.active}
                            />
                        </SettingRow>

                        <SettingRow label={props.text.fieldLabelHowToExpire}>
                            <SelectField
                                name={'expirationdate_expiretype-' + postType}
                                className={'pe-howtoexpire'}
                                options={props.expireTypeList}
                                description={props.text.fieldLabelHowToExpireDescription}
                                selected={postTypeSettings.howToExpire}
                            />
                        </SettingRow>

                        <SettingRow label={props.text.fieldLabelAutoEnable}>
                            <TrueFalseField
                                name={'expirationdate_autoenable-' + postType}
                                trueLabel={props.text.fieldLabelAutoEnableTrue}
                                trueValue={'1'}
                                falseLabel={props.text.fieldLabelAutoEnableFalse}
                                falseValue={'0'}
                                description={props.text.fieldLabelAutoEnableDescription}
                                selected={postTypeSettings.autoEnabled}
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
