import {
    Button,
    Popover,
    __experimentalHStack as HStack,
    __experimentalHeading as Heading
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useRef } from "@wordpress/element";
import NodeIcon from "../../node-icon";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

import './style.css';

const ColumnsContainer = ({ items, setCurrentDescription, onDoubleClick }) => {
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
        );

        columns.push(column);

        if (selectedItemIndex !== undefined && currentItems[selectedItemIndex].children) {
            renderColumns(currentItems[selectedItemIndex].children, [...path, selectedItemIndex]);
        }
    };

    renderColumns(items);

    return <div className="columns-container">
        {columns}
    </div>;
};


export const ExpressionBuilder = ({ name, label, defaultValue, onChange, variables = [] }) => {
    const editorRef = useRef(null);

    const [currentDescription, setCurrentDescription] = useState();

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

    const onDoubleClick = (item) => {
        if (editorRef.current) {
            const editor = editorRef.current.editor;
            const cursorPosition = editor.getCursorPosition();
            editor.session.insert(cursorPosition, `{{${item.id}}}`);
        }
    }

    return <div className="expression-builder">

        <Button
            variant="secondary"
            onClick={togglePopover}
            className="expression-builder-button"
            icon={<NodeIcon icon="braces" size={18} />}
            title={__("Edit", "post-expirator")}
        />

        <Heading level={3} className="expression-editor-preview-heading">{label}</Heading>

        <AceEditor
            mode="handlebars"
            theme="textmate"
            name="expression-editor-preview"
            value={defaultValue?.expression || ''}
            editorProps={{ $blockScrolling: true }}
            onChange={(value) => onChangeSetting({ settingName: "expression", value })}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showGutter: false,
                showPrintMargin: false,
                showLineNumbers: false,
                showInvisibles: false,
            }}
            height="92px"
            width="244px"
        />

        {isOpen && (
            <Popover
                onClose={togglePopover}
                position="middle left"
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

                        <p>{__("Position the cursor where you want to add a variable and double click on a variable to add it to your expression.", "post-expirator")}</p>

                        <ColumnsContainer
                            items={variables}
                            setCurrentDescription={setCurrentDescription}
                            onDoubleClick={onDoubleClick}
                        />
                    </div>

                    {currentDescription && (
                        <p>{currentDescription}</p>
                    )}
                </div>
            </Popover>
        )}
    </div>;
}

export default ExpressionBuilder;
