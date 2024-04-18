import { __ } from "@wordpress/i18n";
import { GrObjectGroup } from "react-icons/gr";

import InspectorCard from "../inspector-card";

export const NodeInspectorCard = ({ node }) => {
    const nodeTypeLabels = {
        genericAction: __("Action", "publishpress-future-pro"),
        genericTrigger: __("Trigger", "publishpress-future-pro"),
        flowIfElse: __("If/Else", "publishpress-future-pro"),
    };

    const nodeTypeDescriptions = {
        genericAction: __(
            "An action is a task that can be executed by the workflow.",
            "publishpress-future-pro",
        ),
        genericTrigger: __(
            "A trigger is an event that starts the workflow.",
            "publishpress-future-pro",
        ),
        flowIfElse: __(
            "An If/Else node is a conditional node that can branch the workflow based on a condition.",
            "publishpress-future-pro",
        ),
    };

    const nodeTypeLabel = node
        ? nodeTypeLabels[node.data.type]
        : __("Node", "publishpress-future-pro");

    const nodeTypeDescription = node
        ? nodeTypeDescriptions[node.data.type]
        : __(
              "A node is a basic element of the workflow.",
              "publishpress-future-pro",
          );
    const nodeIcon = <GrObjectGroup />;

    console.log(node);

    return (
        <InspectorCard
            title={nodeTypeLabel}
            description={nodeTypeDescription}
            icon={nodeIcon}
        />
    );
};

export default NodeInspectorCard;
