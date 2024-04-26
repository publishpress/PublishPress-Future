import { useSelect } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { __ } from "@wordpress/i18n";
import { __experimentalHStack as HStack } from "@wordpress/components";
import { GrObjectGroup } from "react-icons/gr";
import { FaLinesLeaning } from "react-icons/fa6";
import { sprintf } from "@wordpress/i18n";
import NodeInspectorCard from "./node-inspector-card";
import InspectorCard from "../inspector-card";
import InspectorWarning from "../inspector-warning";
import NodeSettingsPanel from "./node-settings-panel";
import { __experimentalVStack as VStack } from "@wordpress/components";
import NodeOutputPanel from "./node-output-panel";
import NodeInputPanel from "./node-input-panel";
import { nodeHasIncomers, nodeHasInput, getNodeIncomers } from "../../utils";
import { FEATURE_DEVELOPER_MODE } from "../../constants";

export const NodeInspector = () => {
    const {
        selectedNodes,
        selectedEdges,
        selectedElementsCount,
        selectedNode,
        selectedEdge,
        nodes,
        edges,
    } = useSelect((select) => {
        const nodes = select(workflowStore).getNodes();
        const edges = select(workflowStore).getEdges();
        const selectedNodes = select(workflowStore).getSelectedNodes();
        const selectedEdges = select(workflowStore).getSelectedEdges();
        const getNodeById = select(workflowStore).getNodeById;
        const getEdgeById = select(workflowStore).getEdgeById;

        const selectedNode =
            selectedNodes.length === 1 ? getNodeById(selectedNodes[0]) : null;
        const selectedEdge =
            selectedEdges.length === 1 ? getEdgeById(selectedEdges[0]) : null;

        return {
            nodes,
            edges,
            selectedNodes,
            selectedEdges,
            selectedElementsCount:
                select(workflowStore).getSelectedElementsCount(),
            selectedNode,
            selectedEdge,
        };
    });

    const {
        isDeveloperModeEnabled,
    } = useSelect((select) => {
        return {
            isDeveloperModeEnabled: select(editorStore).isFeatureActive(
                FEATURE_DEVELOPER_MODE,
            ),
        };
    });

    const onlyNodesSelected =
        selectedNodes.length > 0 && selectedEdges.length === 0;
    const onlyEdgesSelected =
        selectedNodes.length === 0 && selectedEdges.length > 0;

    const nodeHasSettings = selectedNode?.data?.settingsSchema?.length > 0;
    const nodeHasOutput = selectedNode?.data?.outputSchema?.length > 0;

    const nodeIncomers = getNodeIncomers(selectedNode);
    const selectedNodeHasIncomers = nodeHasIncomers(selectedNode);
    const selectedNodeHasInput = nodeHasInput(selectedNode);

    return (
        <>
            {selectedElementsCount === 0 && (
                <InspectorWarning>
                    {__("No element selected.", "publishpress-future-pro")}
                </InspectorWarning>
            )}

            {selectedElementsCount > 1 &&
                !onlyNodesSelected &&
                !onlyEdgesSelected && (
                    <InspectorWarning>
                        {__(
                            "Multiple and different elements selected.",
                            "publishpress-future-pro",
                        )}
                    </InspectorWarning>
                )}

            {onlyNodesSelected && selectedElementsCount > 1 && (
                <InspectorCard
                    title={sprintf(
                        __("%d nodes selected", "publishpress-future-pro"),
                        selectedElementsCount,
                    )}
                    description={__(
                        "Multiple nodes selected.",
                        "publishpress-future-pro",
                    )}
                    icon={<GrObjectGroup />}
                />
            )}

            {onlyEdgesSelected && selectedElementsCount > 1 && (
                <InspectorCard
                    title={sprintf(
                        __("%d edges selected", "publishpress-future-pro"),
                        selectedElementsCount,
                    )}
                    description={__(
                        "Multiple edges selected.",
                        "publishpress-future-pro",
                    )}
                    icon={<FaLinesLeaning />}
                />
            )}

            {onlyNodesSelected && selectedElementsCount === 1 && (
                <>
                    <NodeInspectorCard node={selectedNode} />

                    {isDeveloperModeEnabled && nodeHasOutput && (
                        <NodeOutputPanel outputSchema={selectedNode.data.outputSchema} />
                    )}

                    {isDeveloperModeEnabled && selectedNodeHasIncomers && selectedNodeHasInput && (
                        <>
                            {nodeIncomers.map((incomer) => (
                                <NodeInputPanel key={incomer.id} inputSchema={incomer.data.outputSchema} />
                            ))}
                        </>
                    )}

                    {nodeHasSettings && (
                        <NodeSettingsPanel node={selectedNode} />
                    )}

                    <div className="components-tools-panel"></div>
                </>
            )}

            {onlyEdgesSelected && selectedElementsCount === 1 && (
                <>
                    <InspectorCard
                        title={__("Edge", "publishpress-future-pro")}
                        description={__(
                            "A connection between nodes",
                            "publishpress-future-pro",
                        )}
                        icon={<FaLinesLeaning />}
                        id={selectedEdge.id}
                    />
                    <div className="components-tools-panel"></div>
                </>
            )}
        </>
    );
};

export default NodeInspector;
