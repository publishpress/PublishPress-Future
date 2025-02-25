import { useState, useCallback } from '@wordpress/element';

export const useModalManagement = ({onChange, name, formatCondition, isModalOpenByDefault = false}) => {
    const [isModalOpen, setIsModalOpen] = useState(isModalOpenByDefault);

    const onCloseModal = useCallback(() => {
        if (onChange) {
            onChange(name, formatCondition());
        }

        setIsModalOpen(false);
    }, [setIsModalOpen, onChange, name, formatCondition]);

    return [ isModalOpen, setIsModalOpen, onCloseModal ];
};
