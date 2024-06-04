import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
    NODE_TYPE_ACTION,
    NODE_TYPE_ADVANCED
} from '../../constants';
import { Placeholder } from './placeholder';

export const NodePlaceholder = memo(({id, label, popoverIsOpen = false, searchLabel, elementarTypes}) => {
    return (
        <Placeholder
            id={id}
            popoverIsOpen={true}
            searchLabel={__('Search for actions', 'publishpress-future-pro')}
            elementTypes={[NODE_TYPE_ACTION, NODE_TYPE_ADVANCED]}
        />
    );
});

export default NodePlaceholder;
