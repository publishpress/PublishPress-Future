import { FutureActionPanelClassicEditor } from './components';
import { createStore } from './data';
import { isGutenbergEnabled } from './utils';
import { select } from '@wordpress/data';
import { createRoot } from 'react-dom/client';

const {
    postType,
    isNewPost,
    actionsSelectOptions,
    is12Hour,
    timeFormat,
    startOfWeek,
    strings,
    taxonomyName,
    postTypeDefaultConfig,
    defaultDate,
    statusesSelectOptions,
    hideCalendarByDefault
} = window.publishpressFutureClassicEditorConfig;

if (! isGutenbergEnabled()) {
    const storeName = 'publishpress-future/future-action';

    if (!select(storeName)) {
        createStore({
            name: storeName,
            defaultState: {
                postId: document.getElementById('post_ID') ? parseInt(document.getElementById('post_ID').value, 10) : 0,
                autoEnable: postTypeDefaultConfig.autoEnable,
                action: postTypeDefaultConfig.expireType,
                newStatus: postTypeDefaultConfig.newStatus,
                date: defaultDate,
                taxonomy: postTypeDefaultConfig.taxonomy,
                terms: postTypeDefaultConfig.terms,
            }
        });
    }

    const container = document.getElementById("publishpress-future-classic-editor");
    if (container) {
        const component = (
            <FutureActionPanelClassicEditor
                storeName={storeName}
                postType={postType}
                isNewPost={isNewPost}
                actionsSelectOptions={actionsSelectOptions}
                statusesSelectOptions={statusesSelectOptions}
                is12Hour={is12Hour}
                timeFormat={timeFormat}
                startOfWeek={startOfWeek}
                strings={strings}
                taxonomyName={taxonomyName}
                hideCalendarByDefault={hideCalendarByDefault}
            />
        );

        createRoot(container).render(component);
    }
}
