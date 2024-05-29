import { useSelect } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { __ } from "@wordpress/i18n";
import { GrObjectGroup } from "react-icons/gr";
import { FaLinesLeaning } from "react-icons/fa6";
import { sprintf } from "@wordpress/i18n";
import NodeInspectorCard from "./node-inspector-card";
import InspectorCard from "../inspector-card";
import InspectorWarning from "../inspector-warning";
import NodeSettingsPanel from "./node-settings-panel";
import { nodeHasIncomers, nodeHasInput, mapNodeInputs, nodeHasOutput } from "../../utils";
import { FEATURE_ADVANCED_SETTINGS, FEATURE_DEVELOPER_MODE } from "../../constants";
import NodeValidationPanel from "../node-validation-panel";
import NodeDevInfoPanel from "../node-dev-info-panel";
import NodeSocketsPanel from "./node-sockets-panel";
import WorkflowGlobalVariables from "../workflow-global-variables";

export const NodeInspector = () => {
    const {
        selectedNodes,
        selectedEdges,
        selectedElementsCount,
        selectedNode,
        selectedEdge,
        nodeHasErrors,
        nodeErrors,
    } = useSelect((select) => {
        const selectedNodes = select(workflowStore).getSelectedNodes();
        const selectedEdges = select(workflowStore).getSelectedEdges();
        const getNodeById = select(workflowStore).getNodeById;
        const getEdgeById = select(workflowStore).getEdgeById;
        const selectedNode =
            selectedNodes.length === 1 ? getNodeById(selectedNodes[0]) : null;
        const selectedEdge =
            selectedEdges.length === 1 ? getEdgeById(selectedEdges[0]) : null;
        const nodeErrors = select(workflowStore).getNodeErrors(selectedNode?.id) || {};
        const nodeHasErrors = Object.keys(nodeErrors).length > 0;
        const selectedElementsCount = select(workflowStore).getSelectedElementsCount();

        return {
            selectedNodes,
            selectedEdges,
            selectedElementsCount,
            selectedNode,
            selectedEdge,
            nodeHasErrors,
            nodeErrors,
        };
    });

    const {
        isDeveloperModeEnabled,
        isAdvancedSettingsEnabled,
    } = useSelect((select) => {
        return {
            isDeveloperModeEnabled: select(editorStore).isFeatureActive(FEATURE_DEVELOPER_MODE),
            isAdvancedSettingsEnabled: select(editorStore).isFeatureActive(FEATURE_ADVANCED_SETTINGS),
        };
    });

    const onlyNodesSelected =
        selectedNodes.length > 0 && selectedEdges.length === 0;
    const onlyEdgesSelected =
        selectedNodes.length === 0 && selectedEdges.length > 0;

    const nodeHasSettings = selectedNode?.data?.settingsSchema?.length > 0;

    const selectedNodeHasIncomers = nodeHasIncomers(selectedNode);
    const selectedNodeHasInput = nodeHasInput(selectedNode);
    const selectedNodeHasOutput = nodeHasOutput(selectedNode);

    const mappedNodeInputSchema = mapNodeInputs(selectedNode);

    const nodeOutputSchema = selectedNode?.data?.outputSchema || [];
    let mappedNodeOutputSchema = [];
    if (nodeOutputSchema.length > 0) {
        nodeOutputSchema.forEach((schemaItem) => {
            if (schemaItem.type === "input") {
                mappedNodeOutputSchema = mappedNodeOutputSchema.concat(mappedNodeInputSchema);
            } else {
                mappedNodeOutputSchema.push(schemaItem);
            }
        });
    }

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

                    {nodeHasSettings && (
                        <NodeSettingsPanel node={selectedNode} />
                    )}

                    {nodeHasErrors && (
                        <NodeValidationPanel errors={nodeErrors} />
                    )}

                    {isAdvancedSettingsEnabled &&(
                        <WorkflowGlobalVariables />
                    )}

                    {isDeveloperModeEnabled && (selectedNodeHasInput || selectedNodeHasOutput) && (
                        <NodeSocketsPanel inputSchema={mappedNodeInputSchema} outputSchema={mappedNodeOutputSchema} />
                    )}

                    {isDeveloperModeEnabled && (
                        <NodeDevInfoPanel node={selectedNode} />
                    )}



                    <div className="components-tools-panel"></div>
                </>
            )}

            {onlyEdgesSelected && selectedElementsCount === 1 && selectedEdge && (
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
