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

(function (wp, config) {
    const { StrictMode, createRoot } = wp.element;

    const SettingsFormPanel = (props) => {
        return (
            <StrictMode>
                <SettingsForm>
                    <NonceControl
                        name="_postExpiratorMenuDefaults_nonce"
                        nonce={config.nonce}
                        referrer={config.referrer}
                    />
                    <SettingsSection
                        title={config.text.settingsSectionTitle}
                        description={config.text.settingsSectionDescription}>
                        <PostTypesSettingsPanels
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
        )
    };

    const container = document.getElementById("publishpress-future-settings-post-types");
    const root = createRoot(container);

    root.render(<SettingsFormPanel />);
})(window.wp, window.publishpressFutureConfig);
