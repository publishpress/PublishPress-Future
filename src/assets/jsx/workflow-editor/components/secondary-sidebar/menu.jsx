import { useState, useCallback, useMemo } from '@wordpress/element';
import { __ } from "@wordpress/i18n";
import { VisuallyHidden, SearchControl } from '@wordpress/components';
import { useSelect, select } from '@wordpress/data';
import { Tips } from './tips';
import { NodesTab } from './nodes-tab';
import InserterTabs from './tabs';
import { INSERTER_TAB_ACTIONS, INSERTER_TAB_TRIGGERS } from '../../constants';
import { store } from '../../store';
import { useDispatch } from '@wordpress/data';

export function InserterMenu({
    onSelect,
    showInserterHelpPanel,
    showMostUsedNodes,
    __experimentalFilterValue = '',
    shouldFocusBlock = true,
}) {
    const [filterValue, setFilterValue] = useState(
        __experimentalFilterValue
    );

    const [hoveredItem, setHoveredItem] = useState(null);

    const { currentInserterTab } = useSelect((select) => {
        return {
            currentInserterTab: select(store).getCurrentInserterTab(),
        };
    }, []);
    const { setCurrentInserterTab } = useDispatch(store);

    const onInsert = useCallback(
        (blocks, meta, shouldForceFocusBlock) => {
            onSelect();
        },
        [onSelect]
    );

    const onHover = useCallback(
        (item) => {
            setHoveredItem(item);
        },
        [setHoveredItem]
    );

    const triggersTab = useMemo(
        () => {
            const items = select(store).getTriggerNodes();
            const categories = select(store).getTriggerCategories();

            return (
                <>
                    <div className="block-editor-inserter__block-list">
                        <NodesTab
                            type={INSERTER_TAB_TRIGGERS}
                            onInsert={onInsert}
                            onHover={onHover}
                            showMostUsedNodes={showMostUsedNodes}
                            items={items}
                            categories={categories}
                        />
                    </div>
                    {showInserterHelpPanel && (
                        <div className="block-editor-inserter__tips">
                            <VisuallyHidden as="h2">
                                {__('A tip for using the block editor')}
                            </VisuallyHidden>
                            <Tips />
                        </div>
                    )}
                </>
            );
        },
        [
            onInsert,
            onHover,
            filterValue,
            showMostUsedNodes,
            showInserterHelpPanel,
        ]
    );

    const actionsTab = useMemo(
        () => {
            const items = select(store).getActionNodes();
            const categories = select(store).getActionCategories();

            return (
                <>
                    <div className="block-editor-inserter__block-list">
                        <NodesTab
                            type={INSERTER_TAB_ACTIONS}
                            onInsert={onInsert}
                            onHover={onHover}
                            showMostUsedNodes={showMostUsedNodes}
                            items={items}
                            categories={categories}
                        />
                    </div>
                    {showInserterHelpPanel && (
                        <div className="block-editor-inserter__tips">
                            <VisuallyHidden as="h2">
                                {__('A tip for using the block editor')}
                            </VisuallyHidden>
                            <Tips />
                        </div>
                    )}
                </>
            );
        },
        [
            onInsert,
            onHover,
            filterValue,
            showMostUsedNodes,
            showInserterHelpPanel,
        ]
    );


    const getCurrentTab = useCallback(
        (tab) => {
            if (tab.name === INSERTER_TAB_TRIGGERS) {
                return triggersTab;
            }

            if (tab.name === INSERTER_TAB_ACTIONS) {
                return actionsTab;
            }
        },
        [triggersTab, actionsTab]
    );

    const onSelectTab = useCallback(
        (tab) => {
            setCurrentInserterTab(tab);
        },
        [setCurrentInserterTab]
    );

    return (
        <div className="block-editor-inserter__menu">
            <div className="block-editor-inserter__main-area">
                { /* the following div is necessary to fix the sticky position of the search form */}
                <div className="block-editor-inserter__content">
                    <SearchControl
                        className="block-editor-inserter__search"
                        onChange={(value) => {
                            if (hoveredItem) setHoveredItem(null);
                            setFilterValue(value);
                        }}
                        value={filterValue}
                        label={__('Search for blocks and patterns')}
                        placeholder={__('Search')}
                    />
                    {/* { !! filterValue && (
						<InserterSearchResults
							filterValue={ filterValue }
							onSelect={ onSelect }
							onHover={ onHover }
							rootClientId={ rootClientId }
							clientId={ clientId }
							isAppender={ isAppender }
							__experimentalInsertionIndex={
								__experimentalInsertionIndex
							}
							showBlockDirectory
							shouldFocusBlock={ shouldFocusBlock }
						/>
					) }
                    */ }

                    { ! filterValue && (
						<InserterTabs
                            onSelect={onSelectTab}
                            initialTabName={currentInserterTab}
                        >
							{ getCurrentTab }
						</InserterTabs>
					) }
                </div>
            </div>
            {showInserterHelpPanel && hoveredItem && (
                <InserterPreviewPanel item={hoveredItem} />
            )}
        </div>
    );
}
