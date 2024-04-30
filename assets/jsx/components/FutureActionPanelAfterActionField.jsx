import { Slot, Fill } from '@wordpress/components';

export const FutureActionPanelAfterActionField = ({ children }) => (
    <Fill name="FutureActionPanelAfterActionField">
        {children}
    </Fill>
);

const FutureActionPanelAfterActionFieldSlot = () => (
    <Slot name="FutureActionPanelAfterActionField" />
);

FutureActionPanelAfterActionField.Slot = FutureActionPanelAfterActionFieldSlot;

export default FutureActionPanelAfterActionField;
