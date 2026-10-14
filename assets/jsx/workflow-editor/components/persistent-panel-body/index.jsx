import { PanelBody } from "@wordpress/components";
import {
    usePanelBodyStates,
    useSetPanelBodyState,
} from "../preferences/use-feature";

export const PersistentPanelBody = (props) => {
    const newProps = {
        ...props,
    };

    newProps.id = newProps.id ?? newProps.title.toLowerCase().replace(/ /g, '');

    const panelBodyStates = usePanelBodyStates();
    const setPanelBodyState = useSetPanelBodyState();

    const panelBodyState = panelBodyStates[newProps.id] ?? true;

    const propOnToggle = newProps.onToggle;
    delete newProps.onToggle;

    const isOpened = newProps.opened ?? panelBodyState;
    delete newProps.opened;

    const togglePanelState = (isOpened) => {
        setPanelBodyState(newProps.id, isOpened);

        if (propOnToggle) {
            propOnToggle(isOpened);
        }

        return;
    };

    return (
        <PanelBody {...props} opened={isOpened} onToggle={togglePanelState}>
            {newProps.children}
        </PanelBody>
    );
}

export default PersistentPanelBody;
