import { FullscreenMode } from "@wordpress/interface";
import { WorkflowEditorInterface } from "./interface";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { PluginArea } from '@wordpress/plugins';
import { addBodyClasses, removeBodyClasses } from "../../utils";
import { store as editorStore } from "../editor-store";
import { ReactFlowProvider } from "reactflow";
import { KeyboardShortcuts } from "../keyboard-shortcuts";
import {
    FEATURE_FULLSCREEN_MODE,
    FEATURE_INSERTER,
    FEATURE_WELCOME_GUIDE
} from "../../constants";
import { InserterSidebar } from "../secondary-sidebar/inserter-sidebar";
import classnames from 'classnames';
import { SlotFillProvider } from "@wordpress/components";
import { SettingsSidebar } from "../settings-sidebar/settings-sidebar";
import WelcomeGuide from "../welcome-guide";

export function WorkflowEditorLayout() {
    const {
        isFullscreenActive,
        isInserterOpened,
        isWelcomeGuideActive,
        isPro,
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(editorStore).isFeatureActive(FEATURE_FULLSCREEN_MODE),
            isInserterOpened: select(editorStore).isFeatureActive(FEATURE_INSERTER),
            isWelcomeGuideActive: select(editorStore).isFeatureActive(FEATURE_WELCOME_GUIDE),
            isPro: select(editorStore).isPro(),
        }
    });

    const className = classnames('edit-post-layout editor-editor-interface', {
        'is-inserter-opened': isInserterOpened,
    });

    useEffect(() => {
        const bodyClasses = ['workflow-editor'];

        bodyClasses.push(
            isPro ? 'is-pro' : 'is-free'
        );

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
        <SlotFillProvider>
            <ReactFlowProvider>
                <FullscreenMode isActive={isFullscreenActive} />
                <KeyboardShortcuts />
                <SettingsSidebar />

                <WorkflowEditorInterface
                    className={className}
                    secondarySidebar={secondarySidebar}
                />
                {isWelcomeGuideActive && (
                    <WelcomeGuide />
                )}

            </ReactFlowProvider>

            <PluginArea scope="future-workflow-editor" />
        </SlotFillProvider>
    );
}
