import { QueryBuilder } from 'react-querybuilder';
import { useCallback, useEffect, useMemo } from '@wordpress/element';
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
import { ConditionPreview } from './components/condition-preview';

import 'react-querybuilder/dist/query-builder.css';
import '../../../css/query-builder.css';
import './styles/index.css';

import { useConditionalLogic } from './hooks/useConditionalLogic';
import { useModalManagement } from './hooks/useModalManagement';
import { useEditorSetup } from './hooks/useEditorSetup';
import { useLegacyVariables } from './hooks/useLegacyVariables';
import { useIsPro } from '../../../contexts/pro-context';

const EDITOR_PROPS = {
    $blockScrolling: true,
};

const EDITOR_OPTIONS = {
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    showGutter: false,
    showPrintMargin: false,
    showLineNumbers: false,
    showInvisibles: false,
    highlightActiveLine: false,
};

const QUERY_BUILDER_TRANSLATIONS = {
    addGroup: { label: __('Add Group', 'post-expirator') },
    addRule: { label: __('Add Rule', 'post-expirator') }
};

const QUERY_BUILDER_CONTROL_CLASSNAMES = {
    queryBuilder: 'queryBuilder-branches',
};

export const Conditional = ({ name, label, defaultValue, onChange, variables }) => {
    const { query, setQuery, formatCondition } = useConditionalLogic({ defaultValue, name, onChange, variables });
    const {
        isModalOpen,
        onCloseModal,
        openModal
    } = useModalManagement({onChange, name, formatCondition});
    const [ editorRef ] = useEditorSetup();
    const [ convertLegacyVariables ] = useLegacyVariables();

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

    const queryBuilderContext = useMemo(() => ({
        variables: variables,
        name: name,
        label: label
    }), [variables, name, label]);

    const isPro = useIsPro();

    return (
        <div className='conditional-editor'>
            <Button onClick={openModal} variant="secondary">
                {__('Edit condition', 'post-expirator')}
            </Button>

            <ConditionPreview
                defaultValue={defaultValue}
                editorRef={editorRef}
                editorProps={EDITOR_PROPS}
                editorOptions={EDITOR_OPTIONS}
            />

            {! isPro && (
                <div className="conditional-editor-pro-feature-message">
                    <p className="description margin-top">
                        {__('Conditional logic is a Pro feature. Upgrade to create advanced conditions for your workflows.', 'post-expirator')}
                    </p>
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
                            controlClassnames={QUERY_BUILDER_CONTROL_CLASSNAMES}
                            translations={QUERY_BUILDER_TRANSLATIONS}
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
