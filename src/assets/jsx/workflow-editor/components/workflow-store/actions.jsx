import { controls } from '@wordpress/data';
import { apiFetch } from '@wordpress/data-controls';
import { STORE_NAME } from './name';
import { apiUrl, nonce } from 'future-workflow-editor';

const editableAttributes = ['name', 'description', 'flow'];

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
            yield {type: 'LOAD_WORKFLOW_FAILURE'};
        }
    }
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
        throw new Error(`Invalid key: ${key}`);
    }

    return {
        type: 'SET_EDITED_WORKFLOW_ATTRIBUTE',
        payload: { key, value },
    };
};
