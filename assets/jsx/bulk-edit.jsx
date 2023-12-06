import { FutureActionPanelBulkEdit } from './components';
import { createStore } from './data';
import { getFieldValueByName, getFieldValueByNameAsBool } from './utils';

((wp, config, inlineEditPost) => {
    const storeName = 'publishpress-future/future-action-bulk-edit';
    const delayToUnmountAfterSaving = 1000;

    // We create a copy of the WP inline set bulk function
    const wpInlineSetBulk = inlineEditPost.setBulk;
    const wpInlineEditRevert = inlineEditPost.revert;

    const getPostId = (id) => {
        // If id is a string or a number, return it directly
        if (typeof id === 'string' || typeof id === 'number') {
            return id;
        }

        // Otherwise, assume it's an HTML element and extract the post ID
        const trElement = id.closest('tr');
        const trId = trElement.id;
        const postId = trId.split('-')[1];

        return postId;
    }

    /**
     * We override the function with our own code so we can detect when
     * the inline edit row is displayed to recreate the React component.
     */
    inlineEditPost.setBulk = function (id) {
        const { createRoot } = wp.element;
        const { select, dispatch } = wp.data;

        // Call the original WP edit function.
        wpInlineSetBulk.apply(this, arguments);

        if (select(storeName)) {
            dispatch(storeName).setAction(config.postTypeDefaultConfig.expireType);
            dispatch(storeName).setDate(config.postTypeDefaultConfig.defaultDate);
            dispatch(storeName).setTaxonomy(config.postTypeDefaultConfig.taxonomy);
            dispatch(storeName).setTerms(config.postTypeDefaultConfig.terms);
            dispatch(storeName).setChangeAction('no-change');
        } else {
            createStore({
                name: storeName,
                defaultState: {
                    action: config.postTypeDefaultConfig.expireType,
                    date: config.defaultDate,
                    taxonomy: config.postTypeDefaultConfig.taxonomy,
                    terms: config.postTypeDefaultConfig.terms,
                    changeAction: 'no-change',
                }
            });
        }

        const saveButton = document.querySelector('#bulk_edit');
        if (saveButton) {
            saveButton.onclick = function() {
                setTimeout(() => {
                    root.unmount();
                }, delayToUnmountAfterSaving);
            };
        }

        const container = document.getElementById("publishpress-future-bulk-edit");
        const root = createRoot(container);

        root.render(
            <FutureActionPanelBulkEdit
                storeName={storeName}
                postType={config.postType}
                isNewPost={config.isNewPost}
                actionsSelectOptions={config.actionsSelectOptions}
                is12hours={config.is12hours}
                startOfWeek={config.startOfWeek}
                strings={config.strings}
                taxonomyName={config.taxonomyName}
                nonce={config.nonce}
            />
        );

        inlineEditPost.revert = function () {
            root.unmount();

            // Call the original WP revert function.
            wpInlineEditRevert.apply(this, arguments);
        };
    };
})(window.wp, window.publishpressFutureBulkEdit, inlineEditPost);
