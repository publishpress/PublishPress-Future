import { Platform } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { cog } from '@wordpress/icons';
import { store } from '../../store';
import { store as keyboardShortcutStore } from '@wordpress/keyboard-shortcuts';
import { SHORTCUT_TOGGLE_SIDEBAR } from '../keyboard-shortcuts/constants';
import { PluginSidebarEditPost } from './plugin-sidebar';
import { SettingsHeader } from './settings-header';
import { __ } from '@wordpress/i18n';

const SIDEBAR_ACTIVE_BY_DEFAULT = Platform.select({
    web: true,
    native: false,
});

export const SettingsSidebar = () => {
    const { sidebarName, keyboardShortcut } = useSelect((select) => {
        const shortcut = select(keyboardShortcutStore).getShortcutRepresentation(SHORTCUT_TOGGLE_SIDEBAR);

        return {
            sidebarName: select(store).getActiveSidebarName(),
            keyboardShortcut: shortcut,
        };
    });

    return (
        <PluginSidebarEditPost
            identifier={sidebarName}
            header={<SettingsHeader sidebarName={sidebarName} />}
            closeLabel={__('Close settings')}
            headerClassName="edit-post-sidebar__panel-tabs"
            /* translators: button label text should, if possible, be under 16 characters. */
            title={__('Settings')}
            toggleShortcut={keyboardShortcut}
            icon={cog}
            isActiveByDefault={SIDEBAR_ACTIVE_BY_DEFAULT}
        >
            {/* { sidebarName === SIDEBAR_WORKFLOW && (
				<>
                    <PostStatus />
					<Template />
					<PluginDocumentSettingPanel.Slot />
					<LastRevision />
					<PostLink />
					<PostTaxonomies />
					<FeaturedImage />
					<PostExcerpt />
					<DiscussionPanel />
					<PageAttributes />
					<MetaBoxes location="side" />
				</>
			) }
			{ sidebarName === SIDEBAR_NODE_EDGE && <BlockInspector /> } */}
            <div>Sidebar: {sidebarName}</div>
        </PluginSidebarEditPost>
    );
}

export default SettingsSidebar;
