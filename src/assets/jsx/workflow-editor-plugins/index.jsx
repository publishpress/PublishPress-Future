import { registerPlugin } from '@wordpress/plugins';
import RecurrentDateField from './plugins/recurrent-date-field/index.jsx';

registerPlugin('recurrent-date-field', {
    render: RecurrentDateField,
    scope: 'future-workflow-editor'
});
