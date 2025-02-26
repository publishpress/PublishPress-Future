import { createContext, useContext, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '../components/editor-store';

// Create the context
const ProContext = createContext({ isPro: false });

export const ProFeaturesProvider = ({ children }) => {
    const isPro = useSelect((select) => select(editorStore).isPro(), []);

    const value = useMemo(() => ({ isPro }), [isPro]);

    return (
        <ProContext.Provider value={value}>
            {children}
        </ProContext.Provider>
    );
};

export const useProContext = () => {
    const context = useContext(ProContext);

    if (context === undefined) {
        throw new Error('useProContext must be used within a ProFeaturesProvider');
    }

    return context;
};

export const useIsPro = () => {
    const { isPro } = useProContext();
    return isPro;
};
