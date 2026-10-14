import { FlowEditor } from "../flow-editor";
import EditorNotices from "./notices";

export const LayoutContent = (props) => {
    return (
        <>
            <EditorNotices />
            <FlowEditor />
        </>
    );
}
