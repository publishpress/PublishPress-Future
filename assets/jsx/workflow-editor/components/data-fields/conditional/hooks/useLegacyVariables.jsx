import { useCallback } from '@wordpress/element';

export const useLegacyVariables = () => {
    const convertLegacyVariables = useCallback((legacyQuery) => {
        if (!legacyQuery) return;

        const wrapFieldValue = (field) => {
            if (typeof field !== 'string') return field;
            if (field.startsWith('{{') && field.endsWith('}}')) return field;
            return field;
        };

        const processRules = (rules) => {
            if (!Array.isArray(rules)) return;

            rules.forEach(rule => {
                if (rule.rules) {
                    // Recursively process nested rule groups
                    processRules(rule.rules);
                } else if (rule.field) {
                    // Update the field value if it's not properly wrapped
                    rule.field = wrapFieldValue(rule.field);
                }
            });
        };

        if (legacyQuery.rules) {
            processRules(legacyQuery.rules);
        }
    }, []);

    return [ convertLegacyVariables ];
};
