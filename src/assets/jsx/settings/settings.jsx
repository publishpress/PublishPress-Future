import { addCustomStatusSettings } from "./custom-statuses";
import { addMetadataSettings } from "./metadata-map";
import { addFilter } from "@wordpress/hooks";

import {
    settingsTab
} from "&config.pro-settings";

if ('defaults' === settingsTab) {
    addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', addCustomStatusSettings);
    addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', addMetadataSettings);
}
