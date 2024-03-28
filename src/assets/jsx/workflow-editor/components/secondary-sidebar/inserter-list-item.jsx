/**
 * External dependencies
 */
import { classnames } from '../../utils';

/**
 * WordPress dependencies
 */
import { useMemo, useRef, memo } from '@wordpress/element';

import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import NodeIcon from './node-icon';
import { InserterListboxItem } from './inserter-listbox';
import InserterDraggableNodes from './inserter-draggable-nodes';

/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window window object by default; used for DI testing.
 *
 * @return {boolean} True if MacOS; false otherwise.
 */
function isAppleOS(_window = window) {
    const { platform } = _window.navigator;

    return (
        platform.indexOf('Mac') !== -1 ||
        ['iPad', 'iPhone'].includes(platform)
    );
}

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
    }, [item.id, item.title, item.icon, item.disabled]);

    return (
        <InserterDraggableNodes
            isEnabled={isDraggable && !item.disabled}
            node={node}
            icon={item.icon}
        >
            {({ draggable, onDragStart, onDragEnd }) => (
                <div
                    className="block-editor-block-types-list__list-item"
                    draggable={draggable}
                    onDragStart={(event) => {
                        isDragging.current = true;
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
                        <span className="block-editor-block-types-list__item-title">
                            {item.title}
                        </span>
                    </InserterListboxItem>
                </div>
            )}
        </InserterDraggableNodes>
    );
}

export default memo(InserterListItem);
