import { __ } from "@wordpress/i18n";
import { TreeSelect } from "@wordpress/components";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { useEffect } from "@wordpress/element";

export function PostInput({ name, label, defaultValue, onChange, variables = [] }) {

    let inputOptions = [];

    if (variables.length > 0) {
        variables.forEach((variable) => {
            inputOptions.push({
                name: variable.name,
                id: variable.id,
                children: variable.children,
            });
        });
    }

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    useEffect(() => {
        onChange(name, defaultValue?.variable || inputOptions[0]['id']);
    }, []);

    return (
        <>
            <VStack>
                <TreeSelect
                    label={__("Variable for post", "publishpress-future-pro")}
                    tree={inputOptions}
                    selectedId={defaultValue?.variable}
                    onChange={(value) => onChangeSetting({ settingName: "variable", value })}
                />
            </VStack>
        </>
    );
}

export default PostInput;
