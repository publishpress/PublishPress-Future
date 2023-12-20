/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {
    SettingsForm,
    SettingsSection,
    PostTypesSettingsPanels,
    SubmitButton,
    ButtonsPanel,
    NonceControl
} from "./components";

import { StrictMode, createRoot } from "&wp.element";

import {
    nonce,
    referrer,
    settings,
    expireTypeList,
    taxonomiesList,
    text
} from "&config.settings-post-types";
import { render } from "&ReactDOM";

const SettingsFormPanel = (props) => {
    return (
        <StrictMode>
            <SettingsForm>
                <NonceControl
                    name="_postExpiratorMenuDefaults_nonce"
                    nonce={nonce}
                    referrer={referrer}
                />
                <SettingsSection
                    title={text.settingsSectionTitle}
                    description={text.settingsSectionDescription}>
                    <PostTypesSettingsPanels
                        settings={settings}
                        text={text}
                        expireTypeList={expireTypeList}
                        taxonomiesList={taxonomiesList}
                    />
                </SettingsSection>

                <ButtonsPanel>
                    <SubmitButton
                        name="expirationdateSaveDefaults"
                        text={text.saveChanges}
                    />
                </ButtonsPanel>
            </SettingsForm>
        </StrictMode>
    )
};

const container = document.getElementById("publishpress-future-settings-post-types");
const component = (<SettingsFormPanel />);
if (createRoot) {
    createRoot(container).render(component);
} else {
    render(component, container);
}
