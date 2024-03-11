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

import { StrictMode, createRoot, useState } from "&wp.element";

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
    const [allValid, setAllValid] = useState(false);

    var dataValidationStatuses = {};

    const updateSaveButtonStatus = () => {
        let allValid = true;

        for (const [postType, isValid] of Object.entries(dataValidationStatuses)) {
            if (!isValid) {
                allValid = false;
                break;
            }
        }

        setAllValid(allValid);
    }

    const onDataIsValid = (postType) => {
        dataValidationStatuses[postType] = true;
        updateSaveButtonStatus();
    }

    const onDataIsInvalid = (postType) => {
        dataValidationStatuses[postType] = false;
        updateSaveButtonStatus();
    }

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
                        onDataIsValid={onDataIsValid}
                        onDataIsInvalid={onDataIsInvalid}
                    />
                </SettingsSection>

                <ButtonsPanel>
                    <SubmitButton
                        id="expirationdateSaveDefaults"
                        name="expirationdateSaveDefaults"
                        disabled={!allValid}
                        text={text.saveChanges}
                    />
                </ButtonsPanel>
            </SettingsForm>
        </StrictMode>
    )
};

const container = document.getElementById("publishpress-future-settings-post-types");
const component = (<SettingsFormPanel />);

createRoot(container).render(component);
