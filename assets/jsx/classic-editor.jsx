import { FutureActionPanelClassicEditor } from './components';
import { createStore } from './data';
import { isGutenbergEnabled } from './utils';
import { createRoot } from '@wp/element';
import { select } from '@wp/data';
import {
    postType,
    isNewPost,
    actionsSelectOptions,
    is12Hour,
    startOfWeek,
    strings,
    taxonomyName,
    postTypeDefaultConfig,
    defaultDate
} from "@config/classic-editor";

if (! isGutenbergEnabled()) {
    const storeName = 'publishpress-future/future-action';

    if (!select(storeName)) {
        createStore({
            name: storeName,
            defaultState: {
                autoEnable: postTypeDefaultConfig.autoEnable,
                action: postTypeDefaultConfig.expireType,
                date: defaultDate,
                taxonomy: postTypeDefaultConfig.taxonomy,
                terms: postTypeDefaultConfig.terms,
            }
        });
    }

    const container = document.getElementById("publishpress-future-classic-editor");
    const root = createRoot(container);

    root.render(
        <FutureActionPanelClassicEditor
            storeName={storeName}
            postType={postType}
            isNewPost={isNewPost}
            actionsSelectOptions={actionsSelectOptions}
            is12Hour={is12Hour}
            startOfWeek={startOfWeek}
            strings={strings}
            taxonomyName={taxonomyName}
        />
    );
}
