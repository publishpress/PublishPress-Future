import { __ } from "@wordpress/i18n";

import InspectorCard from "../inspector-card";
import NodeIcon from "../node-icon";

export const NodeInspectorCard = ({ node }) => {
    const nodeIcon = node?.data?.icon || "media-document";
    const nodeLabel = node?.data?.label || __("Node", "publishpress-future-pro");
    const nodeDescription = node?.data?.description || __("No description", "publishpress-future-pro");
    const nodeId = node?.id;

    const Icon = <NodeIcon icon={nodeIcon} />;

    return (
        <InspectorCard
            title={nodeLabel}
            description={nodeDescription}
            id={nodeId}
            icon={Icon}
        />
    );
};

export default NodeInspectorCard;
