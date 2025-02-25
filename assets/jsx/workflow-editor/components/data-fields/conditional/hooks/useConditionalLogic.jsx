import { useState, useCallback } from '@wordpress/element';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';
import { formatQuery, defaultOperators } from 'react-querybuilder';

export const useConditionalLogic = ({defaultValue, name, onChange, variables}) => {
    const [query, setQuery] = useState(
        parseJsonLogic(defaultValue?.json || '')
    );

    const formatCondition = useCallback(() => {
        const jsonCondition = formatQuery(query, {
            format: 'jsonlogic',
            parseNumbers: true,
        });

        const naturalLanguageCondition = formatQuery(query, {
            format: 'natural_language',
            parseNumbers: true,
            fields: variables,
            getOperators: () => defaultOperators,
        });

        return {
            ...defaultValue,
            json: jsonCondition,
            natural: naturalLanguageCondition,
        };
    }, [query, defaultValue, onChange, name, variables]);

    return [query, setQuery, formatCondition];
};
