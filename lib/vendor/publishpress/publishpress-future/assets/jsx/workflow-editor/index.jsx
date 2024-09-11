import { HTML_ELEMENT_ID } from "./constants";
import { createRoot } from 'react-dom/client';
import WorkflowEditorApp from "./components/app";

createRoot(document.getElementById(HTML_ELEMENT_ID)).render(<WorkflowEditorApp />);
