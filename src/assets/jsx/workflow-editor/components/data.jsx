import {
    FEATURE_FULLSCREEN_MODE,
} from "../constants";
import { useDispatch } from "@wordpress/data";
import { store as workflowStore } from "./workflow-store";
import { store as editorStore } from "./editor-store";
import { workflowId, nodeTypeCategories, nodeTypes } from 'future-workflow-editor';
import {
    PostData,
    BooleanData,
    DateData,
    IntegerData,
    StringData,
} from "./data-types";

export function WorkflowData() {
    const {
        setupEditor,
        setDataTypes,
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

    setActiveFeatures([FEATURE_FULLSCREEN_MODE]);
    setTriggerCategories(nodeTypeCategories);
    setTriggerNodes(nodeTypes.triggers);
    setActionCategories(nodeTypeCategories);
    setActionNodes(nodeTypes.actions);
    setFlowCategories(nodeTypeCategories);
    setFlowNodes(nodeTypes.flows);

    const dataTypes = [
        PostData(),
        BooleanData(),
        DateData(),
        IntegerData(),
        StringData(),
    ]
    setDataTypes(dataTypes);

    return null;
}
