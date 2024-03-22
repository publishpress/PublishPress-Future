import { KeyboardShortcuts as WPKeyboardShortcuts } from "@wordpress/components";
import { store } from "../store";
import { dispatch } from "@wordpress/data";
import { FEATURE_FULLSCREEN_MODE } from "../constants";

export const KeyboardShortcuts = () => {
    const toggleFullscreenMode = () => {
        dispatch(store).toggleFeature(FEATURE_FULLSCREEN_MODE);
    }

    return (
        <WPKeyboardShortcuts
            shortcuts={{
                'ctrl+f': toggleFullscreenMode,
            }}
        />
    );
}
