import { FlowEditor } from "../flow-editor";
import EditorNotices from "../editor-notices";

export const LayoutContent = (props) => {
    return (
        <>
            <EditorNotices />
            <FlowEditor />
        </>
    );
}
