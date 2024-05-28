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
import { defaultEdgeProps } from "../../default-edges-props";
import { useLayoutedElements, AutoLayout } from "./auto-layout";
import { FEATURE_MINI_MAP, SLOT_SCOPE_WORKFLOW_EDITOR } from "../../constants";
import GenericNode from "../node-types/generic";

import { AUTO_LAYOUT_DEFAULT_DIRECTION } from "./auto-layout/constants";
import {
    SIDEBAR_NODE_EDGE,
    SIDEBAR_WORKFLOW,
} from "../settings-sidebar/constants";
import TriggerNode from "../node-types/trigger";
import NodeValidator from "../node-validator";

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
        baseSlugCounts,
        isMiniMapActive,
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
            baseSlugCounts: select(workflowStore).getBaseSlugCounts(),
            isMiniMapActive: select(editorStore).isFeatureActive(FEATURE_MINI_MAP),
        };
    });

    const {
        setNodes,
        setEdges,
        setSelectedNodes,
        setSelectedEdges,
        setEditedWorkflowAttribute,
        incrementBaseSlugCounts,
    } = useDispatch(workflowStore);

    const { openGeneralSidebar } = useDispatch(editorStore);

    const reactFlowWrapperRef = useRef(null);
    const reactFlowInstance = useReactFlow();
    const { setViewport } = useReactFlow();

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
                ...defaultEdgeProps,
            };

            setEdges(addEdge(params, edges));
            updateFlowInEditedWorkflow();
        },
        [edges],
    );

    const getId = () => `node_${+new Date()}`;

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const incrementAndGetNodeSlug = (nodeItem) => {
        let baseSlug = nodeItem.baseSlug;

        if (!baseSlug) {
            baseSlug = "node";
        }

        incrementBaseSlugCounts(baseSlug);

        const count = baseSlugCounts[baseSlug] || 0;

        return `${baseSlug}${count + 1}`;
    };

    const createNodeAfterDrop = useCallback(
        ({ item, position }) => {
            const slug = incrementAndGetNodeSlug(item);

            const newNode = {
                id: getId(),
                type: item.type,
                position: position,
                data: {
                    name: item.name,
                    elementarType: item.elementarType,
                    label: item.label,
                    description: item.description,
                    settingsSchema: item.settingsSchema,
                    validationSchema: item.validationSchema,
                    category: item.category,
                    icon: item.icon,
                    version: item.version,
                    outputSchema: item.outputSchema,
                    className: item.className,
                    socketSchema: item.socketSchema,
                    baseSlug: item.baseSlug,
                    slug: slug,
                },
            };

            setNodes(nodes.concat(newNode));

            updateFlowInEditedWorkflow();
        },
        [nodes],
    );

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const dataTransferItem = event.dataTransfer.getData(
                "application/future-workflow-editor-node",
            );
            const item = JSON.parse(dataTransferItem);

            createNodeAfterDrop({
                item: item,
                position: position,
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

    return (
        <div className="reactflow-wrapper" ref={reactFlowWrapperRef}>
            <AutoLayout onLayout={onAutoLayout} />
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
                snapToGrid={true}
                snapGrid={[GRID_SIZE, GRID_SIZE]}
                nodeTypes={nodeTypes}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
            >
                {isMiniMapActive && (
                    <MiniMap
                        pannable
                        zoomable
                        nodeColor={(node) => {
                            if (node.type === "generic") return "#FFCC00";
                        }}
                    />
                )}
                <Background variant="dots" color="#ccc" gap={GRID_SIZE} />
                <Controls />
            </ReactFlow>
            <NodeValidator />
        </div>
    );
};

export default FlowEditor;
