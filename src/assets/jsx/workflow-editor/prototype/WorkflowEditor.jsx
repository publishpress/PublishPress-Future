import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    updateEdge,
    useEdgesState,
    useOnSelectionChange,
    useReactFlow
} from 'reactflow';

import 'reactflow/dist/style.css';
import './css/index.css';

import Sidebar from "./Sidebar";

import {v4 as uuidv4} from 'uuid';
import ConditionalNode from "./Nodes/Steps/ConditionalNode";
import HookActionNode, {useHookActionMetaBox} from "./Nodes/Triggers/HookActionNode";
import PrintToOutputNode from "./Nodes/Steps/PrintToOutputNode";
import RayNode, {useRayMetabox} from "./Nodes/Steps/RayNode";
import Modal from "./Modal";
import HookFilterNode, {useHookFilterMetaBox} from "./Nodes/Triggers/HookFilterNode";
import RunNode from "./Nodes/Triggers/RunNode";

const {useCallback, useEffect, useRef, useState} = wp.element;

const nodeTypeProperties = {
    conditional: {
        icon: 'faDiagramProject',
        label: 'Conditional',
        color: 'blue-lighten-5',
        params: {
            expression: {}
        },
        hasParams: true,
        getMetaboxCallback: useRayMetabox
    },
    printToOutput: {
        icon: 'faLaptopCode',
        label: 'Print to output',
        color: 'blue-lighten-5',
        params: {},
        hasParams: false,
    },
    ray: {
        icon: 'faBug',
        label: 'Ray',
        color: 'blue-lighten-5',
        params: {
            color: 'blue'
        },
        hasParams: true,
        getMetaboxCallback: useRayMetabox
    },
    hookAction: {
        icon: 'faBolt',
        label: 'WP Action Hook',
        color: 'green-lighten-3',
        params: {
            actionName: 'admin_init'
        },
        hasParams: true,
        getMetaboxCallback: useHookActionMetaBox
    },
    hookFilter: {
        icon: 'faBolt',
        label: 'WP Filter Hook',
        color: 'green-lighten-3',
        params: {
            filterName: 'the_content'
        },
        hasParams: true,
        getMetaboxCallback: useHookFilterMetaBox
    },
    run: {
        icon: 'faBolt',
        label: 'Run',
        color: 'green-lighten-3',
        params: {},
        hasParams: false,
    }
}

const nodeTypesComponents = {
    conditional: ConditionalNode,
    printToOutput: PrintToOutputNode,
    ray: RayNode,
    hookAction: HookActionNode,
    hookFilter: HookFilterNode,
    run: RunNode,
}

const initialNodes = [];

const defaultEdgeProps = {}

const initialEdges = [];

const getId = (prefix) => `${prefix}${uuidv4()}`;
const postId = jQuery('#post_ID').val();

const undoSessionKey = 'pwe_workflow_undo_' + postId;
const redoSessionKey = 'pwe_workflow_redo_' + postId;

