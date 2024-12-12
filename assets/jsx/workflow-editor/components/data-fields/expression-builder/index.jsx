import {
    Button,
    Popover,
    __experimentalHStack as HStack,
    __experimentalHeading as Heading
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useRef, useCallback } from "@wordpress/element";
import NodeIcon from "../../node-icon";
import ColumnsContainer from "./columns-container";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

import './style.css';

export const ExpressionBuilder = ({ name, label, defaultValue, onChange, variables = [], propertyName = "expression", settings = {}, description }) => {
    const editorRef = useRef(null);

    const [currentDescription, setCurrentDescription] = useState();
    const [currentVariableId, setCurrentVariableId] = useState();
    const [isOpen, setIsOpen] = useState(false);

    if (! defaultValue) {
        defaultValue = {};
    }

    const onChangeSetting = useCallback(({ settingName, value }) => {
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
    }, [defaultValue]);

    const togglePopover = useCallback(() => {
        setIsOpen((state) => !state);
    }, [setIsOpen]);

    const onClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const onDoubleClick = useCallback((item) => {
        if (editorRef.current) {
            const editor = editorRef.current.editor;
            const cursorPosition = editor.getCursorPosition();
            editor.session.insert(cursorPosition, `{{${item.name}}}`);
        }
    }, [editorRef]);

    const editorProps = {
        $blockScrolling: true,
    };

    return <div className="expression-builder">

        <Button
            variant="secondary"
            onClick={togglePopover}
            className="expression-builder-button"
            icon={<NodeIcon icon="braces" size={18} />}
            title={__("Edit", "post-expirator")}
        />

        <Heading level={3} className="expression-editor-preview-heading">{label}</Heading>

        {description && (
            <p>{description}</p>
        )}

        <AceEditor
            mode="handlebars"
            theme="textmate"
            name="expression-editor-preview"
            value={defaultValue[propertyName] || ''}
            editorProps={editorProps}
            onChange={(value) => onChangeSetting({ settingName: propertyName, value })}
            setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                showGutter: false,
                showPrintMargin: false,
                showLineNumbers: false,
                showInvisibles: false,
            }}
            height="92px"
            width="244px"
            placeholder={settings?.placeholder || ''}
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
                        onChange={(value) => onChangeSetting({ settingName: propertyName, value })}
                        value={defaultValue[propertyName] || ''}
                        editorProps={editorProps}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                        }}
                        height="200px"
                        width="560px"
                        placeholder={settings?.placeholder || ''}
                    />

                    <div style={{ maxWidth: '600px', overflowX: 'auto' }}>
                        <Heading level={2} className="components-truncate components-text components-heading block-editor-inspector-popover-header__heading">{__("Variables", "post-expirator")}</Heading>

                        <p>{__("Position the cursor where you want to add a variable and double click on a variable to add it to your expression.", "post-expirator")}</p>

                        <ColumnsContainer
                            items={variables}
                            setCurrentDescription={setCurrentDescription}
                            setCurrentVariableId={setCurrentVariableId}
                            onDoubleClick={onDoubleClick}
                        />
                    </div>

                    {currentDescription && (
                        <p>
                            <code className="expression-builder-variable-name">
                                {`{{${currentVariableId}}}`}
                            </code>: {currentDescription}
                        </p>
                    )}
                </div>
            </Popover>
        )}
    </div>;
}

export default ExpressionBuilder;
