/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************************************!*\
  !*** ./assets/jsx/gutenberg-panel/gutenberg-panel.jsx ***!
  \********************************************************/


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
    var _React = React,
        useEffect = _React.useEffect;
    var addQueryArgs = wp.url.addQueryArgs;
    var _wp$data = wp.data,
        useSelect = _wp$data.useSelect,
        useDispatch = _wp$data.useDispatch,
        register = _wp$data.register,
        createReduxStore = _wp$data.createReduxStore,
        select = _wp$data.select;
    var apiFetch = wp.apiFetch;


    var compact = function compact(array) {
        return array.filter(function (item) {
            return item !== null && item !== undefined && item !== '';
        });
    };

    var debugLog = function debugLog(description) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        if (console && config.isDebugEnabled) {
            var _console;

            (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
        }
    };

    var getCurrentTime = function getCurrentTime() {
        return new Date().getTime() / 1000;
    };

    var getDefaultState = function getDefaultState() {
        var defaultState = {
            futureAction: null,
            futureActionDate: getCurrentTime(),
            futureActionEnabled: false,
            futureActionTerms: [],
            futureActionTaxonomy: null,
            termsListByName: null,
            termsListById: null,
            taxonomyName: null,
            isFetchingTerms: false
        };

        if (!config || !config.postTypeDefaultConfig) {
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
            defaultState.futureActionDate = getCurrentTime();
        }

        if (config.postTypeDefaultConfig.taxonomy) {
            defaultState.futureActionTaxonomy = config.postTypeDefaultConfig.taxonomy;
        }

        if (config.postTypeDefaultConfig.terms) {
            defaultState.futureActionTerms = config.postTypeDefaultConfig.terms.split(',').map(function (term) {
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
            },
            setIsFetchingTerms: function setIsFetchingTerms(isFetchingTerms) {
                return {
                    type: 'SET_IS_FETCHING_TERMS',
                    isFetchingTerms: isFetchingTerms
                };
            }
        },
        selectors: {
            getFutureAction: function getFutureAction(state) {
                return state.futureAction;
            },
            getFutureActionDate: function getFutureActionDate(state) {
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
            getIsFetchingTerms: function getIsFetchingTerms(state) {
                return state.isFetchingTerms;
            }
        }
    });

    register(store);

    // Step 2: Create the component
    var FutureActionSettingPanel = function FutureActionSettingPanel() {
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
        var isFetchingTerms = useSelect(function (select) {
            return select('publishpress-future/store').getIsFetchingTerms();
        }, []);

        var _useDispatch = useDispatch('publishpress-future/store'),
            setFutureAction = _useDispatch.setFutureAction,
            setFutureActionDate = _useDispatch.setFutureActionDate,
            setFutureActionEnabled = _useDispatch.setFutureActionEnabled,
            setFutureActionTerms = _useDispatch.setFutureActionTerms,
            setFutureActionTaxonomy = _useDispatch.setFutureActionTaxonomy,
            setTermsListByName = _useDispatch.setTermsListByName,
            setTermsListById = _useDispatch.setTermsListById,
            setTaxonomyName = _useDispatch.setTaxonomyName,
            setIsFetchingTerms = _useDispatch.setIsFetchingTerms;

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

            var newAttribute = {
                'enabled': isChecked

                // User default values to other fields
            };if (isChecked) {
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
        };

        var handleActionChange = function handleActionChange(value) {
            setFutureAction(value);
            editPostAttribute({ 'action': value });
        };

        var handleDateChange = function handleDateChange(value) {
            var date = new Date(value).getTime() / 1000;

            setFutureActionDate(date);
            editPostAttribute({ 'date': date });
        };

        var handleTermsChange = function handleTermsChange(value) {
            value = mapTermsFromNameToId(value);

            setFutureActionTerms(value);
            editPostAttribute({ 'terms': value });
        };

        var getPostType = function getPostType() {
            return select('core/editor').getCurrentPostType();
        };

        var fetchFutureActionData = function fetchFutureActionData(callback) {
            var data = select('core/editor').getEditedPostAttribute('publishpress_future_action');
            debugLog('fetchFutureActionData', data);

            setFutureActionEnabled(data.enabled).then(callback);
            setFutureAction(data.action);
            setFutureActionDate(new Date(data.date).getTime() / 1000);
            setFutureActionTerms(data.terms);
            setFutureActionTaxonomy(data.taxonomy);
        };

        var fetchTerms = function fetchTerms() {
            debugLog('fetchTerms', 'Fetching terms...');
            var futureActionTaxonomy = select('publishpress-future/store').getFutureActionTaxonomy();
            var postType = getPostType();

            var termsListByName = {};
            var termsListById = {};

            setIsFetchingTerms(true);

            debugLog('futureActionTaxonomy', futureActionTaxonomy);

            if (!futureActionTaxonomy && postType === 'post' || futureActionTaxonomy === 'category') {
                debugLog('fetchTerms', 'Fetching categories...');
                apiFetch({
                    path: addQueryArgs('wp/v2/categories', { per_page: -1 })
                }).then(function (list) {
                    debugLog('list', list);

                    list.forEach(function (cat) {
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
                    path: addQueryArgs('publishpress-future/v1/taxonomies/' + postType)
                }).then(function (response) {
                    debugLog('response', response);

                    if (parseInt(response.count) > 0) {
                        apiFetch({
                            path: addQueryArgs('wp/v2/taxonomies/' + futureActionTaxonomy, { context: 'edit', per_page: -1 })
                        }).then(function (taxAttributes) {
                            debugLog('taxAttributes', taxAttributes);
                            // fetch all terms
                            apiFetch({
                                path: addQueryArgs('wp/v2/' + taxAttributes.rest_base, { context: 'edit', per_page: -1 })
                            }).then(function (terms) {
                                debugLog('terms', terms);
                                terms.forEach(function (term) {
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
        };

        var editPostAttribute = function editPostAttribute(newAttribute) {
            var attribute = {
                publishpress_future_action: {
                    enabled: futureActionEnabled,
                    date: futureActionDate,
                    action: futureAction,
                    terms: futureActionTerms,
                    taxonomy: futureActionTaxonomy,
                    browser_timezone_offset: new Date().getTimezoneOffset()
                }
            };

            // For each property on newAttribute, set the value on attribute
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(newAttribute)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var name = _ref2[0];
                    var value = _ref2[1];

                    attribute.publishpress_future_action[name] = value;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            editPost(attribute);
            debugLog('editPostAttribute', newAttribute, attribute);
        };

        useEffect(function () {
            fetchFutureActionData();

            // We need to get the value directly from the store because the value from the state is not updated yet
            var enabled = select('publishpress-future/store').getFutureActionEnabled();
            var isCleanNewPost = select('core/editor').isCleanNewPost();

            debugLog('enabled', enabled);
            debugLog('isCleanNewPost', isCleanNewPost);

            if (enabled) {
                if (isCleanNewPost) {
                    handleEnabledChange(true);
                }

                fetchTerms();
            }
        }, []);

        var selectedTerms = [];
        debugLog('futureActionTerms', futureActionTerms);
        if (futureActionTerms && futureActionTerms.length > 0 && termsListById) {
            selectedTerms = compact(mapTermsFromIdToName(futureActionTerms));

            if (typeof selectedTerms === 'string') {
                selectedTerms = [];
            }
        }

        var currentDate = futureActionDate;
        debugLog('futureActionDate', futureActionDate);
        debugLog('currentDate', currentDate);

        var termsListByNameKeys = [];
        if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
            termsListByNameKeys = Object.keys(termsListByName);
        }

        return React.createElement(
            PluginDocumentSettingPanel,
            { title: config.strings.panelTitle, icon: 'calendar',
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
                    { className: 'future-action-date-panel' },
                    React.createElement(DateTimePicker, {
                        currentDate: currentDate * 1000,
                        onChange: handleDateChange,
                        __nextRemoveHelpButton: true,
                        is12Hour: config.is12hours,
                        startOfWeek: config.startOfWeek
                    })
                ),
                React.createElement(SelectControl, {
                    label: config.strings.action,
                    value: futureAction,
                    options: config.actionsSelectOptions,
                    onChange: handleActionChange
                }),
                String(futureAction).includes('category') && (isFetchingTerms && React.createElement(
                    Fragment,
                    null,
                    config.strings.loading + (' (' + futureActionTaxonomy + ')'),
                    React.createElement(Spinner, null)
                ) || !futureActionTaxonomy && React.createElement(
                    'p',
                    null,
                    React.createElement('i', { className: 'dashicons dashicons-warning' }),
                    ' ',
                    config.strings.noTaxonomyFound
                ) || termsListByNameKeys.length === 0 && React.createElement(
                    'p',
                    null,
                    React.createElement('i', { className: 'dashicons dashicons-warning' }),
                    ' ',
                    config.strings.noTermsFound
                ) || React.createElement(FormTokenField, {
                    label: config.taxonomyName,
                    value: selectedTerms,
                    suggestions: Object.keys(termsListByName),
                    onChange: handleTermsChange,
                    maxSuggestions: 10
                }))
            )
        );
    };

    registerPlugin('publishpress-future-action', {
        render: FutureActionSettingPanel
    });
})(window.wp, window.postExpiratorPanelConfig);
/******/ })()
;
//# sourceMappingURL=gutenberg-panel.js.map