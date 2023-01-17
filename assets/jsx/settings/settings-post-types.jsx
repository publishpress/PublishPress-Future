/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {StrictMode} from "react";
import {render} from 'react-dom';
import SettingsSection from "./components/SettingsSection";
import SettingsForm from "./components/SettingsForm";
import PostTypesSettingsPanes from "./components/PostTypesSettingsPanes";
import SubmitButton from "./components/SubmitButton";
import ButtonsPanel from "./components/ButtonsPanel";
import NonceField from "./components/fields/NonceField";

(function (wp, config, $) {
    const settingsForm = (
        <StrictMode>
            <SettingsForm>
                <NonceField
                    name="_postExpiratorMenuDefaults_nonce"
                    nonce={config.nonce}
                    referrer={config.referrer}
                />
                <SettingsSection
                    title={config.text.settingsSectionTitle}
                    description={config.text.settingsSectionDescription}>
                    <PostTypesSettingsPanes
                        settings={config.settings}
                        text={config.text}
                        expireTypeList={config.expireTypeList}
                        taxonomiesList={config.taxonomiesList}
                    />
                </SettingsSection>

                <ButtonsPanel>
                    <SubmitButton
                        name="expirationdateSaveDefaults"
                        text={config.text.saveChanges}
                    />
                </ButtonsPanel>
            </SettingsForm>
        </StrictMode>
    );

    const wrapper = $('<div id="publishpress-future-settings-post-types"></div>');
    const navBar = $('#postexpirator-nav');
    wrapper.insertAfter(navBar);

    render(settingsForm, document.getElementById('publishpress-future-settings-post-types'));
})(window.wp, window.publishpressFutureConfig, jQuery);

PostTypesSettingsPanes
