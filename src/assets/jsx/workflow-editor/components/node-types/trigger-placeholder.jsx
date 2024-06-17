import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Placeholder from './placeholder';
import { NODE_TYPE_TRIGGER } from '../../constants';

export const TriggerPlaceholder = memo((props) => {
    return (
        <Placeholder
            {...props}
            label={__('Click to add a trigger', 'publishpress-future-pro')}
            popoverIsOpen={false}
            searchLabel={__('Search for triggers and steps', 'publishpress-future-pro')}
            elementaryTypes={[NODE_TYPE_TRIGGER]}
        />
    );
});

export default TriggerPlaceholder;
