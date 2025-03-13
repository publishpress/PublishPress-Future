import { ConditionalExpressionBuilder } from './conditional-expression-builder';

export const FieldExpressionBuilder = ({ value, handleOnChange, context }) => {
    return <ConditionalExpressionBuilder
        value={value}
        handleOnChange={handleOnChange}
        context={context}
        readOnlyPreview={true}
        singleVariableOnly={true}
    />;
};
