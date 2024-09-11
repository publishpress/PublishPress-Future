import { FormTokenField, RadioControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { InlineMultiSelect } from "../inline-multi-select";
import { __experimentalVStack as VStack } from "@wordpress/components";


export function PostQuery({ name, label, defaultValue, onChange, settings }) {
    const postTypes = futureWorkflowEditor.postTypes;
    const postStatuses = futureWorkflowEditor.postStatuses;

    const onChangeSetting = ({ settingName, value }) => {
        const newValue = { ...defaultValue };
        newValue[settingName] = value;

        if (onChange) {
            onChange(name, newValue);
        }
    }

    const acceptsInput = settings && settings?.acceptsInput === true;
    const defaultPostSource =acceptsInput ? 'input' : 'custom';
    const showCustomQueryFields = defaultValue?.postSource === 'custom' || ! acceptsInput;

    // Set default setting
    useEffect(() => {
        if (!defaultValue) {
            defaultValue = {
                postSource: defaultPostSource,
                postType: [],
                postId: [],
                postStatus: [],
            };

            onChangeSetting({ settingName: "postSource", value: defaultPostSource });
        }
    }, []);

    return (
        <>
            <VStack>
                {acceptsInput && (
                    <RadioControl
                        label={__('Post selection', 'post-expirator')}
                        selected={defaultValue?.postSource || defaultPostSource}
                        options={[
                            { label: __('Post received as input', 'post-expirator'), value: 'input' },
                            { label: __('Custom query', 'post-expirator'), value: 'custom' },
                        ]}
                        onChange={(value) => onChangeSetting({ settingName: "postSource", value })}
                    />
                )}

                {/* More than one post input? */}

                {showCustomQueryFields && (
                    <>
                        <InlineMultiSelect
                            label={__('Post Type', 'post-expirator')}
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
                            label={__('Post Status', 'post-expirator')}
                            value={defaultValue?.postStatus || []}
                            suggestions={postStatuses}
                            expandOnFocus={true}
                            autoSelectFirstMatch={true}
                            onChange={(value) => onChangeSetting({ settingName: "postStatus", value })}
                        />
                    </>
                )}
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
