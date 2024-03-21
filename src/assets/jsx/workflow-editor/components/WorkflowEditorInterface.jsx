import { InterfaceSkeleton } from "@wordpress/interface";
import { FullscreenModeClose } from "./FullscreenModeClose";
import { useSelect } from "@wordpress/data";
import { store } from "../store";
import { FEATURE_FULLSCREEN_MODE, FEATURE_REDUCED_UI } from "../constants";
import { ReactFlowProvider, ReactFlow } from "reactflow";

export function WorkflowEditorInterface(props) {
    const {
        isFullscreenActive,
        hasReducedUI,
        nodes,
        edges
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(store).isFeatureActive(FEATURE_FULLSCREEN_MODE),
            hasReducedUI: select(store).isFeatureActive(FEATURE_REDUCED_UI),
            nodes: select(store).getNodes(),
            edges: select(store).getEdges(),
        }
    });

    const headerClasses = 'edit-workflow-header ' + (hasReducedUI ? 'has-reduced-ui' : '');

    return (
        <InterfaceSkeleton
            header={
                <div className={headerClasses}>
                    {isFullscreenActive &&
                        <FullscreenModeClose />
                    }
                    <h2>Workflow Editor</h2>
                </div>
            }
            content={
                <div>
                    <ReactFlowProvider>
                        <ReactFlow nodes={nodes} edges={edges}>

                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            }
            footer={<div>Footer</div>}
        >

        </InterfaceSkeleton>
    );
}
