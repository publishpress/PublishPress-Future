import {WorkflowEditor} from "./Components";


const container = document.getElementById("future-workflow-editor-wrapper");
const root = wp.element.createRoot(container);
root.render(<WorkflowEditor />);