function WorkflowEditor() {
    const reactFlowWrapper = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {setViewport} = useReactFlow();
    const theReactFlowInstance = useReactFlow();
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [selection, setSelection] = useState(null);
    const [isEditingNode, setIsEditingNode] = useState(false);
    const [selectionData, setSelectionData] = useState({});

    const setUndoStackState = (newState) => {
        sessionStorage.setItem(undoSessionKey, JSON.stringify(newState));
        setUndoStack(newState)
    }

    const setRedoStackState = (newState) => {
        sessionStorage.setItem(redoSessionKey, JSON.stringify(newState));
        setRedoStack(newState)
    }

    const getUndoStack = () => {
        const stack = JSON.parse(sessionStorage.getItem(undoSessionKey));

        if (!stack) {
            return [];
        }

        return stack;
    }

    const getRedoStack = () => {
        const stack = JSON.parse(sessionStorage.getItem(redoSessionKey));

        if (!stack) {
            return [];
        }

        return stack;
    }

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => {
            pushFlowToUndoStack()

            setEdges((eds) => applyEdgeChanges(changes, eds))
        },
        []
    );
    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => {
            pushFlowToUndoStack()

            setEdges((els) => {
                const result = updateEdge(oldEdge, newConnection, els)

                return result
            })
        },
        []
    );
    const onConnect = useCallback((params) => {
        pushFlowToUndoStack()

        params = {
            ...defaultEdgeProps,
            ...params,
        }

        params.id = getId('we_') + `_${params.source}_${params.target}`

        setEdges((els) => {
            return addEdge(params, els)
        })
    }, [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const nodeType = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof nodeType === 'undefined' || !nodeType) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const nodeData =
                nodeTypeProperties[nodeType]
                    ? nodeTypeProperties[nodeType]
                    : {
                        label: 'Undefined'
                    };

            const newNode = {
                id: getId('wn_'),
                type: nodeType,
                position,
                data: nodeData,
            };

            setNodes((nds) => nds.concat(newNode));

            pushFlowToUndoStack()
        },
        [reactFlowInstance]
    );

    const onNodeDragStop = useCallback(
        (event) => {
            pushFlowToUndoStack()
        },
        [reactFlowInstance]
    )

    useEffect(() => {
        jQuery('#post').submit(function (e) {
            document.dispatchEvent(new Event('pwe_workflow_save'));
        });

        document.addEventListener('pwe_workflow_save', () => {
            onSave()
        });

        document.addEventListener('pwe_workflow_restore', () => {
            onRestore()
        });

        document.addEventListener('pwe_workflow_undo', () => {
            onUndo()
        });

        document.addEventListener('pwe_workflow_redo', () => {
            onRedo()
        });
    }, [])

    useEffect(() => {
        jQuery(() => {
            document.dispatchEvent(new Event('pwe_workflow_restore'));
        });
    }, [])

    // Reset the state stack for a clean undo/redo stack
    useEffect(() => {
        onDOMLoad(() => {
            setUndoStackState([getDiagramData()]);
        });
    }, [])

    const onDOMLoad = (callback) => {
        jQuery(() => {
            callback()
        });
    }

    const getDiagramData = () => {
        return jQuery('#pwe_workflow_data').val();
    }

    const updateDiagramDataOnTextarea = (diagramData) => {
        jQuery('#pwe_workflow_data').val(diagramData);
    }

    const unselectAll = () => {
        setNodes((nds) => {
            return nds.map((node) => {
                node.selected = false

                return node;
            })
        });

        setEdges((eds) => {
            return eds.map((edge) => {
                edge.selected = false

                return edge;
            })
        });
    };

    const onSave = useCallback(() => {
        if (theReactFlowInstance) {
            unselectAll();

            const flow = theReactFlowInstance.toObject();
            const flowJson = JSON.stringify(flow);

            updateDiagramDataOnTextarea(flowJson);
        }
    }, [theReactFlowInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            setIsLoading(true)
            const flowData = getDiagramData();

            if (!flowData) {
                return;
            }
            const flow = JSON.parse(flowData);

            if (flow) {
                const {x = 0, y = 0, zoom = 1} = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({x, y, zoom});
            }

            unselectAll();

            setIsLoading(false)
        };

        restoreFlow();
    }, [setNodes, setViewport]);

    useOnSelectionChange({
        onChange: ({nodes, edges}) => {
            if (nodes.length) {
                const node = nodes[0];

                if (nodeTypeProperties[node.type]['getMetaboxCallback']) {
                    node.data.getMetaboxCallback = nodeTypeProperties[node.type]['getMetaboxCallback'];
                }

                node.data.editCallback = editNode;

                setSelection(node);
                setSelectionData(node.data);
                return;
            }

            if (edges.length) {
                const edge = edges[0];
                setSelection(edge);
                setSelectionData(edge.data);
                return;
            }

            setSelection(null);
            setIsEditingNode(false);
            setSelectionData({});
        },
    });

    const pushFlowToUndoStack = () => {
        if (isLoading) {
            return;
        }

        let stack = getUndoStack();

        if (!stack) {
            stack = [];
        }

        if (!theReactFlowInstance) {
            return;
        }

        const flow = theReactFlowInstance.toObject();
        let flowJson = normalizeJsonForStack(JSON.stringify(flow));

        stack.push(flowJson);
        setUndoStackState(stack)
    }

    const pushFlowToRedoStack = () => {
        if (isLoading) {
            return;
        }

        let stack = getRedoStack();

        if (!stack) {
            stack = [];
        }

        if (!theReactFlowInstance) {
            return;
        }

        const flow = theReactFlowInstance.toObject();
        let flowJson = normalizeJsonForStack(JSON.stringify(flow));

        stack.push(flowJson);
        setRedoStackState(stack)
    }


    const normalizeJsonForStack = (json) => {
        json = json.replace('"dragging":true', '"dragging":false')

        return json
    }

    const popUndoStack = () => {
        let stack = getUndoStack()

        if (!stack || stack.length === 0) {
            return null;
        }

        // We never remove all the items from the stack
        if (stack.length === 1) {
            return stack[0];
        }

        if (!theReactFlowInstance) {
            return;
        }
        const flow = theReactFlowInstance.toObject();
        const flowJson = JSON.stringify(flow);

        let lastItem = stack.pop();
        setUndoStackState(stack)

        // Make sure we ignore stacked states that are equal to the current one.
        if (lastItem === flowJson && stack.length > 1) {
            return popUndoStack();
        }

        // Add current workflow to the redo stack.
        pushFlowToRedoStack()

        return lastItem;
    };

    const popRedoStack = () => {
        let stack = getRedoStack()

        if (!stack || stack.length === 0) {
            return null;
        }

        // We never remove all the items from the stack
        if (stack.length === 1) {
            return stack[0];
        }

        if (!theReactFlowInstance) {
            return;
        }
        const flow = theReactFlowInstance.toObject();
        const flowJson = JSON.stringify(flow);

        let lastItem = stack.pop();
        setRedoStackState(stack)

        // Make sure we ignore stacked states that are equal to the current one.
        if (lastItem === flowJson && stack.length > 1) {
            return popRedoStack();
        }

        // Add current workflow to the undo stack.
        pushFlowToUndoStack()

        return lastItem;
    };


    const onUndo = () => {
        const flowToRestore = popUndoStack();

        if (!flowToRestore) {
            return;
        }

        updateDiagramDataOnTextarea(flowToRestore);
        onRestore()
    };

    const onRedo = () => {
        const flowToRestore = popRedoStack();

        if (!flowToRestore) {
            return;
        }

        updateDiagramDataOnTextarea(flowToRestore);
        onRestore()
    };

    const editNode = (nodeProps) => {
        if (nodeProps.data.getMetaboxCallback) {
            setIsEditingNode(true);
        }
    }

    const onCloseModal = (id) => {
        setNodes((nds) => {
            return nds.map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data
                    }
                }

                return node;
            });
        })
        setIsEditingNode(false);
    }

    const minimapNodeColor = (node) => {
        switch (node.type) {
            case 'hookAction':
                return '#3d834a';
            default:
                return '#6865A5';
        }
    };

    return (
        <>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onEdgeUpdate={onEdgeUpdate}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeDragStop={onNodeDragStop}
                    onEdgeUpdateEnd={onNodeDragStop}
                    onEdgesDelete={onNodeDragStop}
                    nodeTypes={nodeTypesComponents}
                    snapToGrid
                    fitView
                    snapGrid={[4, 4]}
                    attributionPosition="top-right"
                    className="pwe-workflow-editor-canvas"
                >
                    <Background/>
                    <Controls/>
                    <MiniMap nodeColor={minimapNodeColor} nodeStrokeWidth={3} zoomable pannable/>
                </ReactFlow>
            </div>
            <Sidebar
                nodeTypes={nodeTypeProperties}
                selection={selection}
            />

            {isEditingNode &&
                <Modal onClose={onCloseModal} node={selection}/>
            }
        </>
    );
}

function WorkflowEditorProvider() {
    return <div className="pwe-workflow-editor">
        <ReactFlowProvider>
            <WorkflowEditor/>
        </ReactFlowProvider>
    </div>;
}

export default WorkflowEditorProvider;
