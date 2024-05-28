import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import GenericNode from './generic';

export const TriggerNode = memo(({ id, data, isConnectable }) => {
    return <GenericNode id={id} data={data} isConnectable={isConnectable} />;
});

export default TriggerNode;
