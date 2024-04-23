import { useSelect } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
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

export const NodeInspector = () => {
    const {
        selectedNodes,
        selectedEdges,
        selectedElementsCount,
        selectedNode,
        selectedEdge,
    } = useSelect((select) => {
        const selectedNodes = select(workflowStore).getSelectedNodes();
        const selectedEdges = select(workflowStore).getSelectedEdges();
        const getNodeById = select(workflowStore).getNodeById;
        const getEdgeById = select(workflowStore).getEdgeById;

        const selectedNode =
            selectedNodes.length === 1 ? getNodeById(selectedNodes[0]) : null;
        const selectedEdge =
            selectedEdges.length === 1 ? getEdgeById(selectedEdges[0]) : null;

        return {
            selectedNodes,
            selectedEdges,
            selectedElementsCount:
                select(workflowStore).getSelectedElementsCount(),
            selectedNode,
            selectedEdge,
        };
    });

    const onlyNodesSelected =
        selectedNodes.length > 0 && selectedEdges.length === 0;
    const onlyEdgesSelected =
        selectedNodes.length === 0 && selectedEdges.length > 0;

    const nodeHasSettings = selectedNode?.data?.settingsSchema?.length > 0;

    return (
        <VStack className="editor-element-inspector__panel">
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
                    />
                    <div className="components-tools-panel"></div>
                </>
            )}
        </VStack>
    );
};

export default NodeInspector;
