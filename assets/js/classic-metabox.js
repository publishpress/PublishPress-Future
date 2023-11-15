/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/jsx/FutureActionPanel.jsx":
/*!******************************************!*\
  !*** ./assets/jsx/FutureActionPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    select = _wp$data.select;
var _wp = wp,
    apiFetch = _wp.apiFetch;
var _utils = './utils',
    compact = _utils.compact;
var FutureActionPanel = exports.FutureActionPanel = function FutureActionPanel(props) {
    var action = useSelect(function (select) {
        return select('publishpress-future/future-action').getAction();
    }, []);
    var date = useSelect(function (select) {
        return select('publishpress-future/future-action').getDate();
    }, []);
    var enabled = useSelect(function (select) {
        return select('publishpress-future/future-action').getEnabled();
    }, []);
    var terms = useSelect(function (select) {
        return select('publishpress-future/future-action').getTerms();
    }, []);
    var taxonomy = useSelect(function (select) {
        return select('publishpress-future/future-action').getTaxonomy();
    }, []);
    var taxonomyName = useSelect(function (select) {
        return select('publishpress-future/future-action').getTaxonomyName();
    }, []);
    var termsListByName = useSelect(function (select) {
        return select('publishpress-future/future-action').getTermsListByName();
    }, []);
    var termsListById = useSelect(function (select) {
        return select('publishpress-future/future-action').getTermsListById();
    }, []);
    var isFetchingTerms = useSelect(function (select) {
        return select('publishpress-future/future-action').getIsFetchingTerms();
    }, []);

    var _useDispatch = useDispatch('publishpress-future/future-action'),
        setAction = _useDispatch.setAction,
        setDate = _useDispatch.setDate,
        setEnabled = _useDispatch.setEnabled,
        setTerms = _useDispatch.setTerms,
        setTaxonomy = _useDispatch.setTaxonomy,
        setTermsListByName = _useDispatch.setTermsListByName,
        setTermsListById = _useDispatch.setTermsListById,
        setTaxonomyName = _useDispatch.setTaxonomyName,
        setIsFetchingTerms = _useDispatch.setIsFetchingTerms;

    var mapTermsListById = function mapTermsListById(terms) {
        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        return terms.map(function (term) {
            return termsListByName[term].id;
        });
    };

    var callOnChangeData = function callOnChangeData() {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData({
                enabled: enabled,
                action: action,
                date: date,
                terms: terms,
                taxonomy: taxonomy
            });
        }
    };

    var handleEnabledChange = function handleEnabledChange(isChecked) {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            // setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData();
    };

    var handleActionChange = function handleActionChange(value) {
        setAction(value);

        callOnChangeData();
    };

    var handleDateChange = function handleDateChange(value) {
        var date = new Date(value).getTime() / 1000;

        setDate(date);

        callOnChangeData();
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData();
    };

    var fetchTerms = function fetchTerms() {
        var termsListByName = {};
        var termsListById = {};

        setIsFetchingTerms(true);

        if (!taxonomy && props.postType === 'post' || taxonomy === 'category') {
            apiFetch({
                path: addQueryArgs('wp/v2/categories', { per_page: -1 })
            }).then(function (list) {
                list.forEach(function (cat) {
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
                path: addQueryArgs('publishpress-future/v1/taxonomies/' + props.postType)
            }).then(function (response) {
                if (parseInt(response.count) > 0) {
                    apiFetch({
                        path: addQueryArgs('wp/v2/taxonomies/' + taxonomy, { context: 'edit', per_page: -1 })
                    }).then(function (taxonomyAttributes) {
                        // fetch all terms
                        apiFetch({
                            path: addQueryArgs('wp/v2/' + taxonomyAttributes.rest_base, { context: 'edit', per_page: -1 })
                        }).then(function (terms) {
                            terms.forEach(function (term) {
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
    };

    useEffect(function () {
        setEnabled(props.enabled);
        setAction(props.action);
        setDate(new Date(props.date).getTime() / 1000);
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

    var selectedTerms = [];
    if (terms && terms.length > 0 && termsListById) {
        selectedTerms = compact(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    var termsListByNameKeys = [];
    if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    return React.createElement(
        Fragment,
        null,
        React.createElement(
            PanelRow,
            null,
            React.createElement(CheckboxControl, {
                label: props.strings.enablePostExpiration,
                checked: enabled,
                onChange: handleEnabledChange
            })
        ),
        enabled && React.createElement(
            Fragment,
            null,
            React.createElement(
                PanelRow,
                { className: 'future-action-date-panel' },
                React.createElement(DateTimePicker, {
                    currentDate: date * 1000,
                    onChange: handleDateChange,
                    __nextRemoveHelpButton: true,
                    is12Hour: props.is12hours,
                    startOfWeek: props.startOfWeek
                })
            ),
            React.createElement(SelectControl, {
                label: props.strings.action,
                value: action,
                options: props.actionsSelectOptions,
                onChange: handleActionChange
            }),
            String(action).includes('category') && (isFetchingTerms && React.createElement(
                Fragment,
                null,
                props.strings.loading + (' (' + taxonomy + ')'),
                React.createElement(Spinner, null)
            ) || !taxonomy && React.createElement(
                'p',
                null,
                React.createElement('i', { className: 'dashicons dashicons-warning' }),
                ' ',
                props.strings.noTaxonomyFound
            ) || termsListByNameKeys.length === 0 && React.createElement(
                'p',
                null,
                React.createElement('i', { className: 'dashicons dashicons-warning' }),
                ' ',
                props.strings.noTermsFound
            ) || React.createElement(FormTokenField, {
                label: taxonomyName,
                value: selectedTerms,
                suggestions: Object.keys(termsListByName),
                onChange: handleTermsChange,
                maxSuggestions: 10
            }))
        )
    );
};

/***/ }),

