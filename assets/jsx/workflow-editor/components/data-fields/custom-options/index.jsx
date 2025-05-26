import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { DescriptionText } from "../description-text";
import { useEffect, useState } from "@wordpress/element";
import OptionItem from "./option-item";
import "./style.css";

export function CustomOptions({
    name,
    label,
    defaultValue,
    onChange,
    settings,
    variables = [],
    helpUrl,
    description,
}) {
    const [autoOpenItem, setAutoOpenItem] = useState(null);

    const onChangeSetting = ({ value }) => {
        if (onChange) {
            onChange(name, value);
        }
    }

    if (!defaultValue || !Array.isArray(defaultValue)) {
        defaultValue = [];
    }

    // If the options are empty or have no value, set the default value
    useEffect(() => {
        if (!defaultValue || !Array.isArray(defaultValue)) {
            defaultValue = [
                {
                    name: 'continue',
                    label: __('Continue', 'post-expirator'),
                    hint: __('Continue the workflow', 'post-expirator'),
                },
                {
                    name: 'cancel',
                    label: __('Cancel', 'post-expirator'),
                    hint: __('Cancel the workflow', 'post-expirator'),
                },
            ];
        }
    }, []);

    const getDefaultName = () => {
        let index = defaultValue.length + 1;
        let name = `option${index}`;

        while (defaultValue.some(option => option.name === name)) {
            index++;
            name = `option${index}`;
        }

        return {
            name,
            index,
        };
    }

    const onClickAddOption = () => {
        const defaultName = getDefaultName();
        const name = defaultName.name;
        const nameIndex = defaultName.index;

        const defaultLabel = sprintf(__('Option %s', 'post-expirator'), nameIndex);

        onChangeSetting({ value: [...defaultValue, { name, label: defaultLabel, hint: '' }] });
        setAutoOpenItem(defaultValue.length);
    }

    const onClickRemoveOption = (index) => {
        onChangeSetting({ value: defaultValue.filter((_, i) => i !== index) });
    }

    const onChangeOption = (index, value) => {
        const newOptions = defaultValue.map((option, i) => i === index ? value : option);
        onChangeSetting({ value: newOptions });
    }

    const hasOnlyOneOption = defaultValue.length === 1;

    return (
        <>
            <VStack className="workflow-editor-panel__row-options-container">
                <label className="workflow-editor-panel__row-options-label">
                    {label}
                </label>
                {defaultValue.map((option, index) => (
                    <div key={`option-${index}`} className="workflow-editor-panel__row-options">
                        <OptionItem
                            name={`options[${index}].name`}
                            label={`#${index + 1}`}
                            popoverLabel={sprintf(__('Option #%s', 'post-expirator'), index + 1)}
                            defaultValue={option}
                            onChange={(value) => onChangeOption(index, value)}
                            autoOpen={autoOpenItem === index}
                            onClosePopover={() => setAutoOpenItem(null)}
                            withExpression={settings?.withExpression}
                            variables={variables}
                        />
                        {! hasOnlyOneOption && (
                            <Button onClick={() => onClickRemoveOption(index)} isSmall={true} iconSize={16} icon={'trash'} />
                        )}
                    </div>
                ))}

                {defaultValue.length === 0 && (
                    <div className="workflow-editor-panel__row-options-empty">
                        {__('No options added to the action.', 'post-expirator')}
                    </div>
                )}

                <Button onClick={onClickAddOption} iconSize={16} icon={'plus'} variant="tertiary">
                    {__('Add a new option', 'post-expirator')}
                </Button>


                {description && (
                    <DescriptionText text={description} helpUrl={helpUrl} />
                )}
            </VStack>
        </>
    );
}

export default CustomOptions;
