import { createRoot } from 'react-dom/client';

import BackupPanel from './components/backup-panel';

import './css/general.css';

const container = document.getElementById("backup-panel");

if (container) {
    const component = (<BackupPanel />);

    createRoot(container).render(component);
}
