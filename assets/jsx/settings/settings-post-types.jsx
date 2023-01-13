/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {StrictMode} from "react";
import {render} from 'react-dom';
import SettingsSection from "./components/SettingsSection";
import SettingsForm from "./components/SettingsForm";
import PostTypesSettingsPanes from "./components/PostTypesSettingsPanes";

(function (wp, config) {
    const settingsForm = (
        <StrictMode>
            <SettingsForm>
                <SettingsSection
                    title={config.text.settingsSectionTitle}
                    description={config.text.settingsSectionDescription}>
                    <PostTypesSettingsPanes settings={config.settings} text={config.text} />
                </SettingsSection>
            </SettingsForm>
        </StrictMode>
    );

    render(settingsForm, document.getElementById('publishpress-future-settings-post-types'));
})(window.wp, window.publishpressFutureConfig);

PostTypesSettingsPanes
