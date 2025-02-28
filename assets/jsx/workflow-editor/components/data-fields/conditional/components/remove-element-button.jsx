import { Button, Dashicon } from '@wordpress/components';

export const RemoveElementButton = ({ label, handleOnClick }) => {
    return <Button onClick={handleOnClick} variant="secondary" className="conditional-editor-modal-remove-element">
        <Dashicon icon="trash" size={16} />
    </Button>;
};
