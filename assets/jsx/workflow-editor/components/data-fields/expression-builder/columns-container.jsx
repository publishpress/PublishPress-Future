import { useState, useCallback } from "@wordpress/element";
import { ColumnItem } from "./column-item";

const RenderColumns = ({ currentItemPath, currentItems, handleClick, setCurrentDescription, onDoubleClick, path = [] }) => {
    if (!currentItems) return null;

    const currentColumnIndex = path.length;
    const selectedItemIndex = currentItemPath[currentColumnIndex];
    const currentItem = currentItems[selectedItemIndex];

    if (currentItem?.type === 'meta') {
        currentItem.children = [
            {
                id: currentItem.id,
                name: 'metaKey',
                description: 'Type the meta key',
                type: 'meta-key-input'
            }
        ]
    }

    return (
        <>
            <div className="column" key={`column-${path.join('-')}`}>
                {currentItems.map((item, index) => {
                    return <ColumnItem
                        key={`column-item-${path.join('-')}-${index}`}
                        item={item}
                        currentItemPath={currentItemPath}
                        handleClick={handleClick}
                        setCurrentDescription={setCurrentDescription}
                        onDoubleClick={onDoubleClick}
                        path={[...path, index]}
                        index={index}
                    />;
                })}
            </div>

            {selectedItemIndex !== undefined && currentItem?.children && (
                <RenderColumns
                    currentItemPath={currentItemPath}
                    currentItems={currentItem.children}
                    path={[...path, selectedItemIndex]}
                    handleClick={handleClick}
                    setCurrentDescription={setCurrentDescription}
                    onDoubleClick={onDoubleClick}
                />
            )}
        </>
    );
};

export const ColumnsContainer = ({ items, setCurrentDescription, onDoubleClick }) => {
    const [currentItemPath, setCurrentItemPath] = useState([]);

    const handleClick = useCallback((path) => {
        setCurrentItemPath(path);

        const container = document.querySelector('.columns-container');
        if (container) {
            setTimeout(() => {
                container.scrollLeft = container.scrollWidth;
            }, 0);
        }
    }, [setCurrentItemPath]);

    return (
        <div className="columns-container">
            <RenderColumns
                currentItems={items}
                currentItemPath={currentItemPath}
                handleClick={handleClick}
                onDoubleClick={onDoubleClick}
                setCurrentDescription={setCurrentDescription}
            />
        </div>
    );
};

export default ColumnsContainer;
