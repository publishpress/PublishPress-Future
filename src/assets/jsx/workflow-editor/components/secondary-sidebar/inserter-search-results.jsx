/**
 * External dependencies
 */
import { orderBy, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo, useEffect } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { VisuallyHidden } from '@wordpress/components';
import { useDebounce, useAsyncList } from '@wordpress/compose';
import { speak } from '@wordpress/a11y';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import NodeTypesList from './node-types-list';
import InserterPanel from './panel';
import { searchNodeItems } from './search-items';
import { InserterListbox } from './inserter-listbox';
import { InserterNoResults } from './inserter-no-results';
import { store as editorStore } from '../editor-store';

const INITIAL_INSERTER_RESULTS = 9;

export const InserterSearchResults = ({
    filterValue,
    onSelect,
    onHover,
    maxNodeTypes,
    isDraggable = true,
}) => {
    const debouncedSpeak = useDebounce(speak, 500);

    const {
        nodeTypes,
        nodeTypeCategories,
    } = useSelect((select) => {
        const actionNodes = select(editorStore).getActionNodes();
        const actionCategories = select(editorStore).getActionCategories();
        const triggerNodes = select(editorStore).getTriggerNodes();
        const triggerCategories = select(editorStore).getTriggerCategories();
        const flowNodes = select(editorStore).getFlowNodes();
        const flowCategories = select(editorStore).getFlowCategories();

        const nodeTypes = [
            ...actionNodes,
            ...triggerNodes,
            ...flowNodes,
        ];

        const nodeTypeCategories = [
            ...actionCategories,
            ...triggerCategories,
            ...flowCategories,
        ];

        return {
            nodeTypes: nodeTypes,
            nodeTypeCategories: nodeTypeCategories,
        };
    });


    const filteredNodeTypes = useMemo(() => {
        const results = searchNodeItems(
            orderBy(nodeTypes, ['frecency'], ['desc']),
            nodeTypeCategories,
            filterValue
        );

        return maxNodeTypes !== undefined
            ? results.slice(0, maxNodeTypes)
            : results;
    }, [
        filterValue,
        nodeTypes,
        nodeTypeCategories,
        maxNodeTypes,
    ]);

    // Announce search results on change
    useEffect(() => {
        if (!filterValue) {
            return;
        }
        const count = filteredNodeTypes.length;
        const resultsFoundMessage = sprintf(
            /* translators: %d: number of results. */
            _n('%d result found.', '%d results found.', count),
            count
        );
        debouncedSpeak(resultsFoundMessage);
    }, [filterValue, debouncedSpeak, filteredNodeTypes]);

    const currentShownNodeTypes = useAsyncList(filteredNodeTypes, {
        step: INITIAL_INSERTER_RESULTS,
    });

    const hasItems = !isEmpty(filteredNodeTypes);

    return (
        <InserterListbox>
            {!hasItems && <InserterNoResults />}

            {!!hasItems && (
                <InserterPanel
                    title={
                        <VisuallyHidden>{__('Nodes')}</VisuallyHidden>
                    }
                >
                    <NodeTypesList
                        items={currentShownNodeTypes}
                        onSelect={onSelect}
                        onHover={onHover}
                        label={__('Nodes')}
                        isDraggable={isDraggable}
                    />
                </InserterPanel>
            )}

            {/* {!!hasItems &&
                (
                    <div className="block-editor-inserter__quick-inserter-separator" />
                )} */}
        </InserterListbox>
    );
}

export default InserterSearchResults;
