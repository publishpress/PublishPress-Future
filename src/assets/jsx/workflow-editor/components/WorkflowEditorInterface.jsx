import { InterfaceSkeleton } from "@wordpress/interface";
import { LayoutContent } from "./LayoutContent";
import { LayoutFooter } from "./LayoutFooter";
import { LayoutHeader } from "./LayoutHeader";

export function WorkflowEditorInterface(props) {
    return (
        <InterfaceSkeleton
            header={<LayoutHeader />}
            content={<LayoutContent />}
            footer={<LayoutFooter />}
        >
        </InterfaceSkeleton>
    );
}