/***/ "./assets/jsx/data.jsx":
/*!*****************************!*\
  !*** ./assets/jsx/data.jsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createStore = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _time = __webpack_require__(/*! ./time */ "./assets/jsx/time.jsx");

var createStore = exports.createStore = function createStore(props) {
    var _wp$data = wp.data,
        register = _wp$data.register,
        createReduxStore = _wp$data.createReduxStore;


    var defaultState = {
        action: props.defaultState.action,
        date: props.defaultState.date ? parseInt(props.defaultState.date) : (0, _time.getCurrentTime)(),
        enabled: props.defaultState.autoEnable,
        terms: props.defaultState.terms ? props.defaultState.terms.split(',').map(function (term) {
            return parseInt(term);
        }) : [],
        taxonomy: props.defaultState.taxonomy ? props.defaultState.taxonomy : null,
        termsListByName: null,
        termsListById: null,
        taxonomyName: null,
        isFetchingTerms: false
    };

    var store = createReduxStore('publishpress-future/future-action', {
        reducer: function reducer() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
            var action = arguments[1];

            switch (action.type) {
                case 'SET_ACTION':
                    return _extends({}, state, {
                        action: action.action
                    });
                case 'SET_DATE':
                    return _extends({}, state, {
                        date: action.date
                    });
                case 'SET_ENABLED':
                    return _extends({}, state, {
                        enabled: action.enabled
                    });
                case 'SET_TERMS':
                    return _extends({}, state, {
                        terms: action.terms
                    });
                case 'SET_TAXONOMY':
                    return _extends({}, state, {
                        taxonomy: action.taxonomy
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
            setAction: function setAction(action) {
                return {
                    type: 'SET_ACTION',
                    action: action
                };
            },
            setDate: function setDate(date) {
                return {
                    type: 'SET_DATE',
                    date: date
                };
            },
            setEnabled: function setEnabled(enabled) {
                return {
                    type: 'SET_ENABLED',
                    enabled: enabled
                };
            },
            setTerms: function setTerms(terms) {
                return {
                    type: 'SET_TERMS',
                    terms: terms
                };
            },
            setTaxonomy: function setTaxonomy(taxonomy) {
                return {
                    type: 'SET_TAXONOMY',
                    taxonomy: taxonomy
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
            getAction: function getAction(state) {
                return state.action;
            },
            getDate: function getDate(state) {
                return state.date;
            },
            getEnabled: function getEnabled(state) {
                return state.enabled;
            },
            getTerms: function getTerms(state) {
                return state.terms;
            },
            getTaxonomy: function getTaxonomy(state) {
                return state.taxonomy;
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

    return store;
};

/***/ }),

/***/ "./assets/jsx/time.jsx":
/*!*****************************!*\
  !*** ./assets/jsx/time.jsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var getCurrentTime = exports.getCurrentTime = function getCurrentTime() {
    return new Date().getTime() / 1000;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************************!*\
  !*** ./assets/jsx/classic-metabox/classic-metabox.jsx ***!
  \********************************************************/


var _data = __webpack_require__(/*! ../data */ "./assets/jsx/data.jsx");

var _FutureActionPanel = __webpack_require__(/*! ../FutureActionPanel */ "./assets/jsx/FutureActionPanel.jsx");

(function (wp, config) {
    // const {createRoot} = ReactDOM;

    // createStore({
    //     defaultState: {
    //         autoEnable: config.postTypeDefaultConfig.autoEnable,
    //         action: config.postTypeDefaultConfig.expireType,
    //         date: config.defaultDate,
    //         taxonomy: config.postTypeDefaultConfig.taxonomy,
    //         ters: config.postTypeDefaultConfig.terms,
    //     }
    // });

    // const ClassicFutureActionPanel = () => {
    //     return (
    //         <FutureActionPanel/>
    //     );
    // };

    // const container = document.getElementById("publishpress-future-classic-metabox");
    // const root = createRoot(container);

    // root.render(<ClassicFutureActionPanel />);
})(window.wp, window.publishpressFutureClassicMetabox);
})();

/******/ })()
;
//# sourceMappingURL=classic-metabox.js.map