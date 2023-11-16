/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/classic-metabox.js":
/*!**************************************!*\
  !*** ./assets/js/classic-metabox.js ***!
  \**************************************/
/***/ (() => {

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/classic-metabox.js":
/*!**************************************!*\
  !*** ./assets/js/classic-metabox.js ***!
  \**************************************/
/***/ (() => {

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/classic-metabox.js":
/*!**************************************!*\
  !*** ./assets/js/classic-metabox.js ***!
  \**************************************/
/***/ (() => {

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/classic-metabox.js":
/*!**************************************!*\
  !*** ./assets/js/classic-metabox.js ***!
  \**************************************/
/***/ (() => {

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/jsx/FutureActionPanel.jsx":
/*!******************************************!*\
  !*** ./assets/jsx/FutureActionPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_331__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __nested_webpack_require_331__(/*! ./utils */ "./assets/jsx/utils.jsx");

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
    useDispatch = _wp$data.useDispatch;
var _wp = wp,
    apiFetch = _wp.apiFetch;
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
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListByName[term].id;
        });
    };

    var callOnChangeData = function callOnChangeData(attribute, value) {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData(attribute, value);
        }
    };

    var handleEnabledChange = function handleEnabledChange(isChecked) {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData('enabled', isChecked);
    };

    var handleActionChange = function handleActionChange(value) {
        setAction(value);

        callOnChangeData('action', value);
    };

    var handleDateChange = function handleDateChange(value) {
        console.log('handleDateChange', value);
        var date = new Date(value).getTime();

        setDate(date);

        callOnChangeData('date', date);
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
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
        setDate(new Date(props.date).getTime());
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
        selectedTerms = (0, _utils.compact)(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    var termsListByNameKeys = [];
    if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    // TODO: Why is this different on block editor and classic editor?
    console.log('currentDate', date);

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
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_10616__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createStore = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _time = __nested_webpack_require_10616__(/*! ./time */ "./assets/jsx/time.jsx");

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

var formatUnixTimestamp = exports.formatUnixTimestamp = function formatUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000); // Convert to milliseconds by multiplying by 1000

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

var formatTimeToUnixTimestamp = exports.formatTimeToUnixTimestamp = function formatTimeToUnixTimestamp(time) {
    var date = new Date(time);

    return date.getTime() / 1000;
};

/***/ }),

/***/ "./assets/jsx/utils.jsx":
/*!******************************!*\
  !*** ./assets/jsx/utils.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var compact = exports.compact = function compact(array) {
    return array.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });
};

var debugLogFactory = exports.debugLogFactory = function debugLogFactory(config) {
    return function (description) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        if (console && config.isDebugEnabled) {
            var _console;

            (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
        }
    };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_18858__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_18858__);
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


var _data = __nested_webpack_require_18858__(/*! ../data */ "./assets/jsx/data.jsx");

var _FutureActionPanel = __nested_webpack_require_18858__(/*! ../FutureActionPanel */ "./assets/jsx/FutureActionPanel.jsx");

(function (wp, config) {
    // Exit if Gutenberg is enabled.
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    var _ReactDOM = ReactDOM,
        createRoot = _ReactDOM.createRoot;


    (0, _data.createStore)({
        defaultState: {
            autoEnable: config.postTypeDefaultConfig.autoEnable,
            action: config.postTypeDefaultConfig.expireType,
            date: config.defaultDate,
            taxonomy: config.postTypeDefaultConfig.taxonomy,
            ters: config.postTypeDefaultConfig.terms
        }
    });

    var ClassicFutureActionPanel = function ClassicFutureActionPanel() {
        var select = wp.data.select;


        var getElementByName = function getElementByName(name) {
            return document.getElementsByName(name)[0];
        };

        var onChangeData = function onChangeData(attribute, value) {
            var store = select('publishpress-future/future-action');

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
            getElementByName('future_action_browser_timezone_offset').value = new Date().getTimezoneOffset();
        };

        var data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(function (term) {
                return parseInt(term);
            }),
            taxonomy: getElementByName('future_action_taxonomy').value
        };

        console.log('date', data.date);

        return React.createElement(
            'div',
            { className: 'post-expirator-panel' },
            React.createElement(_FutureActionPanel.FutureActionPanel, {
                postType: config.postType,
                isCleanNewPost: config.isNewPost,
                actionsSelectOptions: config.actionsSelectOptions,
                enabled: data.enabled,
                action: data.action,
                date: parseInt(data.date),
                terms: data.terms,
                taxonomy: data.taxonomy,
                onChangeData: onChangeData,
                is12hours: config.is12hours,
                startOfWeek: config.startOfWeek,

                strings: config.strings })
        );
    };

    var container = document.getElementById("publishpress-future-classic-metabox");
    var root = createRoot(container);

    root.render(React.createElement(ClassicFutureActionPanel, null));
})(window.wp, window.publishpressFutureClassicMetabox);
})();

