import { QueryBuilder, formatQuery, defaultOperators } from 'react-querybuilder';
import { parseJsonLogic } from 'react-querybuilder/parseJsonLogic';
import { useState } from '@wordpress/element';
import { Button, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '../editor-store';
import { useSelect } from '@wordpress/data';

import 'react-querybuilder/dist/query-builder.css';

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

    const togglePopover = () => setIsPopoverVisible((prev) => !prev);

    const onSave = () => {
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

        onClose();
    }

    const onClose = () => {
        togglePopover();
    }

    const onCancel = () => {
        onClose();
    }

    const fields = [
        ...allVariables,
    ];

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
                    <div style={{ padding: '20px', minWidth: '400px' }}>
                        <QueryBuilder
                            fields={fields}
                            onQueryChange={setQuery}
                            query={query}
                            addRuleToNewGroups
                            parseNumbers="strict-limited"
                            showCombinatorsBetweenRules
                            showNotToggle
                            controlClassnames={{
                                queryBuilder: 'queryBuilder-branches',
                            }}
                        />
                    </div>
                    <Button onClick={onSave}>{__('Save', 'post-expirator')}</Button>
                    <Button onClick={onCancel}>{__('Cancel', 'post-expirator')}</Button>
                </Popover>
            )}
        </div>
    );
    return <QueryBuilder />;
};

export default Conditional;
