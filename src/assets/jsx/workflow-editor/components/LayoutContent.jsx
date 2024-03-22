import { useSelect } from "@wordpress/data";
import { store } from "../store";
import ReactFlow, { ReactFlowProvider, Background, Controls } from "reactflow";
import { KeyboardShortcuts } from "./KeyboardShortcodes";

export const LayoutContent = (props) => {
    const {
        nodes,
        edges
    } = useSelect((select) => {
        return {
            nodes: select(store).getNodes(),
            edges: select(store).getEdges(),
        }
    });

    const proOptions = {
        // TODO: Change this to true after we start supporting the pro version of ReactFlow.
        hideAttribution: false,
    }

    return (
        <div>
            <ReactFlowProvider>
                <KeyboardShortcuts />

                <ReactFlow
                    defaultNodes={nodes}
                    defaultEdges={edges}
                    fitView
                    proOptions={proOptions}
                    nodesDraggable={true}
                >
                    <Background variant="dots" />
                    <Controls />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}
