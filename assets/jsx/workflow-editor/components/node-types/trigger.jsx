import { memo } from '@wordpress/element';
import { __ } from '@publishpress/i18n';
import GenericNode from './generic';
import EnergyIcon from '../icons/energy';

export const TriggerNode = memo((props) => {
    const icon = <EnergyIcon size={8} />;

    return <GenericNode {...props} nodeTypeIcon={icon} />;
});

export default TriggerNode;
