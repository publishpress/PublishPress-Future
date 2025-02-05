import { __ } from "@wordpress/i18n";
import {
    useCallback,
    useMemo
} from "@wordpress/element";
import {
    __experimentalVStack as VStack
} from "@wordpress/components";
import InlineSetting from "./inline-setting";
import { ExpressionBuilder } from "../expression-builder";

export const PostTitleControl = ({
    name,
    label,
    defaultValue,
    onChange,
    variables = [],
    settings
}) => {
    defaultValue = {
        expression: "",
        ...defaultValue
    };

    const onChangeSetting = useCallback(({ settingName, value }) => {
        const newValue = { ...defaultValue };

        if (onChange) {
            onChange(name, value);
        }
    }, [defaultValue, name, onChange]);

    const valuePreview = useMemo(() => {
        if (defaultValue.expression !== '') {
            return defaultValue.expression;
        }

        return __('Unchanged', 'post-expirator');
    }, [defaultValue]);

    return (
        <>
            <InlineSetting
                name={name}
                label={label}
                valuePreview={valuePreview}
            >
                <VStack>
                    <ExpressionBuilder
                        name={name}
                        label={label}
                        defaultValue={defaultValue}
                        onChange={(settingName, value) => onChangeSetting({ settingName: "postTitle", value })}
                        variables={variables}
                    />
                </VStack>
            </InlineSetting>
        </>
    )
}

export default PostTitleControl;
