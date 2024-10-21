import { QueryBuilder, formatQuery, defaultOperators } from 'react-querybuilder';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';
import { useState, useMemo, useCallback } from '@wordpress/element';
import { Button, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '../editor-store';
import { useSelect } from '@wordpress/data';

import 'react-querybuilder/dist/query-builder.css';
import { __experimentalHStack as HStack, __experimentalHeading as Heading } from '@wordpress/components';

export const Conditional = ({ name, label, defaultValue, onChange, variables }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [query, setQuery] = useState(
        parseJsonLogic(
            defaultValue?.json ?
                defaultValue.json :
                ''
        )
    );

    const {
        isPro,
    } = useSelect((select) => ({
        isPro: select(editorStore).isPro(),
    }));

    const allVariables = useMemo(() => {
        let allVariables = [];

        for (const variable of variables) {
            if (variable.children) {
                for (const child of variable.children) {
                    allVariables.push({
                        name: child.id,
                        label: child.name,
                    });
                }
            } else {
                allVariables.push({
                    name: variable.id,
                    label: variable.name,
                });
            }
        }

        return allVariables;
    }, [variables]);

    const togglePopover = useCallback(() => setIsPopoverVisible((prev) => !prev), []);

    const onClose = useCallback(() => {
        const jsonCondition = formatQuery(
            query,
            {
                format: 'jsonlogic',
                parseNumbers: true,
            }
        );

        const naturalLanguageCondition = formatQuery(
            query,
            {
                format: 'natural_language',
                parseNumbers: true,
                fields: allVariables,
                getOperators: () => defaultOperators,
            }
        );

        const newValue = { ...defaultValue };
        newValue.json = jsonCondition;
        newValue.natural = naturalLanguageCondition;

        if (onChange) {
            onChange(name, newValue);
        }

        togglePopover();
    }, [query, allVariables, onChange, name, defaultValue]);

    return (
        <div>
            <Button onClick={togglePopover} variant="secondary">
                {__('Edit condition', 'post-expirator')}
            </Button>

            {defaultValue?.natural && (
                <div className="condition-natural-language">{defaultValue.natural}</div>
            )}

            {! isPro && (
                <div className="condition-pro-features-notice">
                    <p>{__('This conditional will only be evaluated in the Pro version. In the Free version, it will always return true.', 'post-expirator')}</p>
                </div>
            )}

            {isPopoverVisible && (
                <Popover onClose={onClose}>
                    <div style={{ padding: '20px', minWidth: '400px' }} onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            onClose();
                        }
                    }}>
                        <HStack>
                            <Heading level={2} className="block-editor-inspector-popover-header__heading">{__('Condition', 'post-expirator')}</Heading>
                            <Button onClick={onClose} icon="no-alt" className='block-editor-inspector-popover-header__action' />
                        </HStack>

                        <QueryBuilder
                            fields={allVariables}
                            onQueryChange={setQuery}
                            query={query}
                            addRuleToNewGroups
                            parseNumbers="strict-limited"
                            showCombinatorsBetweenRules
                            showNotToggle
                            controlClassnames={{
                                queryBuilder: 'queryBuilder-branches',
                            }}
                            translations={{
                                addGroup: { label: __('Add Group', 'post-expirator') },
                                addRule: { label: __('Add Rule', 'post-expirator') }
                            }}
                        />
                    </div>
                </Popover>
            )}
        </div>
    );
    return <QueryBuilder />;
};

export default Conditional;
