import { __ } from "@wordpress/i18n";
import { VariablesTreeSelect } from "../variables-tree-select";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { filterVariableOptionsByDataType } from "../../utils";

export function PostInput({ name, label, defaultValue, onChange, variables, settings }) {
    variables = filterVariableOptionsByDataType(variables, ['post']);

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const defaultVariable = defaultValue?.variable;

    const tree = [
        {
            id: "",
            name: "",
            "children": [],
        },
        ...variables,
    ];

    return (
        <>
            <VStack>
                <VariablesTreeSelect
                    tree={tree}
                    label={label}
                    selectedId={defaultValue?.variable}
                    onChange={(value) => onChangeSetting({ settingName: "variable", value })}
                />
            </VStack>
        </>
    );
}

export default PostInput;
