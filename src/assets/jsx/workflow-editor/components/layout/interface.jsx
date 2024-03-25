import { InterfaceSkeleton } from "@wordpress/interface";
import { LayoutContent } from "./content";
import { LayoutFooter } from "./footer";
import { LayoutHeader } from "./header";

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
