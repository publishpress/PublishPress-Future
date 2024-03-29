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
import { useCallback, useRef, useLayoutEffect, useEffect } from "@wordpress/element";
import { defaultEdgeProps } from "../../default-edges-props";
import { nodeStyle } from '../../default-nodes-props';
import ELK from "elkjs";



const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,
            // Adjust the target and source handle positions based on the layout
            // direction.
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',

            // Hardcode a width and height for elk to use when layouting.
            width: 150,
            height: 50,
        })),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                // React Flow expects a position property on the node instead of `x`
                // and `y` fields.
                position: { x: node.x, y: node.y },
            })),

            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};




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

    const createNodeAfterDrop = useCallback(({item, position}) => {
        const type = item.type === 'trigger' ? 'input' : 'default';

        const newNode = {
            id: getId(),
            type: type,
            position: position,
            data: { label: item.title},
            style: nodeStyle[item.type],
        };

        setNodes(nodes.concat(newNode));
    }, [nodes]);


    const onDrop = useCallback((event) => {
        event.preventDefault();

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const dataTransferItem = event.dataTransfer.getData('application/future-workflow-editor-node');
        const item = JSON.parse(dataTransferItem);

        createNodeAfterDrop({
            item: item,
            position: position,
        })
    }, [reactFlowInstance, nodes]);

    const fitView = useCallback(() => {
        reactFlowInstance.fitView();
    }, [reactFlowInstance]);

    const onLayout = useCallback(
        ({ direction }) => {
            const opts = { 'elk.direction': direction, ...elkOptions };

            getLayoutedElements(nodes, edges, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);

                window.requestAnimationFrame(() => fitView());
            });
        },
        [nodes, edges]
    );

    // Calculate the initial layout on mount.
    useLayoutEffect(() => {
        onLayout({ direction: 'DOWN' });
    }, []);

    useEffect(() => {
        const handleAutoLayout = () => {
            onLayout({ direction: 'DOWN' });
        };

        document.addEventListener('future_workflow_editor_auto_layout', handleAutoLayout);

        return () => {
            document.removeEventListener('future_workflow_editor_auto_layout', handleAutoLayout);
        };
    }, [onLayout]);

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
                <MiniMap
                    pannable
                    zoomable
                    nodeColor={(node) => {
                        if (node.type === 'input') return nodeStyle['trigger'].backgroundColor;
                        if (node.type === 'default') return nodeStyle['action'].backgroundColor;
                    }}
                />
                <Background variant="dots" />
                <Controls />
            </ReactFlow>
        </div>
    );
}
