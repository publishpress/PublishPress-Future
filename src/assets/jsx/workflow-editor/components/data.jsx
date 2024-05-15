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
    InputData,
    WorkflowData as WorkflowDataType,
    UserData,
    SiteData,
    NodeData,
    ArrayData
} from "./data-types";

export function WorkflowData() {
    const {
        setupEditor,
        setDataTypes,
    } = useDispatch(workflowStore);

    const {
        setTriggerNodes,
        setTriggerCategories,
        setActionCategories,
        setActionNodes,
        setFlowCategories,
        setFlowNodes,
    } = useDispatch(editorStore);

    setupEditor(workflowId);

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
        InputData(),
        WorkflowDataType(),
        UserData(),
        SiteData(),
        NodeData(),
        ArrayData(),
    ]
    setDataTypes(dataTypes);

    return null;
}
