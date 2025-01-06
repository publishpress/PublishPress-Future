import { useInlineEditBulk } from '../hook';
import { Fieldset } from './fieldset';

import './css/style.css';

// Initialize the hook
const { setupInlineEditBulk } = useInlineEditBulk();

const containerId = "publishpress-future-bulk-edit-manual-trigger";
const component = (
    <Fieldset context='bulk-edit' />
);

setupInlineEditBulk(containerId, component);
