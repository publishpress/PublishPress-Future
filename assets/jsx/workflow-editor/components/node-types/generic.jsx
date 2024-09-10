import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';
import NodeIcon from '../node-icon';
import { useSelect, useDispatch } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarGroup, ToolbarButton, Popover } from '@wordpress/components';
import PlayIcon from "../icons/play";
import { SIDEBAR_NODE_EDGE } from '../settings-sidebar/constants';


export const GenericNode = memo(({ id, data, isConnectable, selected, nodeTypeIcon }) => {
    const {
        nodeErrors,
        nodeHasErrors,
        isAdvancedSettingsEnabled,
        isSingularElementSelected,
        getNodeTypeByName,
    } = useSelect((select) => {
        const nodeErrors = select(workflowStore).getNodeErrors(id);
        const selectedElementsCount = select(workflowStore).getSelectedElementsCount();

        return {
            nodeErrors,
            nodeHasErrors: Object.keys(nodeErrors).length > 0,
            isAdvancedSettingsEnabled: true,
            isSingularElementSelected: selectedElementsCount === 1,
            getNodeTypeByName: select(editorStore).getNodeTypeByName,
        }
    });

    const {
        removeNode,
    } = useDispatch(workflowStore);

    const {
        openGeneralSidebar,
    } = useDispatch(editorStore);

    const nodeType = getNodeTypeByName(data.name);
    const nodeLabel = nodeType.label || data.label || __('Node', 'post-expirator');
    const nodeClassName = nodeType?.className || 'react-flow__node-genericNode';

    let targetHandles = null;
    if (nodeType.handleSchema) {
        if (nodeType.handleSchema.target) {
            targetHandles = nodeType.handleSchema.target.map((handle) => {
                return (
                    <Handle
                        key={handle.id + '_target'}
                        type="target"
                        position={Position.Top}
                        id={handle.id}
                        style={{ left: handle.left}}
                        isConnectable={isConnectable}
                    />
                );
            });
        }
    }

    let sourceHandles = null;
    let handleAreas = null;
    if (nodeType.handleSchema) {
        if (nodeType.handleSchema.source) {
            sourceHandles = nodeType.handleSchema.source.map((handle) => {
                return (
                    <Handle
                        key={handle.id + '_source'}
                        type="source"
                        position={Position.Bottom}
                        id={handle.id}
                        style={{ left: handle.left }}
                        isConnectable={isConnectable}
                    />
                );
            });

            handleAreas = nodeType.handleSchema.source.map((handle) => {
                return (
                    <div
                        key={handle.id + 'handleArea'}
                        className='react-flow__node-handle-name'
                    >
                        {handle.label}
                    </div>
                );
            });
        }
    }

    let topText = __('Step', 'post-expirator');
    if (data.elementaryType === 'action') {
        topText = __('Action', 'post-expirator');
    } else if (data.elementaryType === 'advanced') {
        topText = __('Advanced', 'post-expirator');
    } else if (data.elementaryType === 'trigger') {
        topText = __('Trigger', 'post-expirator');
    }

    const nodeAttributes = [
        // {
        //     id: 'id',
        //     label: __('ID', 'post-expirator'),
        //     value: id,
        // },
        // {
        //     id: 'slug',
        //     label: __('Slug', 'post-expirator'),
        //     value: data.slug,
        // },
    ];

    const onClickDeleteNode = () => {
        removeNode(id);
    };

    const onDoubleClick = () => {
        if (isSingularElementSelected) {
            openGeneralSidebar(SIDEBAR_NODE_EDGE);
        }
    }

    if (! nodeTypeIcon) {
        nodeTypeIcon = <PlayIcon size={8} />;
    }

    return (
        <>
            {selected && isSingularElementSelected && (
                <>
                    <Popover placement="top-start" offset={14}>
                        <Toolbar className="components-accessible-toolbar block-editor-block-contextual-toolbar react-flow__node-toolbar">
                            <ToolbarGroup>
                                <ToolbarButton
                                    icon={'trash'}
                                    label={__('Delete', 'post-expirator')}
                                    onClick={onClickDeleteNode}
                                />
                            </ToolbarGroup>
                        </Toolbar>
                    </Popover>
                </>
            )}

            <div className={"react-flow__node-body " + nodeClassName} onDoubleClick={onDoubleClick}>
                {targetHandles}
                <div className='react-flow__node-top'>
                    {nodeTypeIcon}
                    {topText}
                </div>

                <div className='react-flow__node-inner-body'>
                    {nodeHasErrors && (
                        <div className='react-flow__node-error'>
                            <NodeIcon icon={'error'} size={16} />
                        </div>
                    )}
                    <div className='react-flow__node-header'>
                        <NodeIcon icon={nodeType.icon.src} size={14} />
                        <div className="react-flow__node-label">{nodeLabel}</div>
                    </div>
                    {isAdvancedSettingsEnabled && nodeAttributes.length > 0 &&
                        <div className='react-flow__node-content'>
                            <table>
                                <tbody>
                                    {nodeAttributes.map((attribute) => {
                                        return (
                                            <tr key={'attribute_' + attribute.id}>
                                                <th>{attribute.label}</th>
                                                <td>{attribute.value}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <div className='react-flow__node-handle-area'>
                    {handleAreas}
                </div>

                {sourceHandles}
            </div>
        </>
    );
});

export default GenericNode;
