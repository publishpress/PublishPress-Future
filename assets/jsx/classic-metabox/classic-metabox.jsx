import { formatUnixTimestamp } from '../../js/classic-metabox';
import { createStore } from '../data';
import { FutureActionPanel } from '../FutureActionPanel';

(function (wp, config) {
    // Exit if Gutenberg is enabled.
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    const {createRoot} = ReactDOM;

    createStore({
        defaultState: {
            autoEnable: config.postTypeDefaultConfig.autoEnable,
            action: config.postTypeDefaultConfig.expireType,
            date: config.defaultDate,
            taxonomy: config.postTypeDefaultConfig.taxonomy,
            ters: config.postTypeDefaultConfig.terms,
        }
    });

    const ClassicFutureActionPanel = () => {
        const { select } = wp.data;

        const getElementByName = (name) => {
            return document.getElementsByName(name)[0];
        }

        const onChangeData = (attribute, value) => {
            const store = select('publishpress-future/future-action');

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
            getElementByName('future_action_browser_timezone_offset').value = new Date().getTimezoneOffset();
        }

        const data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(term => parseInt(term)),
            taxonomy: getElementByName('future_action_taxonomy').value,
        };

        console.log('date', formatUnixTimestamp(data.date), data.date);

        return (
            <div className={'post-expirator-panel'}>
                <FutureActionPanel
                    postType={config.postType}
                    isCleanNewPost={config.isNewPost}
                    actionsSelectOptions={config.actionsSelectOptions}
                    enabled={data.enabled}
                    action={data.action}
                    date={parseInt(data.date)}
                    terms={data.terms}
                    taxonomy={data.taxonomy}
                    onChangeData={onChangeData}
                    is12hours={config.is12hours}
                    startOfWeek={config.startOfWeek}

                    strings={config.strings} />
            </div>
        );
    };

    const container = document.getElementById("publishpress-future-classic-metabox");
    const root = createRoot(container);

    root.render(<ClassicFutureActionPanel />);
})(window.wp, window.publishpressFutureClassicMetabox);
