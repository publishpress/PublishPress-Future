import { useSelect } from "@wordpress/data";
import { store } from "../store";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

export const FlowEditor = (props) => {
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

    const editorStyle = {
        backgroundColor: "#ffffff",
    }

    return (
        <ReactFlow
            defaultNodes={nodes}
            defaultEdges={edges}
            fitView
            proOptions={proOptions}
            nodesDraggable={true}
            style={editorStyle}
        >
            <MiniMap pannable zoomable />
            <Background variant="dots" />
            <Controls />
        </ReactFlow>
    );
}
