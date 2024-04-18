import { __ } from "@wordpress/i18n";

import InspectorCard from "../inspector-card";
import NodeIcon from "../node-icon";
import { useEffect } from "@wordpress/element";

export const NodeInspectorCard = ({ node }) => {
    const nodeIcon = node?.data?.icon || "media-document";
    const nodeLabel = node?.data?.label || __("Node", "publishpress-future-pro");
    const nodeDescription = node?.data?.description || __("No description", "publishpress-future-pro");

    const Icon = <NodeIcon icon={nodeIcon} />;

    // Debugging
    useEffect(() => {
        console.log(node);
    }, [node])

    return (
        <InspectorCard
            title={nodeLabel}
            description={nodeDescription}
            icon={Icon}
        />
    );
};

export default NodeInspectorCard;
