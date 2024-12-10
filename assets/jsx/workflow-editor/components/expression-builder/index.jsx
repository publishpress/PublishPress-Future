import {
    Button,
    TextControl,
    Popover,
    TextareaControl,
    __experimentalHStack as HStack,
    __experimentalHeading as Heading
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element"

import './style.css';


const items = [
    {
        name: 'global',
        label: 'Global',
        items: [
            {
                name: 'site',
                label: 'Site',
                items: [
                    {
                        name: 'name',
                        label: 'Name',
                    },
                    {
                        name: 'url',
                        label: 'URL',
                    }
                ]
            },
            {
                name: 'user',
                label: 'User',
                items: [
                    {
                        name: 'name',
                        label: 'Name',
                    },
                    {
                        name: 'email',
                        label: 'Email',
                    }
                ]
            }
        ]
    },
    {
        name: 'onPostUpdated1',
        label: 'Post Updated',
        items: [
            {
                id: 'postBefore ',
                label: 'Post before',
                items: [
                    {
                        name: 'title',
                        label: 'Title',
                    },
                    {
                        name: 'status',
                        label: 'Status',
                    }
                ]
            },
            {
                id: 'postAfter',
                label: 'Post after',
                items: [
                    {
                        name: 'title',
                        label: 'Title',
                    },
                    {
                        name: 'status',
                        label: 'Status',
                    },
                    {
                        name: 'author',
                        label: 'Author',
                        items: [
                            {
                                name: 'name',
                                label: 'Name',
                            },
                            {
                                name: 'email',
                                label: 'Email',
                            },
                            {
                                name: 'id',
                                label: 'ID',
                            },
                            {
                                name: 'mother',
                                label: 'Mother',
                                items: [
                                    {
                                        name: 'name',
                                        label: 'Name',
                                    },
                                    {
                                        name: 'email',
                                        label: 'Email',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'onSavePost1',
        label: 'Post saved',
        items: [
            {
                name: 'post',
                label: 'Post',
                items: [
                    {
                        name: 'title',
                        label: 'Title',
                    },
                    {
                        name: 'status',
                        label: 'Status',
                    }
                ]
            }
        ]
    }
];

const ColumnsContainer = ({ items }) => {
    const [currentItemPath, setCurrentItemPath] = useState([]);

    const handleClick = (path) => {
        setCurrentItemPath(path);

        const container = document.querySelector('.columns-container');
        if (container) {
            setTimeout(() => {
                container.scrollLeft = container.scrollWidth;
            }, 0);
        }
    };

    const columns = [];

    const renderColumns = (currentItems, path = []) => {
        if (!currentItems) return null;

        const currentColumnIndex = path.length;
        const selectedItemIndex = currentItemPath[currentColumnIndex];
        const column = (
            <div className="column">
                {currentItems.map((item, index) => {
                    const hasChildren = item.items && item.items.length > 0;

                    return <div
                        key={index}
                        onClick={() => handleClick([...path, index])}
                        className={`column-item ${selectedItemIndex === index ? 'selected' : ''} ${hasChildren ? 'has-children' : ''}`}
                    >
                        {item.label}
                    </div>;
                })}
            </div>
        );

        columns.push(column);

        if (selectedItemIndex !== undefined && currentItems[selectedItemIndex].items) {
            renderColumns(currentItems[selectedItemIndex].items, [...path, selectedItemIndex]);
        }
    };

    renderColumns(items);

    return <div className="columns-container">
        {columns}
    </div>;
};




export const ExpressionBuilder = ({ name, label, defaultValue, onChange, variables = [] }) => {
    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    const togglePopover = () => {
        setIsOpen((state) => !state);
    }

    const onClose = () => {
        setIsOpen(false);
    }



    return <div>
        <TextControl
            label={label}
            value={defaultValue?.expression}
            onChange={(value) => onChangeSetting({ settingName: "expression", value })}
        />

        {isOpen && (
            <Popover
                onClose={togglePopover}
                position="top left"
            >
                <div style={{ padding: '20px', minWidth: '600px' }} onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        onClose();
                    }
                }}>
                    <HStack>
                        <Heading level={2} className="block-editor-inspector-popover-header__heading">{label}</Heading>
                        <Button onClick={onClose} icon="no-alt" className='block-editor-inspector-popover-header__action' />
                    </HStack>

                    <TextareaControl
                        value={defaultValue?.expression}
                        onChange={(value) => onChangeSetting({ settingName: "expression", value })}
                    />

                    <div style={{ maxWidth: '600px', overflowX: 'auto' }}>
                        <ColumnsContainer items={items} />
                    </div>
                </div>
            </Popover>
        )}

        <Button
            variant="secondary"
            onClick={togglePopover}
        >
            {__("#", "post-expirator")}

        </Button>
    </div>;
}

export default ExpressionBuilder;
