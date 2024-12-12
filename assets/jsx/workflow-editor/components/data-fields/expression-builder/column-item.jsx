import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { TextControl, Button } from "@wordpress/components";

const ColumnItemVariable = ({ item, currentItemPath, handleClick, setCurrentDescription, onDoubleClick, path = [], index }) => {
    const hasChildren = item.children && item.children.length > 0;
    const currentColumnIndex = path.length;
    const selectedItemIndex = currentItemPath[currentColumnIndex];

    return <div
        className={`column-item ${selectedItemIndex === index ? 'selected' : ''} ${hasChildren ? 'has-children' : ''}`}
        onClick={() => handleClick([...path, index])}
        onMouseEnter={() => setCurrentDescription(`${item.description} {{${item.id}}}`)}
        onDoubleClick={() => onDoubleClick(item)}
    >
        {item.name}
    </div>;
};

export const ColumnItem = ({ item, currentItemPath, handleClick, setCurrentDescription, onDoubleClick, path = [], index }) => {
    const [metaKey, setMetaKey] = useState('');

    if (item?.type === 'text-input') {
        const metaItem = {
            id: item.id + '.' + metaKey,
        }

        return (
            <div className="column-item-form">
                <TextControl
                    label={item.name}
                    value={metaKey}
                    onChange={(value) => setMetaKey(value)}
                    help={item.description}
                />
                <Button variant="secondary" onClick={() => {onDoubleClick(metaItem)}}>
                    {__('Insert', 'post-expirator')}
                </Button>
            </div>
        );
    }

    return <ColumnItemVariable item={item} currentItemPath={currentItemPath} handleClick={handleClick} setCurrentDescription={setCurrentDescription} onDoubleClick={onDoubleClick} path={path} index={index} />;
};

export default ColumnItem;
