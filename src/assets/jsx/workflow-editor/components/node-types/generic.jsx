import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';
import NodeIcon from '../node-icon';
import { useSelect, useDispatch } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarGroup, ToolbarButton, Popover } from '@wordpress/components';
import PlayIcon from "../icons/play";


export const GenericNode = memo(({ id, data, isConnectable, selected }) => {
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

    const nodeType = getNodeTypeByName(data.name);
    const nodeLabel = nodeType.label || data.label || __('Node', 'publishpress-future-pro');
    const nodeClassName = nodeType?.className || 'react-flow__node-genericNode';

    let targetHandles = null;
    if (nodeType.socketSchema) {
        if (nodeType.socketSchema.target) {
            targetHandles = nodeType.socketSchema.target.map((handle) => {
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
    let socketAreas = null;
    if (nodeType.socketSchema) {
        if (nodeType.socketSchema.source) {
            sourceHandles = nodeType.socketSchema.source.map((handle) => {
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

            socketAreas = nodeType.socketSchema.source.map((handle) => {
                return (
                    <div
                        key={handle.id + 'socketArea'}
                        className='react-flow__node-socket-name'
                    >
                        {handle.label}
                    </div>
                );
            });
        }
    }

    let topText = __('Step', 'publishpress-future-pro');
    if (data.elementarType === 'action') {
        topText = __('Action', 'publishpress-future-pro');
    } else if (data.elementarType === 'advanced') {
        topText = __('Advanced', 'publishpress-future-pro');
    } else if (data.elementarType === 'trigger') {
        topText = __('Trigger', 'publishpress-future-pro');
    }

    const nodeAttributes = [
        // {
        //     id: 'id',
        //     label: __('ID', 'publishpress-future-pro'),
        //     value: id,
        // },
        // {
        //     id: 'slug',
        //     label: __('Slug', 'publishpress-future-pro'),
        //     value: data.slug,
        // },
    ];

    const onClickDeleteNode = () => {
        removeNode(id);
    };

    return (
        <>
            {selected && isSingularElementSelected && (
                <>
                    <Popover placement="top-start" offset={14}>
                        <Toolbar className="components-accessible-toolbar block-editor-block-contextual-toolbar react-flow__node-toolbar">
                            <ToolbarGroup>
                                <ToolbarButton
                                    icon={'trash'}
                                    label={__('Delete', 'publishpress-future-pro')}
                                    onClick={onClickDeleteNode}
                                />
                            </ToolbarGroup>
                        </Toolbar>
                    </Popover>
                </>
            )}

            <div className={"react-flow__node-body " + nodeClassName}>
                {targetHandles}
                <div className='react-flow__node-top'>
                    <PlayIcon size={8} />
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

                <div className='react-flow__node-socket-area'>
                    {socketAreas}
                </div>

                {sourceHandles}
            </div>
        </>
    );
});

export default GenericNode;
