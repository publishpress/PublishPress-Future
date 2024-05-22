import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const NodeInputPanel = ({ inputSchema = []}) => {

    if (!inputSchema) {
        inputSchema = [];
    }

    return (
        <PanelBody title={__("Inputs", "publishpress-future-pro")}>
            <div className="workflow-editor-inspector-card__input-schema">
                <div>{__("This node receives the following input from previous node:", "publishpress-future-pro")}</div>
                <ul>
                    {inputSchema.map((schemaItem, index) => (
                        <li key={index}>
                            <code>{schemaItem.name}</code>
                        </li>
                    ))}
                </ul>
            </div>
        </PanelBody>
    );
};

export default NodeInputPanel;
