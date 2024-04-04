import { WorkflowEditorLayout } from "./components/layout/layout";
import {
    HTML_ELEMENT_ID,
} from "./constants";
import { createRoot, StrictMode } from "@wordpress/element";
import { WorkflowData } from "./components/data";


import "./css/index.css";
import 'reactflow/dist/style.css';


createRoot(document.getElementById(HTML_ELEMENT_ID)).render(
    <StrictMode>
        <WorkflowData />
        <WorkflowEditorLayout />
    </StrictMode>
);
