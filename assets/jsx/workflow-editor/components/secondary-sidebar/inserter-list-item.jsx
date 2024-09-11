/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useMemo, useRef, memo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import NodeIcon from '../node-icon';
import { InserterListboxItem } from './inserter-listbox';
import InserterDraggableNodes from './inserter-draggable-nodes';
import { isAppleOS } from '../../utils';
import { store as editorStore } from '../editor-store';
import { EVENT_DROP_NODE } from '../../constants';

function InserterListItem({
    className,
    isFirst,
    item,
    onSelect,
    onHover,
    isDraggable,
    ...props
}) {
    const isDragging = useRef(false);
    const itemIconStyle = item.icon
        ? {
            backgroundColor: item.icon.background,
            color: item.icon.foreground,
        }
        : {};
    const node = useMemo(() => {
        return item;
    }, [item.id, item.label, item.icon, item.disabled]);

    const { isPro } = useSelect((select) => {
        return {
            isPro: select(editorStore).isPro(),
        }
    });

    const classes = classnames(
        'block-editor-block-types-list__list-item',
        item.isProFeature && !isPro ? 'is-pro-feature' : '',
    );

    return (
        <InserterDraggableNodes
            isEnabled={isDraggable && !item.disabled}
            node={node}
            icon={item.icon}
        >
            {({ draggable, onDragStart, onDragEnd }) => (
                <div
                    className={classes}
                    draggable={draggable}
                    onDragStart={(event) => {
                        isDragging.current = true;

                        event.dataTransfer.setData(EVENT_DROP_NODE, JSON.stringify(item));

                        if (onDragStart) {
                            onHover(null);
                            onDragStart(event);
                        }
                    }}
                    onDragEnd={(event) => {
                        isDragging.current = false;
                        if (onDragEnd) {
                            onDragEnd(event);
                        }
                    }}
                >
                    <InserterListboxItem
                        isFirst={isFirst}
                        className={classnames(
                            'block-editor-block-types-list__item',
                            className
                        )}
                        disabled={item.isDisabled}
                        onClick={(event) => {
                            event.preventDefault();
                            onSelect(
                                item,
                                isAppleOS() ? event.metaKey : event.ctrlKey
                            );
                            onHover(null);
                        }}
                        onKeyDown={(event) => {
                            const { keyCode } = event;
                            if (keyCode === ENTER) {
                                event.preventDefault();
                                onSelect(
                                    item,
                                    isAppleOS() ? event.metaKey : event.ctrlKey
                                );
                                onHover(null);
                            }
                        }}
                        onFocus={() => {
                            if (isDragging.current) {
                                return;
                            }
                            onHover(item);
                        }}
                        onMouseEnter={() => {
                            if (isDragging.current) {
                                return;
                            }
                            onHover(item);
                        }}
                        onMouseLeave={() => onHover(null)}
                        onBlur={() => onHover(null)}
                        {...props}
                    >
                        <span
                            className="block-editor-block-types-list__item-icon"
                            style={itemIconStyle}
                        >
                            <NodeIcon icon={item.icon} showColors />
                        </span>

                        {item.isProFeature && !isPro && (
                            <span className="block-editor-block-types-list__item-pro-badge">
                                Pro
                            </span>
                        )}

                        <span className="block-editor-block-types-list__item-title">
                            {item.label}
                        </span>
                    </InserterListboxItem>
                </div>
            )}
        </InserterDraggableNodes>
    );
}

export default memo(InserterListItem);
