import { memo, useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FiPlus } from "react-icons/fi";
import { Popover, SearchControl } from '@wordpress/components';
import { NodesTab } from '../secondary-sidebar/nodes-tab';
import { store as editorStore } from '../editor-store';
import { store as workflowStore } from '../workflow-store';
import { useSelect, useDispatch } from '@wordpress/data';
import {
    FEATURE_INSERTER,
    HANDLE_TYPE_SOURCE,
    INSERTER_TAB_TRIGGERS,
    NODE_TYPE_ACTION,
    NODE_TYPE_ADVANCED,
    NODE_TYPE_TRIGGER
} from '../../constants';
import InserterSearchResults from '../secondary-sidebar/inserter-search-results';
import { useReactFlow, addEdge } from 'reactflow';
import { createNewNode } from '../../utils';

export const Placeholder = memo(({id, label, popoverIsOpen = false, searchLabel, elementarTypes}) => {
    const nodeLabel = label || '';

    const nodeId = useRef(null);

    const reactFlowInstance = useReactFlow();

    const [inserterIsOpen, setInserterIsOpen] = useState(popoverIsOpen);
    const [filterValue, setFilterValue] = useState('');

    const {
        nodes,
        edges,
        items,
        categories,
        isSidebarInserterOpen,
        draggingFromHandle,
        getNodeTypeByName,
    } = useSelect((select) => {
        const triggerNodes = select(editorStore).getTriggerNodes();
        const actionNodes = select(editorStore).getActionNodes();
        const advancedNodes = select(editorStore).getAdvancedNodes();

        // FIXME: Fix this
        let items = [];
        if (! elementarTypes) {
            items = [...triggerNodes, ...actionNodes, ...advancedNodes];
        } else {
            if (elementarTypes.includes(NODE_TYPE_TRIGGER)) {
                items = items.concat(triggerNodes);
            }
            if (elementarTypes.includes(NODE_TYPE_ACTION)) {
                items = items.concat(actionNodes);
            }
            if (elementarTypes.includes(NODE_TYPE_ADVANCED)) {
                items = items.concat(advancedNodes);
            }
        }

        return {
            nodes: select(workflowStore).getNodes(),
            edges: select(workflowStore).getEdges(),
            items,
            categories: select(editorStore).getTriggerCategories(),
            isSidebarInserterOpen: select(editorStore).isFeatureActive(FEATURE_INSERTER),
            draggingFromHandle: select(workflowStore).getDraggingFromHandle(),
            getNodeTypeByName: select(editorStore).getNodeTypeByName,
        };
    });

    const {
        setEdges,
        setDraggingFromHandle,
    } = useDispatch(workflowStore);

    const onClickAddButton = (event) => {
        event.stopPropagation();

        setInserterIsOpen(true);
    }

    const onSelectItem = (item) => {
        const placeholderNode = nodes.find((node) => node.id === nodeId.current);

        const position = {
            x: placeholderNode.position.x,
            y: placeholderNode.position.y,
        };

        const newNode = createNewNode({
            item,
            position,
            reactFlowInstance
        });

        if (draggingFromHandle?.sourceId) {
            // Get the node type of the target node
            const nodeType = getNodeTypeByName(newNode.data.name);

            let firstTargetHandleId;
            let newEdgeParams;

            if (draggingFromHandle.handleType === HANDLE_TYPE_SOURCE) {
                firstTargetHandleId = nodeType.socketSchema.target[0].id;
                newEdgeParams = {
                    source: draggingFromHandle.sourceId,
                    sourceHandle: draggingFromHandle.handleId,
                    target: newNode.id,
                    targetHandle: firstTargetHandleId,
                    type: 'genericEdge',
                    id: `${draggingFromHandle.sourceId}-${draggingFromHandle.handleId}-${newNode.id}-${firstTargetHandleId}`,
                };
            } else {
                firstTargetHandleId = nodeType.socketSchema.source[0].id;
                newEdgeParams = {
                    source: newNode.id,
                    sourceHandle: firstTargetHandleId,
                    target: draggingFromHandle.sourceId,
                    targetHandle: draggingFromHandle.handleId,
                    type: 'genericEdge',
                    id: `${newNode.id}-${firstTargetHandleId}-${draggingFromHandle.sourceId}-${draggingFromHandle.handleId}`,
                };
            }

            // Get the target input handle
            setEdges(addEdge(newEdgeParams, edges));

            setDraggingFromHandle({sourceId: null, sourceHandle: null, handleType: null});
        }
    }

    useEffect(() => {
        if (isSidebarInserterOpen) {
            setInserterIsOpen(false);
        }
    }, [isSidebarInserterOpen]);

    useEffect(() => {
        if (! nodeId.current) {
            nodeId.current = id;
        }
    }, []);

    if (! searchLabel) {
        searchLabel = __('Search for steps', 'publishpress-future-pro');
    }

    return (
        <>
            {inserterIsOpen && (
                <Popover placement="bottom-start" offset={14} className='react-flow__node-inserter-popover'>
                    <SearchControl
                        className="block-editor-inserter__search"
                        onChange={(value) => {
                            setFilterValue(value);
                        }}
                        value={filterValue}
                        label={__('Search for triggers and steps', 'publishpress-future-pro')}
                        placeholder={__('Search')}
                    />
                    {!!filterValue && (
                        <InserterSearchResults
                            filterValue={filterValue}
                            onSelect={onSelectItem}
                            filterTypes={['trigger']}
                        />
                    )}

                    {!filterValue && (
                        <div className="block-editor-inserter__block-list">
                            <NodesTab
                                type={INSERTER_TAB_TRIGGERS}
                                onSelect={onSelectItem}
                                items={items}
                                categories={categories}
                            />
                        </div>
                    )}
                </Popover>
            )}
            <div className={"react-flow__node-body react-flow__node-triggerPlaceholderNode"} onClick={onClickAddButton}>
                <div className='react-flow__node-inner-body'>
                    <div className='react-flow__node-header'>
                        <div className='icon'>
                            <FiPlus />
                        </div>
                        <div className="react-flow__node-label">{nodeLabel}</div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Placeholder;
