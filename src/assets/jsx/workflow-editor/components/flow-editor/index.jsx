import { useSelect, useDispatch } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
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
    useOnViewportChange,
} from "reactflow";
import {
    useCallback,
    useRef,
    useLayoutEffect,
    useEffect,
    Platform,
    useMemo,
} from "@wordpress/element";
import { useLayoutedElements, AutoLayout } from "./auto-layout";
import { EVENT_DROP_NODE, FEATURE_CONTROLS, FEATURE_MINI_MAP, SLOT_SCOPE_WORKFLOW_EDITOR } from "../../constants";
import GenericNode from "../node-types/generic";

import { AUTO_LAYOUT_DEFAULT_DIRECTION } from "./auto-layout/constants";
import {
    SIDEBAR_NODE_EDGE,
    SIDEBAR_WORKFLOW,
} from "../settings-sidebar/constants";
import TriggerNode from "../node-types/trigger";
import NodeValidator from "../node-validator";
import { GenericEdge } from "../edge-types";
import { TriggerPlaceholder } from "../node-types/trigger-placeholder";
import { createNewNode, getId } from "../../utils";

const GRID_SIZE = 10;

export const FlowEditor = (props) => {
    const {
        nodes,
        edges,
        selectedNodes,
        selectedEdges,
        hasActiveSideBar,
        activeComplementaryArea,
        initialViewport,
        isMiniMapFeatureActive,
        isControlsFeatureActive,
    } = useSelect((select) => {
        const activeComplementaryArea = select(
            "core/interface",
        ).getActiveComplementaryArea(SLOT_SCOPE_WORKFLOW_EDITOR);

        return {
            nodes: select(workflowStore).getNodes(),
            edges: select(workflowStore).getEdges(),
            selectedNodes: select(workflowStore).getSelectedNodes(),
            selectedEdges: select(workflowStore).getSelectedEdges(),
            activeComplementaryArea: activeComplementaryArea,
            hasActiveSideBar:
                activeComplementaryArea !== null &&
                activeComplementaryArea !== "null/undefined",
            initialViewport: select(workflowStore).getInitialViewport(),
            isMiniMapFeatureActive: select(editorStore).isFeatureActive(FEATURE_MINI_MAP),
            isControlsFeatureActive: select(editorStore).isFeatureActive(FEATURE_CONTROLS),
        };
    });

    const {
        setNodes,
        setEdges,
        setSelectedNodes,
        setSelectedEdges,
        setEditedWorkflowAttribute,
    } = useDispatch(workflowStore);

    const { openGeneralSidebar } = useDispatch(editorStore);

    const reactFlowWrapperRef = useRef(null);
    const reactFlowInstance = useReactFlow();
    const { setViewport } = useReactFlow();
    const connectingNodeId = useRef(null);

    const proOptions = {
        // TODO: Change this to true after we start supporting the pro version of ReactFlow.
        hideAttribution: false,
    };

    const editorStyle = {
        backgroundColor: "#ffffff",
    };

    const nodeTypes = useMemo(() => ({
        generic: GenericNode,
        trigger: TriggerNode,
        triggerPlaceholder: TriggerPlaceholder
    }), []);

    const edgeTypes = useMemo(() => ({
        genericEdge: GenericEdge,
    }), []);

    const updateFlowInEditedWorkflow = useCallback(() => {
        // We need to delay the update of the flow to avoid missing the changes.
        setTimeout(() => {
            setEditedWorkflowAttribute("flow", reactFlowInstance.toObject());
        }, 400);
    }, [reactFlowInstance]);

    useOnViewportChange({
        onEnd: () => {
            updateFlowInEditedWorkflow();
        },
    });

    useEffect(() => {
        if (initialViewport) {
            setViewport(initialViewport);
        }
    }, [initialViewport]);

    const onNodesChange = useCallback(
        (changes) => {
            // TODO: Try to use the changes for handling the undo/redo state.
            setNodes(applyNodeChanges(changes, nodes));
            updateFlowInEditedWorkflow();
        },
        [nodes],
    );

    const onEdgesChange = useCallback(
        (changes) => {
            // TODO: Try to use the changes for handling the undo/redo state.
            setEdges(applyEdgeChanges(changes, edges));
            updateFlowInEditedWorkflow();
        },
        [edges],
    );

    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => {
            setEdges(updateEdge(oldEdge, newConnection, edges));
            updateFlowInEditedWorkflow();
        },
        [edges],
    );

    const onConnect = useCallback(
        (params) => {
            params = {
                ...params,
                type: 'genericEdge',
                id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
            };

            setEdges(addEdge(params, edges));
            updateFlowInEditedWorkflow();
        },
        [edges],
    );

    // const onConnectStart = useCallback((_, { nodeId }) => {
    //     connectingNodeId.current = nodeId;
    //   }, []);

    // const onConnectEnd = useCallback((event) => {
    //     if (!connectingNodeId.current) {
    //         return;
    //     }

    //     const targetIsPane = event.target.classList.contains("react-flow__pane");

    //     if (targetIsPane) {
    //         const position = reactFlowInstance.screenToFlowPosition({
    //             x: event.clientX,
    //             y: event.clientY,
    //         });

    //         const id = getId();

    //         const item = {
    //             id,
    //             type: 'nodePlaceholder',
    //             data: {
    //                 name: 'core/node-placeholder',
    //             },
    //             position,
    //             origin: [0.5, 0.0],
    //         };

    //         setNodes([...nodes, item]);
    //         setEdges([
    //             ...edges,
    //             {
    //                 id: `${connectingNodeId.current}-${item.id}`,
    //                 source: connectingNodeId.current,
    //                 target: item.id,
    //                 type: 'genericEdge',
    //             },
    //         ]);
    //     }
    // }, [reactFlowInstance.screenToFlowPosition]);


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const dataTransferItem = event.dataTransfer.getData(EVENT_DROP_NODE);
            const item = JSON.parse(dataTransferItem);

            createNewNode({
                item,
                position,
                reactFlowInstance
            });
        },
        [reactFlowInstance, nodes],
    );

    const onNodesDelete = useCallback(() => {
        updateFlowInEditedWorkflow();
    });

    const onEdgesDelete = useCallback(() => {
        updateFlowInEditedWorkflow();
    });

    const fitView = useCallback(() => {
        reactFlowInstance.fitView();
    }, [reactFlowInstance]);

    const applyLayout = useLayoutedElements({
        nodes,
        edges,
        onLayout: (layoutedNodes, layoutedEdges) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        },
        onAnimationFrame: () => {
            fitView();

            updateFlowInEditedWorkflow();
        },
    });

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            // Avoid selecting the placeholder node.
            if (nodes.length > 0 && nodes[0].type === 'triggerPlaceholder') {
                setSelectedNodes([]);
                setSelectedEdges([]);

                return;
            }

            setSelectedNodes(nodes.map((node) => node.id));
            setSelectedEdges(edges.map((edge) => edge.id));

            if (!hasActiveSideBar) {
                return;
            }

            if (nodes.length === 0 && edges.length === 0) {
                openGeneralSidebar(SIDEBAR_WORKFLOW);
            }

            if (nodes.length > 0 || edges.length > 0) {
                openGeneralSidebar(SIDEBAR_NODE_EDGE);
            }
        },
    });

    const onAutoLayout = useCallback(() => {
        applyLayout({ direction: AUTO_LAYOUT_DEFAULT_DIRECTION });
    }, [applyLayout]);

    // Calculate the initial layout on mount.
    useLayoutEffect(() => {
        onAutoLayout();
    }, []);

    useEffect(() => {
        const sidebarIsActiveByDefault = Platform.select({
            web: true,
            native: false,
        });

        if (sidebarIsActiveByDefault) {
            openGeneralSidebar(SIDEBAR_WORKFLOW);
        }
    }, []);

    // Fix the behavior when the sidebar is closed and opened again, making sure a sidebar is loaded.
    useEffect(() => {
        if (activeComplementaryArea === "null/undefined") {
            const sidebar =
                selectedNodes.length > 0 || selectedEdges.length > 0
                    ? SIDEBAR_NODE_EDGE
                    : SIDEBAR_WORKFLOW;

            openGeneralSidebar(sidebar);
        }
    }, [activeComplementaryArea, selectedEdges, selectedNodes]);

    // Add the placeholder node if there is no node in the flow.
    // Otherwise, remove it.
    useEffect(() => {
        if (! nodes.length) {
            nodes.push({
                id: 'triggerPlaceholder',
                type: 'triggerPlaceholder',
                data: {
                    name: 'core/trigger-placeholder',
                    label: 'Trigger Placeholder',
                },
                position: { x: 0, y: 0 },
            });
            onAutoLayout();
        } else if (nodes.length > 1) {
            const placeholderIndex = nodes.findIndex((node) => node.type === 'triggerPlaceholder');

            if (placeholderIndex !== -1) {
                nodes.splice(placeholderIndex, 1);
            }
        }
    }, [nodes]);

    return (
        <div className="reactflow-wrapper" ref={reactFlowWrapperRef}>
            <AutoLayout onLayout={onAutoLayout} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgeUpdate={onEdgeUpdate}
                // onConnectStart={onConnectStart}
                // onConnectEnd={onConnectEnd}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodesDraggable={true}
                proOptions={proOptions}
                fitView
                style={editorStyle}
                snapToGrid={true}
                snapGrid={[GRID_SIZE, GRID_SIZE]}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                connectionLineStyle={{ stroke: "#c2c2c2", strokeWidth: 2, strokeDasharray: '3,4', }}
            >
                {isMiniMapFeatureActive && (
                    <MiniMap
                        pannable
                        zoomable
                        nodeColor={(node) => {
                            if (node.type === "generic") return "#FFCC00";
                        }}
                    />
                )}

                {isControlsFeatureActive && (
                    <Controls />
                )}

                <Background variant="dots" color="#ccc" gap={GRID_SIZE} />
            </ReactFlow>
            <NodeValidator />
        </div>
    );
};

export default FlowEditor;
