import { QueryBuilder, formatQuery, defaultOperators } from 'react-querybuilder';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';
import { useState, useCallback, useEffect, useRef } from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '../../editor-store';
import { useSelect, useDispatch } from '@wordpress/data';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';

import { FieldExpressionBuilder } from './field-expression-builder';
import { ValueExpressionBuilder } from './value-expression-builder';
import { NotToggle } from './not-toggle';
import { AddElementButton } from './add-element-button';
import { RemoveElementButton } from './remove-element-button';
import { CombinatorSelector } from './combinator-selector';
import { OperatorSelector } from './operator-selector';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

import 'react-querybuilder/dist/query-builder.css';
import '../../../css/query-builder.css';
import './style.css';

import { useConditionalLogic } from './hook-conditional-logic';

export const Conditional = ({ name, label, defaultValue, onChange, variables }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [query, setQuery, formatCondition] = useConditionalLogic(defaultValue, name, onChange, variables);

    const {
        isPro,
    } = useSelect((select) => ({
        isPro: select(editorStore).isPro(),
    }), [editorStore]);

    const {
        setCurrentConditionalQuery,
    } = useDispatch(editorStore);

    const editorRef = useRef(null);

    const convertLegacyVariables = useCallback((legacyQuery) => {
        if (!legacyQuery) return;

        const wrapFieldValue = (field) => {
            if (typeof field !== 'string') return field;
            if (field.startsWith('{{') && field.endsWith('}}')) return field;
            return field;
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
        if (onChange) {
            onChange(name, formatCondition());
        }

        setIsPopoverVisible(false);
    }, [onChange, name, formatCondition, setIsPopoverVisible]);

    const getDefaultField = useCallback((field) => {
        return '{{global.user.id}}';
    }, []);

    useEffect(() => {
        convertLegacyVariables(query);
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.editor.setOption("indentedSoftWrap", false);
        }
    }, [editorRef]);

    useEffect(() => {
        setCurrentConditionalQuery(query);
    }, [query]);

    const editorProps = {
        $blockScrolling: true,
    };

    const editorOptions = {
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        showGutter: false,
        showPrintMargin: false,
        showLineNumbers: false,
        showInvisibles: false,
        highlightActiveLine: false,
    };

    const queryBuilderTranslations = {
        addGroup: { label: __('Add Group', 'post-expirator') },
        addRule: { label: __('Add Rule', 'post-expirator') }
    };

    const queryBuilderControlElements = {
        fieldSelector: FieldExpressionBuilder,
        valueEditor: ValueExpressionBuilder,
        notToggle: NotToggle,
        addRuleAction: AddElementButton,
        addGroupAction: AddElementButton,
        removeGroupAction: RemoveElementButton,
        removeRuleAction: RemoveElementButton,
        combinatorSelector: CombinatorSelector,
        operatorSelector: OperatorSelector,
    };

    const queryBuilderControlClassnames = {
        queryBuilder: 'queryBuilder-branches',
    };

    const queryBuilderContext = {
        variables: variables,
        name: name,
        label: label
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
                    setOptions={editorOptions}
                />
            )}

            {!isPro && (
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
                        {__('Create rules that will continue the workflow only if certain conditions are met.', 'post-expirator')}
                    </p>
                    <QueryBuilderDnD>
                        <QueryBuilder
                            fields={variables}
                            onQueryChange={setQuery}
                            query={query}
                            addRuleToNewGroups
                            parseNumbers="strict-limited"
                            showCombinatorsBetweenRules
                            showNotToggle
                            enableDragAndDrop={true}
                            controlClassnames={queryBuilderControlClassnames}
                            translations={queryBuilderTranslations}
                            controlElements={queryBuilderControlElements}
                            context={queryBuilderContext}
                            getDefaultField={getDefaultField}
                        />
                    </QueryBuilderDnD>
                </Modal>
            )}
        </div>
    );
};

export default Conditional;
