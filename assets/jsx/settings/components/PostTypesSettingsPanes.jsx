/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import TrueFalseField from "./fields/TrueFalseField";
import SettingRow from "./SettingRow";
import SettingsFieldset from "./SettingsFieldset";
import SettingsTable from "./SettingsTable";

const PostTypesSettingsPanes = function (props) {
    let panes = [];

    console.log(props.settings);

    for (const [postType, settings] of Object.entries(props.settings)) {
        panes.push(
            <SettingsFieldset legend={settings.label}>
                <SettingsTable
                    bodyChildren={
                        <SettingRow label={props.text.fieldLabelActive}>
                            <TrueFalseField
                                fieldName={'expirationdate_activemeta-' + postType}
                                trueLabel={props.text.fieldLabelActive}
                                trueValue={'active'}
                                falseLabel={props.text.fieldLabelInactive}
                                falseValue={'inactive'}
                                description={props.text.fieldLabelActiveDescription}
                                selected={settings.active}
                            />
                        </SettingRow>
                    }
                />
            </SettingsFieldset>
        );
    }

    return (panes);
}

export default PostTypesSettingsPanes;
