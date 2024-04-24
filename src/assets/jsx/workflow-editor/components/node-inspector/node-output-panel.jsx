import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const NodeOutputPanel = ({ outputSchema }) => {
    return (
        <PanelBody title={__("Outputs", "publishpress-future-pro")}>
            <div className="workflow-editor-inspector-card__output-schema">
                <div>{__("This node outputs the following data:", "publishpress-future-pro")}</div>
                <ul>
                    {outputSchema.map((schemaItem, index) => (
                        <li key={index}>
                            <code>{schemaItem.label}</code>
                        </li>
                    ))}
                </ul>
            </div>
        </PanelBody>
    );
};

export default NodeOutputPanel;
