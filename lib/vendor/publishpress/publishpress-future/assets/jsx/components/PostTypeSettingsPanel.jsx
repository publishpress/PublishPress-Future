/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {
    SettingRow,
    SettingsFieldset,
    SettingsTable,
    SelectControl,
    TextControl,
    TokensControl,
    CheckboxControl
} from './';

export const PostTypeSettingsPanel = function (props) {
    const { useState, useEffect } = wp.element;
    const { addQueryArgs } = wp.url;
    const { applyFilters } = wp.hooks;
    const { apiFetch } = wp;

    const [postTypeTaxonomy, setPostTypeTaxonomy] = useState(props.settings.taxonomy);
    const [termOptions, setTermOptions] = useState([]);
    const [termsSelectIsLoading, setTermsSelectIsLoading] = useState(false);
    const [selectedTerms, setSelectedTerms] = useState([]);
    const [settingHowToExpire, setSettingHowToExpire] = useState(props.settings.howToExpire);
    const [isActive, setIsActive] = useState(props.settings.active);
    const [expireOffset, setExpireOffset] = useState(props.settings.defaultExpireOffset);
    const [emailNotification, setEmailNotification] = useState(props.settings.emailNotification);
    const [isAutoEnabled, setIsAutoEnabled] = useState(props.settings.autoEnabled);

    const onChangeTaxonomy = function (value) {
        setPostTypeTaxonomy(value);
    };

    const onChangeTerms = (value) => {
        setSelectedTerms(value);
    };

    const onChangeHowToExpire = (value) => {
        setSettingHowToExpire(value);
    }

    const onChangeActive = (value) => {
        setIsActive(value);
    }

    const onChangeExpireOffset = (value) => {
        setExpireOffset(value);
    }

    const onChangeEmailNotification = (value) => {
        setEmailNotification(value);
    }

    const onChangeAutoEnabled = (value) => {
        setIsAutoEnabled(value);
    }

    useEffect(() => {
        const updateTermsOptionsState = (list) => {
            let options = [];

            let settingsTermsOptions = null;
            let option;
            list.forEach(term => {
                option = { value: term.id, label: term.name };
                options.push(option);

                if (postTypeTaxonomy === props.settings.taxonomy && props.settings.terms.includes(term.id)) {
                    if (settingsTermsOptions === null) {
                        settingsTermsOptions = [];
                    }

                    settingsTermsOptions.push(option.label);
                }
            });

            setTermOptions(options);
            setTermsSelectIsLoading(false);
            setSelectedTerms(settingsTermsOptions);
        };

        if ((!postTypeTaxonomy && props.postType === 'post') || postTypeTaxonomy === 'category') {
            setTermsSelectIsLoading(true);
            apiFetch({
                path: addQueryArgs(`wp/v2/categories`, { per_page: -1 }),
            }).then(updateTermsOptionsState);
        } else {
            if (!postTypeTaxonomy || !props.taxonomiesList) {
                return;
            }

            setTermsSelectIsLoading(true);
            apiFetch({
                path: addQueryArgs(`wp/v2/taxonomies/${postTypeTaxonomy}`),
            }).then((taxAttributes) => {
                // fetch all terms
                apiFetch({
                    path: addQueryArgs(`wp/v2/${taxAttributes.rest_base}`),
                }).then(updateTermsOptionsState);
            }).catch((error) => {
                console.debug('Taxonomy terms error', error);
                setTermsSelectIsLoading(false);
            });
        }
    }, [postTypeTaxonomy]);

    const termOptionsLabels = termOptions.map((term) => term.label);

    let settingsRows = [
        <SettingRow label={props.text.fieldActive} key={'expirationdate_activemeta-' + props.postType}>
            <CheckboxControl
                name={'expirationdate_activemeta-' + props.postType}
                checked={isActive || false}
                label={props.text.fieldActiveLabel}
                onChange={onChangeActive}
            />
        </SettingRow>
    ];

    if (isActive) {
        settingsRows.push(
            <SettingRow label={props.text.fieldAutoEnable} key={'expirationdate_autoenable-' + props.postType}>
                <CheckboxControl
                    name={'expirationdate_autoenable-' + props.postType}
                    checked={isAutoEnabled || false}
                    label={props.text.fieldAutoEnableLabel}
                    onChange={onChangeAutoEnabled}
                />
            </SettingRow>
        );

        settingsRows.push(
            <SettingRow label={props.text.fieldTaxonomy} key={'expirationdate_taxonomy-' + props.postType}>
                <SelectControl
                    name={'expirationdate_taxonomy-' + props.postType}
                    options={props.taxonomiesList}
                    selected={postTypeTaxonomy}
                    noItemFoundMessage={props.text.noItemsfound}
                    data={props.postType}
                    onChange={onChangeTaxonomy}
                >
                </SelectControl>
            </SettingRow>
        );

        // Remove items from expireTypeList if related to taxonomies and there is no taxonmoy for the post type
        if (props.taxonomiesList.length === 0) {
            props.expireTypeList[props.postType] = props.expireTypeList[props.postType].filter((item) => {
                return ['category', 'category-add', 'category-remove'].indexOf(item.value) === -1;
            });
        }

        settingsRows.push(
            <SettingRow label={props.text.fieldHowToExpire} key={'expirationdate_expiretype-' + props.postType}>
                <SelectControl
                    name={'expirationdate_expiretype-' + props.postType}
                    className={'pe-howtoexpire'}
                    options={props.expireTypeList[props.postType]}
                    description={props.text.fieldHowToExpireDescription}
                    selected={settingHowToExpire}
                    onChange={onChangeHowToExpire}
                />

                {(props.taxonomiesList.length > 0 && (['category', 'category-add', 'category-remove'].indexOf(settingHowToExpire) > -1)) &&
                    <TokensControl
                        label={props.text.fieldTerm}
                        name={'expirationdate_terms-' + props.postType}
                        options={termOptionsLabels}
                        value={selectedTerms}
                        isLoading={termsSelectIsLoading}
                        onChange={onChangeTerms}
                        description={props.text.fieldTermDescription}
                    />
                }
            </SettingRow>
        );

        settingsRows.push(
            <SettingRow label={props.text.fieldDefaultDateTimeOffset} key={'expired-custom-date-' + props.postType}>
                <TextControl
                    name={'expired-custom-date-' + props.postType}
                    value={expireOffset}
                    placeholder={props.settings.globalDefaultExpireOffset}
                    description={props.text.fieldDefaultDateTimeOffsetDescription}
                    unescapedDescription={true}
                    onChange={onChangeExpireOffset}
                />
            </SettingRow>
        );

        settingsRows.push(
            <SettingRow label={props.text.fieldWhoToNotify} key={'expirationdate_emailnotification-' + props.postType}>
                <TextControl
                    name={'expirationdate_emailnotification-' + props.postType}
                    className="large-text"
                    value={emailNotification}
                    description={props.text.fieldWhoToNotifyDescription}
                    onChange={onChangeEmailNotification}
                />
            </SettingRow>
        );
    }

    settingsRows = applyFilters('expirationdate_settings_posttype', settingsRows, props, isActive, useState);

    return (
        <SettingsFieldset legend={props.legend}>
            <SettingsTable bodyChildren={settingsRows} />
        </SettingsFieldset>
    );
}
