import { __ } from "@wordpress/i18n";
import {
    __experimentalVStack as VStack,
    __experimentalHStack as HStack,
    PanelRow,
} from "@wordpress/components";
import { PostDateControl } from "./post-date";
import { PostTitleControl } from "./post-title";

export function PostData({ name, label, defaultValue, onChange, settings, variables }) {
    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <VStack>
            <PostDateControl
                name="postDate"
                label={__('Post Date', 'post-expirator')}
                defaultValue={defaultValue?.postDate}
                onChange={(settingName, value) => onChangeSetting({ settingName: "postDate", value })}
                settings={settings}
                variables={variables}
            />
            <PostTitleControl
                name="postTitle"
                label={__('Post Title', 'post-expirator')}
                defaultValue={defaultValue?.postTitle}
                onChange={(settingName, value) => onChangeSetting({ settingName: "postTitle", value })}
                settings={settings}
                variables={variables}
            />
        </VStack>
    );
}

export default PostData;
