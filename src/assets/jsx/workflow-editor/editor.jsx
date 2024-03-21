import { WorkflowEditorLayout } from "./components";
import {
    HTML_ELEMENT_ID,
} from "./constants";
import { createRoot } from "@wordpress/element";

import "./css/editor.css";

// --------------------------------------------------------------
// DEMO
const nodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Input Node' },
        position: { x: 250, y: 5 }
    },
    {
        id: '2',
        data: { label: 'Another Node' },
        position: { x: 100, y: 100 }
    }
];

const edges = [
    { id: 'e1-2', source: '1', target: '2' }
];

const layout = <WorkflowEditorLayout
    nodes={nodes}
    edges={edges}
/>;

createRoot(
    document.getElementById(HTML_ELEMENT_ID)
).render(layout);
