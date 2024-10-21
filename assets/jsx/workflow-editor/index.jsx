import { HTML_ELEMENT_ID } from "./constants";
import { createRoot } from 'react-dom/client';
import WorkflowEditorApp from "./components/app";

const container = document.getElementById(HTML_ELEMENT_ID);

if (container) {
    createRoot(container).render(<WorkflowEditorApp />);
}
