/*
 * Copyright (c) 2024, Ramble Ventures
 */

import { PostTypeSettingsPanel } from "./";
import { useState } from "@wordpress/element";

export const PostTypesSettingsPanels = function (props) {
    const [currentTab, setCurrentTab] = useState(Object.keys(props.settings)[0]);

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
                statusesList={props.statusesList[postType]}
                key={`${postType}-panel`}
                onDataIsValid={props.onDataIsValid}
                onDataIsInvalid={props.onDataIsInvalid}
                onValidationStarted={props.onValidationStarted}
                onValidationFinished={props.onValidationFinished}
                isVisible={currentTab === postType}
            />
        );
    }

    const onSelectTab = (event) => {
        event.preventDefault();
        setCurrentTab(event.target.hash.replace('#', '').replace('-panel', ''));
    }

    let tabs = [];
    let selected = false;

    for (const [postType, postTypeSettings] of Object.entries(props.settings)) {
        selected = currentTab === postType;
        tabs.push(
            <a href={`#${postType}-panel`}
                className={"nav-tab " + (selected ? 'nav-tab-active':'')}
                key={`${postType}-tab`}
                onClick={onSelectTab}
            >
                {postTypeSettings.label}
            </a>
        );
    }

    return (
        <div>
            <nav className="nav-tab-wrapper">
                {tabs}
            </nav>
            {panels}
        </div>
    );
}

