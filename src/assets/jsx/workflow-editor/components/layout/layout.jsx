import { FullscreenMode } from "@wordpress/interface";
import { WorkflowEditorInterface } from "./interface";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { addBodyClasses, removeBodyClasses } from "../../utils";
import { store } from "../../store";
import { ReactFlowProvider } from "reactflow";
import { KeyboardShortcuts } from "../keyboard-shortcuts";

export function WorkflowEditorLayout() {
    const {
        isFullscreenActive
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(store).isFeatureActive('fullscreenMode')
        }
    });

    useEffect(() => {
        const bodyClasses = ['workflow-editor'];

        addBodyClasses(bodyClasses);

        return () => {
            removeBodyClasses(bodyClasses);
        }
    }, []);

    return (
        <ReactFlowProvider>
            <FullscreenMode isActive={isFullscreenActive} />
            <KeyboardShortcuts />

            <WorkflowEditorInterface />
        </ReactFlowProvider>
    );
}
