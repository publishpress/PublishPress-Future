import { Slot, Fill } from '@wordpress/components';

export const FutureActionPanelAfterActionField = ({ children }) => (
    <Fill name="FutureActionPanelAfterActionField">
        {children}
    </Fill>
);

const FutureActionPanelAfterActionFieldSlot = (props) => (
    <Slot name="FutureActionPanelAfterActionField" {...props} />
);

FutureActionPanelAfterActionField.Slot = FutureActionPanelAfterActionFieldSlot;

export default FutureActionPanelAfterActionField;
