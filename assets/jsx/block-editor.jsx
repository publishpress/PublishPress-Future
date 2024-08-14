import { createStore } from './data';
import { FutureActionPanelBlockEditor } from './components';
import { select } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import {
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
} from "&config.block-editor";

const storeName = 'publishpress-future/future-action';

createStore({
    name: storeName,
    defaultState: {
        autoEnable: postTypeDefaultConfig.autoEnable,
        action: postTypeDefaultConfig.expireType,
        newStatus: postTypeDefaultConfig.newStatus,
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
            statusesSelectOptions={statusesSelectOptions}
            is12Hour={is12Hour}
            timeFormat={timeFormat}
            startOfWeek={startOfWeek}
            storeName={storeName}
            strings={strings}
            taxonomyName={taxonomyName}
            postTypeDefaultConfig={postTypeDefaultConfig}
            hideCalendarByDefault={hideCalendarByDefault}
        />
    );
}

registerPlugin('publishpress-future-action', {
    render: BlockEditorFutureActionPlugin
});
