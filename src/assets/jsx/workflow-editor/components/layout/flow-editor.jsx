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
    useReactFlow,
} from "reactflow";
import { useCallback, useRef } from "@wordpress/element";
import { defaultEdgeProps } from "../../default-edges-props";
import { nodeStyle } from "../../demo-data/nodes";

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

    const reactFlowWrapperRef = useRef(null);
    const reactFlowInstance = useReactFlow();

    const proOptions = {
        // TODO: Change this to true after we start supporting the pro version of ReactFlow.
        hideAttribution: false,
    }

    const editorStyle = {
        backgroundColor: "#ffffff",
    }

    const onNodesChange = useCallback(
        (changes) => {
            // TODO: Try to use the changes for handling the undo/redo state.
            setNodes(applyNodeChanges(changes, nodes))
        },
        [nodes]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            // TODO: Try to use the changes for handling the undo/redo state.
            setEdges(applyEdgeChanges(changes, edges))
        },
        [edges]
    );

    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => {
            setEdges(updateEdge(oldEdge, newConnection, edges))
        },
        [edges]
    );

    const onConnect = useCallback(
        (params) => {
            params = {
                ...params,
                ...defaultEdgeProps,
            };

            setEdges(addEdge(params, edges))
        },
        [edges]
    );

    const getId = () => `node_${+new Date()}`;

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const createNodeAfterDrop = useCallback((data) => {
        const newNode = {
            id: getId(),
            type: data.type,
            position: data.position,
            data: { label: `${data.type} node` },
            style: nodeStyle,
        };

        setNodes(nodes.concat(newNode));
    }, [nodes]);


    const onDrop = useCallback((event) => {
        event.preventDefault();

        const type = 'default';

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        createNodeAfterDrop({
            type: type,
            position: position,
        })
    }, [reactFlowInstance, nodes]);

    return (
        <div className="reactflow-wrapper" ref={reactFlowWrapperRef}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgeUpdate={onEdgeUpdate}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodesDraggable={true}
                proOptions={proOptions}
                fitView
                style={editorStyle}
            >
                <MiniMap pannable zoomable />
                <Background variant="dots" />
                <Controls />
            </ReactFlow>
        </div>
    );
}
