import { InterfaceSkeleton } from "@wordpress/interface";

export function WorkflowEditorInterface(props) {
    return (
        <InterfaceSkeleton
            header={<h2>Workflow Editor</h2>}
            content={<div>Content</div>}
            footer={<div>Footer</div>}
        >

        </InterfaceSkeleton>
    );
}
