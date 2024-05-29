import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import GenericNode from './generic';

export const TriggerNode = memo((props) => {
    return <GenericNode {...props} />;
});

export default TriggerNode;
