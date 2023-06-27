/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************************************!*\
  !*** ./assets/jsx/gutenberg-panel/gutenberg-panel.jsx ***!
  \********************************************************/


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (wp, config) {
    var registerPlugin = wp.plugins.registerPlugin;
    var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;
    var _wp$components = wp.components,
        PanelRow = _wp$components.PanelRow,
        DateTimePicker = _wp$components.DateTimePicker,
        CheckboxControl = _wp$components.CheckboxControl,
        SelectControl = _wp$components.SelectControl,
        FormTokenField = _wp$components.FormTokenField,
        Spinner = _wp$components.Spinner;
    var Fragment = wp.element.Fragment;
    var decodeEntities = wp.htmlEntities.decodeEntities;
    var _lodash = lodash,
        isEmpty = _lodash.isEmpty,
        keys = _lodash.keys,
        compact = _lodash.compact;
    var _React = React,
        useEffect = _React.useEffect,
        useState = _React.useState;
    var _wp$hooks = wp.hooks,
        addAction = _wp$hooks.addAction,
        doAction = _wp$hooks.doAction;
    var addQueryArgs = wp.url.addQueryArgs;
    var _wp$data = wp.data,
        useSelect = _wp$data.useSelect,
        useDispatch = _wp$data.useDispatch,
        register = _wp$data.register,
        createReduxStore = _wp$data.createReduxStore,
        select = _wp$data.select,
        subscribe = _wp$data.subscribe,
        dispatch = _wp$data.dispatch;
    var apiFetch = wp.apiFetch;


    var debugLog = function debugLog(description, message) {
        if (console && config.is_debug_enabled) {
            console.debug('[Future]', description, message);
        }
    };

    var getDefaultState = function getDefaultState() {
        var defaultState = {
            futureAction: null,
            futureActionDate: 0,
            futureActionEnabled: false,
            futureActionTerms: [],
            futureActionTaxonomy: null,
            termsListByName: null,
            termsListById: null,
            taxonomyName: null
        };

        if (!config || !config.defaults) {
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
            defaultState.futureActionTerms = config.defaults.terms.split(',').map(function (term) {
                return parseInt(term);
            });
        }

        return defaultState;
    };

    // Step 1: Create the Redux store
    var DEFAULT_STATE = getDefaultState();

    debugLog('DEFAULT_STATE', DEFAULT_STATE);

    var store = createReduxStore('publishpress-future/store', {
        reducer: function reducer() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
            var action = arguments[1];

            switch (action.type) {
                case 'SET_FUTURE_ACTION':
                    return _extends({}, state, {
                        futureAction: action.futureAction
                    });
                case 'SET_FUTURE_ACTION_DATE':
                    return _extends({}, state, {
                        futureActionDate: action.futureActionDate
                    });
                case 'SET_FUTURE_ACTION_ENABLED':
                    return _extends({}, state, {
                        futureActionEnabled: action.futureActionEnabled
                    });
                case 'SET_FUTURE_ACTION_TERMS':
                    return _extends({}, state, {
                        futureActionTerms: action.futureActionTerms
                    });
                case 'SET_FUTURE_ACTION_TAXONOMY':
                    return _extends({}, state, {
                        futureActionTaxonomy: action.futureActionTaxonomy
                    });
                case 'SET_TERMS_LIST_BY_NAME':
                    return _extends({}, state, {
                        termsListByName: action.termsListByName
                    });
                case 'SET_TERMS_LIST_BY_ID':
                    return _extends({}, state, {
                        termsListById: action.termsListById
                    });
                case 'SET_TAXONOMY_NAME':
                    return _extends({}, state, {
                        taxonomyName: action.taxonomyName
                    });
            }

            return state;
        },

        actions: {
            setFutureAction: function setFutureAction(futureAction) {
                return {
                    type: 'SET_FUTURE_ACTION',
                    futureAction: futureAction
                };
            },
            setFutureActionDate: function setFutureActionDate(futureActionDate) {
                return {
                    type: 'SET_FUTURE_ACTION_DATE',
                    futureActionDate: futureActionDate
                };
            },
            setFutureActionEnabled: function setFutureActionEnabled(futureActionEnabled) {
                return {
                    type: 'SET_FUTURE_ACTION_ENABLED',
                    futureActionEnabled: futureActionEnabled
                };
            },
            setFutureActionTerms: function setFutureActionTerms(futureActionTerms) {
                return {
                    type: 'SET_FUTURE_ACTION_TERMS',
                    futureActionTerms: futureActionTerms
                };
            },
            setFutureActionTaxonomy: function setFutureActionTaxonomy(futureActionTaxonomy) {
                return {
                    type: 'SET_FUTURE_ACTION_TAXONOMY',
                    futureActionTaxonomy: futureActionTaxonomy
                };
            },
            setTermsListByName: function setTermsListByName(termsListByName) {
                return {
                    type: 'SET_TERMS_LIST_BY_NAME',
                    termsListByName: termsListByName
                };
            },
            setTermsListById: function setTermsListById(termsListById) {
                return {
                    type: 'SET_TERMS_LIST_BY_ID',
                    termsListById: termsListById
                };
            },
            setTaxonomyName: function setTaxonomyName(taxonomyName) {
                return {
                    type: 'SET_TAXONOMY_NAME',
                    taxonomyName: taxonomyName
                };
            }
        },
        selectors: {
            getFutureAction: function getFutureAction(state) {
                return state.futureAction;
            },
            getFutureActionDate: function getFutureActionDate(state) {
                // let date = new Date();
                // let browserTimezoneOffset = date.getTimezoneOffset() * 60;
                // let wpTimezoneOffset = config.timezone_offset * 60;

                // date.setTime((storedDate + browserTimezoneOffset + wpTimezoneOffset) * 1000);
                // date.setTime(state.futureActionDate * 1000);
                //
                // return date.getTime()/1000;
                return state.futureActionDate;
            },
            getFutureActionEnabled: function getFutureActionEnabled(state) {
                return state.futureActionEnabled;
            },
            getFutureActionTerms: function getFutureActionTerms(state) {
                return state.futureActionTerms;
            },
            getFutureActionTaxonomy: function getFutureActionTaxonomy(state) {
                return state.futureActionTaxonomy;
            },
            getTermsListByName: function getTermsListByName(state) {
                return state.termsListByName;
            },
            getTermsListById: function getTermsListById(state) {
                return state.termsListById;
            },
            getTaxonomyName: function getTaxonomyName(state) {
                return state.taxonomyName;
            },
            getData: function getData(state) {
                return {
                    futureAction: state.futureAction,
                    futureActionDate: state.futureActionDate,
                    futureActionEnabled: state.futureActionEnabled,
                    futureActionTerms: state.futureActionTerms,
                    futureActionTaxonomy: state.futureActionTaxonomy
                };
            }
        }
    });

    register(store);

    // Step 2: Create the component
    var MyPluginDocumentSettingPanel = function MyPluginDocumentSettingPanel() {
        var futureAction = useSelect(function (select) {
            return select('publishpress-future/store').getFutureAction();
        }, []);
        var futureActionDate = useSelect(function (select) {
            return select('publishpress-future/store').getFutureActionDate();
        }, []);
        var futureActionEnabled = useSelect(function (select) {
            return select('publishpress-future/store').getFutureActionEnabled();
        }, []);
        var futureActionTerms = useSelect(function (select) {
            return select('publishpress-future/store').getFutureActionTerms();
        }, []);
        var futureActionTaxonomy = useSelect(function (select) {
            return select('publishpress-future/store').getFutureActionTaxonomy();
        }, []);
        var termsListByName = useSelect(function (select) {
            return select('publishpress-future/store').getTermsListByName();
        }, []);
        var termsListById = useSelect(function (select) {
            return select('publishpress-future/store').getTermsListById();
        }, []);

        var _useDispatch = useDispatch('publishpress-future/store'),
            setFutureAction = _useDispatch.setFutureAction,
            setFutureActionDate = _useDispatch.setFutureActionDate,
            setFutureActionEnabled = _useDispatch.setFutureActionEnabled,
            setFutureActionTerms = _useDispatch.setFutureActionTerms,
            setFutureActionTaxonomy = _useDispatch.setFutureActionTaxonomy,
            setTermsListByName = _useDispatch.setTermsListByName,
            setTermsListById = _useDispatch.setTermsListById,
            setTaxonomyName = _useDispatch.setTaxonomyName;

        var _useDispatch2 = useDispatch('core/editor'),
            editPost = _useDispatch2.editPost;

        var mapTermsFromIdToName = function mapTermsFromIdToName(terms) {
            return terms.map(function (term) {
                return termsListById[term];
            });
        };

        var mapTermsFromNameToId = function mapTermsFromNameToId(terms) {
            return terms.map(function (term) {
                return termsListByName[term].id;
            });
        };

        var handleEnabledChange = function handleEnabledChange(isChecked) {
            setFutureActionEnabled(isChecked);
            editPostAttribute('enabled', isChecked);
        };

        var handleActionChange = function handleActionChange(value) {
            setFutureAction(value);
            editPostAttribute('action', value);
        };

        var handleDateChange = function handleDateChange(value) {
            var date = new Date(value).getTime() / 1000;

            setFutureActionDate(date);
            editPostAttribute('date', value);
        };

        var handleTermsChange = function handleTermsChange(value) {
            value = mapTermsFromNameToId(value);

            setFutureActionTerms(value);
            editPostAttribute('terms', value);
        };

        var getPostId = function getPostId() {
            return select('core/editor').getCurrentPostId();
        };

        var getPostType = function getPostType() {
            return select('core/editor').getCurrentPostType();
        };

        var fetchFutureActionData = function fetchFutureActionData() {
            var data = select('core/editor').getEditedPostAttribute('publishpress_future_action');

            setFutureActionEnabled(data.enabled);
            setFutureAction(data.action);
            setFutureActionDate(data.date);
            setFutureActionTerms(data.terms);
            setFutureActionTaxonomy(data.taxonomy);
        };

        var fetchTerms = function fetchTerms() {
            var futureActionTaxonomy = select('publishpress-future/store').getFutureActionTaxonomy();
            var postType = getPostType();

            var termsListByName = {};
            var termsListById = {};

            if (!futureActionTaxonomy && postType === 'post' || futureActionTaxonomy === 'category') {
                apiFetch({
                    path: addQueryArgs('wp/v2/categories', { per_page: -1 })
                }).then(function (list) {
                    list.forEach(function (cat) {
                        termsListByName[cat.name] = cat;
                        termsListById[cat.id] = cat.name;
                    });

                    setTermsListByName(termsListByName);
                    setTermsListById(termsListById);
                    setTaxonomyName(config.strings.category);
                });
            } else {
                apiFetch({
                    path: addQueryArgs('wp/v2/taxonomies/' + futureActionTaxonomy, { context: 'edit', per_page: -1 })
                }).then(function (taxAttributes) {
                    // fetch all terms
                    apiFetch({
                        path: addQueryArgs('wp/v2/' + taxAttributes.rest_base, { context: 'edit', per_page: -1 })
                    }).then(function (terms) {
                        terms.forEach(function (term) {
                            termsListByName[decodeEntities(term.name)] = term;
                            termsListById[term.id] = decodeEntities(term.name);
                        });

                        setTermsListByName(termsListByName);
                        setTermsListById(termsListById);
                        setTaxonomyName(decodeEntities(taxAttributes.name));
                    });
                });
            }
        };

        var editPostAttribute = function editPostAttribute(name, value) {
            var attribute = {
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
        };

        var init = function init() {
            fetchFutureActionData();
            fetchTerms();

            var isCleanNewPost = select('core/editor').isCleanNewPost();

            if (futureActionEnabled && isCleanNewPost) {
                editPostAttribute('enabled', true);
            }
        };

        useEffect(init, []);

        var selectedTerms = [];
        debugLog('futureActionTerms', futureActionTerms);
        if (futureActionTerms && futureActionTerms.length > 0 && termsListById) {
            selectedTerms = compact(mapTermsFromIdToName(futureActionTerms));

            if (typeof selectedTerms === 'string') {
                selectedTerms = [];
            }
        }

        return React.createElement(
            PluginDocumentSettingPanel,
            { title: config.strings.postExpirator, icon: 'calendar',
                initialOpen: futureActionEnabled, className: 'post-expirator-panel'
            },
            React.createElement(
                PanelRow,
                null,
                React.createElement(CheckboxControl, {
                    label: config.strings.enablePostExpiration,
                    checked: futureActionEnabled,
                    onChange: handleEnabledChange
                })
            ),
            futureActionEnabled && React.createElement(
                Fragment,
                null,
                React.createElement(
                    PanelRow,
                    null,
                    React.createElement(DateTimePicker, {
                        currentDate: futureActionDate * 1000,
                        onChange: handleDateChange,
                        __nextRemoveHelpButton: true,
                        is12Hour: config.is_12_hours
                    })
                ),
                React.createElement(SelectControl, {
                    label: config.strings.howToExpire,
                    value: futureAction,
                    options: config.actions_options,
                    onChange: handleActionChange
                }),
                futureAction.includes('category') && (isEmpty(keys(termsListByName)) && React.createElement(
                    Fragment,
                    null,
                    config.strings.loading + (' (' + futureActionTaxonomy + ')'),
                    React.createElement(Spinner, null)
                ) || React.createElement(FormTokenField, {
                    label: config.strings.expirationCategories + (' (' + futureActionTaxonomy + ')'),
                    value: selectedTerms,
                    suggestions: Object.keys(termsListByName),
                    onChange: handleTermsChange,
                    maxSuggestions: 10
                }))
            )
        );
    };

    // Step 3: Connect the component to the Redux store
    registerPlugin('publishpress-future-action', {
        render: MyPluginDocumentSettingPanel
    });
})(window.wp, window.postExpiratorPanelConfig);
/******/ })()
;
//# sourceMappingURL=gutenberg-panel.js.map