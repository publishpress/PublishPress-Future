import { useState, useCallback, useMemo } from '@wordpress/element';
import { __ } from "@wordpress/i18n";
import { VisuallyHidden, SearchControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Tips } from './tips';
import { NodeTypesTab } from './node-types-tab';
import InserterTabs from './tabs';

export function InserterMenu({
    onSelect,
    showInserterHelpPanel,
    showMostUsedBlocks,
    __experimentalFilterValue = '',
    shouldFocusBlock = true,
}) {
    const [filterValue, setFilterValue] = useState(
        __experimentalFilterValue
    );

    const [hoveredItem, setHoveredItem] = useState(null);
    const hasReusableBlocks = false;


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
        () => (
            <>
                <div className="block-editor-inserter__block-list">
                    <NodeTypesTab
                        onInsert={onInsert}
                        onHover={onHover}
                        showMostUsedBlocks={showMostUsedBlocks}
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
        ),
        [
            onInsert,
            onHover,
            filterValue,
            showMostUsedBlocks,
            showInserterHelpPanel,
        ]
    );

    const actionsTab = useMemo(
        () => (
            <>
                <div className="block-editor-inserter__block-list">
                    <NodeTypesTab
                        onInsert={onInsert}
                        onHover={onHover}
                        showMostUsedBlocks={showMostUsedBlocks}
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
        ),
        [
            onInsert,
            onHover,
            filterValue,
            showMostUsedBlocks,
            showInserterHelpPanel,
        ]
    );


    const getCurrentTab = useCallback(
        (tab) => {
            if (tab.name === 'triggers') {
                return triggersTab;
            }

            if (tab.name === 'actions') {
                return actionsTab;
            }

            // return reusableBlocksTab;

        },
        [triggersTab]
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
						<InserterTabs>
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
