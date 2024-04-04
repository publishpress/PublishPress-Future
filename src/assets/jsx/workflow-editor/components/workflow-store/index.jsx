/*
 * WordPress dependencies
 */
import { register, createReduxStore, dispatch, select } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';
/*
 * Internal dependencies
 */
import { POST_TYPE } from '../../constants';
import { STORE_NAME } from './constants';


export const storeConfig = {
    postType: POST_TYPE,
    nodes: [],
    edges: [],
    undo: [],
    redo: [],
    selectedNodes: [],
    selectedEdges: [],
    workflowAttributes : {
        name: null,
        description: null,
    },
    editedWorkflowAttributes: {},
    workflowContent: null,
    editedWorkflowContent: null,
}

export const store = createReduxStore(STORE_NAME, {
    reducer(state = storeConfig, action) {
        switch (action.type) {
            case 'SET_POST_TYPE':
                return {
                    ...state,
                    postType: action.payload,
                };

            case 'SET_NODES':
                return {
                    ...state,
                    nodes: action.payload,
                };

            case 'SET_EDGES':
                return {
                    ...state,
                    edges: action.payload,
                };

            case 'SET_SELECTED_NODES':
                return {
                    ...state,
                    selectedNodes: action.payload,
                };

            case 'SET_SELECTED_EDGES':
                return {
                    ...state,
                    selectedEdges: action.payload,
                };

            case 'SET_WORKFLOW_NAME':
                return {
                    ...state,
                    workflowName: action.payload,
                };

            case 'UNDO':
                // TODO: Implement undo
                return {
                    ...state
                };

            case 'REDO':
                // TODO: Implement redo
                return {
                    ...state
                };

            case 'SET_WORKFLOW_ATTRIBUTES':
                return {
                    ...state,
                    workflowAttributes: action.payload,
                };

            case 'SET_WORKFLOW_CONTENT':
                return {
                    ...state,
                    workflowContent: action.payload,
                };

            case 'SET_EDITED_WORKFLOW_ATTRIBUTES':
                return {
                    ...state,
                    editedWorkflowAttributes: action.payload,
                };

            case 'SET_EDITED_WORKFLOW_CONTENT':
                return {
                    ...state,
                    editedWorkflowContent: action.payload,
                };
        }

        return state;
    },
    actions: {
        setPostType(postType) {
            return {
                type: 'SET_POST_TYPE',
                payload: postType
            };
        },
        setNodes(nodes) {
            return {
                type: 'SET_NODES',
                payload: nodes
            };
        },
        setEdges(edges) {
            return {
                type: 'SET_EDGES',
                payload: edges
            };
        },
        setSelectedNodes(nodes) {
            return {
                type: 'SET_SELECTED_NODES',
                payload: nodes
            };
        },
        setSelectedEdges(edges) {
            return {
                type: 'SET_SELECTED_EDGES',
                payload: edges
            };
        },
        setWorkflowName(name) {
            return {
                type: 'SET_WORKFLOW_NAME',
                payload: name
            };
        },
        undo() {
            return {
                type: 'UNDO'
            };
        },
        redo() {
            return {
                type: 'REDO'
            };
        },
        setWorkflowAttributes(attributes) {
            return {
                type: 'SET_WORKFLOW_ATTRIBUTES',
                payload: attributes
            };
        },
        setWorkflowContent(content) {
            return {
                type: 'SET_WORKFLOW_CONTENT',
                payload: content
            };
        },
        setEditedWorkflowAttributes(attributes) {
            return {
                type: 'SET_EDITED_WORKFLOW_ATTRIBUTES',
                payload: attributes
            };
        },
        setEditedWorkflowContent(content) {
            return {
                type: 'SET_EDITED_WORKFLOW_CONTENT',
                payload: content
            };
        },
    },
    selectors: {
        getPostType(state) {
            return state.postType;
        },
        getNodes(state) {
            return state.nodes;
        },
        getEdges(state) {
            return state.edges;
        },
        getNodeById(state, id) {
            return state.nodes.find(node => node.id === id);
        },
        getEdgeById(state, id) {
            return state.edges.find(edge => edge.id === id);
        },
        getSelectedNodes(state) {
            return state.selectedNodes;
        },
        getSelectedEdges(state) {
            return state.selectedEdges;
        },
        hasSelectedNodes(state) {
            return state.selectedNodes.length > 0;
        },
        hasSelectedEdges(state) {
            return state.selectedEdges.length > 0;
        },
        getWorkflowName(state) {
            return state.workflowName;
        },
        hasUndo(state) {
            return state.undo.length > 0;
        },
        hasRedo(state) {
            return state.redo.length > 0;
        },
        getWorkflowAttributes(state) {
            return state.workflowAttributes;
        },
        getWorkflowContent(state) {
            return state.workflowContent;
        },
        getEditedWorkflowAttributes(state) {
            return state.editedWorkflowAttributes;
        },
        getEditedWorkflowContent(state) {
            return state.editedWorkflowContent;
        },
    }
});

register(store);

export default store;
