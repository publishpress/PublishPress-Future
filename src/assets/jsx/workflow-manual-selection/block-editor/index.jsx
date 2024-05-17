import { useDispatch, useSelect } from '@wordpress/data';
import { store } from '../store';
import { Fieldset } from '../fieldset';
import { __ } from '@wordpress/i18n';

import { registerPlugin } from '@wordpress/plugins';
import { useEffect } from 'react';

function BlockEditorWorkflowManualTrigger() {
    const { PluginDocumentSettingPanel } = wp.editPost;

    const {
        workflowsEnabledForPost
    } = useSelect((select) => {
        return {
            workflowsEnabledForPost: select(store).getWorkflowsEnabledForPost(),
        };
    });

    const { editPost } = useDispatch('core/editor');

    useEffect(() => {
        editPostAttribute(workflowsEnabledForPost);
    }, [workflowsEnabledForPost]);

    const editPostAttribute = (enabledWorkflows) => {
        const attribute = {
            publishpress_future_workflow_manual_trigger: {
                enabledWorkflows: [],
            }
        };

        attribute.publishpress_future_workflow_manual_trigger = enabledWorkflows;

        editPost(attribute);
    }

    // Load the workflow settings for the post
    const apiUrl = window.futureWorkflowManualSelection.apiUrl;
    const nonce = window.futureWorkflowManualSelection.nonce;
    const postId = window.futureWorkflowManualSelection.postId;

    return (
        <PluginDocumentSettingPanel
            name={'publishpress-future-workflow-manual-trigger'}
            title={__('Workflow Manual Trigger', 'publishpress-future-pro')}
            initialOpen={true}
            className={'future-workflow-manual-trigger'}
        >
            <Fieldset
                context='block-editor'
                postId={postId}
                apiUrl={apiUrl}
                nonce={nonce}
            />
        </PluginDocumentSettingPanel>
    );
}

registerPlugin('publishpress-future-workflow-manual-trigger', {
    render: BlockEditorWorkflowManualTrigger
});

// import './css/style.css';

// // We create a copy of the WP inline edit post function
// const wpInlineEditPro = window.inlineEditPost.edit;
// const wpInlineEditProRevert = window.inlineEditPost.revert;

// const getPostIdFromButton = (id) => {
//     // If id is a string or a number, return it directly
//     if (typeof id === 'string' || typeof id === 'number') {
//         return id;
//     }

//     // Otherwise, assume it's an HTML element and extract the post ID
//     const trElement = id.closest('tr');
//     const trId = trElement.id;
//     const postId = trId.split('-')[1];

//     return postId;
// }

// /**
//  * We override the function with our own code so we can detect when
//  * the inline edit row is displayed to recreate the React component.
//  */
// window.inlineEditPost.edit = function (button, id) {
//     // Call the original WP edit function.
//     wpInlineEditPro.apply(this, arguments);

//     const postId = getPostIdFromButton(button);

//     const container = document.getElementById("publishpress-future-pro-quick-edit");
//     const root = createRoot(container);

//     const saveButton = document.querySelector('.inline-edit-save .save');
//     if (saveButton) {
//         saveButton.onclick = function() {
//             setTimeout(() => {
//                 root.unmount();
//             }, delayToUnmountAfterSaving);
//         };
//     }

//     // Load the workflow settings for the post
//     const apiUrl = window.futureWorkflowManualSelection.apiUrl;
//     const nonce = window.futureWorkflowManualSelection.nonce;

//     dispatch(store).setWorkflowsWithManualTrigger([]);
//     dispatch(store).setWorkflowsEnabledForPost([]);

//     apiFetch({
//         path: `${apiUrl}/posts/workflow-settings/${postId}`,
//         headers: {
//             'X-WP-Nonce': nonce,
//         },
//     }).then((response) => {
//         dispatch(store).setWorkflowsWithManualTrigger(response.workflowsWithManualTrigger);
//         dispatch(store).setWorkflowsEnabledForPost(response.manuallyEnabledWorkflows);
//     });

//     const component = (
//         <Fieldset
//             store={store}
//             context='quick-edit'
//         />
//     );

//     root.render(component);

//     window.inlineEditPost.revert = function () {
//         root.unmount();

//         // Call the original WP revert function.
//         wpInlineEditProRevert.apply(this, arguments);
//     };
// };
