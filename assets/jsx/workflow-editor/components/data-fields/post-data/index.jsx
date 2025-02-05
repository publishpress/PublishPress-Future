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
                name="date"
                label={__('Post Date', 'post-expirator')}
                defaultValue={defaultValue?.date}
                onChange={(settingName, value) => onChangeSetting({ settingName: "date", value })}
                settings={settings}
                variables={variables}
                checkboxLabel={__("Update the post date", "post-expirator")}
            />
            <PostTextControl
                name="title"
                label={__('Post Title', 'post-expirator')}
                defaultValue={defaultValue?.title}
                onChange={(settingName, value) => onChangeSetting({ settingName: "title", value })}
                settings={settings}
                variables={variables}
                checkboxLabel={__("Update the post title", "post-expirator")}
            />
            <PostTextControl
                name="name"
                label={__('Post Name', 'post-expirator')}
                defaultValue={defaultValue?.name}
                onChange={(settingName, value) => onChangeSetting({ settingName: "name", value })}
                settings={settings}
                variables={variables}
                checkboxLabel={__("Update the post name", "post-expirator")}
            />
            <PostTextControl
                name="content"
                label={__('Post Content', 'post-expirator')}
                defaultValue={defaultValue?.content}
                onChange={(settingName, value) => onChangeSetting({ settingName: "content", value })}
                settings={settings}
                variables={variables}
                checkboxLabel={__("Update the post content", "post-expirator")}
            />
            <PostTextControl
                name="excerpt"
                label={__('Post Excerpt', 'post-expirator')}
                defaultValue={defaultValue?.excerpt}
                onChange={(settingName, value) => onChangeSetting({ settingName: "excerpt", value })}
                settings={settings}
                variables={variables}
                checkboxLabel={__("Update the post excerpt", "post-expirator")}
            />
            <PostDiscussionControl
                name="discussion"
                label={__('Post Discussion', 'post-expirator')}
                defaultValue={defaultValue?.discussion}
                onChange={(settingName, value) => onChangeSetting({ settingName: "discussion", value })}
                checkboxLabel={__("Update the post discussion", "post-expirator")}
            />
            <PostTextControl
                name="password"
                label={__('Post Password', 'post-expirator')}
                defaultValue={defaultValue?.password}
                onChange={(settingName, value) => onChangeSetting({ settingName: "password", value })}
                settings={settings}
                variables={variables}
                checkboxLabel={__("Update the post password", "post-expirator")}
            />
        </VStack>
    );
}

export default PostData;
