import { FormTokenField } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { InlineMultiSelect } from "../inline-multi-select";

export function PostQueryField({ field, settings, onChange }) {
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

    const [fieldSettings, setFieldSettings] = useState(settings);

    const convertListOfLabelsToValues = (list, labels) => {
        return list.filter((item) => labels.includes(item.label)).map((item) => item.value);
    }

    return (
        <>
            {field.description && <div className="settings-field-description">{field.description}</div>}

            <InlineMultiSelect
                label={__('Post Type', 'publishpress-future-pro')}
                value={fieldSettings['postType'] || []}
                suggestions={postTypes}
                expandOnFocus={true}
                autoSelectFirstMatch={true}
                onChange={(selectedValues) => {
                    const newSettings = {
                        ...fieldSettings,
                        postType: selectedValues,
                    };

                    setFieldSettings(newSettings);

                    if (onChange) {
                        onChange(field.name, newSettings);
                    }
                }}
            />

            <FormTokenField
                label="Post ID"
                value={fieldSettings['postId'] || []}
                onChange={(value) => {
                    const newSettings = {
                        ...fieldSettings,
                        postId: value,
                    };

                    setFieldSettings(newSettings);

                    if (onChange) {
                        onChange(field.name, newSettings);
                    }
                }}
            />

            <InlineMultiSelect
                label={__('Post Status', 'publishpress-future-pro')}
                value={fieldSettings['postStatus'] || []}
                suggestions={postStatuses}
                expandOnFocus={true}
                autoSelectFirstMatch={true}
                onChange={(selectedValues) => {
                    const newSettings = {
                        ...fieldSettings,
                        postStatus: selectedValues,
                    };

                    setFieldSettings(newSettings);

                    if (onChange) {
                        onChange(field.name, newSettings);
                    }
                }}
            />
        </>
    );
}

export default PostQueryField;


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
