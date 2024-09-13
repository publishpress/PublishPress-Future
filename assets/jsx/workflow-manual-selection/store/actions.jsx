
export function setWorkflowsWithManualTrigger(workflows) {
    return {
        type: 'SET_WORKFLOWS_WITH_MANUAL_TRIGGER',
        payload: workflows,
    };
}

export function setWorkflowsEnabledForPost(workflows) {
    return {
        type: 'SET_WORKFLOWS_ENABLED_FOR_POST',
        payload: workflows,
    };
}

export function updateWorkflowsEnabledForPost(workflowId, enabled) {
    return {
        type: 'UPDATE_WORKFLOWS_ENABLED_FOR_POST',
        payload: { workflowId, enabled },
    };
}
