import { PanelRow, Animate } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PersistentPanelBody from "../persistent-panel-body";
import { useSelect } from "@wordpress/data";
import { store as workflowStore } from '../workflow-store';
import NodeIcon from "../node-icon";
import { useState } from "@wordpress/element";

export const NodeDataFlowPanel = ({ inputSchema = [], outputSchema = []}) => {
    const {
        isLoadingWorkflow,
        getDataTypeByName,
        globalVariables,
    } = useSelect((select) => {
        return {
            isLoadingWorkflow: select(workflowStore).isLoadingWorkflow(),
            getDataTypeByName: select(workflowStore).getDataTypeByName,
            globalVariables: select(workflowStore).getGlobalVariables(),
        };
    });

    const globalVariableNames = Object.keys(globalVariables);

    if (!inputSchema) {
        inputSchema = [];
    }

    const Variable = ({schemaItem, prefix}) => {
        const [isOpen, setIsOpen] = useState(false);

        const togglePopover = () => {
            setIsOpen(!isOpen);
        }

        const properties = getDataTypeByName(schemaItem.type).propertiesSchema.map(property => <li key={`${schemaItem.name}${property.name}`}><code>{property.name}</code></li>);

        return (
            <>
                <div onClick={togglePopover} className="workflow-editor-data-flow-variable">
                    <NodeIcon icon={isOpen ? 'arrow-down' : 'arrow-right'} />
                    <code>{prefix}{schemaItem.name}</code>

                    {isOpen && (
                        <Animate type="slide-in" options={{origin: 'top'}}>
                            {({ className }) => (
                                <ul>
                                    {properties}
                                </ul>
                            )}
                        </Animate>
                    )}
                </div>
            </>
        );
    };

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
                                        <Variable schemaItem={schemaItem} />
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
                                        <Variable schemaItem={schemaItem} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {outputSchema.length === 0 && __("This step does not output any data.", "publishpress-future-pro")}
                </div>
            </PanelRow>

            <PanelRow className="workflow-editor-inspector-card__handles-schema">
                <h3>{__('Global Variables', 'publishpress-future-pro')}</h3>
                <div>
                    {!isLoadingWorkflow && globalVariableNames.length === 0 &&
                        <div>
                            {__('No global variables are declared', 'publishpress-future-pro')}
                        </div>
                    }

                    {!isLoadingWorkflow && globalVariableNames.length > 0 && (
                        <ul>
                            {globalVariableNames.map((variableName) => {
                                return (
                                    <li key={`global-${variableName}`}>
                                        <Variable schemaItem={globalVariables[variableName]} prefix="global." />
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </PanelRow>
        </PersistentPanelBody>
    );
};

export default NodeDataFlowPanel;
