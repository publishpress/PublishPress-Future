import { QueryBuilder } from 'react-querybuilder';
import { useState, useCallback, useEffect, useRef, useMemo } from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '../../editor-store';
import { useSelect, useDispatch } from '@wordpress/data';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';

import { FieldExpressionBuilder } from './components/field-expression-builder';
import { ValueExpressionBuilder } from './components/value-expression-builder';
import { NotToggle } from './components/not-toggle';
import { AddElementButton } from './components/add-element-button';
import { RemoveElementButton } from './components/remove-element-button';
import { CombinatorSelector } from './components/combinator-selector';
import { OperatorSelector } from './components/operator-selector';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";

import 'react-querybuilder/dist/query-builder.css';
import '../../../css/query-builder.css';
import './styles/index.css';

import { useConditionalLogic } from './hooks/useConditionalLogic';
import { useModalManagement } from './hooks/useModalManagement';
import { useEditorSetup } from './hooks/useEditorSetup';
import { useLegacyVariables } from './hooks/useLegacyVariables';

export const Conditional = ({ name, label, defaultValue, onChange, variables }) => {
    const [query, setQuery, formatCondition] = useConditionalLogic({defaultValue, name, onChange, variables});
    const {
        isModalOpen,
        onCloseModal,
        openModal
    } = useModalManagement({onChange, name, formatCondition});
    const [ editorRef ] = useEditorSetup();
    const [ convertLegacyVariables ] = useLegacyVariables();

    const {
        isPro,
    } = useSelect((select) => ({
        isPro: select(editorStore).isPro(),
    }), [editorStore]);

    const {
        setCurrentConditionalQuery,
    } = useDispatch(editorStore);

    const getDefaultField = useCallback((field) => {
        return '{{global.user.id}}';
    }, []);

    useEffect(() => {
        convertLegacyVariables(query);
    }, []);

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

    const queryBuilderContext = useMemo(() => ({
        variables: variables,
        name: name,
        label: label
    }), [variables, name, label]);

    return (
        <div className='conditional-editor'>
            <Button onClick={openModal} variant="secondary">
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

            {isModalOpen && (
                <Modal
                    onClose={onCloseModal}
                    title={__('Condition', 'post-expirator')}
                    onRequestClose={onCloseModal}
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
