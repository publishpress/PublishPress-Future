import { useSelect } from '@wordpress/data';
import { store as workflowStore } from '../workflow-store';
import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalHStack as HStack } from '@wordpress/components';
import { Icon } from '@wordpress/components';
import { GrObjectGroup } from "react-icons/gr";
import { FaLinesLeaning } from "react-icons/fa6";
import { sprintf } from '@wordpress/i18n';

export const NodeInspector = () => {
    const {
        selectedNodes,
        selectedEdges,
        selectedElementsCount,
        selectedNode,
        selectedEdge,
    } = useSelect((select) => {
        const selectedNodes = select(workflowStore).getSelectedNodes();
        const selectedEdges = select(workflowStore).getSelectedEdges();
        const getNodeById = select(workflowStore).getNodeById;
        const getEdgeById = select(workflowStore).getEdgeById;

        const selectedNode = selectedNodes.length === 1 ? getNodeById(selectedNodes[0]) : null;
        const selectedEdge = selectedEdges.length === 1 ? getEdgeById(selectedEdges[0]) : null;

        return {
            selectedNodes,
            selectedEdges,
            selectedElementsCount: select(workflowStore).getSelectedElementsCount(),
            selectedNode,
            selectedEdge,
        };
    });

    const onlyNodesSelected = selectedNodes.length > 0 && selectedEdges.length === 0;
    const onlyEdgesSelected = selectedNodes.length === 0 && selectedEdges.length > 0;

    const WarningSpan = ({children}) => {
        return (
            <span className='workflow-editor-element-inspector__warning'>
                {children}
            </span>
        );
    }

    const InspectorCard = ({title, description, icon }) => {
        return (
            <div className='workflow-editor-inspector-card'>
                <span className='workflow-editor-inspector-icon has-colors'>
                    {icon}
                </span>
                <div className='workflow-editor-inspector-card__content'>
                    <h2 className='workflow-editor-inspector-card__title'>{title}</h2>
                    <div className='workflow-editor-inspector-card__description'>{description}</div>
                </div>
            </div>
        );
    }

    const nodeTypeLabels = {
        'action': __('Action', 'publishpress-future-pro'),
        'trigger': __('Trigger', 'publishpress-future-pro'),
        'condition': __('Condition', 'publishpress-future-pro'),
    }

    const nodeTypeDescriptions = {
        'action': __('An action is a task that can be executed by the workflow.', 'publishpress-future-pro'),
        'trigger': __('A trigger is an event that starts the workflow.', 'publishpress-future-pro'),
        'condition': __('A condition is a rule that must be met for the workflow to continue.', 'publishpress-future-pro'),
    }

    const nodeTypeLabel = selectedNode ? nodeTypeLabels[selectedNode.data.type] : '';
    const nodeTypeDescription = selectedNode ? nodeTypeDescriptions[selectedNode.data.type] : '';

    return (
        <HStack className="editor-element-inspector__panel">
            {selectedElementsCount === 0 && (
                <WarningSpan>
                    {__('No element selected.', 'publishpress-future-pro')}
                </WarningSpan>
            )}

            {selectedElementsCount > 1 && (!onlyNodesSelected && !onlyEdgesSelected) && (
                <WarningSpan>
                    {__('Multiple and different elements selected.', 'publishpress-future-pro')}
                </WarningSpan>
            )}

            {onlyNodesSelected && selectedElementsCount > 1 && (
                <InspectorCard
                    title={sprintf(__('%d nodes selected', 'publishpress-future-pro'), selectedElementsCount)}
                    description={__('Multiple nodes selected.', 'publishpress-future-pro')}
                    icon={<GrObjectGroup />}
                />
            )}

            {onlyEdgesSelected && selectedElementsCount > 1 && (
                <InspectorCard
                    title={sprintf(__('%d edges selected', 'publishpress-future-pro'), selectedElementsCount)}
                    description={__('Multiple edges selected.', 'publishpress-future-pro')}
                    icon={<FaLinesLeaning />}
                />
            )}

            {onlyNodesSelected && selectedElementsCount === 1 && (
                <>
                    <InspectorCard
                        title={nodeTypeLabel}
                        description={nodeTypeDescription}
                        icon={<GrObjectGroup />}
                    />
                    <div className='components-tools-panel'></div>
                </>
            )}

            {onlyEdgesSelected && selectedElementsCount === 1 && (
                <>
                <InspectorCard
                    title={__('Edge', 'publishpress-future-pro')}
                    description={__('A connection between nodes', 'publishpress-future-pro')}
                    icon={<FaLinesLeaning />}
                />
                <div className='components-tools-panel'></div>
            </>
            )}
        </HStack>
    );
}

export default NodeInspector;
