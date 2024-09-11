import { useSelect } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { __ } from "@wordpress/i18n";
import { sprintf } from "@wordpress/i18n";
import { useRef } from "@wordpress/element";
import NodeInspectorCard from "./node-inspector-card";
import InspectorCard from "../inspector-card";
import InspectorWarning from "../inspector-warning";
import NodeSettingsPanel from "./node-settings-panel";
import { nodeHasInput, mapNodeInputs, nodeHasOutput } from "../../utils";
import { FEATURE_ADVANCED_SETTINGS, FEATURE_DEVELOPER_MODE } from "../../constants";
import NodeValidationPanel from "../node-validation-panel";
import NodeDataFlowPanel from "./node-data-flow-panel";
import ObjectGroupIcon from "../icons/object-group";
import LinesLeaningIcon from "../icons/lines-leaning";
import NodeDevInfoPanel from "../node-dev-info-panel";
import useScrollToTop from "../scrolled-to-top";

export const NodeInspector = () => {
    const {
        selectedNodes,
        selectedEdges,
        selectedElementsCount,
        selectedNode,
        selectedEdge,
        nodeErrors,
        nodeType,
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
        const selectedElementsCount = select(workflowStore).getSelectedElementsCount();
        let nodeType = null;
        if (selectedNode) {
            nodeType = select(editorStore).getNodeTypeByName(selectedNode?.data?.name);
        }

        return {
            selectedNodes,
            selectedEdges,
            selectedElementsCount,
            selectedNode,
            selectedEdge,
            nodeErrors,
            nodeType,
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

    const sidebarRef = useRef(null);

    const onlyNodesSelected =
        selectedNodes.length > 0 && selectedEdges.length === 0;
    const onlyEdgesSelected =
        selectedNodes.length === 0 && selectedEdges.length > 0;

    const nodeHasSettings = nodeType?.settingsSchema?.length > 0;

    const selectedNodeHasInput = nodeHasInput(selectedNode);
    const selectedNodeHasOutput = nodeHasOutput(selectedNode);

    const mappedNodeInputSchema = mapNodeInputs(selectedNode);

    const nodeOutputSchema = nodeType?.outputSchema || [];
    let mappedNodeOutputSchema = [];
    if (nodeOutputSchema.length > 0) {
        nodeOutputSchema.forEach((schemaItem) => {
            if (schemaItem.type === "input") {
                mappedNodeOutputSchema = mappedNodeOutputSchema.concat(mappedNodeInputSchema);
            } else {
                mappedNodeOutputSchema.push({
                    ...schemaItem,
                    name: `${selectedNode?.data?.slug}.${schemaItem.name}`,
                });
            }
        });
    }

    useScrollToTop(sidebarRef, ".interface-interface-skeleton__sidebar");

    return (
        <div ref={sidebarRef}>
            {selectedElementsCount === 0 && (
                <InspectorWarning>
                    {__("No element selected.", "post-expirator")}
                </InspectorWarning>
            )}

            {selectedElementsCount > 1 &&
                !onlyNodesSelected &&
                !onlyEdgesSelected && (
                    <InspectorWarning>
                        {__(
                            "Multiple and different elements selected.",
                            "post-expirator",
                        )}
                    </InspectorWarning>
                )}

            {onlyNodesSelected && selectedElementsCount > 1 && (
                <InspectorCard
                    title={sprintf(
                        __("%d steps selected", "post-expirator"),
                        selectedElementsCount,
                    )}
                    description={__(
                        "Multiple steps selected.",
                        "post-expirator",
                    )}
                    icon={<ObjectGroupIcon size={24} />}
                />
            )}

            {onlyEdgesSelected && selectedElementsCount > 1 && (
                <InspectorCard
                    title={sprintf(
                        __("%d connections selected", "post-expirator"),
                        selectedElementsCount,
                    )}
                    description={__(
                        "Multiple connections selected.",
                        "post-expirator",
                    )}
                    icon={<LinesLeaningIcon size={24} />}
                />
            )}

            {onlyNodesSelected && selectedElementsCount === 1 && (
                <>
                    <NodeInspectorCard node={selectedNode} />

                    {nodeHasSettings && (
                        <NodeSettingsPanel node={selectedNode} />
                    )}

                    <NodeValidationPanel errors={nodeErrors} />

                    {isAdvancedSettingsEnabled && (selectedNodeHasInput || selectedNodeHasOutput) && (
                        <NodeDataFlowPanel inputSchema={mappedNodeInputSchema} outputSchema={mappedNodeOutputSchema} />
                    )}

                    {isDeveloperModeEnabled && (
                        <NodeDevInfoPanel node={selectedNode} nodeType={nodeType} />
                    )}

                    <div className="components-tools-panel"></div>
                </>
            )}

            {onlyEdgesSelected && selectedElementsCount === 1 && selectedEdge && (
                <>
                    <InspectorCard
                        title={__("Connection", "post-expirator")}
                        description={__(
                            "The connection between nodes in the workflow. Signifies the path along which data or control flow one node to another.",
                            "post-expirator",
                        )}
                        icon={<LinesLeaningIcon size={24} />}
                        id={selectedEdge.id}
                    />
                    <div className="components-tools-panel"></div>
                </>
            )}
        </div>
    );
};

export default NodeInspector;
