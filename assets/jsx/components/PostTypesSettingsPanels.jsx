/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import PostTypeSettingsPanel from "./PostTypeSettingsPanel";

const PostTypesSettingsPanels = function (props) {
    let panels = [];

    for (const [postType, postTypeSettings] of Object.entries(props.settings)) {
        panels.push(
            <PostTypeSettingsPanel
                legend={postTypeSettings.label}
                text={props.text}
                postType={postType}
                settings={postTypeSettings}
                expireTypeList={props.expireTypeList}
                taxonomiesList={props.taxonomiesList[postType]}
                key={postType}
            />
        );
    }

    return (panels);
}

export default PostTypesSettingsPanels;
