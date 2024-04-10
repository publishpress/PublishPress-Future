import { POST_TYPE } from '../../constants';

export const DEFAULT_STATE = {
    postType: POST_TYPE,
    isLoadingWorkflow: false,
    isCreatingWorkflow: false,
    isSavingWorkflow: false,
    isNewWorkflow: true,
    // isEditedWorkflowEmpty: true,
    // isEditedWorkflowSaveable: false,
    // isDeletingWorkflow: false,
    // isCurrentWorkflowPublished: false,
    workflow: {
        id: 0,
        title: '',
        description: '',
        flow: '',
        status: 'auto-draft',
    },
    editedWorkflowAttributes: {},
    nodes: [],
    edges: [],
    selectedNodes: [],
    selectedEdges: [],
}

const loadWorkflowStart = (state, action) => {
    return {
        ...state,
        isLoadingWorkflow: true,
    };
}

const loadWorkflowSuccess = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        isLoadingWorkflow: false,
        workflow: payload,
        editedWorkflowAttributes: {},
        isNewWorkflow: payload.status === 'auto-draft',
    };
}

const loadWorkflowFailure = (state, action) => {
    return {
        ...state,
        isLoadingWorkflow: false,
    };
}

const createWorkflowStart = (state, action) => {
    return {
        ...state,
        isCreatingWorkflow: true,
        isLoadingWorkflow: true,
    };
}

const createWorkflowSuccess = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        isCreatingWorkflow: false,
        isLoadingWorkflow: false,
        workflow: payload,
        editedWorkflowAttributes: {},
        isNewWorkflow: payload.status === 'auto-draft',
    };
}

const createWorkflowFailure = (state, action) => {
    return {
        ...state,
        isCreatingWorkflow: false,
        isLoadingWorkflow: false,
    };
}

const saveAsDraftStart = (state, action) => {
    return {
        ...state,
        isSavingWorkflow: true,
    };
}

const saveAsDraftSuccess = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        isSavingWorkflow: false,
        workflow: payload,
        editedWorkflowAttributes: {},
        isNewWorkflow: payload.status === 'auto-draft',
    };
}

const saveAsDraftFailure = (state, action) => {
    return {
        ...state,
        isSavingWorkflow: false,
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
        case 'CREATE_WORKFLOW_START':
            return createWorkflowStart(state, action);
        case 'CREATE_WORKFLOW_SUCCESS':
            return createWorkflowSuccess(state, action);
        case 'CREATE_WORKFLOW_FAILURE':
            return createWorkflowFailure(state, action);
        case 'LOAD_WORKFLOW_START':
            return loadWorkflowStart(state, action);
        case 'LOAD_WORKFLOW_SUCCESS':
            return loadWorkflowSuccess(state, action);
        case 'LOAD_WORKFLOW_FAILURE':
            return loadWorkflowFailure(state, action);
        case 'SAVE_AS_DRAFT_START':
            return saveAsDraftStart(state, action);
        case 'SAVE_AS_DRAFT_SUCCESS':
            return saveAsDraftSuccess(state, action);
        case 'SAVE_AS_DRAFT_FAILURE':
            return saveAsDraftFailure(state, action);
        case 'SET_EDITED_WORKFLOW_ATTRIBUTE':
            return setEditedWorkflowAttribute(state, action);
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
