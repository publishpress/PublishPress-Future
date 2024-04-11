import { POST_TYPE } from '../../constants';

export const DEFAULT_STATE = {
    postType: POST_TYPE,
    isLoadingWorkflow: false,
    isCreatingWorkflow: false,
    isSavingWorkflow: false,
    isNewWorkflow: true,
    isDeletingWorkflow: false,
    // isEditedWorkflowEmpty: true,
    // isEditedWorkflowSaveable: false,
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
    initialViewport: {
        x: 0,
        y: 0,
        zoom: 2,
    },
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

    const nodes = payload.flow?.nodes || [];
    const edges = payload.flow?.edges || [];
    const viewport = payload.flow?.viewport || DEFAULT_STATE.viewport;

    return {
        ...state,
        isLoadingWorkflow: false,
        workflow: payload,
        editedWorkflowAttributes: {},
        isNewWorkflow: payload.status === 'auto-draft',
        nodes: nodes,
        edges: edges,
        initialViewport: viewport,
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

const switchToDraftStart = (state, action) => {
    return {
        ...state,
        isSavingWorkflow: true,
    };
}

const switchToDraftSuccess = (state, action) => {
    const { payload } = action;

    const newWorkflow = {
        ...state.workflow,
        status: payload.status,
    };

    return {
        ...state,
        isSavingWorkflow: false,
        workflow: newWorkflow,
        isNewWorkflow: false,
    };
}

const switchToDraftFailure = (state, action) => {
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

const setInitialViewport = (state, action) => {
    const { payload } = action;

    return {
        ...state,
        viewport: payload,
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

const deleteWorkflowStart = (state, action) => {
    return {
        ...state,
        isDeletingWorkflow: true,
    };
}

const deleteWorkflowSuccess = (state, action) => {
    return {
        ...state,
        isDeletingWorkflow: false,
    };
}

const deleteWorkflowFailure = (state, action) => {
    return {
        ...state,
        isDeletingWorkflow: false,
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
        case 'SWITCH_TO_DRAFT_START':
            return switchToDraftStart(state, action);
        case 'SWITCH_TO_DRAFT_SUCCESS':
            return switchToDraftSuccess(state, action);
        case 'SWITCH_TO_DRAFT_FAILURE':
            return switchToDraftFailure(state, action);
        case 'SET_EDITED_WORKFLOW_ATTRIBUTE':
            return setEditedWorkflowAttribute(state, action);
        case 'SET_POST_TYPE':
            return setPostType(state, action);
        case 'SET_NODES':
            return setNodes(state, action);
        case 'SET_EDGES':
            return setEdges(state, action);
        case 'SET_INITIAL_VIEWPORT':
            return setInitialViewport(state, action);
        case 'SET_SELECTED_NODES':
            return setSelectedNodes(state, action);
        case 'SET_SELECTED_EDGES':
            return setSelectedEdges(state, action);
        case 'DELETE_WORKFLOW_START':
            return deleteWorkflowStart(state, action);
        case 'DELETE_WORKFLOW_SUCCESS':
            return deleteWorkflowSuccess(state, action);
        case 'DELETE_WORKFLOW_FAILURE':
            return deleteWorkflowFailure(state, action);
    }

    return state;
}

export default reducer;
