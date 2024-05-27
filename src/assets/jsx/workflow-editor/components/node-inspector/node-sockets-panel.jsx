import { PanelRow } from "@wordpress/components";
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const NodeSocketsPanel = ({ inputSchema = [], outputSchema = []}) => {

    if (!inputSchema) {
        inputSchema = [];
    }

    return (
        <PanelBody title={__("Sockets", "publishpress-future-pro")} className="workflow-editor-dev-panel">
            <PanelRow className="workflow-editor-inspector-card__sockets-schema">
                <h3>{__('Inputs', 'publishpress-future-pro')}</h3>
                <div>
                    <div>{__("This step receives the following input from previous step:", "publishpress-future-pro")}</div>
                    <ul>
                        {inputSchema.map((schemaItem, index) => (
                            <li key={index}>
                                <code>{schemaItem.name}</code>
                            </li>
                        ))}
                    </ul>
                </div>
            </PanelRow>
            <PanelRow className="workflow-editor-inspector-card__sockets-schema">
                <h3>{__('Outputs', 'publishpress-future-pro')}</h3>
                <div>
                    <div>{__("This step outputs the following data:", "publishpress-future-pro")}</div>
                    <ul>
                    {outputSchema.map((schemaItem, index) => (
                        <li key={index}>
                            <code>{schemaItem.name}</code>
                        </li>
                    ))}
                </ul>
                </div>
            </PanelRow>
        </PanelBody>
    );
};

export default NodeSocketsPanel;