/******/ })()
;
//# sourceMappingURL=classic-metabox.js.map

/***/ }),

/***/ "./assets/jsx/FutureActionPanel.jsx":
/*!******************************************!*\
  !*** ./assets/jsx/FutureActionPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_23860__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __nested_webpack_require_23860__(/*! ./utils */ "./assets/jsx/utils.jsx");

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
    useDispatch = _wp$data.useDispatch;
var _wp = wp,
    apiFetch = _wp.apiFetch;
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
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListByName[term].id;
        });
    };

    var callOnChangeData = function callOnChangeData(attribute, value) {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData(attribute, value);
        }
    };

    var handleEnabledChange = function handleEnabledChange(isChecked) {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData('enabled', isChecked);
    };

    var handleActionChange = function handleActionChange(value) {
        setAction(value);

        callOnChangeData('action', value);
    };

    var handleDateChange = function handleDateChange(value) {
        console.log('handleDateChange', value);
        var date = new Date(value).getTime();

        setDate(date);

        callOnChangeData('date', date);
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
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
        setDate(new Date(props.date).getTime());
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
        selectedTerms = (0, _utils.compact)(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    var termsListByNameKeys = [];
    if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    // TODO: Why is this different on block editor and classic editor?
    console.log('currentDate', date);

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
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_34159__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createStore = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _time = __nested_webpack_require_34159__(/*! ./time */ "./assets/jsx/time.jsx");

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

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var getCurrentTime = exports.getCurrentTime = function getCurrentTime() {
    return new Date().getTime() / 1000;
};

var formatUnixTimestamp = exports.formatUnixTimestamp = function formatUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000); // Convert to milliseconds by multiplying by 1000

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

var formatTimeToUnixTimestamp = exports.formatTimeToUnixTimestamp = function formatTimeToUnixTimestamp(time) {
    var date = new Date(time);

    return date.getTime() / 1000;
};

/***/ }),

/***/ "./assets/jsx/utils.jsx":
/*!******************************!*\
  !*** ./assets/jsx/utils.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var compact = exports.compact = function compact(array) {
    return array.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });
};

var debugLogFactory = exports.debugLogFactory = function debugLogFactory(config) {
    return function (description) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        if (console && config.isDebugEnabled) {
            var _console;

            (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
        }
    };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_42443__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_42443__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************!*\
  !*** ./assets/jsx/classic-metabox/classic-metabox.jsx ***!
  \********************************************************/


var _classicMetabox = __nested_webpack_require_42443__(/*! ../../js/classic-metabox */ "./assets/js/classic-metabox.js");

var _data = __nested_webpack_require_42443__(/*! ../data */ "./assets/jsx/data.jsx");

var _FutureActionPanel = __nested_webpack_require_42443__(/*! ../FutureActionPanel */ "./assets/jsx/FutureActionPanel.jsx");

