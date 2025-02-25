import { ConditionalExpressionBuilder } from './conditional-expression-builder';

export const FieldExpressionBuilder = ({ options, value, handleOnChange, context }) => {
    return <ConditionalExpressionBuilder
        options={options}
        value={value}
        handleOnChange={handleOnChange}
        context={context}
        readOnlyPreview={true}
        singleVariableOnly={true}
    />;
};
