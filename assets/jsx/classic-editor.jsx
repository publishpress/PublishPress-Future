import { FutureActionPanelClassicEditor } from './components';
import { createStore } from './data';
import { isGutenbergEnabled } from './utils';

((wp, config) => {
    if (isGutenbergEnabled()) {
        return;
    }

    const storeName = 'publishpress-future/future-action';

    const { createRoot } = wp.element;
    const { select } = wp.data;

    if (!select(storeName)) {
        createStore({
            name: storeName,
            defaultState: {
                autoEnable: config.postTypeDefaultConfig.autoEnable,
                action: config.postTypeDefaultConfig.expireType,
                date: config.defaultDate,
                taxonomy: config.postTypeDefaultConfig.taxonomy,
                terms: config.postTypeDefaultConfig.terms,
            }
        });
    }

    const container = document.getElementById("publishpress-future-classic-editor");
    const root = createRoot(container);

    root.render(
        <FutureActionPanelClassicEditor
            storeName={storeName}
            postType={config.postType}
            isNewPost={config.isNewPost}
            actionsSelectOptions={config.actionsSelectOptions}
            is12hours={config.is12hours}
            startOfWeek={config.startOfWeek}
            strings={config.strings}
        />
    );
})(window.wp, window.publishpressFutureClassicMetabox);
