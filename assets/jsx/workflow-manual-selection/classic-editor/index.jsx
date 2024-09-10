import { select, dispatch } from '@wordpress/data';
import { createRoot } from 'react-dom/client';
import { store } from '../store';
import { Fieldset } from '../fieldset';
import apiFetch from '@wordpress/api-fetch';


const container = document.getElementById("post-expirator-classic-editor");
const root = createRoot(container);

const saveButton = document.querySelector('.inline-edit-save .save');
const delayToUnmountAfterSaving = 1000;

if (saveButton) {
    saveButton.onclick = function() {
        setTimeout(() => {
            root.unmount();
        }, delayToUnmountAfterSaving);
    };
}

// Load the workflow settings for the post
const apiUrl = window.futureWorkflowManualSelection.apiUrl;
const nonce = window.futureWorkflowManualSelection.nonce;
const postId = window.futureWorkflowManualSelection.postId;

dispatch(store).setWorkflowsWithManualTrigger([]);
dispatch(store).setWorkflowsEnabledForPost([]);

apiFetch({
    path: `${apiUrl}/posts/workflow-settings/${postId}`,
    headers: {
        'X-WP-Nonce': nonce,
    },
}).then((response) => {
    dispatch(store).setWorkflowsWithManualTrigger(response.workflowsWithManualTrigger);
    dispatch(store).setWorkflowsEnabledForPost(response.manuallyEnabledWorkflows);
});

const component = (
    <Fieldset
        context='classic-editor'
        postId={postId}
        apiUrl={apiUrl}
        nonce={nonce}
    />
);

root.render(component);
