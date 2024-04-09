import { POST_TYPE } from '../../constants';

export const DEFAULT_STATE = {
    postType: POST_TYPE,
    isLoadingWorkflow: false,
    // isSavingWorkflow: false,
    // isEditedWorkflowDirty: false,
    // isEditedWorkflowEmpty: true,
    // isEditedWorkflowNew: true,
    // isEditedWorkflowSaveable: false,
    // isDeletingWorkflow: false,
    // isCurrentWorkflowPublished: false,
    workflow: {
        id: 0,
        name: '',
        description: '',
        flow: '',
    },
    editedWorkflowAttributes: {},
    nodes: [],
    edges: [],
    selectedNodes: [],
    selectedEdges: [],
}

const loadWorkflowStart = (state, action) => {
    console.log('loadWorkflowStart');
    return {
        ...state,
        isLoadingWorkflow: true,
    };
}

const loadWorkflowSuccess = (state, action) => {
    console.log('loadWorkflowSuccess', action);
    const { payload } = action;

    return {
        ...state,
        isLoadingWorkflow: false,
        workflow: payload,
        editedWorkflowAttributes: {},
    };
}

const loadWorkflowFailure = (state, action) => {
    console.log('loadWorkflowFailure');
    return {
        ...state,
        isLoadingWorkflow: false,
    };
}

const setEditedWorkflowAttribute = (state, action) => {
    const { key, value } = action.payload;

    return {
        ...state,
        editedWorkflowAttributes: {
            ...state.editedWorkflowAttributes,
            [key]: value,
        },
    };
}

const setPostType = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        postType: payload,
    };
}

const setNodes = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        nodes: payload,
    };
}

const setEdges = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        edges: payload,
    };
}

const setSelectedNodes = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        selectedNodes: payload,
    };
}

const setSelectedEdges = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        selectedEdges: payload,
    };
}

export const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'LOAD_WORKFLOW_START':
            return loadWorkflowStart(state, action);
        case 'LOAD_WORKFLOW_SUCCESS':
            return loadWorkflowSuccess(state, action);
        case 'LOAD_WORKFLOW_FAILURE':
            return loadWorkflowFailure(state, action);
        case 'SET_EDITED_WORKFLOW_ATTRIBUTE':
            return setEditedWorkflowAttribute(state, action);
        // case 'SAVE_AS_DRAFT':
        //     return saveAsDraft(state, action);
        case 'SET_POST_TYPE':
            return setPostType(state, action);
        case 'SET_NODES':
            return setNodes(state, action);
        case 'SET_EDGES':
            return setEdges(state, action);
        case 'SET_SELECTED_NODES':
            return setSelectedNodes(state, action);
        case 'SET_SELECTED_EDGES':
            return setSelectedEdges(state, action);
    }

    return state;
}

export default reducer;
