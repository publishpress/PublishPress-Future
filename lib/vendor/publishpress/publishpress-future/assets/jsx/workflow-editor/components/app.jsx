import { useEffect, StrictMode } from "@wordpress/element";
import { WorkflowEditorLayout } from "./layout/layout";
import { useDispatch } from "@wordpress/data";
import { store as workflowStore } from "./workflow-store";
import { store as editorStore } from "./editor-store";
import { workflowId, nodeTypeCategories, nodeTypes } from 'future-workflow-editor';
import {
    PostData,
    BooleanData,
    DatetimeData,
    IntegerData,
    StringData,
    EmailData,
    InputData,
    WorkflowData,
    UserData,
    SiteData,
    NodeData,
    ArrayData
} from "./data-types";

import "../css/index.css";
import 'reactflow/dist/style.css';

export default function WorkflowEditorApp() {
    const {
        setupEditor,
        setDataTypes,
    } = useDispatch(workflowStore);

    const {
        setTriggerNodes,
        setTriggerCategories,
        setActionCategories,
        setActionNodes,
        setAdvancedCategories,
        setAdvancedNodes,
    } = useDispatch(editorStore);

    useEffect(() => {
        setupEditor(workflowId);

        setTriggerNodes(nodeTypes.triggers);
        setActionNodes(nodeTypes.actions);
        setAdvancedNodes(nodeTypes.advanced);

        setTriggerCategories(nodeTypeCategories);
        setActionCategories(nodeTypeCategories);
        setAdvancedCategories(nodeTypeCategories);

        const dataTypes = [
            PostData(),
            BooleanData(),
            DatetimeData(),
            IntegerData(),
            StringData(),
            EmailData(),
            InputData(),
            WorkflowData(),
            UserData(),
            SiteData(),
            NodeData(),
            ArrayData(),
        ]
        setDataTypes(dataTypes);
    }, [workflowId]);

    return (
        <StrictMode>
            <WorkflowEditorLayout />
        </StrictMode>
    );
};
