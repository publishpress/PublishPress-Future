import FutureActionPanel from './components/FutureActionPanel';
import { createStore } from './data';
import { isGutenbergEnabled } from './utils';

((wp, config) => {
    if (isGutenbergEnabled()) {
        return;
    }

    const storeName = 'publishpress-future/future-action';

    const ClassicFutureActionPanel = () => {
        const { select } = wp.data;
        const browserTimezoneOffset = new Date().getTimezoneOffset();

        const getElementByName = (name) => {
            return document.getElementsByName(name)[0];
        }

        const onChangeData = (attribute, value) => {
            const store = select(storeName);

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
        }

        const data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(term => parseInt(term)),
            taxonomy: getElementByName('future_action_taxonomy').value,
        };

        return (
            <div className={'post-expirator-panel'}>
                <FutureActionPanel
                    postType={config.postType}
                    isCleanNewPost={config.isNewPost}
                    actionsSelectOptions={config.actionsSelectOptions}
                    enabled={data.enabled}
                    action={data.action}
                    date={data.date}
                    terms={data.terms}
                    taxonomy={data.taxonomy}
                    onChangeData={onChangeData}
                    is12hours={config.is12hours}
                    startOfWeek={config.startOfWeek}
                    storeName={storeName}
                    strings={config.strings} />
            </div>
        );
    };

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

    const container = document.getElementById("publishpress-future-classic-metabox");
    const root = createRoot(container);

    root.render(<ClassicFutureActionPanel />);
})(window.wp, window.publishpressFutureClassicMetabox);
