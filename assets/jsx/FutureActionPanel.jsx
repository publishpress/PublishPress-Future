const { PanelRow, DateTimePicker, CheckboxControl, SelectControl, FormTokenField, Spinner } = wp.components;
const { Fragment } = wp.element;
const { decodeEntities } = wp.htmlEntities;
const { useEffect } = React;
const { addQueryArgs } = wp.url;
const {
    useSelect,
    useDispatch,
    select
} = wp.data;
const { apiFetch } = wp;
const {compact} = './utils';

export const FutureActionPanel = (props) => {
    const action = useSelect((select) => select('publishpress-future/future-action').getAction(), []);
    const date = useSelect((select) => select('publishpress-future/future-action').getDate(), []);
    const enabled = useSelect((select) => select('publishpress-future/future-action').getEnabled(), []);
    const terms = useSelect((select) => select('publishpress-future/future-action').getTerms(), []);
    const taxonomy = useSelect((select) => select('publishpress-future/future-action').getTaxonomy(), []);
    const taxonomyName = useSelect((select) => select('publishpress-future/future-action').getTaxonomyName(), []);
    const termsListByName = useSelect((select) => select('publishpress-future/future-action').getTermsListByName(), []);
    const termsListById = useSelect((select) => select('publishpress-future/future-action').getTermsListById(), []);
    const isFetchingTerms = useSelect((select) => select('publishpress-future/future-action').getIsFetchingTerms(), []);

    const {
        setAction,
        setDate,
        setEnabled,
        setTerms,
        setTaxonomy,
        setTermsListByName,
        setTermsListById,
        setTaxonomyName,
        setIsFetchingTerms
    } = useDispatch('publishpress-future/future-action');

    const mapTermsListById = (terms) => {
        return terms.map((term) => {
            return termsListById[term];
        });
    }

    const mapTermsListByName = (terms) => {
        return terms.map((term) => {
            return termsListByName[term].id;
        });
    }

    const callOnChangeData = () => {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData({
                enabled: enabled,
                action: action,
                date: date,
                terms: terms,
                taxonomy: taxonomy
            });
        }
    }

    const handleEnabledChange = (isChecked) => {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            // setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData();
    }

    const handleActionChange = (value) => {
        setAction(value);

        callOnChangeData();
    }

    const handleDateChange = (value) => {
        const date = new Date(value).getTime() / 1000;

        setDate(date);

        callOnChangeData();
    }

    const handleTermsChange = (value) => {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData();
    }

    const fetchTerms = () => {
        let termsListByName = {};
        let termsListById = {};

        setIsFetchingTerms(true);

        if ((!taxonomy && props.postType === 'post') || taxonomy === 'category') {
            apiFetch({
                path: addQueryArgs('wp/v2/categories', { per_page: -1 }),
            }).then((list) => {
                list.forEach(cat => {
                    termsListByName[cat.name] = cat;
                    termsListById[cat.id] = cat.name;
                });

                setTermsListByName(termsListByName);
                setTermsListById(termsListById);
                setTaxonomyName(props.strings.category);
                setIsFetchingTerms(false);
            });
        } else {
            apiFetch({
                path: addQueryArgs(`publishpress-future/v1/taxonomies/` + props.postType),
            }).then((response) => {
                if (parseInt(response.count) > 0) {
                    apiFetch({
                        path: addQueryArgs(`wp/v2/taxonomies/${taxonomy}`, { context: 'edit', per_page: -1 }),
                    }).then((taxonomyAttributes) => {
                        // fetch all terms
                        apiFetch({
                            path: addQueryArgs(`wp/v2/${taxonomyAttributes.rest_base}`, { context: 'edit', per_page: -1 }),
                        }).then((terms) => {
                            terms.forEach(term => {
                                termsListByName[decodeEntities(term.name)] = term;
                                termsListById[term.id] = decodeEntities(term.name);
                            });

                            setTermsListByName(termsListByName);
                            setTermsListById(termsListById);
                            setTaxonomyName(decodeEntities(taxonomyAttributes.name));
                            setIsFetchingTerms(false);
                        });
                    });
                }
            });
        }
    }

    useEffect(() => {
        setEnabled(props.enabled);
        setAction(props.action);
        setDate((new Date(props.date)).getTime() / 1000);
        setTerms(props.terms);
        setTaxonomy(props.taxonomy);

        // We need to get the value directly from the store because the value from the state is not updated yet
        if (props.enabled) {
            if (props.isCleanNewPost) {
                handleEnabledChange(true);
            }

            fetchTerms();
        }
    }, []);

    let selectedTerms = [];
    if (terms && terms.length > 0 && termsListById) {
        selectedTerms = compact(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    let termsListByNameKeys = [];
    if (typeof termsListByName === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    return (
        <Fragment>
            <PanelRow>
                <CheckboxControl
                    label={props.strings.enablePostExpiration}
                    checked={enabled}
                    onChange={handleEnabledChange}
                />
            </PanelRow>
            {enabled && (
                <Fragment>
                    <PanelRow className={'future-action-date-panel'}>
                        <DateTimePicker
                            currentDate={date * 1000}
                            onChange={handleDateChange}
                            __nextRemoveHelpButton={true}
                            is12Hour={props.is12hours}
                            startOfWeek={props.startOfWeek}
                        />
                    </PanelRow>
                    <SelectControl
                        label={props.strings.action}
                        value={action}
                        options={props.actionsSelectOptions}
                        onChange={handleActionChange}
                    />

                    {
                        String(action).includes('category') && (
                            isFetchingTerms && (
                                <Fragment>
                                    {props.strings.loading + ` (${taxonomy})`}
                                    <Spinner />
                                </Fragment>
                            )
                            || (!taxonomy && (
                                <p><i className="dashicons dashicons-warning"></i> {props.strings.noTaxonomyFound}</p>
                            )
                                || (
                                    termsListByNameKeys.length === 0 && (
                                        <p><i className="dashicons dashicons-warning"></i> {props.strings.noTermsFound}</p>
                                    )
                                    || (
                                        <FormTokenField
                                            label={taxonomyName}
                                            value={selectedTerms}
                                            suggestions={Object.keys(termsListByName)}
                                            onChange={handleTermsChange}
                                            maxSuggestions={10}
                                        />
                                    )
                                )
                            )
                        )
                    }
                </Fragment>
            )}
        </Fragment>
    );
};
