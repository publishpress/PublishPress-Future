import WorkflowEditorProvider from "./WorkflowEditor";

import "./css/index.css";

jQuery(($) => {
    const container = document.getElementById("future-workflow-editor-wrapper");
    const root = wp.element.createRoot(container);
    root.render(<WorkflowEditorProvider />);
})
