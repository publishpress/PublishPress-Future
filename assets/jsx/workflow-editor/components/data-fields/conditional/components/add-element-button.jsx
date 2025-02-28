import { Button } from '@wordpress/components';

export const AddElementButton = ({ label, handleOnClick }) => {
    return <Button onClick={handleOnClick} variant="secondary">
        {label}
    </Button>;
};