(function (wp, config) {
    // Exit if Gutenberg is enabled.
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    var _ReactDOM = ReactDOM,
        createRoot = _ReactDOM.createRoot;


    (0, _data.createStore)({
        defaultState: {
            autoEnable: config.postTypeDefaultConfig.autoEnable,
            action: config.postTypeDefaultConfig.expireType,
            date: config.defaultDate,
            taxonomy: config.postTypeDefaultConfig.taxonomy,
            ters: config.postTypeDefaultConfig.terms
        }
    });

    var ClassicFutureActionPanel = function ClassicFutureActionPanel() {
        var select = wp.data.select;


        var getElementByName = function getElementByName(name) {
            return document.getElementsByName(name)[0];
        };

        var onChangeData = function onChangeData(attribute, value) {
            var store = select('publishpress-future/future-action');

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
            getElementByName('future_action_browser_timezone_offset').value = new Date().getTimezoneOffset();
        };

        var data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(function (term) {
                return parseInt(term);
            }),
            taxonomy: getElementByName('future_action_taxonomy').value
        };

        console.log('date', (0, _classicMetabox.formatUnixTimestamp)(data.date), data.date);

        return React.createElement(
            'div',
            { className: 'post-expirator-panel' },
            React.createElement(_FutureActionPanel.FutureActionPanel, {
                postType: config.postType,
                isCleanNewPost: config.isNewPost,
                actionsSelectOptions: config.actionsSelectOptions,
                enabled: data.enabled,
                action: data.action,
                date: parseInt(data.date),
                terms: data.terms,
                taxonomy: data.taxonomy,
                onChangeData: onChangeData,
                is12hours: config.is12hours,
                startOfWeek: config.startOfWeek,

                strings: config.strings })
        );
    };

    var container = document.getElementById("publishpress-future-classic-metabox");
    var root = createRoot(container);

    root.render(React.createElement(ClassicFutureActionPanel, null));
})(window.wp, window.publishpressFutureClassicMetabox);
})();

/******/ })()
;
//# sourceMappingURL=classic-metabox.js.map

/***/ }),

/***/ "./assets/jsx/FutureActionPanel.jsx":
/*!******************************************!*\
  !*** ./assets/jsx/FutureActionPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_47610__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __nested_webpack_require_47610__(/*! ./utils */ "./assets/jsx/utils.jsx");

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
    useDispatch = _wp$data.useDispatch;
var _wp = wp,
    apiFetch = _wp.apiFetch;
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
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListByName[term].id;
        });
    };

    var callOnChangeData = function callOnChangeData(attribute, value) {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData(attribute, value);
        }
    };

    var handleEnabledChange = function handleEnabledChange(isChecked) {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData('enabled', isChecked);
    };

    var handleActionChange = function handleActionChange(value) {
        setAction(value);

        callOnChangeData('action', value);
    };

    var handleDateChange = function handleDateChange(value) {
        console.log('handleDateChange', value);
        var date = new Date(value).getTime();

        setDate(date);

        callOnChangeData('date', date);
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
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
        setDate(new Date(props.date).getTime());
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
        selectedTerms = (0, _utils.compact)(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    var termsListByNameKeys = [];
    if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    // TODO: Why is this different on block editor and classic editor?
    console.log('currentDate', date);

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
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_57909__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createStore = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _time = __nested_webpack_require_57909__(/*! ./time */ "./assets/jsx/time.jsx");

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

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var getCurrentTime = exports.getCurrentTime = function getCurrentTime() {
    return new Date().getTime() / 1000;
};

var formatUnixTimestamp = exports.formatUnixTimestamp = function formatUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000); // Convert to milliseconds by multiplying by 1000

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

var formatTimeToUnixTimestamp = exports.formatTimeToUnixTimestamp = function formatTimeToUnixTimestamp(time) {
    var date = new Date(time);

    return date.getTime() / 1000;
};

/***/ }),

/***/ "./assets/jsx/utils.jsx":
/*!******************************!*\
  !*** ./assets/jsx/utils.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var compact = exports.compact = function compact(array) {
    return array.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });
};

var debugLogFactory = exports.debugLogFactory = function debugLogFactory(config) {
    return function (description) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        if (console && config.isDebugEnabled) {
            var _console;

            (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
        }
    };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_66193__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_66193__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************!*\
  !*** ./assets/jsx/classic-metabox/classic-metabox.jsx ***!
  \********************************************************/


var _classicMetabox = __nested_webpack_require_66193__(/*! ../../js/classic-metabox */ "./assets/js/classic-metabox.js");

var _data = __nested_webpack_require_66193__(/*! ../data */ "./assets/jsx/data.jsx");

var _FutureActionPanel = __nested_webpack_require_66193__(/*! ../FutureActionPanel */ "./assets/jsx/FutureActionPanel.jsx");

