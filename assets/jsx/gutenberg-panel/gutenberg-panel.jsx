
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

    const debugLog = (description, ...message) => {
        if (console && config.isDebugEnabled) {
            console.debug('[Future]', description, ...message);
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
            taxonomyName: null,
            isFetchingTerms: false,
        }

        if (! config || ! config.postTypeDefaultConfig) {
            return defaultState;
        }

        if (config.postTypeDefaultConfig.autoEnable) {
            defaultState.futureActionEnabled = true;
        }

        if (config.postTypeDefaultConfig.expireType) {
            defaultState.futureAction = config.postTypeDefaultConfig.expireType;
        }

        if (config.defaultDate) {
            defaultState.futureActionDate = parseInt(config.defaultDate);
        } else {
            defaultState.futureActionDate = new Date().getTime();
        }

        if (config.postTypeDefaultConfig.taxonomy) {
            defaultState.futureActionTaxonomy = config.postTypeDefaultConfig.taxonomy;
        }

        if (config.postTypeDefaultConfig.terms) {
            defaultState.futureActionTerms = config.postTypeDefaultConfig.terms.split(',').map(term => parseInt(term));
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
            },
            setIsFetchingTerms(isFetchingTerms) {
                return {
                    type: 'SET_IS_FETCHING_TERMS',
                    isFetchingTerms: isFetchingTerms
                }
            }
        },
        selectors: {
            getFutureAction(state) {
                return state.futureAction;
            },
            getFutureActionDate(state) {
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
            getIsFetchingTerms(state) {
                return state.isFetchingTerms;
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
        const isFetchingTerms = useSelect((select) => select('publishpress-future/store').getIsFetchingTerms(), []);

        const {
            setFutureAction,
            setFutureActionDate,
            setFutureActionEnabled,
            setFutureActionTerms,
            setFutureActionTaxonomy,
            setTermsListByName,
            setTermsListById,
            setTaxonomyName,
            setIsFetchingTerms
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

            const newAttribute = {
                'enabled': isChecked
            }

            // User default values to other fields
            if (isChecked) {
                setFutureAction(DEFAULT_STATE.futureAction);
                setFutureActionDate(DEFAULT_STATE.futureActionDate);
                setFutureActionTerms(DEFAULT_STATE.futureActionTerms);
                setFutureActionTaxonomy(DEFAULT_STATE.futureActionTaxonomy);

                newAttribute['action'] = DEFAULT_STATE.futureAction;
                newAttribute['date'] = DEFAULT_STATE.futureActionDate;
                newAttribute['terms'] = DEFAULT_STATE.futureActionTerms;
                newAttribute['taxonomy'] = DEFAULT_STATE.futureActionTaxonomy;

                fetchTerms();
            }

            editPostAttribute(newAttribute);
        }

        const handleActionChange = (value) => {
            setFutureAction(value);
            editPostAttribute({'action': value});
        }

        const handleDateChange = (value) => {
            const date = new Date(value).getTime()/1000;

            setFutureActionDate(date);
            editPostAttribute({'date': date});
        }

        const handleTermsChange = (value) => {
            value = mapTermsFromNameToId(value);

            setFutureActionTerms(value);
            editPostAttribute({'terms': value});
        }

        const getPostId = () => {
            return select('core/editor').getCurrentPostId();
        }

        const getPostType = () => {
            return select('core/editor').getCurrentPostType();
        }

        const fetchFutureActionData = (callback) => {
            const data = select('core/editor').getEditedPostAttribute('publishpress_future_action');
            debugLog('fetchFutureActionData', data);

            setFutureActionEnabled(data.enabled).then(callback);
            setFutureAction(data.action);
            setFutureActionDate(data.date);
            setFutureActionTerms(data.terms);
            setFutureActionTaxonomy(data.taxonomy);
        }

        const fetchTerms = () => {
            debugLog('fetchTerms', 'Fetching terms...');
            const futureActionTaxonomy = select('publishpress-future/store').getFutureActionTaxonomy();
            const postType = getPostType();

            let termsListByName = {};
            let termsListById = {};

            setIsFetchingTerms(true);

            debugLog('futureActionTaxonomy', futureActionTaxonomy);

            if ((!futureActionTaxonomy && postType === 'post') || futureActionTaxonomy === 'category') {
                debugLog('fetchTerms', 'Fetching categories...');
                apiFetch({
                    path: addQueryArgs('wp/v2/categories', {per_page: -1}),
                }).then((list) => {
                    debugLog('list', list);

                    list.forEach(cat => {
                        termsListByName[cat.name] = cat;
                        termsListById[cat.id] = cat.name;
                    });

                    setTermsListByName(termsListByName);
                    setTermsListById(termsListById);
                    setTaxonomyName(config.strings.category);
                    setIsFetchingTerms(false);
                });
            } else {
                debugLog('fetchTerms', 'Fetching taxonomies...');
                apiFetch({
                    path: addQueryArgs(`publishpress-future/v1/taxonomies/` + postType),
                }).then((response) => {
                    debugLog('response', response);

                    if (parseInt(response.count) > 0) {
                        apiFetch({
                            path: addQueryArgs(`wp/v2/taxonomies/${futureActionTaxonomy}`, {context: 'edit', per_page: -1}),
                        }).then((taxAttributes) => {
                            debugLog('taxAttributes', taxAttributes);
                            // fetch all terms
                            apiFetch({
                                path: addQueryArgs(`wp/v2/${taxAttributes.rest_base}`, {context: 'edit', per_page: -1}),
                            }).then((terms) => {
                                debugLog('terms', terms);
                                terms.forEach(term => {
                                    termsListByName[decodeEntities(term.name)] = term;
                                    termsListById[term.id] = decodeEntities(term.name);
                                });

                                setTermsListByName(termsListByName);
                                setTermsListById(termsListById);
                                setTaxonomyName(decodeEntities(taxAttributes.name));
                                setIsFetchingTerms(false);
                            });
                        });
                    } else {
                        debugLog('fetchTerms', 'No taxonomies found');
                    }
                });
            }
        }

        const editPostAttribute = (newAttribute) => {
            const attribute = {
                publishpress_future_action: {
                    enabled: futureActionEnabled,
                    date: futureActionDate,
                    action: futureAction,
                    terms: futureActionTerms,
                    taxonomy: futureActionTaxonomy
                }
            };

            // For each property on newAttribute, set the value on attribute
            for (const [name, value] of Object.entries(newAttribute)) {
                attribute.publishpress_future_action[name] = value;
            }

            editPost(attribute);
            debugLog('editPostAttribute', newAttribute, attribute);
        }

        useEffect(() => {
            fetchFutureActionData();

            // We need to get the value directly from the store because the value from the state is not updated yet
            const enabled = select('publishpress-future/store').getFutureActionEnabled();
            const isCleanNewPost = select('core/editor').isCleanNewPost();

            debugLog('enabled', enabled);
            debugLog('isCleanNewPost', isCleanNewPost);

            if (enabled) {
                if (isCleanNewPost) {
                    handleEnabledChange(true);
                }

                fetchTerms();
            }
        }, []);

        let selectedTerms = [];
        debugLog('futureActionTerms', futureActionTerms);
        if (futureActionTerms && futureActionTerms.length > 0 && termsListById) {
            selectedTerms = compact(mapTermsFromIdToName(futureActionTerms));

            if (typeof selectedTerms === 'string') {
                selectedTerms = [];
            }
        }

        return (
            <PluginDocumentSettingPanel title={config.strings.panelTitle} icon="calendar"
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
                        <PanelRow className={'future-action-date-panel'}>
                            <DateTimePicker
                                currentDate={futureActionDate*1000}
                                onChange={handleDateChange}
                                __nextRemoveHelpButton={true}
                                is12Hour={config.is12hours}
                                startOfWeek={config.startOfWeek}
                            />
                        </PanelRow>
                        <SelectControl
                            label={config.strings.action}
                            value={futureAction}
                            options={config.actionsSelectOptions}
                            onChange={handleActionChange}
                        />

                        {
                            String(futureAction).includes('category') && (
                                isFetchingTerms && (
                                    <Fragment>
                                        {config.strings.loading + ` (${futureActionTaxonomy})`}
                                        <Spinner/>
                                    </Fragment>
                                )
                                || (! futureActionTaxonomy && (
                                        <p><i className="dashicons dashicons-warning"></i> {config.strings.noTaxonomyFound}</p>
                                    )
                                    || (
                                        isEmpty(keys(termsListByName)) && (
                                            <p><i className="dashicons dashicons-warning"></i> {config.strings.noTermsFound}</p>
                                        )
                                        || (
                                            <FormTokenField
                                                label={config.taxonomyName}
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
            </PluginDocumentSettingPanel>
        );
    };

    // Step 3: Connect the component to the Redux store
    registerPlugin('publishpress-future-action', {
        render: MyPluginDocumentSettingPanel
    });

})(window.wp, window.postExpiratorPanelConfig);
