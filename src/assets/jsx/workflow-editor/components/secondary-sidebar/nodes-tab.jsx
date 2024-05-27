/**
 * External dependencies
 */
import { map, flow, groupBy, orderBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useMemo, useEffect } from '@wordpress/element';
import { useAsyncList } from '@wordpress/compose';

import NodeTypesList from './node-types-list';
import InserterPanel from './panel';

/**
 * Internal dependencies
 */
import InserterListbox from './inserter-listbox';

export const NodesTab = ({
    items,
    categories,
    onInsert,
    onSelect,
    onHover,
    showMostUsedNodes
}) => {
    const MAX_SUGGESTED_ITEMS = 6;

    /**
     * Shared reference to an empty array for cases where it is important to avoid
     * returning a new array reference on every invocation and rerendering the component.
     *
     * @type {Array}
     */
    const EMPTY_ARRAY = [];

    const suggestedItems = useMemo(() => {
        return orderBy(items, ['frecency'], ['desc']).slice(
            0,
            MAX_SUGGESTED_ITEMS
        );
    }, [items]);

    const itemsPerCategory = useMemo(() => {
        return flow(
            (itemList) =>
                itemList.filter(
                    (item) => item.category && item.category !== 'reusable'
                ),
            (itemList) => groupBy(itemList, 'category')
        )(items);
    }, [items]);

    // Hide block preview on unmount.
    useEffect(() => () => onHover(null), []);

    const onSelectItem = (item) => {

    };

    /**
     * The inserter contains a big number of blocks and opening it is a costful operation.
     * The rendering is the most costful part of it, in order to improve the responsiveness
     * of the "opening" action, these lazy lists allow us to render the inserter category per category,
     * once all the categories are rendered, we start rendering the collections and the uncategorized block types.
     */
    const currentlyRenderedCategories = useAsyncList(categories);
    // const didRenderAllCategories = categories.length === currentlyRenderedCategories.length;

    return (
        <InserterListbox>
            <div>
                {showMostUsedNodes && suggestedItems.length > 0 && (
                    <InserterPanel title={_x('Most used', 'blocks', 'publishpress-future-pro')}>
                        <NodeTypesList
                            items={suggestedItems}
                            onSelect={onSelectItem}
                            onHover={onHover}
                            label={_x('Most used', 'blocks', 'publishpress-future-pro')}
                        />
                    </InserterPanel>
                )}

                {map(currentlyRenderedCategories, (category) => {
                    const categoryItems = itemsPerCategory[category.name];
                    if (!categoryItems || !categoryItems.length) {
                        return null;
                    }
                    return (
                        <InserterPanel
                            key={category.name}
                            title={category.label}
                            icon={category.icon}
                        >
                            <NodeTypesList
                                items={categoryItems}
                                onSelect={onSelectItem}
                                onHover={onHover}
                                label={category.label}
                            />
                        </InserterPanel>
                    );
                })}
            </div>
        </InserterListbox>
    );
}
