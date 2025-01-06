import { QueryBuilder, formatQuery, defaultOperators } from 'react-querybuilder';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';
import { useState, useCallback, useEffect, useRef } from '@wordpress/element';
import { Button, CheckboxControl, Dashicon, Modal, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '../../editor-store';
import { useSelect } from '@wordpress/data';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

import ExpressionBuilder from '../expression-builder';

import 'react-querybuilder/dist/query-builder.css';
import '../../../css/query-builder.css';
import './style.css';

const ConditionalExpressionBuilder = ({ options, value, handleOnChange, context, readOnlyPreview, singleVariableOnly }) => {
    const onChange = (name, value) => {
        if (handleOnChange) {
            handleOnChange(value.expression);
        }
    }

    return <div>
        <ExpressionBuilder
            name={context.name}
            label={context.label}
            defaultValue={{expression: value}}
            onChange={onChange}
            variables={context.options}
            isInline={true}
            readOnlyPreview={readOnlyPreview || false}
            singleVariableOnly={singleVariableOnly || false}
            oneLinePreview={true}
            wrapOnPreview={false}
            wrapOnEditor={false}
        />
    </div>;
};

const FieldExpressionBuilder = ({ options, value, handleOnChange, context }) => {
    return <ConditionalExpressionBuilder
        options={options}
        value={value}
        handleOnChange={handleOnChange}
        context={context}
        readOnlyPreview={true}
        singleVariableOnly={true}
    />;
};

const ValueExpressionBuilder = ({ options, value, handleOnChange, context }) => {
    return <ConditionalExpressionBuilder
        options={options}
        value={value}
        handleOnChange={handleOnChange}
        context={context}
        readOnlyPreview={false}
    />;
};

const NotToggle = ({ checked, handleOnChange }) => {
    const [isNot, setIsNot] = useState(checked || false);

    useEffect(() => {
        setIsNot(checked || false);
    }, [checked]);

    const handleToggle = () => {
        const newValue = !isNot;
        setIsNot(newValue);
        handleOnChange(newValue);
    }

    return (
        <CheckboxControl
            label={__('Not', 'post-expirator')}
            checked={isNot}
            onChange={handleToggle}
            className={isNot ? 'is-checked' : ''}
        />
    );
};

const AddElementButton = ({ label, handleOnClick }) => {
    return <Button onClick={handleOnClick} variant="secondary">
        {label}
    </Button>;
};

const RemoveElementButton = ({ label, handleOnClick }) => {
    return <Button onClick={handleOnClick} variant="secondary" className="conditional-editor-modal-remove-element">
        <Dashicon icon="trash" size={16} />
    </Button>;
};

const CombinatorSelector = ({ label, value, options, handleOnChange }) => {
    return <SelectControl
        label={label}
        value={value}
        options={options}
        onChange={handleOnChange}
    />;
};

const OperatorSelector = ({ label, value, options, handleOnChange }) => {
    return <SelectControl
        label={label}
        value={value}
        options={options}
        onChange={handleOnChange}
        className="conditional-editor-modal-operator-selector"
    />;
};

export const Conditional = ({ name, label, defaultValue, onChange, variables }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [query, setQuery] = useState(
        parseJsonLogic(
            defaultValue?.json ?
                defaultValue.json :
                ''
        )
    );

    const {
        isPro,
    } = useSelect((select) => ({
        isPro: select(editorStore).isPro(),
    }));

    let allVariables = variables;

    const editorRef = useRef(null);

    const convertLegacyVariables = useCallback((legacyQuery) => {
        if (!legacyQuery) return;

        const wrapFieldValue = (field) => {
            if (typeof field !== 'string') return field;
            if (field.startsWith('{{') && field.endsWith('}}')) return field;
            return `{{${field}}}`;
        };

        const processRules = (rules) => {
            if (!Array.isArray(rules)) return;

            rules.forEach(rule => {
                if (rule.rules) {
                    // Recursively process nested rule groups
                    processRules(rule.rules);
                } else if (rule.field) {
                    // Update the field value if it's not properly wrapped
                    rule.field = wrapFieldValue(rule.field);
                }
            });
        };

        if (legacyQuery.rules) {
            processRules(legacyQuery.rules);
        }
    }, []);

    const onClose = useCallback(() => {
        const jsonCondition = formatQuery(
            query,
            {
                format: 'jsonlogic',
                parseNumbers: true,
            }
        );

        const naturalLanguageCondition = formatQuery(
            query,
            {
                format: 'natural_language',
                parseNumbers: true,
                fields: allVariables,
                getOperators: () => defaultOperators,
            }
        );

        const newValue = { ...defaultValue };
        newValue.json = jsonCondition;
        newValue.natural = naturalLanguageCondition;

        if (onChange) {
            onChange(name, newValue);
        }

        setIsPopoverVisible(false);
    }, [query, allVariables, onChange, name, defaultValue]);

    useEffect(() => {
        convertLegacyVariables(query);

        if (editorRef.current) {
            editorRef.current.editor.setOption("indentedSoftWrap", false);
        }
    }, []);

    const getDefaultField = useCallback((field) => {
        return '{{global.user.id}}';
    }, []);

    const editorProps = {
        $blockScrolling: true,
    };



    return (
        <div className='conditional-editor'>
            <Button onClick={() => setIsPopoverVisible(true)} variant="secondary">
                {__('Edit condition', 'post-expirator')}
            </Button>

            {defaultValue?.natural && (
                <AceEditor
                    ref={editorRef}
                    mode="handlebars"
                    theme="textmate"
                    name="expression-builder-natural-language"
                    className="read-only-editor settings-panel"
                    wrapEnabled={true}
                    value={defaultValue?.natural || ''}
                    editorProps={editorProps}
                    readOnly={true}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        showGutter: false,
                        showPrintMargin: false,
                        showLineNumbers: false,
                        showInvisibles: false,
                        highlightActiveLine: false,
                    }}
                />
            )}

            {! isPro && (
                <div className="condition-pro-features-notice">
                    <p className="description margin-top">{__('This conditional will only be evaluated in the Pro version. In the Free version, it will always return true.', 'post-expirator')}</p>
                </div>
            )}

            {isPopoverVisible && (
                <Modal
                    onClose={onClose}
                    title={__('Condition', 'post-expirator')}
                    onRequestClose={onClose}
                    className="conditional-editor-modal"
                >
                    <p>
                        {__('Create a condition adding rules and groups. You can also add a NOT condition to any rule or group.', 'post-expirator')}
                    </p>
                    <QueryBuilderDnD>
                        <QueryBuilder
                            fields={allVariables}
                            onQueryChange={setQuery}
                            query={query}
                            addRuleToNewGroups
                            parseNumbers="strict-limited"
                            showCombinatorsBetweenRules
                            showNotToggle
                            enableDragAndDrop={true}
                            controlClassnames={{
                                queryBuilder: 'queryBuilder-branches',
                            }}
                            translations={{
                                addGroup: { label: __('Add Group', 'post-expirator') },
                                addRule: { label: __('Add Rule', 'post-expirator') }
                            }}
                            controlElements={{
                                fieldSelector: FieldExpressionBuilder,
                                valueEditor: ValueExpressionBuilder,
                                notToggle: NotToggle,
                                addRuleAction: AddElementButton,
                                addGroupAction: AddElementButton,
                                removeGroupAction: RemoveElementButton,
                                removeRuleAction: RemoveElementButton,
                                combinatorSelector: CombinatorSelector,
                                operatorSelector: OperatorSelector,
                            }}
                            context={{
                                options: allVariables,
                                name: name,
                                label: label
                            }}
                            getDefaultField={getDefaultField}
                        />
                    </QueryBuilderDnD>
                </Modal>
            )}
        </div>
    );
};

export default Conditional;