(function (wp, config) {
    // Exit if Gutenberg is enabled.
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    var _ReactDOM = ReactDOM,
        createRoot = _ReactDOM.createRoot;


    if (!window.publishpressFuture) {
        window.publishpressFuture = {};
    }

    if (!window.publishpressFuture.store) {
        window.publishpressFuture.store = (0, _data.createStore)({
            defaultState: {
                autoEnable: config.postTypeDefaultConfig.autoEnable,
                action: config.postTypeDefaultConfig.expireType,
                date: config.defaultDate,
                taxonomy: config.postTypeDefaultConfig.taxonomy,
                terms: config.postTypeDefaultConfig.terms
            }
        });
    }

    var ClassicFutureActionPanel = function ClassicFutureActionPanel() {
        var select = wp.data.select;


        var getElementByName = function getElementByName(name) {
            return document.getElementsByName(name)[0];
        };

        var onChangeData = function onChangeData(attribute, value) {
            var store = select('publishpress-future/future-action');

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
            getElementByName('future_action_browser_timezone_offset').value = new Date().getTimezoneOffset();
        };

        var data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(function (term) {
                return parseInt(term);
            }),
            taxonomy: getElementByName('future_action_taxonomy').value
        };

        console.log('date', (0, _classicMetabox.formatUnixTimestamp)(data.date), data.date);

        return React.createElement(
            'div',
            { className: 'post-expirator-panel' },
            React.createElement(_FutureActionPanel.FutureActionPanel, {
                postType: config.postType,
                isCleanNewPost: config.isNewPost,
                actionsSelectOptions: config.actionsSelectOptions,
                enabled: data.enabled,
                action: data.action,
                date: parseInt(data.date),
                terms: data.terms,
                taxonomy: data.taxonomy,
                onChangeData: onChangeData,
                is12hours: config.is12hours,
                startOfWeek: config.startOfWeek,

                strings: config.strings })
        );
    };

    var container = document.getElementById("publishpress-future-classic-metabox");
    var root = createRoot(container);

    root.render(React.createElement(ClassicFutureActionPanel, null));
})(window.wp, window.publishpressFutureClassicMetabox);
})();

/******/ })()
;
//# sourceMappingURL=classic-metabox.js.map

/***/ }),

/***/ "./assets/jsx/FutureActionPanel.jsx":
/*!******************************************!*\
  !*** ./assets/jsx/FutureActionPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_71566__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __nested_webpack_require_71566__(/*! ./utils */ "./assets/jsx/utils.jsx");

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
    useDispatch = _wp$data.useDispatch;
var _wp = wp,
    apiFetch = _wp.apiFetch;
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
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListByName[term].id;
        });
    };

    var callOnChangeData = function callOnChangeData(attribute, value) {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData(attribute, value);
        }
    };

    var handleEnabledChange = function handleEnabledChange(isChecked) {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData('enabled', isChecked);
    };

    var handleActionChange = function handleActionChange(value) {
        setAction(value);

        callOnChangeData('action', value);
    };

    var handleDateChange = function handleDateChange(value) {
        console.log('handleDateChange', value);
        var date = new Date(value).getTime();

        setDate(date);

        callOnChangeData('date', date);
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
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
        setDate(new Date(props.date).getTime());
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
        selectedTerms = (0, _utils.compact)(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    var termsListByNameKeys = [];
    if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    // TODO: Why is this different on block editor and classic editor?
    console.log('currentDate', date);

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
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_81865__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createStore = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _time = __nested_webpack_require_81865__(/*! ./time */ "./assets/jsx/time.jsx");

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

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var getCurrentTime = exports.getCurrentTime = function getCurrentTime() {
    return new Date().getTime() / 1000;
};

var formatUnixTimestamp = exports.formatUnixTimestamp = function formatUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000); // Convert to milliseconds by multiplying by 1000

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

var formatTimeToUnixTimestamp = exports.formatTimeToUnixTimestamp = function formatTimeToUnixTimestamp(time) {
    var date = new Date(time);

    return date.getTime() / 1000;
};

/***/ }),

