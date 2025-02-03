import { SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { __experimentalVStack as VStack } from "@wordpress/components";


export function PostData({ name, label, defaultValue, onChange, settings }) {
    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <>

        </>
    );
}

export default PostData;
