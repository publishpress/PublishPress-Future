
(function (wp, config) {

    const {registerPlugin} = wp.plugins;
    const {PluginDocumentSettingPanel} = wp.editPost;
    const {PanelRow, DateTimePicker, CheckboxControl, SelectControl, FormTokenField, Spinner} = wp.components;
    const {Fragment} = wp.element;
    const {decodeEntities} = wp.htmlEntities;
    const {isEmpty, keys, compact} = lodash;
    const {useEffect} = React;
    const {addQueryArgs} = wp.url;
    const {
        useSelect,
        useDispatch,
        register,
        createReduxStore,
        select
    } = wp.data;
    const {apiFetch} = wp;

    const debugLog = (description, message) => {
        if (console && config.is_debug_enabled) {
            console.debug('[Future]', description, message);
        }
    }

    const getDefaultState = () => {
        let defaultState = {
            futureAction: null,
            futureActionDate: 0,
            futureActionEnabled: false,
            futureActionTerms: [],
            futureActionTaxonomy: null,
            termsListByName: null,
            termsListById: null,
            taxonomyName: null
        }

        if (! config || ! config.defaults) {
            return defaultState;
        }

        if (config.defaults.autoEnable) {
            defaultState.futureActionEnabled = true;
        }

        if (config.defaults.expireType) {
            defaultState.futureAction = config.defaults.expireType;
        }

        if (config.default_date) {
            defaultState.futureActionDate = parseInt(config.default_date);
        } else {
            defaultState.futureActionDate = new Date().getTime();
        }

        if (config.defaults.taxonomy) {
            defaultState.futureActionTaxonomy = config.defaults.taxonomy;
        }

        if (config.defaults.terms) {
            defaultState.futureActionTerms = config.defaults.terms.split(',').map(term => parseInt(term));
        }

        return defaultState;
    }

    // Step 1: Create the Redux store
    const DEFAULT_STATE = getDefaultState();

    debugLog('DEFAULT_STATE', DEFAULT_STATE);

    const store = createReduxStore('publishpress-future/store', {
        reducer(state = DEFAULT_STATE, action) {
            switch (action.type) {
                case 'SET_FUTURE_ACTION':
                    return {
                        ...state,
                        futureAction: action.futureAction,
                    };
                case 'SET_FUTURE_ACTION_DATE':
                    return {
                        ...state,
                        futureActionDate: action.futureActionDate,
                    }
                case 'SET_FUTURE_ACTION_ENABLED':
                    return {
                        ...state,
                        futureActionEnabled: action.futureActionEnabled,
                    }
                case 'SET_FUTURE_ACTION_TERMS':
                    return {
                        ...state,
                        futureActionTerms: action.futureActionTerms,
                    }
                case 'SET_FUTURE_ACTION_TAXONOMY':
                    return {
                        ...state,
                        futureActionTaxonomy: action.futureActionTaxonomy,
                    }
                case 'SET_TERMS_LIST_BY_NAME':
                    return {
                        ...state,
                        termsListByName: action.termsListByName,
                    }
                case 'SET_TERMS_LIST_BY_ID':
                    return {
                        ...state,
                        termsListById: action.termsListById,
                    }
                case 'SET_TAXONOMY_NAME':
                    return {
                        ...state,
                        taxonomyName: action.taxonomyName,
                    }
            }

            return state;
        },
        actions: {
            setFutureAction(futureAction) {
                return {
                    type: 'SET_FUTURE_ACTION',
                    futureAction: futureAction
                };
            },
            setFutureActionDate(futureActionDate) {
                return {
                    type: 'SET_FUTURE_ACTION_DATE',
                    futureActionDate: futureActionDate
                };
            },
            setFutureActionEnabled(futureActionEnabled) {
                return {
                    type: 'SET_FUTURE_ACTION_ENABLED',
                    futureActionEnabled: futureActionEnabled
                };
            },
            setFutureActionTerms(futureActionTerms) {
                return {
                    type: 'SET_FUTURE_ACTION_TERMS',
                    futureActionTerms: futureActionTerms
                };
            },
            setFutureActionTaxonomy(futureActionTaxonomy) {
                return {
                    type: 'SET_FUTURE_ACTION_TAXONOMY',
                    futureActionTaxonomy: futureActionTaxonomy
                };
            },
            setTermsListByName(termsListByName) {
                return {
                    type: 'SET_TERMS_LIST_BY_NAME',
                    termsListByName: termsListByName
                };
            },
            setTermsListById(termsListById) {
                return {
                    type: 'SET_TERMS_LIST_BY_ID',
                    termsListById: termsListById
                };
            },
            setTaxonomyName(taxonomyName) {
                return {
                    type: 'SET_TAXONOMY_NAME',
                    taxonomyName: taxonomyName
                };
            }
        },
        selectors: {
            getFutureAction(state) {
                return state.futureAction;
            },
            getFutureActionDate(state) {
                // let date = new Date();
                // let browserTimezoneOffset = date.getTimezoneOffset() * 60;
                // let wpTimezoneOffset = config.timezone_offset * 60;

                // date.setTime((storedDate + browserTimezoneOffset + wpTimezoneOffset) * 1000);
                // date.setTime(state.futureActionDate * 1000);
                //
                // return date.getTime()/1000;
                return state.futureActionDate;
            },
            getFutureActionEnabled(state) {
                return state.futureActionEnabled;
            },
            getFutureActionTerms(state) {
                return state.futureActionTerms;
            },
            getFutureActionTaxonomy(state) {
                return state.futureActionTaxonomy;
            },
            getTermsListByName(state) {
                return state.termsListByName;
            },
            getTermsListById(state) {
                return state.termsListById;
            },
            getTaxonomyName(state) {
                return state.taxonomyName;
            },
            getData(state) {
                return {
                    futureAction: state.futureAction,
                    futureActionDate: state.futureActionDate,
                    futureActionEnabled: state.futureActionEnabled,
                    futureActionTerms: state.futureActionTerms,
                    futureActionTaxonomy: state.futureActionTaxonomy
                }
            }
        }
    });

    register(store);

    // Step 2: Create the component
    const MyPluginDocumentSettingPanel = () => {
        const futureAction = useSelect((select) => select('publishpress-future/store').getFutureAction(), []);
        const futureActionDate = useSelect((select) => select('publishpress-future/store').getFutureActionDate(), []);
        const futureActionEnabled = useSelect((select) => select('publishpress-future/store').getFutureActionEnabled(), []);
        const futureActionTerms = useSelect((select) => select('publishpress-future/store').getFutureActionTerms(), []);
        const futureActionTaxonomy = useSelect((select) => select('publishpress-future/store').getFutureActionTaxonomy(), []);
        const termsListByName = useSelect((select) => select('publishpress-future/store').getTermsListByName(), []);
        const termsListById = useSelect((select) => select('publishpress-future/store').getTermsListById(), []);

        const {
            setFutureAction,
            setFutureActionDate,
            setFutureActionEnabled,
            setFutureActionTerms,
            setFutureActionTaxonomy,
            setTermsListByName,
            setTermsListById,
            setTaxonomyName
        } = useDispatch('publishpress-future/store');

        const {editPost} = useDispatch('core/editor');

        const mapTermsFromIdToName = (terms) => {
            return terms.map((term) => {
                return termsListById[term];
            });
        }

        const mapTermsFromNameToId = (terms) => {
            return terms.map((term) => {
                return termsListByName[term].id;
            });
        }

        const handleEnabledChange = (isChecked) => {
            setFutureActionEnabled(isChecked);
            editPostAttribute('enabled', isChecked);
        }

        const handleActionChange = (value) => {
            setFutureAction(value);
            editPostAttribute('action', value);
        };

        const handleDateChange = (value) => {
            const date = new Date(value).getTime()/1000;

            setFutureActionDate(date);
            editPostAttribute('date', value);
        }

        const handleTermsChange = (value) => {
            value = mapTermsFromNameToId(value);

            setFutureActionTerms(value);
            editPostAttribute('terms', value);
        }

        const getPostId = () => {
            return select('core/editor').getCurrentPostId();
        }

        const getPostType = () => {
            return select('core/editor').getCurrentPostType();
        }

        const fetchFutureActionData = () => {
            const data = select('core/editor').getEditedPostAttribute('publishpress_future_action');

            setFutureActionEnabled(data.enabled);
            setFutureAction(data.action);
            setFutureActionDate(data.date);
            setFutureActionTerms(data.terms);
            setFutureActionTaxonomy(data.taxonomy);
        }

        const fetchTerms = () => {
            const futureActionTaxonomy = select('publishpress-future/store').getFutureActionTaxonomy();
            const postType = getPostType();

            let termsListByName = {};
            let termsListById = {};

            if ((!futureActionTaxonomy && postType === 'post') || futureActionTaxonomy === 'category') {
                apiFetch({
                    path: addQueryArgs('wp/v2/categories', {per_page: -1}),
                }).then((list) => {
                    list.forEach(cat => {
                        termsListByName[cat.name] = cat;
                        termsListById[cat.id] = cat.name;
                    });

                    setTermsListByName(termsListByName);
                    setTermsListById(termsListById);
                    setTaxonomyName(config.strings.category);
                });
            } else {
                apiFetch({
                    path: addQueryArgs(`wp/v2/taxonomies/${futureActionTaxonomy}`, {context: 'edit', per_page: -1}),
                }).then((taxAttributes) => {
                    // fetch all terms
                    apiFetch({
                        path: addQueryArgs(`wp/v2/${taxAttributes.rest_base}`, {context: 'edit', per_page: -1}),
                    }).then((terms) => {
                        terms.forEach(term => {
                            termsListByName[decodeEntities(term.name)] = term;
                            termsListById[term.id] = decodeEntities(term.name);
                        });

                        setTermsListByName(termsListByName);
                        setTermsListById(termsListById);
                        setTaxonomyName(decodeEntities(taxAttributes.name));
                    });
                });
            }
        }

        const editPostAttribute = (name, value) => {
            const attribute = {
                publishpress_future_action: {
                    enabled: futureActionEnabled,
                    date: futureActionDate,
                    action: futureAction,
                    terms: futureActionTerms,
                    taxonomy: futureActionTaxonomy
                }
            };

            attribute.publishpress_future_action[name] = value;

            editPost(attribute);
            debugLog('editPostAttribute', attribute);
        }


        const init = () => {
            fetchFutureActionData();
            fetchTerms();

            const isCleanNewPost = select('core/editor').isCleanNewPost();

            if (futureActionEnabled && isCleanNewPost) {
                editPostAttribute('enabled', true);
            }
        }

        useEffect(init, []);

        let selectedTerms = [];
        debugLog('futureActionTerms', futureActionTerms);
        if (futureActionTerms && futureActionTerms.length > 0 && termsListById) {
            selectedTerms = compact(mapTermsFromIdToName(futureActionTerms));

            if (typeof selectedTerms === 'string') {
                selectedTerms = [];
            }
        }

        return (
            <PluginDocumentSettingPanel title={config.strings.postExpirator} icon="calendar"
                                        initialOpen={futureActionEnabled} className={'post-expirator-panel'}
            >
                <PanelRow>
                    <CheckboxControl
                        label={config.strings.enablePostExpiration}
                        checked={futureActionEnabled}
                        onChange={handleEnabledChange}
                    />
                </PanelRow>
                {futureActionEnabled && (
                    <Fragment>
                        <PanelRow>
                            <DateTimePicker
                                currentDate={futureActionDate*1000}
                                onChange={handleDateChange}
                                __nextRemoveHelpButton={true}
                                is12Hour={config.is_12_hours}
                            />
                        </PanelRow>
                        <SelectControl
                            label={config.strings.howToExpire}
                            value={futureAction}
                            options={config.actions_options}
                            onChange={handleActionChange}
                        />
                        {futureAction.includes('category') &&
                            (
                                (isEmpty(keys(termsListByName)) && (
                                    <Fragment>
                                        {config.strings.loading + ` (${futureActionTaxonomy})`}
                                        <Spinner/>
                                    </Fragment>
                                ))
                                ||
                                (
                                    <FormTokenField
                                        label={config.strings.expirationCategories + ` (${futureActionTaxonomy})`}
                                        value={selectedTerms}
                                        suggestions={Object.keys(termsListByName)}
                                        onChange={handleTermsChange}
                                        maxSuggestions={10}
                                    />
                                )
                            )}
                    </Fragment>
                )}
            </PluginDocumentSettingPanel>
        );
    };

    // Step 3: Connect the component to the Redux store
    registerPlugin('publishpress-future-action', {
        render: MyPluginDocumentSettingPanel
    });

})(window.wp, window.postExpiratorPanelConfig);
