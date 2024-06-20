
export const DEFAULT_STATE = {
    workflowsWithManualTrigger: [],
    workflowsEnabledForPost: [],
}

const setWorkflowsWithManualTrigger = (state, action) => {
    return {
        ...state,
        workflowsWithManualTrigger: [...action.payload],

    };
}

const setWorkflowsEnabledForPost = (state, action) => {
    return {
        ...state,
        workflowsEnabledForPost: [...action.payload],
    };
}

const updateWorkflowsEnabledForPost = (state, action) => {
    const { workflowId, enabled } = action.payload;

    const newList = [...state.workflowsEnabledForPost];

    if (enabled && !newList.includes(workflowId)) {
        newList.push(workflowId);
    }

    if (!enabled && newList.includes(workflowId)) {
        newList.splice(newList.indexOf(workflowId), 1);
    }

    return {
        ...state,
        workflowsEnabledForPost: newList,
    };
}

export const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_WORKFLOWS_WITH_MANUAL_TRIGGER':
            return setWorkflowsWithManualTrigger(state, action);
        case 'SET_WORKFLOWS_ENABLED_FOR_POST':
            return setWorkflowsEnabledForPost(state, action);
        case 'UPDATE_WORKFLOWS_ENABLED_FOR_POST':
            return updateWorkflowsEnabledForPost(state, action);
    }

    return state;
}

export default reducer;
