import { useState, useCallback } from "@wordpress/element";

const RenderColumns = ({ currentItemPath, currentItems, handleClick, setCurrentDescription, path = [] }) => {
    if (!currentItems) return null;

    const currentColumnIndex = path.length;
    const selectedItemIndex = currentItemPath[currentColumnIndex];

    return (
        <>
            <div className="column" key={`column-${path.join('-')}`}>
                {currentItems.map((item, index) => {
                    const hasChildren = item.children && item.children.length > 0;

                    return <div
                        key={`column-item-${path.join('-')}-${index}`}
                        onClick={() => handleClick([...path, index])}
                        onMouseEnter={() => setCurrentDescription(item.description)}
                        onDoubleClick={() => onDoubleClick(item)}
                        className={`column-item ${selectedItemIndex === index ? 'selected' : ''} ${hasChildren ? 'has-children' : ''}`}
                    >
                        {item.name}
                    </div>;
                })}
            </div>

            {selectedItemIndex !== undefined && currentItems[selectedItemIndex]?.children && (
                <RenderColumns
                    currentItemPath={currentItemPath}
                    currentItems={currentItems[selectedItemIndex].children}
                    path={[...path, selectedItemIndex]}
                    handleClick={handleClick}
                    setCurrentDescription={setCurrentDescription}
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
