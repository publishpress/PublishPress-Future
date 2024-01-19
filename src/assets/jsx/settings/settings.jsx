import { addCustomStatusSettings } from "./custom-statuses";
import { addMetadataSettings } from "./metadata-map";
import { addFilter } from "&wp.hooks";

addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', addCustomStatusSettings);
addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', addMetadataSettings);
