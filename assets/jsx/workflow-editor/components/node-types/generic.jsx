import { Handle, Position } from 'reactflow';
import { memo, useEffect, useRef } from '@wordpress/element';
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
        isPro,
    } = useSelect((select) => {
        const nodeErrors = select(workflowStore).getNodeErrors(id);
        const selectedElementsCount = select(workflowStore).getSelectedElementsCount();

        return {
            nodeErrors,
            nodeHasErrors: Object.keys(nodeErrors).length > 0,
            isAdvancedSettingsEnabled: true,
            isSingularElementSelected: selectedElementsCount === 1,
            getNodeTypeByName: select(editorStore).getNodeTypeByName,
            isPro: select(editorStore).isPro(),
        }
    });

    const {
        removeNode,
    } = useDispatch(workflowStore);

    const {
        openGeneralSidebar,
    } = useDispatch(editorStore);

    let nodeType = getNodeTypeByName(data.name);

    if (! nodeType || ! nodeType.handleSchema) {
        nodeType = {
            "id": Math.floor(Math.random() * 1000000),
            "type": "generic",
            "elementaryType": "action",
            "name": data.name,
            "label": sprintf(__('Unknown node: %s', 'post-expirator'), data.name),
            "description": __('This is a placeholder node for a node that does not exist.', 'post-expirator'),
            "baseSlug": "deletePost",
            "initiatlAttributes": [],
            "category": "post",
            "disabled": false,
            "isDisabled": false,
            "frecency": 1,
            "icon": {
                "src": "media-document",
                "background": "#ffffff",
                "foreground": "#1e1e1e"
            },
            "version": 1,
            "settingsSchema": [],
            "outputSchema": [
                {
                    "name": "input",
                    "type": "input",
                    "label": "Step input",
                    "description": "The input data for this step."
                }
            ],
            "className": "react-flow__node-unknownNode",
            "handleSchema": {
                "target": [
                    {
                        "id": "input",
                        "left": "50%"
                    }
                ],
                "source": [
                    {
                        "id": "output",
                        "left": "50%",
                        "label": "Next"
                    }
                ]
            },
            "isProFeature": false,
            "validationSchema": {
                "connections": {
                    "rules": []
                },
                "settings": {
                    "rules": []
                }
            }
        };
    }

    const nodeLabel = data.label || nodeType.label || __('Node', 'post-expirator');
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
                        className={'handle-target-' + handle.id}
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
                        className={'handle-source-' + handle.id}
                    />
                );
            });

            handleAreas = nodeType.handleSchema.source.map((handle) => {
                return (
                    <div
                        key={handle.id + 'handleArea'}
                        className={'react-flow__node-handle-name handle-area-source-' + handle.id}
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


    // Unfocus the tolbar button when the node is selected
    const nodeRef = useRef(null);
    useEffect(() => {
        if (selected && isSingularElementSelected) {
            setTimeout(() => {
                jQuery(nodeRef.current.parentNode).focus();
            }, 100);
        }
    }, [selected, isSingularElementSelected]);

    return (
        <>
            {selected && isSingularElementSelected && (
                <>
                    <Popover placement="top-start" offset={14}>
                        <Toolbar
                            label={__('Step actions', 'post-expirator')}
                            className="components-accessible-toolbar block-editor-block-contextual-toolbar react-flow__node-toolbar"
                        >
                            <ToolbarGroup>
                                <ToolbarButton
                                    icon={'trash'}
                                    label={__('Delete', 'post-expirator')}
                                    onClick={onClickDeleteNode}
                                    accessibleWhenDisabled={true}
                                />
                            </ToolbarGroup>
                        </Toolbar>
                    </Popover>
                </>
            )}

            <div
                className={"react-flow__node-body " + nodeClassName}
                onDoubleClick={onDoubleClick}
                ref={nodeRef}
            >
                {targetHandles}
                <div className='react-flow__node-top'>
                    {nodeTypeIcon}
                    {topText}
                </div>

                <div className='react-flow__node-inner-body'>

                    {(nodeHasErrors || (nodeType.isProFeature && !isPro)) && (
                        <div className='react-flow__node-marker-wrapper'>
                            {nodeType.isProFeature && !isPro && (
                                <div className='react-flow__node-pro-badge'
                                    title={__('Currently this step is being skipped. Upgrade to Pro to unlock this feature.', 'post-expirator')}
                                >
                                    <NodeIcon icon={'lock'} iconSize={8} />
                                </div>
                            )}

                            {nodeHasErrors && (
                                <div className='react-flow__node-error'
                                    title={__('This node has errors', 'post-expirator')}
                                >
                                    <NodeIcon icon={'exclamation'} iconSize={8} />
                                </div>
                            )}

                        </div>
                    )}

                    <div className='react-flow__node-header'>
                        <NodeIcon icon={nodeType.icon.src} iconSize={14} />
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
