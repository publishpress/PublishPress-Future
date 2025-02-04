import { __ } from "@wordpress/i18n";
import {
    __experimentalVStack as VStack,
    __experimentalHStack as HStack,
    PanelRow,
} from "@wordpress/components";
import { PostDateControl } from "./post-date";

export function PostData({ name, label, defaultValue, onChange, settings, variables }) {
    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <PanelRow>
            <VStack>
                <HStack className="workflow-editor-panel__row">
                    <PostDateControl
                        name="postDate"
                        label={__('Post Date', 'post-expirator')}
                        defaultValue={defaultValue?.postDate}
                        onChange={(settingName, value) => onChangeSetting({ settingName: "postDate", value })}
                        settings={settings}
                        variables={variables}
                    />
                </HStack>
            </VStack>
        </PanelRow>
    );
}

export default PostData;
