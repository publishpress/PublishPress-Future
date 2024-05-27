import {
    PanelBody,
    __experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as workflowStore } from '../workflow-store';
import { useSelect } from '@wordpress/data';

export const WorkflowGlobalVariables = () => {
    const {
        isLoadingWorkflow,
        globalVariables,
        getDataTypeByName,
    } = useSelect((select) => {
        return {
            isLoadingWorkflow: select(workflowStore).isLoadingWorkflow(),
            globalVariables: select(workflowStore).getGlobalVariables(),
            getDataTypeByName: select(workflowStore).getDataTypeByName,
        }
    });

    const variablesNames = Object.keys(globalVariables);

    return (
        <PanelBody
            title={__('Global Variables', 'publishpress-future-pro')}
            initialOpen={true}
            disabled={isLoadingWorkflow}
            className='workflow-editor-global-variables-panel'
        >
            <VStack>
                {isLoadingWorkflow &&
                    <div>
                        {__('Loading...', 'publishpress-future-pro')}
                    </div>
                }

                {!isLoadingWorkflow && variablesNames.length === 0 &&
                    <div>
                        {__('No global variables are declared', 'publishpress-future-pro')}
                    </div>
                }

                <div className='workflow-editor-global-variables-label'>
                    {__('Variables list', 'publishpress-future-pro')}
                </div>

                {!isLoadingWorkflow && variablesNames.length > 0 && (
                    <ul className='workflow-editor-inspector-card__input-schema'>
                        {variablesNames.map((variableName) => {
                            const variable = globalVariables[variableName];
                            const dataType = getDataTypeByName(variable.type);

                            return (
                                <li key={variableName}>
                                    <div></div>
                                    <ul>
                                        {dataType && dataType.propertiesSchema.map((property) => {
                                            return (
                                                <li key={variableName + property.name}>
                                                    <code>{`global.${variable.name}.${property.name}`}</code>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <div className='workflow-editor-global-variables-description'>
                    {__('Global variables are available to all nodes in the workflow that accepts variables.', 'publishpress-future-pro')}
                </div>
            </VStack>
        </PanelBody>
    );
};

export default WorkflowGlobalVariables;
