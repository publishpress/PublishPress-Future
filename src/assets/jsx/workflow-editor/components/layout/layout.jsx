import { FullscreenMode } from "@wordpress/interface";
import { WorkflowEditorInterface } from "./interface";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { addBodyClasses, removeBodyClasses } from "../../utils";
import { store } from "../../store";
import { ReactFlowProvider } from "reactflow";
import { KeyboardShortcuts } from "../keyboard-shortcuts";
import { FEATURE_FULLSCREEN_MODE, FEATURE_INSERTER } from "../../constants";
import { InserterSidebar } from "../secondary-sidebar/inserter";
import { classnames } from "../../utils";

export function WorkflowEditorLayout() {
    const {
        isFullscreenActive,
        isInserterOpened,
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(store).isFeatureActive(FEATURE_FULLSCREEN_MODE),
            isInserterOpened: select(store).isFeatureActive(FEATURE_INSERTER),
        }
    });

    const className = classnames('edit-post-layout', {
        'is-inserter-opened': isInserterOpened,
    });

    useEffect(() => {
        const bodyClasses = ['workflow-editor'];

        addBodyClasses(bodyClasses);

        return () => {
            removeBodyClasses(bodyClasses);
        }
    }, []);

    const secondarySidebar = () => {
        if (isInserterOpened) {
            return <InserterSidebar />;
        }

        return null;
    };

    return (
        <ReactFlowProvider>
            <FullscreenMode isActive={isFullscreenActive} />
            <KeyboardShortcuts />

            <WorkflowEditorInterface
                className={className}
                secondarySidebar={secondarySidebar}
            />
        </ReactFlowProvider>
    );
}
