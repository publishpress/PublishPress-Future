import { Slot, Fill } from '@wordpress/components';

export const FutureActionPanelTop = ({ children }) => (
    <Fill name="FutureActionPanelTop">
        {children}
    </Fill>
);

const FutureActionPanelTopSlot = (props) => (
    <Slot name="FutureActionPanelTop" {...props} />
);

FutureActionPanelTop.Slot = FutureActionPanelTopSlot;

export default FutureActionPanelTop;
