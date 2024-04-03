import { useSelect, useDispatch } from "@wordpress/data";
import { store } from "../store";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    applyNodeChanges,
    applyEdgeChanges,
    updateEdge,
    addEdge,
    useReactFlow,
    useOnSelectionChange,
} from "reactflow";
import { useCallback, useRef, useLayoutEffect, useEffect } from "@wordpress/element";
import { defaultEdgeProps } from "../default-edges-props";
import { nodeStyle } from '../default-nodes-props';
import { useLayoutedElements, AutoLayout } from "./auto-layout";

import {
    AUTO_LAYOUT_DEFAULT_DIRECTION,
} from "./auto-layout/constants";
import { SIDEBAR_NODE_EDGE } from "../components/settings-sidebar/constants";


export const FlowEditor = (props) => {
    const {
        nodes,
        edges,
        selectedNodes,
        selectedEdges,
    } = useSelect((select) => {
        return {
            nodes: select(store).getNodes(),
            edges: select(store).getEdges(),
            selectedNodes: select(store).getSelectedNodes(),
            selectedEdges: select(store).getSelectedEdges(),
        }
    });

    const {
        setNodes,
        setEdges,
        setSelectedNodes,
        setSelectedEdges,
        openGeneralSidebar,
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

    const createNodeAfterDrop = useCallback(({ item, position }) => {
        const type = item.type === 'trigger' ? 'input' : 'default';

        const newNode = {
            id: getId(),
            type: type,
            position: position,
            data: { label: item.title },
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

    const applyLayout = useLayoutedElements(
        {
            nodes,
            edges,
            onLayout: (layoutedNodes, layoutedEdges) => {
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
            },
            onAnimationFrame: fitView,
        }
    );

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            setSelectedNodes(nodes.map((node) => node.id));
            setSelectedEdges(edges.map((edge) => edge.id));

            if (nodes.length === 0 || edges.length === 0) {
                openGeneralSidebar(SIDEBAR_NODE_EDGE);
            }
        }
    })

    useEffect(() => {

    }, [selectedNodes, selectedEdges]);

    const onAutoLayout = useCallback(() => {
        applyLayout({ direction: AUTO_LAYOUT_DEFAULT_DIRECTION });
    }, [applyLayout]);

    // Calculate the initial layout on mount.
    useLayoutEffect(() => {
        onAutoLayout();
    }, []);

    return (
        <div className="reactflow-wrapper" ref={reactFlowWrapperRef}>
            <AutoLayout onLayout={onAutoLayout}/>
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

export default FlowEditor;
