import { __ } from "@wordpress/i18n";
import {
    useMemo,
    useEffect,
    useState
} from "@wordpress/element";
import {
    __experimentalVStack as VStack,
    SelectControl
} from "@wordpress/components";
import ToggleInlineSetting from "./toggle-inline-setting";
import apiFetch from "@wordpress/api-fetch";
import { cache } from "react";

const { apiUrl, nonce } = window.futureWorkflowEditor;

let authorsPromise = null;
let cachedAuthors = null;

const getAuthors = () => {
    if (cachedAuthors) {
        return Promise.resolve(cachedAuthors);
    }

    if (!authorsPromise) {
        authorsPromise = apiFetch({
            path: `${apiUrl}/authors`,
            headers: {
                'X-WP-Nonce': nonce,
            },
        }).then(response => {
            cachedAuthors = response;

            return cachedAuthors;
        });
    }
    return authorsPromise;
};

const getAuthorOptions = (authors) => {
    return authors.map(author => ({
        label: author.name,
        value: author.userLogin
    }));
};

export const PostAuthorControl = ({
    name,
    label,
    defaultValue,
    onChange,
    checkboxLabel
}) => {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        getAuthors()
            .then(setAuthors)
            .catch(error => {
                dispatch('core/notices').createErrorNotice(
                    __('Unable to load the list of authors. Please try again.', 'post-expirator')
                );
            });
    }, []);

    defaultValue = {
        authors: [authors[0]?.userLogin],
        update: false,
        ...defaultValue
    };

    const authorOptions = useMemo(() => getAuthorOptions(authors), [authors]);

    const valuePreview = useMemo(() => {
        if (!defaultValue.update || defaultValue.authors.length === 0) {
            return __('Do not update', 'post-expirator');
        }

        return defaultValue.authors.map(author => authorOptions.find(a => a.value === author)?.label).join(', ');
    }, [defaultValue, authorOptions]);

    return (
        <>
            <ToggleInlineSetting
                name={name}
                label={label}
                valuePreview={valuePreview}
                defaultValue={defaultValue}
                checkboxLabel={checkboxLabel}
                onChange={onChange}
                onUncheckUpdate={() => onChange(name, null)}
            >
                <VStack>
                    <SelectControl
                        label={__('Author', 'post-expirator')}
                        value={defaultValue.authors[0]}
                        options={authorOptions}
                        onChange={value => {
                            onChange(name, {
                                authors: [value],
                                update: true
                            });
                        }}
                    />
                </VStack>
            </ToggleInlineSetting>
        </>
    )
}

export default PostAuthorControl;
