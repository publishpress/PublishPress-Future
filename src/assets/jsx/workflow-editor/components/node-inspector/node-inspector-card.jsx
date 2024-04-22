import { __ } from "@wordpress/i18n";

import InspectorCard from "../inspector-card";
import NodeIcon from "../node-icon";

export const NodeInspectorCard = ({ selectedNode }) => {
    const nodeIcon = selectedNode?.data?.icon || "media-document";
    const nodeLabel = selectedNode?.data?.label || __("Node", "publishpress-future-pro");
    const nodeDescription = selectedNode?.data?.description || __("No description", "publishpress-future-pro");

    const Icon = <NodeIcon icon={nodeIcon} />;

    return (
        <InspectorCard
            title={nodeLabel}
            description={nodeDescription}
            icon={Icon}
        />
    );
};

export default NodeInspectorCard;
