import {
    FEATURE_FULLSCREEN_MODE,
    FEATURE_MOST_USED_NODES,
} from "./constants";
import { useDispatch } from "@wordpress/data";
import { store } from "./store";
import { nodes, edges, triggerNodes, triggerCategories, actionCategories, actionNodes } from "./demo-data";

export function WorkflowData() {
    const {
        setActiveFeatures,
        setNodes,
        setEdges,
        setTriggerNodes,
        setTriggerCategories,
        setActionCategories,
        setActionNodes,
    } = useDispatch(store);

    setActiveFeatures([FEATURE_FULLSCREEN_MODE, FEATURE_MOST_USED_NODES]);
    setNodes(nodes);
    setEdges(edges);
    setTriggerCategories(triggerCategories);
    setTriggerNodes(triggerNodes);
    setActionCategories(actionCategories);
    setActionNodes(actionNodes);

    return null;
}
