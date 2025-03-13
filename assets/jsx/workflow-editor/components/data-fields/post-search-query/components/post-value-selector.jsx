import { ValueExpressionBuilder } from '../../conditional/components/value-expression-builder';

/**
 * Value selector component for post queries
 */
export const PostValueSelector = (props) => {
    return <ValueExpressionBuilder
        {...props}
    />;
};