/***/ "./assets/jsx/utils.jsx":
/*!******************************!*\
  !*** ./assets/jsx/utils.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var compact = exports.compact = function compact(array) {
    return array.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });
};

var debugLogFactory = exports.debugLogFactory = function debugLogFactory(config) {
    return function (description) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        if (console && config.isDebugEnabled) {
            var _console;

            (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
        }
    };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_90149__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_90149__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************!*\
  !*** ./assets/jsx/classic-metabox/classic-metabox.jsx ***!
  \********************************************************/


var _classicMetabox = __nested_webpack_require_90149__(/*! ../../js/classic-metabox */ "./assets/js/classic-metabox.js");

var _data = __nested_webpack_require_90149__(/*! ../data */ "./assets/jsx/data.jsx");

var _FutureActionPanel = __nested_webpack_require_90149__(/*! ../FutureActionPanel */ "./assets/jsx/FutureActionPanel.jsx");

(function (wp, config) {
    // Exit if Gutenberg is enabled.
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    var _ReactDOM = ReactDOM,
        createRoot = _ReactDOM.createRoot;


    if (!window.publishpressFuture) {
        window.publishpressFuture = {};
    }

    if (!window.publishpressFuture.store) {
        window.publishpressFuture.store = (0, _data.createStore)({
            defaultState: {
                autoEnable: config.postTypeDefaultConfig.autoEnable,
                action: config.postTypeDefaultConfig.expireType,
                date: config.defaultDate,
                taxonomy: config.postTypeDefaultConfig.taxonomy,
                terms: config.postTypeDefaultConfig.terms
            }
        });
    }

    var ClassicFutureActionPanel = function ClassicFutureActionPanel() {
        var select = wp.data.select;


        var getElementByName = function getElementByName(name) {
            return document.getElementsByName(name)[0];
        };

        var onChangeData = function onChangeData(attribute, value) {
            var store = select('publishpress-future/future-action');

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
            getElementByName('future_action_browser_timezone_offset').value = new Date().getTimezoneOffset();
        };

        var data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(function (term) {
                return parseInt(term);
            }),
            taxonomy: getElementByName('future_action_taxonomy').value
        };

        console.log('date', (0, _classicMetabox.formatUnixTimestamp)(data.date), data.date);

        return React.createElement(
            'div',
            { className: 'post-expirator-panel' },
            React.createElement(_FutureActionPanel.FutureActionPanel, {
                postType: config.postType,
                isCleanNewPost: config.isNewPost,
                actionsSelectOptions: config.actionsSelectOptions,
                enabled: data.enabled,
                action: data.action,
                date: parseInt(data.date),
                terms: data.terms,
                taxonomy: data.taxonomy,
                onChangeData: onChangeData,
                is12hours: config.is12hours,
                startOfWeek: config.startOfWeek,

                strings: config.strings })
        );
    };

    var container = document.getElementById("publishpress-future-classic-metabox");
    var root = createRoot(container);

    root.render(React.createElement(ClassicFutureActionPanel, null));
})(window.wp, window.publishpressFutureClassicMetabox);
})();

/******/ })()
;
//# sourceMappingURL=classic-metabox.js.map

/***/ }),

/***/ "./assets/jsx/FutureActionPanel.jsx":
/*!******************************************!*\
  !*** ./assets/jsx/FutureActionPanel.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(/*! ./utils */ "./assets/jsx/utils.jsx");

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
    useDispatch = _wp$data.useDispatch;
