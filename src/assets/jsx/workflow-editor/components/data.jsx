import {
    FEATURE_FULLSCREEN_MODE,
} from "../constants";
import { useDispatch } from "@wordpress/data";
import { store as workflowStore } from "./workflow-store";
import { store as editorStore } from "./editor-store";
import {
    nodes,
    edges,
    triggerNodes,
    triggerCategories,
    actionCategories,
    actionNodes,
    flowCategories,
    flowNodes,
} from "../demo-data";
import { workflowId } from 'future-workflow-editor';

export function WorkflowData() {
    const {
        setNodes,
        setEdges,
        setupEditor,
    } = useDispatch(workflowStore);

    const {
        setActiveFeatures,
        setTriggerNodes,
        setTriggerCategories,
        setActionCategories,
        setActionNodes,
        setFlowCategories,
        setFlowNodes,
    } = useDispatch(editorStore);

    setupEditor(workflowId);
    setNodes(nodes);
    setEdges(edges);

    setActiveFeatures([FEATURE_FULLSCREEN_MODE]);
    setTriggerCategories(triggerCategories);
    setTriggerNodes(triggerNodes);
    setActionCategories(actionCategories);
    setActionNodes(actionNodes);
    setFlowCategories(flowCategories);
    setFlowNodes(flowNodes);

    return null;
}
