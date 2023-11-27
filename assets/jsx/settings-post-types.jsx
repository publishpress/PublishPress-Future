/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import SettingsSection from "./components/SettingsSection";
import SettingsForm from "./components/SettingsForm";
import PostTypesSettingsPanels from "./components/PostTypesSettingsPanels";
import SubmitButton from "./components/SubmitButton";
import ButtonsPanel from "./components/ButtonsPanel";
import NonceField from "./components/fields/NonceField";

(function (wp, config) {
    const { StrictMode, createRoot } = wp.element;

    const SettingsFormPanel = (props) => {
        return (
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
