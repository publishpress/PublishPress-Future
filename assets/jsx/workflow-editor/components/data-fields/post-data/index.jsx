import { __ } from "@wordpress/i18n";
import {
    __experimentalVStack as VStack,
    __experimentalHStack as HStack,
    PanelRow,
} from "@wordpress/components";
import { PostDateControl } from "./post-date";
import { PostTextControl } from "./post-text";
import { PostDiscussionControl } from "./post-discussion";
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
            <PostTextControl
                name="postTitle"
                label={__('Post Title', 'post-expirator')}
                defaultValue={defaultValue?.postTitle}
                onChange={(settingName, value) => onChangeSetting({ settingName: "postTitle", value })}
                settings={settings}
                variables={variables}
            />
            <PostTextControl
                name="postContent"
                label={__('Post Content', 'post-expirator')}
                defaultValue={defaultValue?.postContent}
                onChange={(settingName, value) => onChangeSetting({ settingName: "postContent", value })}
                settings={settings}
                variables={variables}
            />
            <PostTextControl
                name="postExcerpt"
                label={__('Post Excerpt', 'post-expirator')}
                defaultValue={defaultValue?.postExcerpt}
                onChange={(settingName, value) => onChangeSetting({ settingName: "postExcerpt", value })}
                settings={settings}
                variables={variables}
            />
            <PostDiscussionControl
                name="postDiscussion"
                label={__('Post Discussion', 'post-expirator')}
                defaultValue={defaultValue?.postDiscussion}
                onChange={(settingName, value) => onChangeSetting({ settingName: "postDiscussion", value })}
            />
        </VStack>
    );
}

export default PostData;
