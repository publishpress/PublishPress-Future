import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';
import NodeIcon from '../node-icon';
import { IoMdPlay } from "react-icons/io";
import { useSelect } from "@wordpress/data";
import { store as workflowStore } from "../workflow-store";
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

export const GenericNode = memo(({ id, data, isConnectable }) => {
    const nodeClassName = data?.className || 'react-flow__node-genericNode';

    const {
        nodeErrors,
        nodeHasErrors,
        isAdvancedSettingsEnabled,
    } = useSelect((select) => {
        const nodeErrors = select(workflowStore).getNodeErrors(id);

        return {
            nodeErrors,
            nodeHasErrors: Object.keys(nodeErrors).length > 0,
            isAdvancedSettingsEnabled: true
        }
    });

    let targetHandles = null;
    if (data.socketSchema) {
        if (data.socketSchema.target) {
            targetHandles = data.socketSchema.target.map((handle) => {
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
    if (data.socketSchema) {
        if (data.socketSchema.source) {
            sourceHandles = data.socketSchema.source.map((handle) => {
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

            socketAreas = data.socketSchema.source.map((handle) => {
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

    return (
        <>
            <Tooltip text={__('Slug: ', 'publishpress-future-pro') + data.slug} placement="right-end">
                <div className={"react-flow__node-body " + nodeClassName}>
                    {targetHandles}
                    <div className='react-flow__node-top'>
                        <NodeIcon icon={IoMdPlay} size={8} />
                        {topText}
                    </div>

                    <div className='react-flow__node-inner-body'>
                        {nodeHasErrors && (
                            <div className='react-flow__node-error'>
                                <NodeIcon icon={'warning'} size={16} />
                            </div>
                        )}
                        <div className='react-flow__node-header'>
                            <NodeIcon icon={data.icon} size={14} />
                            <div className="react-flow__node-label">{data.label}</div>
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
            </Tooltip>
        </>
    );
});

export default GenericNode;
