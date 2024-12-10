import {
    Button,
    TextControl,
    Popover,
    TextareaControl,
    __experimentalHStack as HStack,
    __experimentalHeading as Heading
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useRef } from "@wordpress/element"

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

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
            <div className="column" key={`column-${path.join('-')}`}>
                {currentItems.map((item, index) => {
                    const hasChildren = item.items && item.items.length > 0;

                    return <div
                        key={`column-item-${path.join('-')}-${index}`}
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
    const editorRef = useRef(null);

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }

        // Example: Basic linting logic (you can integrate a real linter here)
        const annotations = [];
        if (value.includes('error')) {
            annotations.push({
                row: 0,
                column: 10,
                text: "Example error: 'error' found in code",
                type: "error"
            });
        }

        if (editorRef.current) {
            editorRef.current.editor.getSession().setAnnotations(annotations);
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

        <Button
            variant="secondary"
            onClick={togglePopover}
        >
            {__("Edit", "post-expirator")}

        </Button>

        <TextareaControl
            value={defaultValue?.expression}
            label={label}
            className="expression-editor-textarea"
            readOnly={true}
        />

        {isOpen && (
            <Popover
                onClose={togglePopover}
                position="top left"
            >
                <div style={{ padding: '20px', minWidth: '600px' }}>
                    <HStack>
                        <Heading level={2} className="block-editor-inspector-popover-header__heading">{label}</Heading>
                        <Button onClick={onClose} icon="no-alt" className='block-editor-inspector-popover-header__action' />
                    </HStack>

                    <AceEditor
                        ref={editorRef}
                        mode="handlebars"
                        theme="textmate"
                        name="expression-editor-full"
                        onChange={(value) => onChangeSetting({ settingName: "expression", value })}
                        value={defaultValue?.expression || ''}
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                        }}
                        height="200px"
                        width="560px"
                    />

                    <div style={{ maxWidth: '600px', overflowX: 'auto' }}>
                        <Heading level={2} className="components-truncate components-text components-heading block-editor-inspector-popover-header__heading">{__("Variables", "post-expirator")}</Heading>

                        <p>{__("Double click on a variable to add it to your expression.", "post-expirator")}</p>

                        <ColumnsContainer items={items} />
                    </div>
                </div>
            </Popover>
        )}
    </div>;
}

export default ExpressionBuilder;
