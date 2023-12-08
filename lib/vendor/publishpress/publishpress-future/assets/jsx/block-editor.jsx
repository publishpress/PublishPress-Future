import { createStore } from './data';
import { FutureActionPanelBlockEditor } from './components';
import { select } from '@wp/data';
import { registerPlugin } from '@wp/plugins';
import {
    actionsSelectOptions,
    is12Hour,
    startOfWeek,
    strings,
    taxonomyName,
    postTypeDefaultConfig,
    defaultDate
} from "@config/block-editor";

const storeName = 'publishpress-future/future-action';

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

const BlockEditorFutureActionPlugin = () => {
    return (
        <FutureActionPanelBlockEditor
            postType={select('core/editor').getCurrentPostType()}
            isCleanNewPost={select('core/editor').isCleanNewPost()}
            actionsSelectOptions={actionsSelectOptions}
            is12Hour={is12Hour}
            startOfWeek={startOfWeek}
            storeName={storeName}
            strings={strings}
            taxonomyName={taxonomyName}
            postTypeDefaultConfig={postTypeDefaultConfig} />
    );
}

registerPlugin('publishpress-future-action', {
    render: BlockEditorFutureActionPlugin
});