var _wp = wp,
    apiFetch = _wp.apiFetch;
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
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListByName[term].id;
        });
    };

    var callOnChangeData = function callOnChangeData(attribute, value) {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData(attribute, value);
        }
    };

    var handleEnabledChange = function handleEnabledChange(isChecked) {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData('enabled', isChecked);
    };

    var handleActionChange = function handleActionChange(value) {
        setAction(value);

        callOnChangeData('action', value);
    };

    var handleDateChange = function handleDateChange(value) {
        console.log('handleDateChange', value);
        var date = new Date(value).getTime();

        setDate(date);

        callOnChangeData('date', date);
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
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
        setDate(new Date(props.date).getTime());
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
        selectedTerms = (0, _utils.compact)(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    var termsListByNameKeys = [];
    if ((typeof termsListByName === 'undefined' ? 'undefined' : _typeof(termsListByName)) === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    // TODO: Why is this different on block editor and classic editor?
    console.log('currentDate', date);

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

"use strict";


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

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var getCurrentTime = exports.getCurrentTime = function getCurrentTime() {
    return new Date().getTime() / 1000;
};

var formatUnixTimestamp = exports.formatUnixTimestamp = function formatUnixTimestamp(unixTimestamp) {
    var date = new Date(unixTimestamp * 1000); // Convert to milliseconds by multiplying by 1000

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

var formatTimeToUnixTimestamp = exports.formatTimeToUnixTimestamp = function formatTimeToUnixTimestamp(time) {
    var date = new Date(time);

    return date.getTime() / 1000;
};

/***/ }),

/***/ "./assets/jsx/utils.jsx":
/*!******************************!*\
  !*** ./assets/jsx/utils.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var compact = exports.compact = function compact(array) {
    return array.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });
};

var debugLogFactory = exports.debugLogFactory = function debugLogFactory(config) {
    return function (description) {
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            message[_key - 1] = arguments[_key];
        }

        if (console && config.isDebugEnabled) {
            var _console;

            (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
        }
    };
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************!*\
  !*** ./assets/jsx/classic-metabox/classic-metabox.jsx ***!
  \********************************************************/


var _classicMetabox = __webpack_require__(/*! ../../js/classic-metabox */ "./assets/js/classic-metabox.js");

var _data = __webpack_require__(/*! ../data */ "./assets/jsx/data.jsx");

var _FutureActionPanel = __webpack_require__(/*! ../FutureActionPanel */ "./assets/jsx/FutureActionPanel.jsx");

(function (wp, config) {
    // Exit if Gutenberg is enabled.
    if (document.body.classList.contains('block-editor-page')) {
        return;
    }

    var _ReactDOM = ReactDOM,
        createRoot = _ReactDOM.createRoot;


    (0, _data.createStore)({
        defaultState: {
            autoEnable: config.postTypeDefaultConfig.autoEnable,
            action: config.postTypeDefaultConfig.expireType,
            date: config.defaultDate,
            taxonomy: config.postTypeDefaultConfig.taxonomy,
            ters: config.postTypeDefaultConfig.terms
        }
    });

    var ClassicFutureActionPanel = function ClassicFutureActionPanel() {
        var select = wp.data.select;


        var getElementByName = function getElementByName(name) {
            return document.getElementsByName(name)[0];
        };

        var onChangeData = function onChangeData(attribute, value) {
            var store = select('publishpress-future/future-action');

            getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
            getElementByName('future_action_action').value = store.getAction();
            getElementByName('future_action_date').value = store.getDate();
            getElementByName('future_action_terms').value = store.getTerms().join(',');
            getElementByName('future_action_taxonomy').value = store.getTaxonomy();
            getElementByName('future_action_browser_timezone_offset').value = new Date().getTimezoneOffset();
        };

        var data = {
            enabled: getElementByName('future_action_enabled').value === '1',
            action: getElementByName('future_action_action').value,
            date: getElementByName('future_action_date').value,
            terms: getElementByName('future_action_terms').value.split(',').map(function (term) {
                return parseInt(term);
            }),
            taxonomy: getElementByName('future_action_taxonomy').value
        };

        console.log('date', (0, _classicMetabox.formatUnixTimestamp)(data.date), data.date);

        return React.createElement(
            'div',
            { className: 'post-expirator-panel' },
            React.createElement(_FutureActionPanel.FutureActionPanel, {
                postType: config.postType,
                isCleanNewPost: config.isNewPost,
                actionsSelectOptions: config.actionsSelectOptions,
                enabled: data.enabled,
                action: data.action,
                date: parseInt(data.date),
                terms: data.terms,
                taxonomy: data.taxonomy,
                onChangeData: onChangeData,
                is12hours: config.is12hours,
                startOfWeek: config.startOfWeek,

                strings: config.strings })
        );
    };

    var container = document.getElementById("publishpress-future-classic-metabox");
    var root = createRoot(container);

    root.render(React.createElement(ClassicFutureActionPanel, null));
})(window.wp, window.publishpressFutureClassicMetabox);
})();

/******/ })()
;
//# sourceMappingURL=classic-metabox.js.map