import { KeyboardShortcuts as WPKeyboardShortcuts } from "@wordpress/components";
import { store } from "../store";
import { dispatch } from "@wordpress/data";
import { FEATURE_FULLSCREEN_MODE } from "../constants";
import { useReactFlow } from "reactflow";

export const KeyboardShortcuts = () => {
    const toggleFullscreenMode = () => {
        dispatch(store).toggleFeature(FEATURE_FULLSCREEN_MODE);
    }

    const reactflow = useReactFlow();

    return (
        <WPKeyboardShortcuts
            shortcuts={{
                'ctrl+enter': toggleFullscreenMode,
                'ctrl+f': reactflow.fitView,
            }}
        />
    );
}
