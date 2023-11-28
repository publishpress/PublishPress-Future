/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import TrueFalseField from "./fields/TrueFalseField";
import SettingRow from "./SettingRow";
import SettingsFieldset from "./SettingsFieldset";
import SettingsTable from "./SettingsTable";
import SelectField from "./fields/SelectField";
import TextField from "./fields/TextField";
import TokensField from "./fields/TokensField";

const PostTypeSettingsPanel = function (props) {
    const { useState, useEffect } = wp.element;
    const { addQueryArgs } = wp.url;
    const { applyFilters } = wp.hooks;
    const { apiFetch } = wp;

    const [postTypeTaxonomy, setPostTypeTaxonomy] = useState(props.settings.taxonomy);
    const [termOptions, setTermOptions] = useState([]);
    const [termsSelectIsLoading, setTermsSelectIsLoading] = useState(false);
    const [selectedTerms, setSelectedTerms] = useState([]);
    const [settingHowToExpire, setSettingHowToExpire] = useState(props.settings.howToExpire);
    const [settingActive, setSettingActive] = useState(props.settings.active);

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
        setSettingActive(value);
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

        console.log('options', termOptions);

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
                console.log('Taxonomy terms error', error);
                setTermsSelectIsLoading(false);
            });
        }
    }, [postTypeTaxonomy]);

    const termOptionsLabels = termOptions.map((term) => term.label);
    console.log('postType', props.postType);
    console.log('termOptionsLabels', termOptionsLabels);
    console.log('selectedTerms', selectedTerms);

    let settingsRows = [
        <SettingRow label={props.text.fieldActive} key={'expirationdate_activemeta-' + props.postType}>
            <TrueFalseField
                name={'expirationdate_activemeta-' + props.postType}
                trueLabel={props.text.fieldActiveTrue}
                trueValue={'active'}
                falseLabel={props.text.fieldActiveFalse}
                falseValue={'inactive'}
                description={props.text.fieldActiveDescription}
                selected={props.settings.active}
                onChange={onChangeActive}
            />
        </SettingRow>
    ];

    if (settingActive) {
        settingsRows.push(
            <SettingRow label={props.text.fieldAutoEnable} key={'expirationdate_autoenable-' + props.postType}>
                <TrueFalseField
                    name={'expirationdate_autoenable-' + props.postType}
                    trueLabel={props.text.fieldAutoEnableTrue}
                    trueValue={'1'}
                    falseLabel={props.text.fieldAutoEnableFalse}
                    falseValue={'0'}
                    description={props.text.fieldAutoEnableDescription}
                    selected={props.settings.autoEnabled}
                />
            </SettingRow>
        );

        settingsRows.push(
            <SettingRow label={props.text.fieldTaxonomy} key={'expirationdate_taxonomy-' + props.postType}>
                <SelectField
                    name={'expirationdate_taxonomy-' + props.postType}
                    options={props.taxonomiesList}
                    selected={postTypeTaxonomy}
                    noItemFoundMessage={props.text.noItemsfound}
                    data={props.postType}
                    onChange={onChangeTaxonomy}
                >
                </SelectField>
            </SettingRow>
        );

        console.log('settingHowToExpire', settingHowToExpire);
        console.log('props.taxonomiesList', props.taxonomiesList);

        // Remove items from expireTypeList if related to taxonomies and there is no taxonmoy for the post type
        if (props.taxonomiesList.length === 0) {
            props.expireTypeList[props.postType] = props.expireTypeList[props.postType].filter((item) => {
                return ['category', 'category-add', 'category-remove'].indexOf(item.value) === -1;
            });
        }

        settingsRows.push(
            <SettingRow label={props.text.fieldHowToExpire} key={'expirationdate_expiretype-' + props.postType}>
                <SelectField
                    name={'expirationdate_expiretype-' + props.postType}
                    className={'pe-howtoexpire'}
                    options={props.expireTypeList[props.postType]}
                    description={props.text.fieldHowToExpireDescription}
                    selected={settingHowToExpire}
                    onChange={onChangeHowToExpire}
                />

                {(props.taxonomiesList.length > 0 && (['category', 'category-add', 'category-remove'].indexOf(settingHowToExpire) > -1)) &&
                    <TokensField
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
                <TextField
                    name={'expired-custom-date-' + props.postType}
                    value={props.settings.defaultExpireOffset}
                    placeholder={props.settings.globalDefaultExpireOffset}
                    description={props.text.fieldDefaultDateTimeOffsetDescription}
                    unescapedDescription={true}
                />
            </SettingRow>
        );

        settingsRows.push(
            <SettingRow label={props.text.fieldWhoToNotify} key={'expirationdate_emailnotification-' + props.postType}>
                <TextField
                    name={'expirationdate_emailnotification-' + props.postType}
                    className="large-text"
                    value={props.settings.emailNotification}
                    description={props.text.fieldWhoToNotifyDescription}
                />
            </SettingRow>
        );
    }

    settingsRows = applyFilters('expirationdate_settings_posttype', settingsRows, props, settingActive, useState);

    return (
        <SettingsFieldset legend={props.legend}>
            <SettingsTable bodyChildren={settingsRows} />
        </SettingsFieldset>
    );
}

export default PostTypeSettingsPanel;
