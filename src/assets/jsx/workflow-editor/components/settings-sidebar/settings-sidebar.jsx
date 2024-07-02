import { Platform } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { cog } from '@wordpress/icons';
import { store as keyboardShortcutStore } from '@wordpress/keyboard-shortcuts';
import { SHORTCUT_TOGGLE_SIDEBAR } from '../keyboard-shortcuts/constants';
import { PluginSidebarEditPost } from './plugin-sidebar';
import { SettingsHeader } from './settings-header';
import { __ } from '@wordpress/i18n';
import {
    SLOT_SCOPE_WORKFLOW_EDITOR,
    FEATURE_ADVANCED_SETTINGS
} from '../../constants';
import { SIDEBAR_WORKFLOW, SIDEBAR_NODE_EDGE } from './constants';
import { WorkflowSummary } from '../workflow-summary';
import { NodeInspector } from '../node-inspector';
import { store as editorStore } from '../editor-store';


const SIDEBAR_ACTIVE_BY_DEFAULT = Platform.select({
    web: true,
    native: false,
});

export const SettingsSidebar = () => {
    const { sidebarName, keyboardShortcut } = useSelect((select) => {
        const shortcut = select(keyboardShortcutStore).getShortcutRepresentation(SHORTCUT_TOGGLE_SIDEBAR);
        const sidebarName = select('core/interface').getActiveComplementaryArea(SLOT_SCOPE_WORKFLOW_EDITOR);

        return {
            sidebarName: sidebarName,
            keyboardShortcut: shortcut,
        };
    });

    const {
        isAdvancedSettingsEnabled,
    } = useSelect((select) => {
        return {
            isAdvancedSettingsEnabled: select(editorStore).isFeatureActive(FEATURE_ADVANCED_SETTINGS),
        };
    });

    return (
        <PluginSidebarEditPost
            identifier={sidebarName}
            header={<SettingsHeader sidebarName={sidebarName} />}
            closeLabel={__('Close settings', 'publishpress-future-pro')}
            headerClassName="edit-post-sidebar__panel-tabs"
            className="edit-post-sidebar__panel"
            /* translators: button label text should, if possible, be under 16 characters. */
            title={__('Settings', 'publishpress-future-pro')}
            toggleShortcut={keyboardShortcut}
            icon={cog}
            isActiveByDefault={SIDEBAR_ACTIVE_BY_DEFAULT}
        >
            {sidebarName === SIDEBAR_WORKFLOW && (
                <>
                    <WorkflowSummary />
                </>
            )}
            {sidebarName === SIDEBAR_NODE_EDGE && (
                <>
                    <NodeInspector />
                </>
            )}
        </PluginSidebarEditPost>
    );
}

export default SettingsSidebar;
