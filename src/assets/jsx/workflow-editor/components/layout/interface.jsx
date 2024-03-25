import { InterfaceSkeleton } from "@wordpress/interface";
import { LayoutContent } from "./content";
import { LayoutFooter } from "./footer";
import { LayoutHeader } from "./header";

export function WorkflowEditorInterface({ className, secondarySidebar }) {


    return (
        <InterfaceSkeleton
            className={className}
            header={<LayoutHeader />}
            secondarySidebar={ secondarySidebar() }
            notices={null}
            content={<LayoutContent />}
            footer={<LayoutFooter />}
            actions={null}
            shortcuts={null}
        >
        </InterfaceSkeleton>
    );
}
