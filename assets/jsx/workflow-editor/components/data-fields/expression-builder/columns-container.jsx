import { useState, useCallback } from "@wordpress/element";

const ColumnItem = ({ item, currentItemPath, handleClick, setCurrentDescription, onDoubleClick, path = [], index }) => {
    const hasChildren = item.children && item.children.length > 0;
    const currentColumnIndex = path.length;
    const selectedItemIndex = currentItemPath[currentColumnIndex];

    return <div
        className={`column-item ${selectedItemIndex === index ? 'selected' : ''} ${hasChildren ? 'has-children' : ''}`}
        onClick={() => handleClick([...path, index])}
        onMouseEnter={() => setCurrentDescription(item.description)}
        onDoubleClick={() => onDoubleClick(item)}
    >
        {item.name}
    </div>;
};

const RenderColumns = ({ currentItemPath, currentItems, handleClick, setCurrentDescription, onDoubleClick, path = [] }) => {
    if (!currentItems) return null;

    const currentColumnIndex = path.length;
    const selectedItemIndex = currentItemPath[currentColumnIndex];
    const currentItem = currentItems[selectedItemIndex];

    if (currentItem?.type === 'meta') {
        console.log(currentItem);
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
