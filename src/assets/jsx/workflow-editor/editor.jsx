import { WorkflowEditorLayout } from "./components/layout/layout";
import {
    HTML_ELEMENT_ID,
} from "./constants";
import { createRoot, StrictMode } from "@wordpress/element";
import { dispatch } from "@wordpress/data";
import { store } from "./store";
import { nodes, edges, triggerNodes } from "./demoData";

import "./css/index.css";
import 'reactflow/dist/style.css';

dispatch(store).setNodes(nodes);
dispatch(store).setEdges(edges);
dispatch(store).setTriggerNodes(triggerNodes);

createRoot(document.getElementById(HTML_ELEMENT_ID)).render(
    <StrictMode>
        <WorkflowEditorLayout />
    </StrictMode>
);
