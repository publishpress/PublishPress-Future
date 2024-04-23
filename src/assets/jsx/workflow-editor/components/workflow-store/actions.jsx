import { dispatch, select } from '@wordpress/data';
import { apiFetch } from '@wordpress/data-controls';
import { STORE_NAME } from './name';
import { apiUrl, nonce } from 'future-workflow-editor';

const editableAttributes = ['title', 'description', 'flow', 'status'];

export function* setupEditor(workflowId) {
    yield {type: 'LOAD_WORKFLOW_START'};

    if (workflowId == 0) {
        yield {type: 'CREATE_WORKFLOW_START'};

        // No workflow ID, we have a new workflow. Call the API to create a new workflow and ge the ID.
        try {
            const workflow = yield apiFetch({
                path: `${apiUrl}/workflows`,
                method: 'POST',
                headers: {
                    'X-WP-Nonce': nonce,
                },
            });

            yield {type: 'CREATE_WORKFLOW_SUCCESS', payload: workflow};
        } catch (error) {
            // TODO: Show error message
            yield {type: 'CREATE_WORKFLOW_FAILURE'};
        }
    }

    if (workflowId > 0) {
        try {
            const workflow = yield apiFetch({
                path: `${apiUrl}/workflows/${workflowId}`,
                headers: {
                    'X-WP-Nonce': nonce,
                },
            });

            yield {type: 'LOAD_WORKFLOW_SUCCESS', payload: workflow};
        } catch (error) {
            // TODO: Show error message
            yield {type: 'LOAD_WORKFLOW_FAILURE'};
        }
    }
};

export function* saveAsDraft() {
    yield {type: 'SAVE_AS_DRAFT_START'};

    try {
        const wasNewWorkflow = yield select(STORE_NAME).isNewWorkflow();

        yield dispatch(STORE_NAME).setEditedWorkflowAttribute('status', 'draft');

        const editedWorkflow = yield select(STORE_NAME).getEditedWorkflow();

        const newWorkflow = yield apiFetch({
            path: `${apiUrl}/workflows/${editedWorkflow.id}`,
            method: 'PUT',
            headers: {
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify(editedWorkflow),
        });

        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
            window.history.pushState({}, '', `?page=future_workflow_editor&workflow=${newWorkflow.id}`);
        }

        yield {type: 'SAVE_AS_DRAFT_SUCCESS', payload: newWorkflow};
    } catch (error) {
        // TODO: Show error message
        yield {type: 'SAVE_AS_DRAFT_FAILURE'};
        console.log('error', error);
    }
}

export function* saveAsCurrentStatus() {
    yield {type: 'SAVE_AS_CURRENT_STATUS_START'};

    try {
        const editedWorkflow = yield select(STORE_NAME).getEditedWorkflow();

        const newWorkflow = yield apiFetch({
            path: `${apiUrl}/workflows/${editedWorkflow.id}`,
            method: 'PUT',
            headers: {
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify(editedWorkflow),
        });

        yield {type: 'SAVE_AS_CURRENT_STATUS_SUCCESS', payload: newWorkflow};
    } catch (error) {
        yield {type: 'SAVE_AS_CURRENT_STATUS_FAILURE'};
        console.log('error', error);
    }
}

export function* publishWorkflow() {
    yield {type: 'PUBLISH_WORKFLOW_START'};

    try {
        const wasNewWorkflow = yield select(STORE_NAME).isNewWorkflow();

        yield dispatch(STORE_NAME).setEditedWorkflowAttribute('status', 'publish');

        const editedWorkflow = yield select(STORE_NAME).getEditedWorkflow();

        const newWorkflow = yield apiFetch({
            path: `${apiUrl}/workflows/${editedWorkflow.id}`,
            method: 'PUT',
            headers: {
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify(editedWorkflow),
        });

        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
            window.history.pushState({}, '', `?page=future_workflow_editor&workflow=${newWorkflow.id}`);
        }

        yield {type: 'PUBLISH_WORKFLOW_SUCCESS', payload: newWorkflow};
    } catch (error) {
        // TODO: Show error message
        yield {type: 'PUBLISH_WORKFLOW_FAILURE'};
        console.log('error', error);
    }
}

export function* switchToDraft() {
    yield {type: 'SWITCH_TO_DRAFT_START'};

    try {
        const wasNewWorkflow = yield select(STORE_NAME).isNewWorkflow();

        yield dispatch(STORE_NAME).setEditedWorkflowAttribute('status', 'draft');

        const editedWorkflow = yield select(STORE_NAME).getEditedWorkflow();

        const newWorkflow = yield apiFetch({
            path: `${apiUrl}/workflows/${editedWorkflow.id}`,
            method: 'PUT',
            headers: {
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify(editedWorkflow),
        });

        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
            window.history.pushState({}, '', `?page=future_workflow_editor&workflow=${newWorkflow.id}`);
        }

        yield {type: 'SWITCH_TO_DRAFT_SUCCESS', payload: newWorkflow};
    } catch (error) {
        // TODO: Show error message
        yield {type: 'SWITCH_TO_DRAFT_FAILURE'};
        console.log('error', error);
    }
}

export const setFlow = (flow) => {
    return {
        type: 'SET_FLOW',
        payload: flow,
    };
};

export const setPostType = (postType) => {
    return {
        type: 'SET_POST_TYPE',
        payload: postType,
    };
};

export const setNodes = (nodes) => {
    return {
        type: 'SET_NODES',
        payload: nodes,
    };
};

export const setEdges = (edges) => {
    return {
        type: 'SET_EDGES',
        payload: edges,
    };
};

export const setInitialViewport = (viewport) => {
    return {
        type: 'SET_INITIAL_VIEWPORT',
        payload: viewport,
    };
}

export const setSelectedNodes = (nodes) => {
    return {
        type: 'SET_SELECTED_NODES',
        payload: nodes,
    };
};

export const setSelectedEdges = (edges) => {
    return {
        type: 'SET_SELECTED_EDGES',
        payload: edges,
    };
};

export const setEditedWorkflowAttribute = (key, value) => {
    if (!editableAttributes.includes(key)) {
        throw new Error(`The workflow attribute "${key}" is not editable.`);
    }

    return {
        type: 'SET_EDITED_WORKFLOW_ATTRIBUTE',
        payload: { key, value },
    };
};

export function* deleteWorkflow () {
    yield {type: 'DELETE_WORKFLOW_START'};

    const editedWorkflow = yield select(STORE_NAME).getEditedWorkflow();

    try {
        const newWorkflow = yield apiFetch({
            path: `${apiUrl}/workflows/${editedWorkflow.id}`,
            method: 'DELETE',
            headers: {
                'X-WP-Nonce': nonce,
            },
        });

        yield {type: 'DELETE_WORKFLOW_SUCCESS', payload: newWorkflow};

        // Redirect to the workflow list
        window.location.href = `edit.php?post_type=ppfuture_workflow`;
    } catch (error) {
        // TODO: Show error message
        yield {type: 'DELETE_WORKFLOW_FAILURE'};
        console.log('error', error);
    }
}

export function updateNode(node) {
    return {
        type: 'UPDATE_NODE',
        payload: node,
    };
}
