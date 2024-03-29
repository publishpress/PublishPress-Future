import { useSelect, useDispatch } from "@wordpress/data";
import { store } from "../../store";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    applyNodeChanges,
    applyEdgeChanges,
    updateEdge,
    addEdge,
} from "reactflow";
import { useCallback } from "@wordpress/element";

export const FlowEditor = (props) => {
    const {
        nodes,
        edges,
    } = useSelect((select) => {
        return {
            nodes: select(store).getNodes(),
            edges: select(store).getEdges(),
        }
    });

    const {
        setNodes,
        setEdges,
    } = useDispatch(store);

    const proOptions = {
        // TODO: Change this to true after we start supporting the pro version of ReactFlow.
        hideAttribution: false,
    }

    const editorStyle = {
        backgroundColor: "#ffffff",
    }

    const onNodesChange = (changes) => {
        // TODO: Try to use the changes for handling the undo/redo state.
        setNodes(applyNodeChanges(changes, nodes))
    }

    const onEdgesChange = (changes) => {
        // TODO: Try to use the changes for handling the undo/redo state.
        setEdges(applyEdgeChanges(changes, oldEdges))
    };

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesDraggable={true}
            proOptions={proOptions}
            fitView
            style={editorStyle}
        >
            <MiniMap pannable zoomable />
            <Background variant="dots" />
            <Controls />
        </ReactFlow>
    );
}
