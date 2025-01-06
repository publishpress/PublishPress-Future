import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { TextControl, Button } from "@wordpress/components";

const ColumnItemMeta = ({ item, onClick }) => {
    const [metaKey, setMetaKey] = useState('');

    const metaItem = {
        name: item.name + '.' + metaKey,
        label: 'Metadata key',
        description: 'Type the meta key and click on the button to insert it.',
    }

    return (
        <div className="column-item-form">
            <TextControl
                label={item.label}
                value={metaKey}
                onChange={(value) => setMetaKey(value)}
                help={item.description}
            />
            <Button variant="secondary" onClick={() => {onClick(metaItem)}}>
                {__('Insert', 'post-expirator')}
            </Button>
        </div>
    );
}

const ColumnItemVariable = ({
    item,
    currentItemPath,
    onClick,
    setCurrentDescription,
    setCurrentVariableId,
    onDoubleClick,
    path = [],
    index
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const currentColumnIndex = path.length - 1;
    const selectedItemIndex = currentItemPath[currentColumnIndex];

    const onMouseEnter = () => {
        setCurrentDescription(`${item.description}`);
        setCurrentVariableId(item.name);
    }

    return <div
        className={`column-item ${selectedItemIndex === index ? 'selected' : ''} ${hasChildren ? 'has-children' : ''}`}
        onClick={() => onClick(path, currentColumnIndex, index)}
        onMouseEnter={onMouseEnter}
        onDoubleClick={() => onDoubleClick(item)}
    >
        {item.label}
    </div>;
};

export const ColumnItem = ({
    item,
    currentItemPath,
    onClick,
    setCurrentDescription,
    setCurrentVariableId,
    onDoubleClick,
    path = [],
    index
}) => {
    if (item?.type === 'meta-key-input') {
        return <ColumnItemMeta item={item} onClick={onDoubleClick} />;
    }

    return <ColumnItemVariable
        item={item}
        currentItemPath={currentItemPath}
        onClick={onClick}
        setCurrentDescription={setCurrentDescription}
        setCurrentVariableId={setCurrentVariableId}
        onDoubleClick={onDoubleClick}
        path={path}
        index={index}
    />;
};

export default ColumnItem;
