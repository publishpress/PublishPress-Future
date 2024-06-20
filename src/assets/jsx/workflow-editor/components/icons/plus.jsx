import BaseIcon from "./base"

/**
 * Icon FiPlus from 'react-icons/fi'.
 */
export default function PlusIcon({size = 24}) {
    return (
        <BaseIcon size={size}>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </BaseIcon>
    )
}
