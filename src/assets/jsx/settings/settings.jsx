import { addCustomStatusSettings } from "./custom-statuses";
import { addMetadataSettings } from "./metadata-map";
import { addFilter } from "@wordpress/hooks";
import { createRoot } from 'react-dom/client';
import { ScheduledStepsCleanupSettings } from './scheduled-steps-cleanup';

import {
    settingsTab
} from "&config.pro-settings";

if ('defaults' === settingsTab) {
    addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', addCustomStatusSettings);
    addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', addMetadataSettings);
}

if ('advanced' === settingsTab) {
    const scheduledStepsCleanupContainer = document.getElementById('scheduled-steps-cleanup-settings');

    if (scheduledStepsCleanupContainer) {
        const root = createRoot(scheduledStepsCleanupContainer);
        root.render(<ScheduledStepsCleanupSettings />);
    }
}
