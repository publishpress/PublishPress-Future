import { controls } from '@wordpress/data';
import { apiFetch } from '@wordpress/data-controls';
import { STORE_NAME } from './name';
import { apiUrl } from 'future-workflow-editor';

const editableAttributes = ['name', 'description', 'flow'];

export function* setupEditor(workflowId) {
    yield {type: 'LOAD_WORKFLOW_START'};

    try {
        const workflow = yield apiFetch({
            path: `${apiUrl}/workflows/${workflowId}`,
        });

        console.log(workflow);

        yield {type: 'LOAD_WORKFLOW_SUCCESS', payload: workflow};
    } catch (error) {
        yield {type: 'LOAD_WORKFLOW_FAILURE'};
    }
    console.log('end setupEditor');
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
