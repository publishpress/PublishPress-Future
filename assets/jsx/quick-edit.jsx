import { FutureActionPanel } from './components/FutureActionPanel';
import { createStore } from './data';
import { getFieldValueByName, getFieldValueByNameAsArrayOfInt, getFieldValueByNameAsBool } from './utils';

((wp, config, inlineEditPost) => {
    const storeName = 'publishpress-future/future-action';
    const delayToUnmountAfterSaving = 1000;

    const QuickEditFutureActionPanel = (props) => {
        const { useSelect } = wp.data;
        const { useEffect } = wp.element;

        const onChangeData = (attribute, value) => {};

        const date = useSelect((select) => select(storeName).getDate(), []);
        const enabled = useSelect((select) => select(storeName).getEnabled(), []);
        const action = useSelect((select) => select(storeName).getAction(), []);
        const terms = useSelect((select) => select(storeName).getTerms(), []);
        const taxonomy = useSelect((select) => select(storeName).getTaxonomy(), []);

        return (
            <div className={'post-expirator-panel'}>
                <FutureActionPanel
                    postType={config.postType}
                    isCleanNewPost={config.isNewPost}
                    actionsSelectOptions={config.actionsSelectOptions}
                    enabled={enabled}
                    action={action}
                    date={date}
                    terms={terms}
                    taxonomy={taxonomy}
                    onChangeData={onChangeData}
                    is12hours={config.is12hours}
                    startOfWeek={config.startOfWeek}
                    storeName={storeName}
                    strings={config.strings} />

                {/* Quick edit JS code will save only fields with name inside the edit row */}
                <input type="hidden" name={'future_action_enabled'} value={enabled ? 1 : 0} />
                <input type="hidden" name={'future_action_action'} value={action} />
                <input type="hidden" name={'future_action_date'} value={date} />
                <input type="hidden" name={'future_action_terms'} value={terms.join(',')} />
                <input type="hidden" name={'future_action_taxonomy'} value={taxonomy} />
                <input type="hidden" name={'future_action_view'} value="quick-edit" />
                <input type="hidden" name={'_future_action_nonce'} value={config.nonce} />
            </div>
        );
    };

    // We create a copy of the WP inline edit post function
    const wpInlineEdit = inlineEditPost.edit;
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

    // We override the function with our own code
    inlineEditPost.edit = function (id) {
        const { createRoot } = wp.element;
        const { select } = wp.data;

        const postId = getPostId(id);

        // Call the original WP edit function.
        wpInlineEdit.apply(this, arguments);

        // Initiate our component.
        if (!select(storeName)) {
            const enabled = getFieldValueByNameAsBool('enabled', postId);
            const action = getFieldValueByName('action', postId);
            const date = getFieldValueByName('date', postId);
            const terms = getFieldValueByName('terms', postId);
            const taxonomy = getFieldValueByName('taxonomy', postId);

            createStore({
                name: storeName,
                defaultState: {
                    autoEnable: enabled,
                    action: action,
                    date: date,
                    taxonomy: taxonomy,
                    terms: terms,
                }
            });
        }

        const container = document.getElementById("publishpress-future-quick-edit");
        const root = createRoot(container);

        root.render(<QuickEditFutureActionPanel id={postId} />);

        inlineEditPost.revert = function () {
            root.unmount();

            // Call the original WP edit function.
            wpInlineEditRevert.apply(this, arguments);
        };

         const saveButton = document.querySelector('.inline-edit-save .save');
         if (saveButton) {
             saveButton.onclick = function() {
                 setTimeout(() => {
                     root.unmount();
                 }, delayToUnmountAfterSaving);
             };
         }
    };
})(window.wp, window.publishpressFutureQuickEdit, inlineEditPost);
