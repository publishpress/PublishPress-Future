import { memo, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FiPlus } from "react-icons/fi";
import { Popover, SearchControl } from '@wordpress/components';
import { NodesTab } from '../secondary-sidebar/nodes-tab';
import { store as editorStore } from '../editor-store';
import { store as workflowStore } from '../workflow-store';
import { useSelect } from '@wordpress/data';
import { FEATURE_INSERTER, INSERTER_TAB_TRIGGERS } from '../../constants';
import InserterSearchResults from '../secondary-sidebar/inserter-search-results';
import { useReactFlow } from 'reactflow';
import { createNewNode } from '../../utils';

export const TriggerPlaceholder = memo(() => {
    const nodeLabel = __('Click to add a trigger', 'publishpress-future-pro');

    const reactFlowInstance = useReactFlow();

    const [inserterIsOpen, setInserterIsOpen] = useState(false);
    const [filterValue, setFilterValue] = useState('');

    const {
        nodes,
        items,
        categories,
        isSidebarInserterOpen,
    } = useSelect((select) => {
        const triggerNodes = select(editorStore).getTriggerNodes();

        return {
            nodes: select(workflowStore).getNodes(),
            items: [...triggerNodes],
            categories: select(editorStore).getTriggerCategories(),
            isSidebarInserterOpen: select(editorStore).isFeatureActive(FEATURE_INSERTER),
        };
    });

    const onClickAddButton = (event) => {
        event.stopPropagation();

        setInserterIsOpen(true);
    }

    const onSelectItem = (item) => {
        const placeholderNode = nodes.find((node) => node.type === 'triggerPlaceholder');

        const position = {
            x: placeholderNode.position.x,
            y: placeholderNode.position.y,
        };

        createNewNode({
            item,
            position,
            reactFlowInstance
        });
    }

    useEffect(() => {
        setInserterIsOpen(false);
    }, []);

    useEffect(() => {
        if (isSidebarInserterOpen) {
            setInserterIsOpen(false);
        }
    }, [isSidebarInserterOpen]);

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

export default TriggerPlaceholder;
