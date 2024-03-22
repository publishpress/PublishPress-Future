import { WorkflowEditorLayout } from "./components";
import {
    HTML_ELEMENT_ID,
} from "./constants";
import { createRoot, StrictMode } from "@wordpress/element";
import { dispatch } from "@wordpress/data";
import { store } from "./store";
import { nodes, edges } from "./demoData";

import "./css/editor.css";
import 'reactflow/dist/style.css';

dispatch(store).setNodes(nodes);
dispatch(store).setEdges(edges);

createRoot(document.getElementById(HTML_ELEMENT_ID)).render(
    <StrictMode>
        <WorkflowEditorLayout />
    </StrictMode>
);
