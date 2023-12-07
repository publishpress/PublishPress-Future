import { createStore } from './data';
import { FutureActionPanelBlockEditor } from './components';

(function (wp, config) {
    const { registerPlugin } = wp.plugins;
    const storeName = 'publishpress-future/future-action';

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

    const BlockEditorFutureActionPlugin = () => {
        return (
            <FutureActionPanelBlockEditor
                postType={wp.data.select('core/editor').getCurrentPostType()}
                isCleanNewPost={wp.data.select('core/editor').isCleanNewPost()}
                actionsSelectOptions={config.actionsSelectOptions}
                is12Hour={config.is12Hour}
                startOfWeek={config.startOfWeek}
                storeName={storeName}
                strings={config.strings}
                taxonomyName={config.taxonomyName}
                postTypeDefaultConfig={config.postTypeDefaultConfig} />
        );
    }

    registerPlugin('publishpress-future-action', {
        render: BlockEditorFutureActionPlugin
    });
})(window.wp, window.postExpiratorPanelConfig);
