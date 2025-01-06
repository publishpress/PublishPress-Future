import {
    Button,
    Modal,
    __experimentalHStack as HStack,
    __experimentalHeading as Heading,
    TextareaControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useRef, useCallback, useEffect } from "@wordpress/element";
import NodeIcon from "../../node-icon";
import ColumnsContainer from "./columns-container";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

import './style.css';

export const ExpressionBuilder = ({
    name,
    label = '',
    defaultValue,
    onChange,
    variables = [],
    propertyName = "expression",
    settings = {},
    description = '',
    isInline = false,
    readOnlyPreview = false,
    singleVariableOnly = false,
    wrapOnPreview = false,
    wrapOnEditor = false,
    oneLinePreview = false,
}) => {
    const editorFullRef = useRef(null);
    const editorSmallRef = useRef(null);

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

        if (editorFullRef.current) {
            // editorFullRef.current.editor.getSession().setAnnotations(annotations);
        }
    }, [defaultValue]);

    const onClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const onDoubleClick = useCallback((item) => {
        if (editorFullRef.current) {
            const editor = editorFullRef.current.editor;

            if (! singleVariableOnly) {
                const cursorPosition = editor.getCursorPosition();
                editor.session.insert(cursorPosition, `{{${item.name}}}`);
            } else {
                editor.session.setValue(`{{${item.name}}}`);
            }

            editor.focus();

            if (singleVariableOnly) {
                setIsOpen(false);
            }
        }
    }, [editorFullRef, singleVariableOnly]);

    const editorProps = {
        $blockScrolling: true,
    };

    useEffect(() => {
        if (wrapOnPreview && editorSmallRef.current) {
            editorSmallRef.current.editor.setOption("indentedSoftWrap", false);
        }
    }, [wrapOnPreview, editorSmallRef]);

    return <div className={`expression-builder ${isOpen ? 'expression-builder-open' : ''} ${isInline ? 'expression-builder-inline' : ''}`}>

        <Button
            variant="secondary"
            onClick={() => setIsOpen(true)}
            className="expression-builder-button"
            icon={<NodeIcon icon="braces" iconSize={16} />}
            title={__("Edit", "post-expirator")}
        />

        {! isInline && label && (
            <Heading level={3} className="expression-builder-small-heading">{label}</Heading>
        )}

        {description && (
            <p className="description">{description}</p>
        )}

        <AceEditor
            ref={editorSmallRef}
            mode="handlebars"
            theme="textmate"
            name="expression-builder-small"
            value={defaultValue[propertyName] || ''}
            readOnly={readOnlyPreview}
            className={readOnlyPreview ? 'read-only-editor' : ''}
            editorProps={editorProps}
            wrapEnabled={wrapOnPreview}
            onChange={(value) => onChangeSetting({ settingName: propertyName, value })}
            setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                showGutter: false,
                showPrintMargin: false,
                showLineNumbers: false,
                showInvisibles: false,
                highlightActiveLine: false,
            }}
            height={oneLinePreview ? '30px' : '92px'}
            width="100%"
            placeholder={settings?.placeholder || ''}
        />

        {isOpen && (
            <Modal
                title={label}
                onRequestClose={onClose}
                className="expression-builder-modal"
            >
                <div style={{ minWidth: '600px', maxWidth: '600px' }}>
                    {singleVariableOnly && (
                        <p>{__("Single variable mode. Double click on a variable below to add it to your expression.", "post-expirator")}</p>
                    )}

                    {!singleVariableOnly && (
                        <p>{__("Type your expression here or use the variables below.", "post-expirator")}</p>
                    )}

                    <AceEditor
                        ref={editorFullRef}
                        mode="handlebars"
                        theme="textmate"
                        name="expression-builder-full"
                        className={singleVariableOnly ? 'read-only-editor' : ''}
                        wrapEnabled={wrapOnEditor}
                        onChange={(value) => onChangeSetting({ settingName: propertyName, value })}
                        value={defaultValue[propertyName] || ''}
                        editorProps={editorProps}
                        readOnly={singleVariableOnly}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            showLineNumbers: !singleVariableOnly,
                            showGutter: !singleVariableOnly,
                            highlightActiveLine: !singleVariableOnly,
                        }}
                        height={singleVariableOnly ? '30px' : '200px'}
                        width="100%"
                        placeholder={settings?.placeholder || ''}
                    />

                    <div className="expression-builder-modal-variables" style={{ maxWidth: '600px', overflowX: 'auto' }}>
                        <Heading level={2} className="components-truncate components-text components-heading block-editor-inspector-popover-header__heading">{__("Variables", "post-expirator")}</Heading>

                        {! singleVariableOnly && (
                            <p>{__("Position the cursor where you want to add a variable and double click on a variable to add it to your expression.", "post-expirator")}</p>
                        )}

                        <ColumnsContainer
                            items={variables}
                            setCurrentDescription={setCurrentDescription}
                            setCurrentVariableId={setCurrentVariableId}
                            onDoubleClick={onDoubleClick}
                        />
                    </div>

                    {currentDescription && (
                        <p className="description margin-top">
                            <code className="expression-builder-variable-name">
                                {`{{${currentVariableId}}}`}
                            </code>: {currentDescription}
                        </p>
                    )}

                    {!currentDescription && (
                        <p className="description margin-top">{__("Hover over a variable to see its description.", "post-expirator")}</p>
                    )}
                </div>
            </Modal>
        )}
    </div>;
}

export default ExpressionBuilder;
