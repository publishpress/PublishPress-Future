import { useState, useCallback } from '@wordpress/element';

export const useModalManagement = ({onChange, name, formatCondition, isModalOpenByDefault = false}) => {
    const [isModalOpen, setIsModalOpen] = useState(isModalOpenByDefault);

    const onCloseModal = useCallback(() => {
        if (onChange) {
            onChange(name, formatCondition());
        }

        closeModal();
    }, [closeModal, onChange, name, formatCondition]);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    return {
        isModalOpen,
        onCloseModal,
        openModal,
        closeModal,
        setIsModalOpen
    };
};
