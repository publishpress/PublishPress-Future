import { PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PersistentPanelBody from "../persistent-panel-body";
import { useSelect } from "@wordpress/data";
import { store as workflowStore } from '../workflow-store';

export const NodeDataFlowPanel = ({ inputSchema = [], outputSchema = []}) => {
    const {
        getDataTypeByName,
    } = useSelect((select) => {
        return {
            getDataTypeByName: select(workflowStore).getDataTypeByName,
        };
    });

    if (!inputSchema) {
        inputSchema = [];
    }

    return (
        <PersistentPanelBody title={__("Step Data Flow", "publishpress-future-pro")}>
            <PanelRow className="workflow-editor-inspector-card__handles-schema">
                <h3>{__('Inputs', 'publishpress-future-pro')}</h3>
                <div>
                    {inputSchema.length > 0 && (
                        <>
                            <div>{__("This step receives the following input from previous step:", "publishpress-future-pro")}</div>
                            <ul>
                                {inputSchema.map((schemaItem, index) => (
                                    <li key={`input-${schemaItem.name}-${index}`}>
                                        <span title={(getDataTypeByName(schemaItem.type)).propertiesSchema.map(property => property.name).join(',')}><code>{schemaItem.name}</code></span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {inputSchema.length === 0 && __("This step does not receive any input from previous step.", "publishpress-future-pro")}
                </div>
            </PanelRow>

            <PanelRow className="workflow-editor-inspector-card__handles-schema">
                <h3>{__('Outputs', 'publishpress-future-pro')}</h3>
                <div>
                    {outputSchema.length > 0 && (
                        <>
                        <div>{__("This step outputs the following data:", "publishpress-future-pro")}</div>
                        <ul>
                            {outputSchema.map((schemaItem, index) => (
                                <li key={`output-${schemaItem.name}-${index}`}>
                                    <span title={(getDataTypeByName(schemaItem.type)).propertiesSchema.map(property => property.name).join(',')}><code>{schemaItem.name}</code></span>
                                </li>
                            ))}
                        </ul>
                        </>
                    )}

                    {outputSchema.length === 0 && __("This step does not output any data.", "publishpress-future-pro")}
                </div>
            </PanelRow>
        </PersistentPanelBody>
    );
};

export default NodeDataFlowPanel;
