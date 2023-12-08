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

import { StrictMode, createRoot } from "@wp/element";

import {
    nonce,
    referrer,
    settings,
    expireTypeList,
    taxonomiesList,
    text
} from "@config/settings-post-types";

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
const root = createRoot(container);

root.render(<SettingsFormPanel />);
