import { __ } from "@wordpress/i18n";
import {
    useMemo,
    useCallback
} from "@wordpress/element";
import {
    __experimentalVStack as VStack,
    RadioControl,
    CheckboxControl,
    ExternalLink
} from "@wordpress/components";
import InlineSetting from "./inline-setting";

export const PostDiscussionControl = ({
    name,
    label,
    defaultValue,
    onChange,
    variables = [],
    settings
}) => {
    defaultValue = {
        commentStatus: "",
        pingStatus: "",
        ...defaultValue
    };

    const valuePreview = useMemo(() => {
        const { commentStatus, pingStatus } = defaultValue;

        if (!commentStatus && !pingStatus) {
            return 'Unchanged';
        }

        const statusMap = {
            'open:closed': __('Comments only', 'post-expirator'),
            'closed:closed': __('Closed', 'post-expirator'),
            'closed:open': __('Pings only', 'post-expirator'),
            'open:open': __('Open', 'post-expirator')
        };

        const normalizedPingStatus = pingStatus || 'closed';

        const key = `${commentStatus}:${normalizedPingStatus}`;

        return statusMap[key] || __('Changed...', 'post-expirator');
    }, [defaultValue]);

    const radioOptions = [
        {
            label: __("Open", "post-expirator"),
            value: "open",
            description: __("Visitors can add new comments and replies.", "post-expirator"),
        },
        {
            label: __("Closed", "post-expirator"),
            value: "closed",
            description: __("Visitors can not add new comments or replies. Existing comments remain visible.", "post-expirator"),
        },
    ];

    const onChangeStatus = useCallback((value) => {
        if (value) {
            onChange(name, {
                pingStatus: 'open',
                commentStatus: 'open'
            });
        } else {
            onChange(name, {
                pingStatus: '',
                commentStatus: ''
            });
        }
    }, [onChange, name]);

    const onChangeRadio = useCallback((value) => {
        onChange(name, {
            commentStatus: value,
            pingStatus: defaultValue.pingStatus
        });
    }, [onChange, name, defaultValue]);

    const onChangePingbacks = useCallback((value) => {
        onChange(name, {
            pingStatus: value ? 'open' : 'closed',
            commentStatus: defaultValue.commentStatus
        });
    }, [onChange, name, defaultValue]);

    return (
        <>
            <InlineSetting
                name={name}
                label={label}
                valuePreview={valuePreview}
            >
                <VStack>
                    <CheckboxControl
                        label={__("Update the post discussion status", "post-expirator")}
                        checked={defaultValue.pingStatus !== '' || defaultValue.commentStatus !== ''}
                        onChange={onChangeStatus}
                    />

                    {(defaultValue.pingStatus !== '' || defaultValue.commentStatus !== '') && (
                        <>
                            <RadioControl
                                options={radioOptions}
                                selected={defaultValue.commentStatus}
                                onChange={onChangeRadio}
                            />

                            <CheckboxControl
                                label={__("Enable pinbacks & trackbacks", "post-expirator")}
                                checked={defaultValue.pingStatus === 'open'}
                                onChange={onChangePingbacks}
                            />
                            <ExternalLink
                                href="https://wordpress.org/documentation/article/trackbacks-and-pingbacks/"
                            >
                                {__("Learn more about pinbacks & trackbacks", "post-expirator")}
                            </ExternalLink>
                        </>
                    )}
                </VStack>
            </InlineSetting>
        </>
    )
}

export default PostDiscussionControl;
