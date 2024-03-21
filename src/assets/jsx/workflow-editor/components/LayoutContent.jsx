import { useSelect } from "@wordpress/data";
import { store } from "../store";
import { ReactFlowProvider, ReactFlow } from "reactflow";

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

    return (
        <div>
            <ReactFlowProvider>
                <ReactFlow nodes={nodes} edges={edges}>

                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}
