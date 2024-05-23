import { __ } from "@wordpress/i18n";
import { VariablesTreeSelect } from "../variables-tree-select";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { useEffect } from "@wordpress/element";

export function PostInput({ name, label, defaultValue, onChange, variables, settings }) {
    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const defaultVariable = defaultValue?.variable;

    useEffect(() => {
        onChangeSetting(
            {
                settingName: "variable",
                value: defaultVariable?.id
            }
        );
    }, []);

    return (
        <>
            <VStack>
                <VariablesTreeSelect
                    tree={variables}
                    label={label}
                    selectedId={defaultValue?.variable}
                    onChange={(value) => onChangeSetting({ settingName: "variable", value })}
                />
            </VStack>
        </>
    );
}

export default PostInput;
