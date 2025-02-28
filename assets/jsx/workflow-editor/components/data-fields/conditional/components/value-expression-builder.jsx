import { useMemo } from '@wordpress/element';
import { getVariableDataTypeByVariableName } from '../../../../utils';
import { ConditionalExpressionBuilder } from './conditional-expression-builder';

export const ValueExpressionBuilder = ({ value, handleOnChange, context, rule }) => {
    // Get the variable data type
    const variableDataType = useMemo(
        () => getVariableDataTypeByVariableName(rule.field, context.variables),
        [rule.field, context.variables]
    );

    return <ConditionalExpressionBuilder
        value={value}
        handleOnChange={handleOnChange}
        context={context}
        readOnlyPreview={false}
    />;
};
