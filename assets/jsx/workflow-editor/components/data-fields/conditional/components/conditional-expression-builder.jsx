import ExpressionBuilder from '../../expression-builder';

export const ConditionalExpressionBuilder = ({ options, value, handleOnChange, context, readOnlyPreview, singleVariableOnly }) => {
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
            variables={context.variables}
            isInline={true}
            readOnlyPreview={readOnlyPreview || false}
            singleVariableOnly={singleVariableOnly || false}
            oneLinePreview={true}
            wrapOnPreview={false}
            wrapOnEditor={false}
        />
    </div>;
};
