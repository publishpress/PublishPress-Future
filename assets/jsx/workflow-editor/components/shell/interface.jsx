import classnames from 'classnames';
import { InterfaceSkeleton, ComplementaryArea } from "@wordpress/interface";
import { LayoutContent } from "./content";
import { LayoutHeader } from "./header";
import { useSelect, useDispatch } from "@wordpress/data";
import { useViewportMatch } from "@wordpress/compose";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { SIDEBAR_NODE_EDGE, SIDEBAR_WORKFLOW } from "../settings-sidebar/constants";
import { SLOT_SCOPE_WORKFLOW_EDITOR } from "../../constants";

export function WorkflowEditorInterface({ className, secondarySidebar }) {
    const isMobileViewport = useViewportMatch('medium', '<');

    const {
        sidebarIsOpened,
        hasFixedToolbar,
        hasActiveMetaboxes,
        hasSelectedNodes
    } = useSelect((select) => {
        const activeComplementaryArea = select('core/interface').getActiveComplementaryArea(SLOT_SCOPE_WORKFLOW_EDITOR);

        return {
            sidebarIsOpened: activeComplementaryArea !== null && activeComplementaryArea !== 'null/undefined',
            hasFixedToolbar: false,
            hasActiveMetaboxes: false,
            hasSelectedNodes: select(workflowStore).hasSelectedNodes(),
        }
    });

    const {
        openGeneralSidebar,
    } = useDispatch(editorStore);

    const interfaceClassNames = classnames(className, {
        'is-sidebar-opened': sidebarIsOpened,
        'has-fixed-toolbar': hasFixedToolbar,
        'has-metaboxes': hasActiveMetaboxes,
    });

    const openSidebarPanel = () => {
        openGeneralSidebar(
            hasSelectedNodes ? SIDEBAR_NODE_EDGE : SIDEBAR_WORKFLOW
        );
    }

    return (
        <InterfaceSkeleton
            className={interfaceClassNames}
            header={<LayoutHeader />}
            secondarySidebar={secondarySidebar()}
            content={<LayoutContent />}
            actions={null}
            sidebar={
                (!isMobileViewport || sidebarIsOpened) && (
                    <ComplementaryArea.Slot scope={SLOT_SCOPE_WORKFLOW_EDITOR} />
                )
            }
        >
        </InterfaceSkeleton>
    );
}
