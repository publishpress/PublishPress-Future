import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const NodeInputPanel = ({ inputSchema = []}) => {
    return (
        <PanelBody title={__("Inputs", "publishpress-future-pro")}>
            <div className="workflow-editor-inspector-card__input-schema">
                <div>{__("This node receives the following input from previous node:", "publishpress-future-pro")}</div>
                <ul>
                    {inputSchema.map((schemaItem, index) => (
                        <li key={index}>
                            <strong>{schemaItem.label}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </PanelBody>
    );
};

export default NodeInputPanel;
