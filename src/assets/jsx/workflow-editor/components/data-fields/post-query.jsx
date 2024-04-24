import { FormTokenField, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { InlineMultiSelect } from "../inline-multi-select";
import BaseField from "./base-field";
import { __experimentalVStack as VStack } from "@wordpress/components";

export function PostQuery({ name, label, defaultValue, onChange }) {
    const postTypes = [
        { label: "Post", value: "post" },
        { label: "Page", value: "page" },
    ];

    const postStatuses = [
        { label: "Published", value: "publish" },
        { label: "Draft", value: "draft" },
        { label: "Pending", value: "pending" },
        { label: "Private", value: "private" },
        { label: "Trash", value: "trash" },
    ];

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    return (
        <>
            <VStack>
                <InlineMultiSelect
                    label={__('Post Type', 'publishpress-future-pro')}
                    value={defaultValue?.postType || []}
                    suggestions={postTypes}
                    expandOnFocus={true}
                    autoSelectFirstMatch={true}
                    onChange={(value) => onChangeSetting({ settingName: "postType", value })}
                />

                <FormTokenField
                    label="Post ID"
                    value={defaultValue?.postId || []}
                    onChange={(value) => onChangeSetting({ settingName: "postId", value })}
                />

                <InlineMultiSelect
                    label={__('Post Status', 'publishpress-future-pro')}
                    value={defaultValue?.postStatus || []}
                    suggestions={postStatuses}
                    expandOnFocus={true}
                    autoSelectFirstMatch={true}
                    onChange={(value) => onChangeSetting({ settingName: "postStatus", value })}
                />

                <ToggleControl
                    label="Only new posts"
                    checked={defaultValue?.onlyNewPosts || false}
                    onChange={(value) => onChangeSetting({ settingName: "onlyNewPosts", value })}
                />
            </VStack>
        </>
    );
}

export default PostQuery;


/*
Complex query, maybe for the conditional node type?

* post new status
* post old status
* post author (one or more)
* post author role (one or more)
* post author capability (one or more)
* post taxonomy (one or more, taxonomy and terms)
* post title (equals, contains, starts with, ends with)
* post content (equals, contains, starts with, ends with)
* post excerpt (equals, contains, starts with, ends with)
* post date (before, after, between)
* post modified date (before, after, between)
* post parent
* post slug (equals, contains, starts with, ends with)
* meta data (key, value, compare)
* user meta data (key, value, compare)
* user role (one or more)
* user capability (one or more)
* user email (equals, contains, starts with, ends with)
* user login (equals, contains, starts with, ends with)
* user nicename (equals, contains, starts with, ends with)
*/
