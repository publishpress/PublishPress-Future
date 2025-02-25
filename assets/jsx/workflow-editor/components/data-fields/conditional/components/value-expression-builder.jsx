import { useMemo } from '@wordpress/element';
import { getVariableDataTypeByVariableName } from '../../../../utils';
import { ConditionalExpressionBuilder } from './conditional-expression-builder';

export const ValueExpressionBuilder = ({ options, value, handleOnChange, context, rule }) => {
    const variableDataType = useMemo(
        () => getVariableDataTypeByVariableName(rule.field, context.variables),
        [rule.field, context.variables]
    );

    console.log(variableDataType);

    return <ConditionalExpressionBuilder
        options={options}
        value={value}
        handleOnChange={handleOnChange}
        context={context}
        readOnlyPreview={false}
    />;
};
