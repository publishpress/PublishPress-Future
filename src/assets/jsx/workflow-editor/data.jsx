import {
    FEATURE_FULLSCREEN_MODE,
    FEATURE_MOST_USED_NODES,
} from "./constants";
import { useDispatch } from "@wordpress/data";
import { store as workflowStore } from "./workflow-store";
import { store as editorStore } from "./editor-store";
import { nodes, edges, triggerNodes, triggerCategories, actionCategories, actionNodes } from "./demo-data";

export function WorkflowData() {
    const {
        setNodes,
        setEdges,
    } = useDispatch(workflowStore);

    const {
        setActiveFeatures,
        setTriggerNodes,
        setTriggerCategories,
        setActionCategories,
        setActionNodes,
    } = useDispatch(editorStore);

    setActiveFeatures([FEATURE_FULLSCREEN_MODE, FEATURE_MOST_USED_NODES]);
    setNodes(nodes);
    setEdges(edges);
    setTriggerCategories(triggerCategories);
    setTriggerNodes(triggerNodes);
    setActionCategories(actionCategories);
    setActionNodes(actionNodes);

    return null;
}
