import { createStore } from '../data';
import { FutureActionPanel } from '../FutureActionPanel';
import { formatTimeToUnixTimestamp } from '../time';

(function (wp, config) {
    const { registerPlugin } = wp.plugins;

    createStore({
        defaultState: {
            autoEnable: config.postTypeDefaultConfig.autoEnable,
            action: config.postTypeDefaultConfig.expireType,
            date: config.defaultDate,
            taxonomy: config.postTypeDefaultConfig.taxonomy,
            ters: config.postTypeDefaultConfig.terms,
        }
    });

    const GutenbergFutureActionPanel = () => {
        const { PluginDocumentSettingPanel } = wp.editPost;
        const { useDispatch, select } = wp.data;
        const { editPost } = useDispatch('core/editor');

        const editPostAttribute = (newAttribute) => {
            const attribute = {
                publishpress_future_action: {
                    browser_timezone_offset: new Date().getTimezoneOffset()
                }
            };

            // For each property on newAttribute, set the value on attribute
            for (const [name, value] of Object.entries(newAttribute)) {
                attribute.publishpress_future_action[name] = value;
            }

            editPost(attribute);
        }

        const onChangeData = (attribute, value) => {
            const store = select('publishpress-future/future-action');

            const newAttribute = {
                'enabled': store.getEnabled()
            }

            if (data.enabled) {
                newAttribute['action'] = store.getAction();
                newAttribute['date'] = store.getDate();
                newAttribute['terms'] = store.getTerms();
                newAttribute['taxonomy'] = store.getTaxonomy();
            }

            editPostAttribute(newAttribute);
        }

        const data = select('core/editor').getEditedPostAttribute('publishpress_future_action');

        console.log('date', data.date, formatTimeToUnixTimestamp(data.date));

        return (
            <PluginDocumentSettingPanel
                name={'publishpress-future-action-panel'}
                title={config.strings.panelTitle}
                icon="calendar"
                initialOpen={config.postTypeDefaultConfig.autoEnable}
                className={'post-expirator-panel'}>
                <FutureActionPanel
                    postType={select('core/editor').getCurrentPostType()}
                    isCleanNewPost={select('core/editor').isCleanNewPost()}
                    actionsSelectOptions={config.actionsSelectOptions}
                    enabled={data.enabled}
                    action={data.action}
                    date={data.date}
                    terms={data.terms}
                    taxonomy={data.taxonomy}
                    onChangeData={onChangeData}
                    is12hours={config.is12hours}
                    startOfWeek={config.startOfWeek}

                    strings={config.strings} />
            </PluginDocumentSettingPanel>
        );
    };

    registerPlugin('publishpress-future-action', {
        render: GutenbergFutureActionPanel
    });

})(window.wp, window.postExpiratorPanelConfig);
