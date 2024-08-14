/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/jsx/components/ButtonsPanel.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/ButtonsPanel.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var ButtonsPanel = exports.ButtonsPanel = function ButtonsPanel(props) {
    return React.createElement(
        "div",
        null,
        props.children
    );
};

/***/ }),

/***/ "./assets/jsx/components/CheckboxControl.jsx":
/*!***************************************************!*\
  !*** ./assets/jsx/components/CheckboxControl.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.CheckboxControl = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var CheckboxControl = exports.CheckboxControl = function CheckboxControl(props) {
    var _useState = (0, _element.useState)(props.checked || false),
        _useState2 = _slicedToArray(_useState, 2),
        checked = _useState2[0],
        setChecked = _useState2[1];

    var description = void 0;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = React.createElement("p", { className: "description", dangerouslySetInnerHTML: { __html: props.description } });
    } else {
        description = React.createElement(
            "p",
            { className: "description" },
            props.description
        );
    }

    var onChange = function onChange(value) {
        setChecked(value);

        if (props.onChange) {
            props.onChange(value);
        }
    };

    return React.createElement(
        _element.Fragment,
        null,
        React.createElement(_components.CheckboxControl, {
            label: props.label,
            name: props.name,
            id: props.name,
            className: props.className,
            checked: checked || false,
            onChange: onChange
        }),
        description
    );
};

/***/ }),

/***/ "./assets/jsx/components/DateOffsetPreview.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/DateOffsetPreview.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DateOffsetPreview = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _url = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");

var _wp = __webpack_require__(/*! &wp */ "&wp");

__webpack_require__(/*! ./css/dateOffsetPreview.css */ "./assets/jsx/components/css/dateOffsetPreview.css");

var DateOffsetPreview = exports.DateOffsetPreview = function DateOffsetPreview(_ref) {
    var offset = _ref.offset,
        label = _ref.label,
        labelDatePreview = _ref.labelDatePreview,
        labelOffsetPreview = _ref.labelOffsetPreview,
        setValidationErrorCallback = _ref.setValidationErrorCallback,
        setHasPendingValidationCallback = _ref.setHasPendingValidationCallback,
        setHasValidDataCallback = _ref.setHasValidDataCallback,
        _ref$compactView = _ref.compactView,
        compactView = _ref$compactView === undefined ? false : _ref$compactView;

    var _useState = (0, _element.useState)(''),
        _useState2 = _slicedToArray(_useState, 2),
        offsetPreview = _useState2[0],
        setOffsetPreview = _useState2[1];

    var _useState3 = (0, _element.useState)(),
        _useState4 = _slicedToArray(_useState3, 2),
        currentTime = _useState4[0],
        setCurrentTime = _useState4[1];

    var apiRequestControllerRef = (0, _element.useRef)(new AbortController());

    var validateDateOffset = function validateDateOffset() {
        if (offset) {
            var controller = apiRequestControllerRef.current;

            if (controller) {
                controller.abort();
            }

            apiRequestControllerRef.current = new AbortController();
            var signal = apiRequestControllerRef.current.signal;


            setHasPendingValidationCallback(true);

            (0, _wp.apiFetch)({
                path: (0, _url.addQueryArgs)('publishpress-future/v1/settings/validate-expire-offset'),
                method: 'POST',
                data: {
                    offset: offset
                },
                signal: signal
            }).then(function (result) {
                setHasPendingValidationCallback(false);

                setHasValidDataCallback(result.isValid);
                setValidationErrorCallback(result.message);

                if (result.isValid) {
                    setOffsetPreview(result.preview);
                    setCurrentTime(result.currentTime);
                } else {
                    setOffsetPreview('');
                }
            }).catch(function (error) {
                if (error.name === 'AbortError') {
                    return;
                }

                setHasPendingValidationCallback(false);
                setHasValidDataCallback(false);
                setValidationErrorCallback(error.message);
                setOffsetPreview('');
            });
        }
    };

    (0, _element.useEffect)(function () {
        validateDateOffset();
    }, [offset]);

    var compactClass = compactView ? ' compact' : '';

    return React.createElement(
        _element.Fragment,
        null,
        offset && React.createElement(
            'div',
            { className: 'publishpress-future-date-preview' + compactClass },
            React.createElement(
                'h4',
                null,
                label
            ),
            React.createElement(
                'div',
                { className: 'publishpress-future-date-preview-body' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'publishpress-future-date-preview-label' },
                        labelDatePreview,
                        ': '
                    ),
                    React.createElement(
                        'span',
                        { className: 'publishpress-future-date-preview-value' },
                        currentTime
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'publishpress-future-date-preview-label' },
                        labelOffsetPreview,
                        ': '
                    ),
                    React.createElement(
                        'span',
                        { className: 'publishpress-future-date-preview-value' },
                        offsetPreview
                    )
                )
            )
        )
    );
};

exports["default"] = DateOffsetPreview;

/***/ }),

/***/ "./assets/jsx/components/DateTimePicker.jsx":
/*!**************************************************!*\
  !*** ./assets/jsx/components/DateTimePicker.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DateTimePicker = undefined;

var _time = __webpack_require__(/*! ../time */ "./assets/jsx/time.jsx");

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var DateTimePicker = exports.DateTimePicker = function DateTimePicker(_ref) {
    var currentDate = _ref.currentDate,
        onChange = _ref.onChange,
        is12Hour = _ref.is12Hour,
        startOfWeek = _ref.startOfWeek;

    if (typeof currentDate === 'number') {
        currentDate = (0, _time.normalizeUnixTimeToMilliseconds)(currentDate);
    }

    return React.createElement(_components.DateTimePicker, {
        currentDate: currentDate,
        onChange: onChange,
        __nextRemoveHelpButton: true,
        is12Hour: is12Hour,
        startOfWeek: startOfWeek
    });
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanel.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanel.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _utils = __webpack_require__(/*! ../utils */ "./assets/jsx/utils.jsx");

var _ToggleCalendarDatePicker = __webpack_require__(/*! ./ToggleCalendarDatePicker */ "./assets/jsx/components/ToggleCalendarDatePicker.jsx");

var _plugins = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var _FutureActionPanelAfterActionField = __webpack_require__(/*! ./FutureActionPanelAfterActionField */ "./assets/jsx/components/FutureActionPanelAfterActionField.jsx");

var _FutureActionPanelTop = __webpack_require__(/*! ./FutureActionPanelTop */ "./assets/jsx/components/FutureActionPanelTop.jsx");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _wp$components = wp.components,
    PanelRow = _wp$components.PanelRow,
    CheckboxControl = _wp$components.CheckboxControl,
    SelectControl = _wp$components.SelectControl,
    FormTokenField = _wp$components.FormTokenField,
    Spinner = _wp$components.Spinner,
    BaseControl = _wp$components.BaseControl;
var _wp$element = wp.element,
    Fragment = _wp$element.Fragment,
    useEffect = _wp$element.useEffect,
    useState = _wp$element.useState;
var decodeEntities = wp.htmlEntities.decodeEntities;
var addQueryArgs = wp.url.addQueryArgs;
var _wp$data = wp.data,
    useSelect = _wp$data.useSelect,
    useDispatch = _wp$data.useDispatch;
var _wp = wp,
    apiFetch = _wp.apiFetch;
var FutureActionPanel = exports.FutureActionPanel = function FutureActionPanel(props) {
    var action = useSelect(function (select) {
        return select(props.storeName).getAction();
    }, []);
    var date = useSelect(function (select) {
        return select(props.storeName).getDate();
    }, []);
    var enabled = useSelect(function (select) {
        return select(props.storeName).getEnabled();
    }, []);
    var terms = useSelect(function (select) {
        return select(props.storeName).getTerms();
    }, []);
    var taxonomy = useSelect(function (select) {
        return select(props.storeName).getTaxonomy();
    }, []);
    var taxonomyName = useSelect(function (select) {
        return select(props.storeName).getTaxonomyName();
    }, []);
    var termsListByName = useSelect(function (select) {
        return select(props.storeName).getTermsListByName();
    }, []);
    var termsListById = useSelect(function (select) {
        return select(props.storeName).getTermsListById();
    }, []);
    var isFetchingTerms = useSelect(function (select) {
        return select(props.storeName).getIsFetchingTerms();
    }, []);
    var calendarIsVisible = useSelect(function (select) {
        return select(props.storeName).getCalendarIsVisible();
    }, []);
    var hasValidData = useSelect(function (select) {
        return select(props.storeName).getHasValidData();
    }, []);
    var newStatus = useSelect(function (select) {
        return select(props.storeName).getNewStatus();
    }, []);

    var _useState = useState(''),
        _useState2 = _slicedToArray(_useState, 2),
        validationError = _useState2[0],
        setValidationError = _useState2[1];

    var _useDispatch = useDispatch(props.storeName),
        setAction = _useDispatch.setAction,
        setDate = _useDispatch.setDate,
        setEnabled = _useDispatch.setEnabled,
        setTerms = _useDispatch.setTerms,
        setTaxonomy = _useDispatch.setTaxonomy,
        setTermsListByName = _useDispatch.setTermsListByName,
        setTermsListById = _useDispatch.setTermsListById,
        setTaxonomyName = _useDispatch.setTaxonomyName,
        setIsFetchingTerms = _useDispatch.setIsFetchingTerms,
        setCalendarIsVisible = _useDispatch.setCalendarIsVisible,
        setHasValidData = _useDispatch.setHasValidData,
        setNewStatus = _useDispatch.setNewStatus;

    var mapTermsListById = function mapTermsListById(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            return termsListById[term];
        });
    };

    var insertTerm = function insertTerm(term) {
        termsListByName[term] = { id: term, count: 0, description: "", link: "", name: term, slug: term, taxonomy: taxonomy };
        termsListById[term] = term;
        setTermsListByName(termsListByName);
        setTermsListById(termsListById);
        setTerms([].concat(_toConsumableArray(terms), [term]));
    };

    var mapTermsListByName = function mapTermsListByName(terms) {
        if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) !== 'object' || terms === null) {
            return {};
        }

        return terms.map(function (term) {
            if (termsListByName[term]) {
                return termsListByName[term].id;
            }

            insertTerm(term);

            return term;
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
            setNewStatus(props.newStatus);
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

    var handleNewStatusChange = function handleNewStatusChange(value) {
        setNewStatus(value);

        callOnChangeData('newStatus', value);
    };

    var handleDateChange = function handleDateChange(value) {
        setDate(value);

        callOnChangeData('date', value);
    };

    var handleTermsChange = function handleTermsChange(value) {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
    };

    var fetchTerms = function fetchTerms() {
        var termsListByName = {};
        var termsListById = {};

        if (!taxonomy) {
            return;
        }

        setIsFetchingTerms(true);

        apiFetch({
            path: addQueryArgs('publishpress-future/v1/terms/' + taxonomy)
        }).then(function (result) {
            result.terms.forEach(function (term) {
                termsListByName[decodeEntities(term.name)] = term;
                termsListById[term.id] = decodeEntities(term.name);
            });

            setTermsListByName(termsListByName);
            setTermsListById(termsListById);
            setTaxonomyName(decodeEntities(result.taxonomyName));
            setIsFetchingTerms(false);
        });
    };

    var storeCalendarIsVisibleOnStorage = function storeCalendarIsVisibleOnStorage(value) {
        localStorage.setItem('FUTURE_ACTION_CALENDAR_IS_VISIBLE_' + props.context, value ? '1' : '0');
    };

    var getCalendarIsVisibleFromStorage = function getCalendarIsVisibleFromStorage() {
        return localStorage.getItem('FUTURE_ACTION_CALENDAR_IS_VISIBLE_' + props.context);
    };

    useEffect(function () {
        if (props.autoEnableAndHideCheckbox) {
            setEnabled(true);
        } else {
            setEnabled(props.enabled);
        }

        setAction(props.action);
        setNewStatus(props.newStatus);
        setDate(props.date);
        setTerms(props.terms);
        setTaxonomy(props.taxonomy);

        if (getCalendarIsVisibleFromStorage() === null) {
            setCalendarIsVisible(props.calendarIsVisible);
        } else {
            setCalendarIsVisible(getCalendarIsVisibleFromStorage() === '1');
        }

        // We need to get the value directly from the props because the value from the store is not updated yet
        if (props.enabled) {
            if (props.isCleanNewPost) {
                // Force populate the default values
                handleEnabledChange(true);
            }

            fetchTerms();
        }
    }, []);

    useEffect(function () {
        storeCalendarIsVisibleOnStorage(calendarIsVisible);
    }, [calendarIsVisible]);

    useEffect(function () {
        if (hasValidData && props.onDataIsValid) {
            props.onDataIsValid();
        }

        if (!hasValidData && props.onDataIsInvalid) {
            props.onDataIsInvalid();
        }
    }, [hasValidData]);

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

    var panelClass = calendarIsVisible ? 'future-action-panel' : 'future-action-panel hidden-calendar';
    var contentPanelClass = calendarIsVisible ? 'future-action-panel-content' : 'future-action-panel-content hidden-calendar';
    var datePanelClass = calendarIsVisible ? 'future-action-date-panel' : 'future-action-date-panel hidden-calendar';

    var is24hour = void 0;
    if (props.timeFormat === 'inherited') {
        is24hour = !props.is12Hour;
    } else {
        is24hour = props.timeFormat === '24h';
    }

    var replaceCurlyBracketsWithLink = function replaceCurlyBracketsWithLink(string, href, target) {
        var parts = string.split('{');
        var result = [];

        result.push(parts.shift());

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var part = _step.value;

                var _part$split = part.split('}'),
                    _part$split2 = _slicedToArray(_part$split, 2),
                    before = _part$split2[0],
                    after = _part$split2[1];

                result.push(React.createElement(
                    'a',
                    { href: href, target: target, key: href },
                    before
                ));

                result.push(after);
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

        return result;
    };

    // Remove items from actions list if related to taxonomies and there is no taxonmoy for the post type
    var actionsSelectOptions = props.actionsSelectOptions;
    if (!props.taxonomy) {
        actionsSelectOptions = props.actionsSelectOptions.filter(function (item) {
            return ['category', 'category-add', 'category-remove', 'category-remove-all'].indexOf(item.value) === -1;
        });
    }

    var HelpText = replaceCurlyBracketsWithLink(props.strings.timezoneSettingsHelp, '/wp-admin/options-general.php#timezone_string', '_blank');
    var displayTaxonomyField = String(action).includes('category') && action !== 'category-remove-all';

    var termsFieldLabel = taxonomyName;
    switch (action) {
        case 'category':
            termsFieldLabel = props.strings.newTerms.replace('%s', taxonomyName);
            break;
        case 'category-remove':
            termsFieldLabel = props.strings.removeTerms.replace('%s', taxonomyName);
            break;
        case 'category-add':
            termsFieldLabel = props.strings.addTerms.replace('%s', taxonomyName);
            break;
    }

    var validateData = function validateData() {
        var valid = true;

        if (!enabled) {
            setValidationError('');
            return true;
        }

        if (!action) {
            setValidationError(props.strings.errorActionRequired);
            valid = false;
        }

        if (!date) {
            setValidationError(props.strings.errorDateRequired);
            valid = false;
        }

        // Check if the date is in the past
        if (date && new Date(date) < new Date()) {
            setValidationError(props.strings.errorDateInPast);
            valid = false;
        }

        var isTermRequired = ['category', 'category-add', 'category-remove'].includes(action);
        var noTermIsSelected = terms.length === 0 || terms.length === 1 && (terms[0] === '' || terms[0] === '0');

        if (isTermRequired && noTermIsSelected) {
            setValidationError(props.strings.errorTermsRequired);
            valid = false;
        }

        if (valid) {
            setValidationError('');
        }

        return valid;
    };

    useEffect(function () {
        if (!enabled) {
            setHasValidData(true);
            setValidationError('');

            return;
        }

        setHasValidData(validateData());
    }, [action, date, enabled, terms, taxonomy]);

    // This adds a 'cancel' class to the input when the user clicks on the
    // field to prevent the form from being submitted. This is a workaround
    // for the issue on the quick-edit form where the form is submitted when
    // the user presses the 'Enter' key trying to add a term to the field.
    var forceIgnoreAutoSubmitOnEnter = function forceIgnoreAutoSubmitOnEnter(e) {
        jQuery(e.target).addClass('cancel');
    };

    return React.createElement(
        _components.SlotFillProvider,
        null,
        React.createElement(
            'div',
            { className: panelClass },
            props.autoEnableAndHideCheckbox && React.createElement('input', { type: 'hidden', name: 'future_action_enabled', value: 1 }),
            React.createElement(_FutureActionPanelTop.FutureActionPanelTop.Slot, { fillProps: { storeName: props.storeName } }),
            !props.autoEnableAndHideCheckbox && React.createElement(
                PanelRow,
                null,
                React.createElement(CheckboxControl, {
                    label: props.strings.enablePostExpiration,
                    checked: enabled || false,
                    onChange: handleEnabledChange
                })
            ),
            enabled && React.createElement(
                Fragment,
                null,
                React.createElement(
                    PanelRow,
                    { className: contentPanelClass + ' future-action-full-width' },
                    React.createElement(SelectControl, {
                        label: props.strings.action,
                        value: action,
                        options: actionsSelectOptions,
                        onChange: handleActionChange
                    })
                ),
                React.createElement(_FutureActionPanelAfterActionField.FutureActionPanelAfterActionField.Slot, { fillProps: { storeName: props.storeName } }),
                action === 'change-status' && React.createElement(
                    PanelRow,
                    { className: 'new-status' },
                    React.createElement(SelectControl, {
                        label: props.strings.newStatus,
                        options: props.statusesSelectOptions,
                        value: newStatus,
                        onChange: handleNewStatusChange
                    })
                ),
                displayTaxonomyField && (isFetchingTerms && React.createElement(
                    PanelRow,
                    null,
                    React.createElement(
                        BaseControl,
                        { label: taxonomyName },
                        props.strings.loading + ' (' + taxonomyName + ')',
                        React.createElement(Spinner, null)
                    )
                ) || !taxonomy && React.createElement(
                    PanelRow,
                    null,
                    React.createElement(
                        BaseControl,
                        { label: taxonomyName, className: 'future-action-warning' },
                        React.createElement(
                            'div',
                            null,
                            React.createElement('i', { className: 'dashicons dashicons-warning' }),
                            ' ',
                            props.strings.noTaxonomyFound
                        )
                    )
                ) || termsListByNameKeys.length === 0 && React.createElement(
                    PanelRow,
                    null,
                    React.createElement(
                        BaseControl,
                        { label: taxonomyName, className: 'future-action-warning' },
                        React.createElement(
                            'div',
                            null,
                            React.createElement('i', { className: 'dashicons dashicons-warning' }),
                            ' ',
                            props.strings.noTermsFound
                        )
                    )
                ) || React.createElement(
                    PanelRow,
                    { className: 'future-action-full-width' },
                    React.createElement(
                        BaseControl,
                        null,
                        React.createElement(FormTokenField, {
                            label: termsFieldLabel,
                            value: selectedTerms,
                            suggestions: termsListByNameKeys,
                            onChange: handleTermsChange,
                            placeholder: props.strings.addTermsPlaceholder,
                            maxSuggestions: 1000,
                            onFocus: forceIgnoreAutoSubmitOnEnter,
                            __experimentalExpandOnFocus: true,
                            __experimentalAutoSelectFirstMatch: true
                        })
                    )
                )),
                React.createElement(
                    PanelRow,
                    { className: datePanelClass },
                    React.createElement(_ToggleCalendarDatePicker.ToggleCalendarDatePicker, {
                        currentDate: date,
                        onChangeDate: handleDateChange,
                        onToggleCalendar: function onToggleCalendar() {
                            return setCalendarIsVisible(!calendarIsVisible);
                        },
                        is12Hour: !is24hour,
                        startOfWeek: props.startOfWeek,
                        isExpanded: calendarIsVisible,
                        strings: props.strings
                    })
                ),
                React.createElement(
                    PanelRow,
                    null,
                    React.createElement(
                        'div',
                        { className: 'future-action-help-text' },
                        React.createElement('hr', null),
                        React.createElement('span', { className: 'dashicons dashicons-info' }),
                        ' ',
                        HelpText
                    )
                ),
                !hasValidData && React.createElement(
                    PanelRow,
                    null,
                    React.createElement(
                        BaseControl,
                        { className: 'notice notice-error' },
                        React.createElement(
                            'div',
                            null,
                            validationError
                        )
                    )
                )
            )
        ),
        React.createElement(_plugins.PluginArea, { scope: 'publishpress-future' })
    );
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelAfterActionField.jsx":
/*!*********************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelAfterActionField.jsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanelAfterActionField = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var FutureActionPanelAfterActionField = exports.FutureActionPanelAfterActionField = function FutureActionPanelAfterActionField(_ref) {
    var children = _ref.children;
    return React.createElement(
        _components.Fill,
        { name: "FutureActionPanelAfterActionField" },
        children
    );
};

var FutureActionPanelAfterActionFieldSlot = function FutureActionPanelAfterActionFieldSlot(props) {
    return React.createElement(_components.Slot, _extends({ name: "FutureActionPanelAfterActionField" }, props));
};

FutureActionPanelAfterActionField.Slot = FutureActionPanelAfterActionFieldSlot;

exports["default"] = FutureActionPanelAfterActionField;

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelBlockEditor.jsx":
/*!****************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelBlockEditor.jsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanelBlockEditor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");

var FutureActionPanelBlockEditor = exports.FutureActionPanelBlockEditor = function FutureActionPanelBlockEditor(props) {
    var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;
    var _wp$data = wp.data,
        useDispatch = _wp$data.useDispatch,
        select = _wp$data.select;

    var _useDispatch = useDispatch('core/editor'),
        editPost = _useDispatch.editPost;

    var editPostAttribute = function editPostAttribute(newAttribute) {
        var attribute = {
            publishpress_future_action: {}
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
    };

    var onChangeData = function onChangeData(attribute, value) {
        var store = select(props.storeName);

        var newAttribute = {
            'enabled': store.getEnabled()
        };

        if (newAttribute.enabled) {
            newAttribute['action'] = store.getAction();
            newAttribute['newStatus'] = store.getNewStatus();
            newAttribute['date'] = store.getDate();
            newAttribute['terms'] = store.getTerms();
            newAttribute['taxonomy'] = store.getTaxonomy();
            newAttribute['extraData'] = store.getExtraData();
        }

        editPostAttribute(newAttribute);
    };

    var data = select('core/editor').getEditedPostAttribute('publishpress_future_action');

    var _useDispatch2 = useDispatch('core/editor'),
        lockPostSaving = _useDispatch2.lockPostSaving,
        unlockPostSaving = _useDispatch2.unlockPostSaving;

    var onDataIsValid = function onDataIsValid() {
        unlockPostSaving('future-action');
    };

    var onDataIsInvalid = function onDataIsInvalid() {
        lockPostSaving('future-action');
    };

    return React.createElement(
        PluginDocumentSettingPanel,
        {
            name: 'publishpress-future-action-panel',
            title: props.strings.panelTitle,
            initialOpen: props.postTypeDefaultConfig.autoEnable,
            className: 'post-expirator-panel' },
        React.createElement(
            'div',
            { id: 'publishpress-future-block-editor' },
            React.createElement(_.FutureActionPanel, {
                context: 'block-editor',
                postType: props.postType,
                isCleanNewPost: props.isCleanNewPost,
                actionsSelectOptions: props.actionsSelectOptions,
                statusesSelectOptions: props.statusesSelectOptions,
                enabled: data.enabled,
                calendarIsVisible: true,
                action: data.action,
                newStatus: data.newStatus,
                date: data.date,
                terms: data.terms,
                taxonomy: data.taxonomy,
                taxonomyName: props.taxonomyName,
                onChangeData: onChangeData,
                is12Hour: props.is12Hour,
                timeFormat: props.timeFormat,
                startOfWeek: props.startOfWeek,
                storeName: props.storeName,
                strings: props.strings,
                onDataIsValid: onDataIsValid,
                onDataIsInvalid: onDataIsInvalid })
        )
    );
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelBulkEdit.jsx":
/*!*************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelBulkEdit.jsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanelBulkEdit = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = __webpack_require__(/*! . */ "./assets/jsx/components/index.jsx");

var _utils = __webpack_require__(/*! ../utils */ "./assets/jsx/utils.jsx");

var FutureActionPanelBulkEdit = exports.FutureActionPanelBulkEdit = function FutureActionPanelBulkEdit(props) {
    var _wp$data = wp.data,
        useSelect = _wp$data.useSelect,
        useDispatch = _wp$data.useDispatch,
        select = _wp$data.select;
    var useEffect = wp.element.useEffect;


    var onChangeData = function onChangeData(attribute, value) {
        (0, _utils.getElementByName)('future_action_bulk_enabled').value = select(props.storeName).getEnabled() ? 1 : 0;
        (0, _utils.getElementByName)('future_action_bulk_action').value = select(props.storeName).getAction();
        (0, _utils.getElementByName)('future_action_bulk_new_status').value = select(props.storeName).getNewStatus();
        (0, _utils.getElementByName)('future_action_bulk_date').value = select(props.storeName).getDate();
        (0, _utils.getElementByName)('future_action_bulk_terms').value = select(props.storeName).getTerms().join(',');
        (0, _utils.getElementByName)('future_action_bulk_taxonomy').value = select(props.storeName).getTaxonomy();
    };

    var date = useSelect(function (select) {
        return select(props.storeName).getDate();
    }, []);
    var enabled = useSelect(function (select) {
        return select(props.storeName).getEnabled();
    }, []);
    var action = useSelect(function (select) {
        return select(props.storeName).getAction();
    }, []);
    var newStatus = useSelect(function (select) {
        return select(props.storeName).getNewStatus();
    }, []);
    var terms = useSelect(function (select) {
        return select(props.storeName).getTerms();
    }, []);
    var taxonomy = useSelect(function (select) {
        return select(props.storeName).getTaxonomy();
    }, []);
    var changeAction = useSelect(function (select) {
        return select(props.storeName).getChangeAction();
    }, []);
    var hasValidData = useSelect(function (select) {
        return select(props.storeName).getHasValidData();
    }, []);

    var _useDispatch = useDispatch(props.storeName),
        setChangeAction = _useDispatch.setChangeAction;

    var termsString = terms;
    if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) === 'object') {
        termsString = terms.join(',');
    }

    var handleStrategyChange = function handleStrategyChange(value) {
        setChangeAction(value);
    };

    var options = [{ value: 'no-change', label: props.strings.noChange }, { value: 'change-add', label: props.strings.changeAdd }, { value: 'add-only', label: props.strings.addOnly }, { value: 'change-only', label: props.strings.changeOnly }, { value: 'remove-only', label: props.strings.removeOnly }];

    var optionsToDisplayPanel = ['change-add', 'add-only', 'change-only'];

    useEffect(function () {
        // We are not using onDataIsValid and onDataIsInvalid because we need to enable/disable the button
        // also based on the changeAction value.
        if (hasValidData || changeAction === 'no-change') {
            jQuery('#bulk_edit').prop('disabled', false);
        } else {
            jQuery('#bulk_edit').prop('disabled', true);
        }
    }, [hasValidData, changeAction]);

    return React.createElement(
        'div',
        { className: 'post-expirator-panel' },
        React.createElement(_.SelectControl, {
            label: props.strings.futureActionUpdate,
            name: 'future_action_bulk_change_action',
            value: changeAction,
            options: options,
            onChange: handleStrategyChange
        }),
        optionsToDisplayPanel.includes(changeAction) && React.createElement(_.FutureActionPanel, {
            context: 'bulk-edit',
            autoEnableAndHideCheckbox: true,
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            statusesSelectOptions: props.statusesSelectOptions,
            enabled: true,
            calendarIsVisible: false,
            action: action,
            newStatus: newStatus,
            date: date,
            terms: terms,
            taxonomy: taxonomy,
            taxonomyName: props.taxonomyName,
            onChangeData: onChangeData,
            is12Hour: props.is12Hour,
            timeFormat: props.timeFormat,
            startOfWeek: props.startOfWeek,
            storeName: props.storeName,
            strings: props.strings }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_enabled', value: enabled ? 1 : 0 }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_action', value: action }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_new_status', value: newStatus }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_date', value: date }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_terms', value: termsString }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_taxonomy', value: taxonomy }),
        React.createElement('input', { type: 'hidden', name: 'future_action_bulk_view', value: 'bulk-edit' }),
        React.createElement('input', { type: 'hidden', name: '_future_action_nonce', value: props.nonce })
    );
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelClassicEditor.jsx":
/*!******************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelClassicEditor.jsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanelClassicEditor = undefined;

var _ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");

var _data = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var FutureActionPanelClassicEditor = exports.FutureActionPanelClassicEditor = function FutureActionPanelClassicEditor(props) {
    var browserTimezoneOffset = new Date().getTimezoneOffset();

    var getElementByName = function getElementByName(name) {
        return document.getElementsByName(name)[0];
    };

    var onChangeData = function onChangeData(attribute, value) {
        var store = (0, _data.select)(props.storeName);

        getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
        getElementByName('future_action_action').value = store.getAction();
        getElementByName('future_action_new_status').value = store.getNewStatus();
        getElementByName('future_action_date').value = store.getDate();
        getElementByName('future_action_terms').value = store.getTerms().join(',');
        getElementByName('future_action_taxonomy').value = store.getTaxonomy();
    };

    var getTermsFromElementByName = function getTermsFromElementByName(name) {
        var element = getElementByName(name);
        if (!element) {
            return [];
        }

        var terms = element.value.split(',');

        if (terms.length === 1 && terms[0] === '') {
            terms = [];
        }

        return terms.map(function (term) {
            return parseInt(term);
        });
    };

    var getElementValueByName = function getElementValueByName(name) {
        var element = getElementByName(name);
        if (!element) {
            return '';
        }

        return element.value;
    };

    var data = {
        enabled: getElementValueByName('future_action_enabled') === '1',
        action: getElementValueByName('future_action_action'),
        newStatus: getElementValueByName('future_action_new_status'),
        date: getElementValueByName('future_action_date'),
        terms: getTermsFromElementByName('future_action_terms'),
        taxonomy: getElementValueByName('future_action_taxonomy')
    };

    var onDataIsValid = function onDataIsValid() {
        jQuery('#publish').prop('disabled', false);
    };

    var onDataIsInvalid = function onDataIsInvalid() {
        jQuery('#publish').prop('disabled', true);
    };

    return React.createElement(
        "div",
        { className: 'post-expirator-panel' },
        React.createElement(_.FutureActionPanel, {
            context: 'classic-editor',
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            statusesSelectOptions: props.statusesSelectOptions,
            enabled: data.enabled,
            calendarIsVisible: true,
            action: data.action,
            newStatus: data.newStatus,
            date: data.date,
            terms: data.terms,
            taxonomy: data.taxonomy,
            taxonomyName: props.taxonomyName,
            onChangeData: onChangeData,
            is12Hour: props.is12Hour,
            timeFormat: props.timeFormat,
            startOfWeek: props.startOfWeek,
            storeName: props.storeName,
            strings: props.strings,
            onDataIsValid: onDataIsValid,
            onDataIsInvalid: onDataIsInvalid })
    );
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelQuickEdit.jsx":
/*!**************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelQuickEdit.jsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanelQuickEdit = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");

var _data = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var FutureActionPanelQuickEdit = exports.FutureActionPanelQuickEdit = function FutureActionPanelQuickEdit(props) {
    var onChangeData = function onChangeData(attribute, value) {};

    var date = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getDate();
    }, []);
    var enabled = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getEnabled();
    }, []);
    var action = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getAction();
    }, []);
    var terms = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getTerms();
    }, []);
    var taxonomy = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getTaxonomy();
    }, []);
    var hasValidData = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getHasValidData();
    }, []);
    var newStatus = (0, _data.useSelect)(function (select) {
        return select(props.storeName).getNewStatus();
    }, []);

    var termsString = terms;
    if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) === 'object') {
        termsString = terms.join(',');
    }

    var onDataIsValid = function onDataIsValid() {
        jQuery('.button-primary.save').prop('disabled', false);
    };

    var onDataIsInvalid = function onDataIsInvalid() {
        jQuery('.button-primary.save').prop('disabled', true);
    };

    return React.createElement(
        'div',
        { className: 'post-expirator-panel' },
        React.createElement(_.FutureActionPanel, {
            context: 'quick-edit',
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            statusesSelectOptions: props.statusesSelectOptions,
            enabled: enabled,
            calendarIsVisible: false,
            action: action,
            newStatus: newStatus,
            date: date,
            terms: terms,
            taxonomy: taxonomy,
            taxonomyName: props.taxonomyName,
            onChangeData: onChangeData,
            is12Hour: props.is12Hour,
            timeFormat: props.timeFormat,
            startOfWeek: props.startOfWeek,
            storeName: props.storeName,
            strings: props.strings,
            onDataIsValid: onDataIsValid,
            onDataIsInvalid: onDataIsInvalid }),
        React.createElement('input', { type: 'hidden', name: 'future_action_enabled', value: enabled ? 1 : 0 }),
        React.createElement('input', { type: 'hidden', name: 'future_action_action', value: action ? action : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_new_status', value: newStatus ? newStatus : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_date', value: date ? date : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_terms', value: termsString ? termsString : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_taxonomy', value: taxonomy ? taxonomy : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_view', value: 'quick-edit' }),
        React.createElement('input', { type: 'hidden', name: '_future_action_nonce', value: props.nonce })
    );
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelTop.jsx":
/*!********************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelTop.jsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FutureActionPanelTop = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var FutureActionPanelTop = exports.FutureActionPanelTop = function FutureActionPanelTop(_ref) {
    var children = _ref.children;
    return React.createElement(
        _components.Fill,
        { name: "FutureActionPanelTop" },
        children
    );
};

var FutureActionPanelTopSlot = function FutureActionPanelTopSlot(props) {
    return React.createElement(_components.Slot, _extends({ name: "FutureActionPanelTop" }, props));
};

FutureActionPanelTop.Slot = FutureActionPanelTopSlot;

exports["default"] = FutureActionPanelTop;

/***/ }),

/***/ "./assets/jsx/components/NonceControl.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/NonceControl.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.NonceControl = undefined;

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var NonceControl = exports.NonceControl = function NonceControl(props) {
    if (!props.name) {
        props.name = '_wpnonce';
    }

    if (!props.referrer) {
        props.referrer = true;
    }

    return React.createElement(
        _element.Fragment,
        null,
        React.createElement("input", { type: "hidden", name: props.name, id: props.name, value: props.nonce }),
        props.referrer && React.createElement("input", { type: "hidden", name: "_wp_http_referer", value: props.referrer })
    );
}; /*
    * Copyright (c) 2023. PublishPress, All rights reserved.
    */

/***/ }),

/***/ "./assets/jsx/components/PostTypeSettingsPanel.jsx":
/*!*********************************************************!*\
  !*** ./assets/jsx/components/PostTypeSettingsPanel.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.PostTypeSettingsPanel = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _url = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");

var _hooks = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");

var _wp = __webpack_require__(/*! &wp */ "&wp");

var _DateOffsetPreview = __webpack_require__(/*! ./DateOffsetPreview */ "./assets/jsx/components/DateOffsetPreview.jsx");

var _DateOffsetPreview2 = _interopRequireDefault(_DateOffsetPreview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PanelRow = wp.components.PanelRow;
var PostTypeSettingsPanel = exports.PostTypeSettingsPanel = function PostTypeSettingsPanel(props) {
    var originalExpireTypeList = props.expireTypeList[props.postType];

    var _useState = (0, _element.useState)(props.settings.taxonomy),
        _useState2 = _slicedToArray(_useState, 2),
        postTypeTaxonomy = _useState2[0],
        setPostTypeTaxonomy = _useState2[1];

    var _useState3 = (0, _element.useState)([]),
        _useState4 = _slicedToArray(_useState3, 2),
        termOptions = _useState4[0],
        setTermOptions = _useState4[1];

    var _useState5 = (0, _element.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        termsSelectIsLoading = _useState6[0],
        setTermsSelectIsLoading = _useState6[1];

    var _useState7 = (0, _element.useState)([]),
        _useState8 = _slicedToArray(_useState7, 2),
        selectedTerms = _useState8[0],
        setSelectedTerms = _useState8[1];

    var _useState9 = (0, _element.useState)(props.settings.howToExpire),
        _useState10 = _slicedToArray(_useState9, 2),
        settingHowToExpire = _useState10[0],
        setSettingHowToExpire = _useState10[1];

    var _useState11 = (0, _element.useState)(props.settings.active),
        _useState12 = _slicedToArray(_useState11, 2),
        isActive = _useState12[0],
        setIsActive = _useState12[1];

    var _useState13 = (0, _element.useState)(props.settings.defaultExpireOffset),
        _useState14 = _slicedToArray(_useState13, 2),
        expireOffset = _useState14[0],
        setExpireOffset = _useState14[1];

    var _useState15 = (0, _element.useState)(props.settings.emailNotification),
        _useState16 = _slicedToArray(_useState15, 2),
        emailNotification = _useState16[0],
        setEmailNotification = _useState16[1];

    var _useState17 = (0, _element.useState)(props.settings.autoEnabled),
        _useState18 = _slicedToArray(_useState17, 2),
        isAutoEnabled = _useState18[0],
        setIsAutoEnabled = _useState18[1];

    var _useState19 = (0, _element.useState)(false),
        _useState20 = _slicedToArray(_useState19, 2),
        hasValidData = _useState20[0],
        setHasValidData = _useState20[1];

    var _useState21 = (0, _element.useState)(''),
        _useState22 = _slicedToArray(_useState21, 2),
        validationError = _useState22[0],
        setValidationError = _useState22[1];

    var _useState23 = (0, _element.useState)(''),
        _useState24 = _slicedToArray(_useState23, 2),
        taxonomyLabel = _useState24[0],
        setTaxonomyLabel = _useState24[1];

    var _useState25 = (0, _element.useState)(originalExpireTypeList),
        _useState26 = _slicedToArray(_useState25, 2),
        howToExpireList = _useState26[0],
        setHowToExpireList = _useState26[1];

    var _useState27 = (0, _element.useState)(props.settings.newStatus),
        _useState28 = _slicedToArray(_useState27, 2),
        newStatus = _useState28[0],
        setNewStatus = _useState28[1];

    var _useState29 = (0, _element.useState)(false),
        _useState30 = _slicedToArray(_useState29, 2),
        hasPendingValidation = _useState30[0],
        setHasPendingValidation = _useState30[1];

    var offset = expireOffset ? expireOffset : props.settings.globalDefaultExpireOffset;

    var taxonomyRelatedActions = ['category', 'category-add', 'category-remove', 'category-remove-all'];

    var onChangeTaxonomy = function onChangeTaxonomy(value) {
        setPostTypeTaxonomy(value);
    };

    var onChangeTerms = function onChangeTerms(value) {
        setSelectedTerms(value);
    };

    var onChangeHowToExpire = function onChangeHowToExpire(value) {
        setSettingHowToExpire(value);
    };

    var onChangeActive = function onChangeActive(value) {
        setIsActive(value);
    };

    var onChangeExpireOffset = function onChangeExpireOffset(value) {
        setExpireOffset(value);
    };

    var onChangeEmailNotification = function onChangeEmailNotification(value) {
        setEmailNotification(value);
    };

    var onChangeAutoEnabled = function onChangeAutoEnabled(value) {
        setIsAutoEnabled(value);
    };

    (0, _element.useEffect)(function () {
        // Remove items from expireTypeList if related to taxonomies and there is no taxonmoy for the post type
        if (props.taxonomiesList.length === 0) {
            var newExpireTypeList = [];

            newExpireTypeList = howToExpireList.filter(function (item) {
                return taxonomyRelatedActions.indexOf(item.value) === -1;
            });

            setHowToExpireList(newExpireTypeList);
        }
    }, []);

    (0, _element.useEffect)(function () {
        if (!postTypeTaxonomy || !props.taxonomiesList) {
            return;
        }

        setTermsSelectIsLoading(true);
        (0, _wp.apiFetch)({
            path: (0, _url.addQueryArgs)('publishpress-future/v1/terms/' + postTypeTaxonomy)
        }).then(function (result) {
            var options = [];

            var settingsTermsOptions = null;
            var option = void 0;

            result.terms.forEach(function (term) {
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
            setSelectedTerms(settingsTermsOptions);
            setTermsSelectIsLoading(false);
        });

        props.taxonomiesList.forEach(function (taxonomy) {
            if (taxonomy.value === postTypeTaxonomy) {
                setTaxonomyLabel(taxonomy.label);
            }
        });
    }, [postTypeTaxonomy]);

    (0, _element.useEffect)(function () {
        if (!taxonomyLabel) {
            return;
        }

        // Update the list of actions replacing the taxonomy name.
        var newExpireTypeList = [];

        originalExpireTypeList.forEach(function (expireType) {
            var label = expireType.label;

            if (taxonomyRelatedActions.indexOf(expireType.value) !== -1) {
                label = label.replace('%s', taxonomyLabel.toLowerCase());
            }

            newExpireTypeList.push({
                value: expireType.value,
                label: label
            });
        });

        setHowToExpireList(newExpireTypeList);
    }, [taxonomyLabel]);

    (0, _element.useEffect)(function () {
        if (hasValidData && props.onDataIsValid) {
            props.onDataIsValid(props.postType);
        }

        if (!hasValidData && props.onDataIsInvalid) {
            props.onDataIsInvalid(props.postType);
        }
    }, [hasValidData]);

    (0, _element.useEffect)(function () {
        if (hasPendingValidation && props.onValidationStarted) {
            props.onValidationStarted(props.postType);
        }

        if (!hasPendingValidation && props.onValidationFinished) {
            props.onValidationFinished(props.postType);
        }
    }, [hasPendingValidation]);

    var termOptionsLabels = termOptions.map(function (term) {
        return term.label;
    });

    var settingsRows = [React.createElement(
        _.SettingRow,
        { label: props.text.fieldActive, key: 'expirationdate_activemeta-' + props.postType },
        React.createElement(_.CheckboxControl, {
            name: 'expirationdate_activemeta-' + props.postType,
            checked: isActive || false,
            label: props.text.fieldActiveLabel,
            onChange: onChangeActive
        })
    )];

    if (isActive) {
        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldAutoEnable, key: 'expirationdate_autoenable-' + props.postType },
            React.createElement(_.CheckboxControl, {
                name: 'expirationdate_autoenable-' + props.postType,
                checked: isAutoEnabled || false,
                label: props.text.fieldAutoEnableLabel,
                onChange: onChangeAutoEnabled
            })
        ));

        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldTaxonomy, key: 'expirationdate_taxonomy-' + props.postType },
            React.createElement(_.SelectControl, {
                name: 'expirationdate_taxonomy-' + props.postType,
                options: props.taxonomiesList,
                selected: postTypeTaxonomy,
                noItemFoundMessage: props.text.noItemsfound,
                description: props.text.fieldTaxonomyDescription,
                data: props.postType,
                onChange: onChangeTaxonomy
            })
        ));

        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldHowToExpire, key: 'expirationdate_expiretype-' + props.postType },
            React.createElement(_.SelectControl, {
                name: 'expirationdate_expiretype-' + props.postType,
                className: 'pe-howtoexpire',
                options: howToExpireList,
                description: props.text.fieldHowToExpireDescription,
                selected: settingHowToExpire,
                onChange: onChangeHowToExpire
            }),
            settingHowToExpire === 'change-status' && React.createElement(_.SelectControl, {
                name: 'expirationdate_newstatus-' + props.postType,
                options: props.statusesList,
                selected: newStatus,
                onChange: setNewStatus
            }),
            props.taxonomiesList.length > 0 && ['category', 'category-add', 'category-remove'].indexOf(settingHowToExpire) > -1 && React.createElement(_.TokensControl, {
                label: props.text.fieldTerm,
                name: 'expirationdate_terms-' + props.postType,
                options: termOptionsLabels,
                value: selectedTerms,
                isLoading: termsSelectIsLoading,
                onChange: onChangeTerms,
                description: props.text.fieldTermDescription,
                maxSuggestions: 1000,
                expandOnFocus: true,
                autoSelectFirstMatch: true
            })
        ));

        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldDefaultDateTimeOffset, key: 'expired-custom-date-' + props.postType },
            React.createElement(_.TextControl, {
                name: 'expired-custom-date-' + props.postType,
                value: expireOffset,
                loading: hasPendingValidation,
                placeholder: props.settings.globalDefaultExpireOffset,
                description: props.text.fieldDefaultDateTimeOffsetDescription,
                unescapedDescription: true,
                onChange: onChangeExpireOffset
            }),
            React.createElement(_DateOffsetPreview2.default, {
                offset: offset,
                label: props.text.datePreview,
                labelDatePreview: props.text.datePreviewCurrent,
                labelOffsetPreview: props.text.datePreviewComputed,
                setValidationErrorCallback: setValidationError,
                setHasPendingValidationCallback: setHasPendingValidation,
                setHasValidDataCallback: setHasValidData
            })
        ));

        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldWhoToNotify, key: 'expirationdate_emailnotification-' + props.postType },
            React.createElement(_.TextControl, {
                name: 'expirationdate_emailnotification-' + props.postType,
                className: 'large-text',
                value: emailNotification,
                description: props.text.fieldWhoToNotifyDescription,
                onChange: onChangeEmailNotification
            })
        ));
    }

    settingsRows = (0, _hooks.applyFilters)('expirationdate_settings_posttype', settingsRows, props, isActive, _element.useState);

    var fieldSetClassNames = props.isVisible ? 'pe-settings-fieldset' : 'pe-settings-fieldset hidden';

    return React.createElement(
        'div',
        { className: fieldSetClassNames },
        React.createElement(_.SettingsTable, { bodyChildren: settingsRows }),
        !hasValidData && React.createElement(
            PanelRow,
            null,
            React.createElement(
                'div',
                { className: 'publishpress-future-notice publishpress-future-notice-error' },
                React.createElement(
                    'strong',
                    null,
                    props.text.error,
                    ':'
                ),
                ' ',
                validationError
            )
        )
    );
};

/***/ }),

/***/ "./assets/jsx/components/PostTypesSettingsPanels.jsx":
/*!***********************************************************!*\
  !*** ./assets/jsx/components/PostTypesSettingsPanels.jsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.PostTypesSettingsPanels = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var PostTypesSettingsPanels = exports.PostTypesSettingsPanels = function PostTypesSettingsPanels(props) {
    var _useState = (0, _element.useState)(Object.keys(props.settings)[0]),
        _useState2 = _slicedToArray(_useState, 2),
        currentTab = _useState2[0],
        setCurrentTab = _useState2[1];

    var panels = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(props.settings)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var postType = _ref2[0];
            var postTypeSettings = _ref2[1];

            panels.push(React.createElement(_.PostTypeSettingsPanel, {
                legend: postTypeSettings.label,
                text: props.text,
                postType: postType,
                settings: postTypeSettings,
                expireTypeList: props.expireTypeList,
                taxonomiesList: props.taxonomiesList[postType],
                statusesList: props.statusesList[postType],
                key: postType + "-panel",
                onDataIsValid: props.onDataIsValid,
                onDataIsInvalid: props.onDataIsInvalid,
                onValidationStarted: props.onValidationStarted,
                onValidationFinished: props.onValidationFinished,
                isVisible: currentTab === postType
            }));
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

    var onSelectTab = function onSelectTab(event) {
        event.preventDefault();
        setCurrentTab(event.target.hash.replace('#', '').replace('-panel', ''));
    };

    var tabs = [];
    var selected = false;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.entries(props.settings)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _ref3 = _step2.value;

            var _ref4 = _slicedToArray(_ref3, 2);

            var _postType = _ref4[0];
            var _postTypeSettings = _ref4[1];

            selected = currentTab === _postType;
            tabs.push(React.createElement(
                "a",
                { href: "#" + _postType + "-panel",
                    className: "nav-tab " + (selected ? 'nav-tab-active' : ''),
                    key: _postType + "-tab",
                    onClick: onSelectTab
                },
                _postTypeSettings.label
            ));
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return React.createElement(
        "div",
        null,
        React.createElement(
            "nav",
            { className: "nav-tab-wrapper" },
            tabs
        ),
        panels
    );
};

/***/ }),

/***/ "./assets/jsx/components/SelectControl.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/SelectControl.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SelectControl = undefined;

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
var SelectControl = exports.SelectControl = function SelectControl(props) {
    var onChange = function onChange(value) {
        props.onChange(value);
    };

    return React.createElement(
        _element.Fragment,
        null,
        props.options.length === 0 && React.createElement(
            "div",
            null,
            props.noItemFoundMessage
        ),
        props.options.length > 0 && React.createElement(_components.SelectControl, {
            label: props.label,
            name: props.name,
            id: props.name,
            className: props.className,
            value: props.selected,
            onChange: onChange,
            "data-data": props.data,
            options: props.options
        }),
        props.children,
        React.createElement(
            "p",
            { className: "description" },
            props.description
        )
    );
};

/***/ }),

/***/ "./assets/jsx/components/SettingRow.jsx":
/*!**********************************************!*\
  !*** ./assets/jsx/components/SettingRow.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SettingRow = undefined;

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var SettingRow = exports.SettingRow = function SettingRow(props) {
    return React.createElement(
        "tr",
        { valign: "top" },
        React.createElement(
            "th",
            { scope: "row" },
            React.createElement(
                "label",
                { htmlFor: "" },
                props.label
            )
        ),
        React.createElement(
            "td",
            null,
            props.children
        )
    );
}; /*
    * Copyright (c) 2023. PublishPress, All rights reserved.
    */

/***/ }),

/***/ "./assets/jsx/components/SettingsFieldset.jsx":
/*!****************************************************!*\
  !*** ./assets/jsx/components/SettingsFieldset.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingsFieldset = exports.SettingsFieldset = function SettingsFieldset(props) {
    return React.createElement(
        "fieldset",
        { className: props.className },
        React.createElement(
            "legend",
            null,
            props.legend
        ),
        props.children
    );
};

/***/ }),

/***/ "./assets/jsx/components/SettingsForm.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/SettingsForm.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingsForm = exports.SettingsForm = function SettingsForm(props) {
    return React.createElement(
        "form",
        { method: "post" },
        props.children
    );
};

/***/ }),

/***/ "./assets/jsx/components/SettingsSection.jsx":
/*!***************************************************!*\
  !*** ./assets/jsx/components/SettingsSection.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SettingsSection = undefined;

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var SettingsSection = exports.SettingsSection = function SettingsSection(props) {
    return React.createElement(
        _element.Fragment,
        null,
        React.createElement(
            "h2",
            null,
            props.title
        ),
        React.createElement(
            "p",
            null,
            props.description
        ),
        props.children
    );
}; /*
    * Copyright (c) 2023. PublishPress, All rights reserved.
    */

/***/ }),

/***/ "./assets/jsx/components/SettingsTable.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/SettingsTable.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingsTable = exports.SettingsTable = function SettingsTable(props) {
    return React.createElement(
        "table",
        { className: "form-table" },
        React.createElement(
            "tbody",
            null,
            props.bodyChildren
        )
    );
};

/***/ }),

/***/ "./assets/jsx/components/Spinner.jsx":
/*!*******************************************!*\
  !*** ./assets/jsx/components/Spinner.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2024. PublishPress, All rights reserved.
 */
var Spinner = exports.Spinner = function Spinner(props) {
    return React.createElement(
        "span",
        { className: "publishpress-future-spinner" },
        React.createElement("div", null),
        React.createElement("div", null),
        React.createElement("div", null),
        React.createElement("div", null)
    );
};

/***/ }),

/***/ "./assets/jsx/components/SubmitButton.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/SubmitButton.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SubmitButton = exports.SubmitButton = function SubmitButton(props) {
    return React.createElement("input", {
        type: "submit",
        name: props.name,
        value: props.text,
        disabled: props.disabled,
        className: "button-primary"
    });
};

/***/ }),

/***/ "./assets/jsx/components/TextControl.jsx":
/*!***********************************************!*\
  !*** ./assets/jsx/components/TextControl.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TextControl = undefined;

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var _ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");

var TextControl = exports.TextControl = function TextControl(props) {
    var description = void 0;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = React.createElement("p", { className: "description", dangerouslySetInnerHTML: { __html: props.description } });
    } else {
        description = React.createElement(
            "p",
            { className: "description" },
            props.description
        );
    }

    var onChange = function onChange(value) {
        if (props.onChange) {
            props.onChange(value);
        }
    };

    var className = props.className ? props.className : '';

    if (props.loading) {
        className += ' publishpress-future-loading publishpress-future-loading-input';
    }

    return React.createElement(
        _element.Fragment,
        null,
        React.createElement(
            "div",
            { className: className },
            React.createElement(_components.TextControl, {
                type: "text",
                label: props.label,
                name: props.name,
                id: props.name,
                className: props.className,
                value: props.value,
                placeholder: props.placeholder,
                onChange: onChange
            }),
            props.loading && React.createElement(_.Spinner, null),
            description
        )
    );
}; /*
    * Copyright (c) 2023. PublishPress, All rights reserved.
    */

/***/ }),

/***/ "./assets/jsx/components/ToggleArrowButton.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/ToggleArrowButton.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ToggleArrowButton = undefined;

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var ToggleArrowButton = exports.ToggleArrowButton = function ToggleArrowButton(props) {
    var onClick = function onClick() {
        if (props.onClick) {
            props.onClick();
        }
    };

    var iconExpanded = props.iconExpanded ? props.iconExpanded : 'arrow-up-alt2';
    var iconCollapsed = props.iconCollapsed ? props.iconCollapsed : 'arrow-down-alt2';

    var icon = props.isExpanded ? iconExpanded : iconCollapsed;

    var title = props.isExpanded ? props.titleExpanded : props.titleCollapsed;

    return React.createElement(_components.Button, {
        isSmall: true,
        title: title,
        icon: icon,
        onClick: onClick,
        className: props.className
    });
};

/***/ }),

/***/ "./assets/jsx/components/ToggleCalendarDatePicker.jsx":
/*!************************************************************!*\
  !*** ./assets/jsx/components/ToggleCalendarDatePicker.jsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ToggleCalendarDatePicker = undefined;

var _ToggleArrowButton = __webpack_require__(/*! ./ToggleArrowButton */ "./assets/jsx/components/ToggleArrowButton.jsx");

var _DateTimePicker = __webpack_require__(/*! ./DateTimePicker */ "./assets/jsx/components/DateTimePicker.jsx");

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var ToggleCalendarDatePicker = exports.ToggleCalendarDatePicker = function ToggleCalendarDatePicker(_ref) {
    var isExpanded = _ref.isExpanded,
        strings = _ref.strings,
        onToggleCalendar = _ref.onToggleCalendar,
        currentDate = _ref.currentDate,
        onChangeDate = _ref.onChangeDate,
        is12Hour = _ref.is12Hour,
        startOfWeek = _ref.startOfWeek;

    (0, _element.useEffect)(function () {
        // Move the element of the toggle button to between the time and date elements.
        var toggleButtonElement = document.querySelector('.future-action-calendar-toggle');

        if (!toggleButtonElement) {
            return;
        }

        var dateTimeElement = toggleButtonElement.nextElementSibling;

        if (!dateTimeElement) {
            return;
        }

        var timeElement = dateTimeElement.querySelector('.components-datetime__time');

        if (!timeElement) {
            return;
        }

        var dateElement = timeElement.nextSibling;

        if (!dateElement) {
            return;
        }

        dateTimeElement.insertBefore(toggleButtonElement, dateElement);
    });

    return React.createElement(
        _element.Fragment,
        null,
        React.createElement(_ToggleArrowButton.ToggleArrowButton, {
            className: "future-action-calendar-toggle",
            isExpanded: isExpanded,
            iconExpanded: "arrow-up-alt2",
            iconCollapsed: "calendar",
            titleExpanded: strings.hideCalendar,
            titleCollapsed: strings.showCalendar,
            onClick: onToggleCalendar }),
        React.createElement(_DateTimePicker.DateTimePicker, {
            currentDate: currentDate,
            onChange: onChangeDate,
            __nextRemoveHelpButton: true,
            is12Hour: is12Hour,
            startOfWeek: startOfWeek
        })
    );
};

/***/ }),

/***/ "./assets/jsx/components/TokensControl.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/TokensControl.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TokensControl = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _components = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");

var TokensControl = exports.TokensControl = function TokensControl(props) {
    var _useState = (0, _element.useState)(''),
        _useState2 = _slicedToArray(_useState, 2),
        stringValue = _useState2[0],
        setStringValue = _useState2[1];

    (0, _element.useEffect)(function () {
        if (props.value) {
            setStringValue(props.value.join(','));
        }
    }, [props.value]);

    var description = void 0;

    if (props.description) {
        if (props.unescapedDescription) {
            // If using this option, the HTML has to be escaped before injected into the JS interface.
            description = React.createElement("p", { className: "description", dangerouslySetInnerHTML: { __html: props.description } });
        } else {
            description = React.createElement(
                "p",
                { className: "description" },
                props.description
            );
        }
    }

    var onChange = function onChange(value) {
        if (props.onChange) {
            props.onChange(value);
        }

        if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
            setStringValue(value.join(','));
        } else {
            setStringValue('');
        }
    };

    var value = props.value ? props.value : [];

    return React.createElement(
        _element.Fragment,
        null,
        React.createElement(_components.FormTokenField, {
            label: props.label,
            value: value,
            suggestions: props.options,
            onChange: onChange,
            maxSuggestions: props.maxSuggestions,
            className: "publishpres-future-token-field",
            __experimentalExpandOnFocus: props.expandOnFocus,
            __experimentalAutoSelectFirstMatch: props.autoSelectFirstMatch
        }),
        React.createElement("input", { type: "hidden", name: props.name, value: stringValue }),
        description
    );
};

/***/ }),

/***/ "./assets/jsx/components/TrueFalseControl.jsx":
/*!****************************************************!*\
  !*** ./assets/jsx/components/TrueFalseControl.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var TrueFalseControl = exports.TrueFalseControl = function TrueFalseControl(props) {
    var Fragment = wp.element.Fragment;


    var onChange = function onChange(e) {
        if (props.onChange) {
            props.onChange(e.target.value === props.trueValue && jQuery(e.target).is(':checked'));
            // Check only the true radio... using the field name? or directly the ID
        }
    };

    return React.createElement(
        Fragment,
        null,
        React.createElement('input', {
            type: 'radio',
            name: props.name,
            id: props.name + '-true',
            value: props.trueValue,
            defaultChecked: props.selected,
            onChange: onChange
        }),
        React.createElement(
            'label',
            { htmlFor: props.name + '-true' },
            props.trueLabel
        ),
        '\xA0\xA0',
        React.createElement('input', {
            type: 'radio',
            name: props.name,
            defaultChecked: !props.selected,
            id: props.name + '-false',
            value: props.falseValue,
            onChange: onChange
        }),
        React.createElement(
            'label',
            {
                htmlFor: props.name + '-false' },
            props.falseLabel
        ),
        React.createElement(
            'p',
            { className: 'description' },
            props.description
        )
    );
};

/***/ }),

/***/ "./assets/jsx/components/index.jsx":
/*!*****************************************!*\
  !*** ./assets/jsx/components/index.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _ButtonsPanel = __webpack_require__(/*! ./ButtonsPanel */ "./assets/jsx/components/ButtonsPanel.jsx");

Object.defineProperty(exports, "ButtonsPanel", ({
  enumerable: true,
  get: function get() {
    return _ButtonsPanel.ButtonsPanel;
  }
}));

var _FutureActionPanel = __webpack_require__(/*! ./FutureActionPanel */ "./assets/jsx/components/FutureActionPanel.jsx");

Object.defineProperty(exports, "FutureActionPanel", ({
  enumerable: true,
  get: function get() {
    return _FutureActionPanel.FutureActionPanel;
  }
}));

var _FutureActionPanelBlockEditor = __webpack_require__(/*! ./FutureActionPanelBlockEditor */ "./assets/jsx/components/FutureActionPanelBlockEditor.jsx");

Object.defineProperty(exports, "FutureActionPanelBlockEditor", ({
  enumerable: true,
  get: function get() {
    return _FutureActionPanelBlockEditor.FutureActionPanelBlockEditor;
  }
}));

var _FutureActionPanelClassicEditor = __webpack_require__(/*! ./FutureActionPanelClassicEditor */ "./assets/jsx/components/FutureActionPanelClassicEditor.jsx");

Object.defineProperty(exports, "FutureActionPanelClassicEditor", ({
  enumerable: true,
  get: function get() {
    return _FutureActionPanelClassicEditor.FutureActionPanelClassicEditor;
  }
}));

var _FutureActionPanelQuickEdit = __webpack_require__(/*! ./FutureActionPanelQuickEdit */ "./assets/jsx/components/FutureActionPanelQuickEdit.jsx");

Object.defineProperty(exports, "FutureActionPanelQuickEdit", ({
  enumerable: true,
  get: function get() {
    return _FutureActionPanelQuickEdit.FutureActionPanelQuickEdit;
  }
}));

var _FutureActionPanelBulkEdit = __webpack_require__(/*! ./FutureActionPanelBulkEdit */ "./assets/jsx/components/FutureActionPanelBulkEdit.jsx");

Object.defineProperty(exports, "FutureActionPanelBulkEdit", ({
  enumerable: true,
  get: function get() {
    return _FutureActionPanelBulkEdit.FutureActionPanelBulkEdit;
  }
}));

var _PostTypeSettingsPanel = __webpack_require__(/*! ./PostTypeSettingsPanel */ "./assets/jsx/components/PostTypeSettingsPanel.jsx");

Object.defineProperty(exports, "PostTypeSettingsPanel", ({
  enumerable: true,
  get: function get() {
    return _PostTypeSettingsPanel.PostTypeSettingsPanel;
  }
}));

var _PostTypesSettingsPanels = __webpack_require__(/*! ./PostTypesSettingsPanels */ "./assets/jsx/components/PostTypesSettingsPanels.jsx");

Object.defineProperty(exports, "PostTypesSettingsPanels", ({
  enumerable: true,
  get: function get() {
    return _PostTypesSettingsPanels.PostTypesSettingsPanels;
  }
}));

var _SettingRow = __webpack_require__(/*! ./SettingRow */ "./assets/jsx/components/SettingRow.jsx");

Object.defineProperty(exports, "SettingRow", ({
  enumerable: true,
  get: function get() {
    return _SettingRow.SettingRow;
  }
}));

var _SettingsFieldset = __webpack_require__(/*! ./SettingsFieldset */ "./assets/jsx/components/SettingsFieldset.jsx");

Object.defineProperty(exports, "SettingsFieldset", ({
  enumerable: true,
  get: function get() {
    return _SettingsFieldset.SettingsFieldset;
  }
}));

var _SettingsForm = __webpack_require__(/*! ./SettingsForm */ "./assets/jsx/components/SettingsForm.jsx");

Object.defineProperty(exports, "SettingsForm", ({
  enumerable: true,
  get: function get() {
    return _SettingsForm.SettingsForm;
  }
}));

var _SettingsSection = __webpack_require__(/*! ./SettingsSection */ "./assets/jsx/components/SettingsSection.jsx");

Object.defineProperty(exports, "SettingsSection", ({
  enumerable: true,
  get: function get() {
    return _SettingsSection.SettingsSection;
  }
}));

var _SettingsTable = __webpack_require__(/*! ./SettingsTable */ "./assets/jsx/components/SettingsTable.jsx");

Object.defineProperty(exports, "SettingsTable", ({
  enumerable: true,
  get: function get() {
    return _SettingsTable.SettingsTable;
  }
}));

var _SubmitButton = __webpack_require__(/*! ./SubmitButton */ "./assets/jsx/components/SubmitButton.jsx");

Object.defineProperty(exports, "SubmitButton", ({
  enumerable: true,
  get: function get() {
    return _SubmitButton.SubmitButton;
  }
}));

var _CheckboxControl = __webpack_require__(/*! ./CheckboxControl */ "./assets/jsx/components/CheckboxControl.jsx");

Object.defineProperty(exports, "CheckboxControl", ({
  enumerable: true,
  get: function get() {
    return _CheckboxControl.CheckboxControl;
  }
}));

var _SelectControl = __webpack_require__(/*! ./SelectControl */ "./assets/jsx/components/SelectControl.jsx");

Object.defineProperty(exports, "SelectControl", ({
  enumerable: true,
  get: function get() {
    return _SelectControl.SelectControl;
  }
}));

var _TextControl = __webpack_require__(/*! ./TextControl */ "./assets/jsx/components/TextControl.jsx");

Object.defineProperty(exports, "TextControl", ({
  enumerable: true,
  get: function get() {
    return _TextControl.TextControl;
  }
}));

var _TokensControl = __webpack_require__(/*! ./TokensControl */ "./assets/jsx/components/TokensControl.jsx");

Object.defineProperty(exports, "TokensControl", ({
  enumerable: true,
  get: function get() {
    return _TokensControl.TokensControl;
  }
}));

var _NonceControl = __webpack_require__(/*! ./NonceControl */ "./assets/jsx/components/NonceControl.jsx");

Object.defineProperty(exports, "NonceControl", ({
  enumerable: true,
  get: function get() {
    return _NonceControl.NonceControl;
  }
}));

var _TrueFalseControl = __webpack_require__(/*! ./TrueFalseControl */ "./assets/jsx/components/TrueFalseControl.jsx");

Object.defineProperty(exports, "TrueFalseControl", ({
  enumerable: true,
  get: function get() {
    return _TrueFalseControl.TrueFalseControl;
  }
}));

var _Spinner = __webpack_require__(/*! ./Spinner */ "./assets/jsx/components/Spinner.jsx");

Object.defineProperty(exports, "Spinner", ({
  enumerable: true,
  get: function get() {
    return _Spinner.Spinner;
  }
}));

var _DateOffsetPreview = __webpack_require__(/*! ./DateOffsetPreview */ "./assets/jsx/components/DateOffsetPreview.jsx");

Object.defineProperty(exports, "DateOffsetPreview", ({
  enumerable: true,
  get: function get() {
    return _DateOffsetPreview.DateOffsetPreview;
  }
}));

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

var _utils = __webpack_require__(/*! ./utils */ "./assets/jsx/utils.jsx");

var _data = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createStore = exports.createStore = function createStore(props) {
    if (props.defaultState.terms && typeof props.defaultState.terms === 'string') {
        props.defaultState.terms = props.defaultState.terms.split(',').map(function (term) {
            return parseInt(term);
        });
    }

    var defaultState = {
        action: props.defaultState.action,
        date: props.defaultState.date ? props.defaultState.date : (0, _time.getCurrentTimeAsTimestamp)(),
        enabled: props.defaultState.autoEnable,
        terms: props.defaultState.terms ? props.defaultState.terms : [],
        taxonomy: props.defaultState.taxonomy ? props.defaultState.taxonomy : null,
        newStatus: props.defaultState.newStatus ? props.defaultState.newStatus : 'draft',
        termsListByName: null,
        termsListById: null,
        taxonomyName: null,
        isFetchingTerms: false,
        changeAction: 'no-change',
        calendarIsVisible: true,
        hasValidData: true,
        extraData: props.defaultState.extraData ? props.defaultState.extraData : {}
    };

    var store = (0, _data.createReduxStore)(props.name, {
        reducer: function reducer() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
            var action = arguments[1];

            switch (action.type) {
                case 'SET_ACTION':
                    return _extends({}, state, {
                        action: action.action
                    });
                case 'SET_NEW_STATUS':
                    return _extends({}, state, {
                        newStatus: action.newStatus
                    });
                case 'SET_DATE':
                    // Make sure the date is a number, if it is a string with only numbers
                    if (typeof action.date !== 'number' && (0, _utils.isNumber)(action.date)) {
                        action.date = parseInt(action.date);
                    }

                    // If string, convert to unix time
                    if (typeof action.date === 'string') {
                        action.date = new Date(action.date).getTime();
                    }

                    // Make sure the time is always in seconds
                    action.date = (0, _time.normalizeUnixTimeToSeconds)(action.date);

                    // Convert to formated string format, considering it is in the site's timezone
                    action.date = (0, _time.formatUnixTimeToTimestamp)(action.date);

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
                case 'SET_CHANGE_ACTION':
                    return _extends({}, state, {
                        changeAction: action.changeAction
                    });
                case 'SET_CALENDAR_IS_VISIBLE':
                    return _extends({}, state, {
                        calendarIsVisible: action.calendarIsVisible
                    });
                case 'SET_HAS_VALID_DATA':
                    return _extends({}, state, {
                        hasValidData: action.hasValidData
                    });

                case 'SET_EXTRA_DATA':
                    return _extends({}, state, {
                        extraData: _extends({}, action.extraData)
                    });

                case 'SET_EXTRA_DATA_BY_NAME':
                    var extraData = _extends({}, state.extraData, _defineProperty({}, action.name, action.value));

                    return _extends({}, state, {
                        extraData: _extends({}, extraData)
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
            setNewStatus: function setNewStatus(newStatus) {
                return {
                    type: 'SET_NEW_STATUS',
                    newStatus: newStatus
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
            },
            setChangeAction: function setChangeAction(changeAction) {
                return {
                    type: 'SET_CHANGE_ACTION',
                    changeAction: changeAction
                };
            },
            setCalendarIsVisible: function setCalendarIsVisible(calendarIsVisible) {
                return {
                    type: 'SET_CALENDAR_IS_VISIBLE',
                    calendarIsVisible: calendarIsVisible
                };
            },
            setHasValidData: function setHasValidData(hasValidData) {
                return {
                    type: 'SET_HAS_VALID_DATA',
                    hasValidData: hasValidData
                };
            },
            setExtraData: function setExtraData(extraData) {
                return {
                    type: 'SET_EXTRA_DATA',
                    extraData: extraData
                };
            },
            setExtraDataByName: function setExtraDataByName(name, value) {
                return {
                    type: 'SET_EXTRA_DATA_BY_NAME',
                    name: name,
                    value: value
                };
            }
        },
        selectors: {
            getAction: function getAction(state) {
                return state.action;
            },
            getNewStatus: function getNewStatus(state) {
                return state.newStatus;
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
            },
            getChangeAction: function getChangeAction(state) {
                return state.changeAction;
            },
            getCalendarIsVisible: function getCalendarIsVisible(state) {
                return state.calendarIsVisible;
            },
            getHasValidData: function getHasValidData(state) {
                return state.hasValidData;
            },
            getExtraData: function getExtraData(state) {
                return state.extraData;
            },
            getExtraDataByName: function getExtraDataByName(state, name) {
                return state.extraData[name] || null;
            }
        }
    });

    (0, _data.register)(store);

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
var getCurrentTimeInSeconds = exports.getCurrentTimeInSeconds = function getCurrentTimeInSeconds() {
    return normalizeUnixTimeToSeconds(new Date().getTime());
};

var getCurrentTimeAsTimestamp = exports.getCurrentTimeAsTimestamp = function getCurrentTimeAsTimestamp() {
    return formatUnixTimeToTimestamp(getCurrentTimeInSeconds());
};

var formatUnixTimeToTimestamp = exports.formatUnixTimeToTimestamp = function formatUnixTimeToTimestamp(unixTimestamp) {
    var date = new Date(normalizeUnixTimeToSeconds(unixTimestamp));

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

var formatTimestampToUnixTime = exports.formatTimestampToUnixTime = function formatTimestampToUnixTime(time) {
    var date = new Date(time);

    return normalizeUnixTimeToSeconds(date.getTime());
};

var timeIsInSeconds = exports.timeIsInSeconds = function timeIsInSeconds(time) {
    return parseInt(time).toString().length <= 10;
};

var normalizeUnixTimeToSeconds = exports.normalizeUnixTimeToSeconds = function normalizeUnixTimeToSeconds(time) {
    time = parseInt(time);

    return timeIsInSeconds() ? time : time / 1000;
};

var normalizeUnixTimeToMilliseconds = exports.normalizeUnixTimeToMilliseconds = function normalizeUnixTimeToMilliseconds(time) {
    time = parseInt(time);

    return timeIsInSeconds() ? time * 1000 : time;
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var compact = exports.compact = function compact(array) {
    if (!array) {
        return [];
    }

    if (!Array.isArray(array) && (typeof array === 'undefined' ? 'undefined' : _typeof(array)) === 'object') {
        array = Object.values(array);
    }

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

var isGutenbergEnabled = exports.isGutenbergEnabled = function isGutenbergEnabled() {
    return document.body.classList.contains('block-editor-page');
};

var getElementByName = exports.getElementByName = function getElementByName(name) {
    return document.getElementsByName(name)[0];
};

var getFieldByName = exports.getFieldByName = function getFieldByName(name, postId) {
    return document.querySelector('#the-list tr#post-' + postId + ' .column-expirationdate input#future_action_' + name + '-' + postId);
};

var getFieldValueByName = exports.getFieldValueByName = function getFieldValueByName(name, postId) {
    var field = getFieldByName(name, postId);

    if (!field) {
        return null;
    }

    return field.value;
};

var getFieldValueByNameAsArrayOfInt = exports.getFieldValueByNameAsArrayOfInt = function getFieldValueByNameAsArrayOfInt(name, postId) {
    var field = getFieldByName(name, postId);

    if (!field || !field.value) {
        return [];
    }

    if (typeof field.value === 'number') {
        field.value = field.value.toString();
    }

    return field.value.split(',').map(function (term) {
        return parseInt(term);
    });
};

var getFieldValueByNameAsBool = exports.getFieldValueByNameAsBool = function getFieldValueByNameAsBool(name, postId) {
    var field = getFieldByName(name, postId);

    if (!field) {
        return false;
    }

    return field.value === '1' || field.value === 'true';
};

var getActionSettingsFromColumnData = exports.getActionSettingsFromColumnData = function getActionSettingsFromColumnData(postId) {
    var columnData = document.querySelector('#post-expire-column-' + postId);

    if (!columnData) {
        return {};
    }

    return {
        enabled: columnData.dataset.actionEnabled === '1',
        action: columnData.dataset.actionType,
        date: columnData.dataset.actionDate,
        dateUnix: columnData.dataset.actionDateUnix,
        taxonomy: columnData.dataset.actionTaxonomy,
        terms: columnData.dataset.actionTerms,
        newStatus: columnData.dataset.actionNewStatus
    };
};

/**
 * This function is used to determine if a value is a number, including strings.
 *
 * @param {*} value
 * @returns
 */
var isNumber = exports.isNumber = function isNumber(value) {
    return !isNaN(value);
};

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/dateOffsetPreview.css":
/*!*****************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/dateOffsetPreview.css ***!
  \*****************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.publishpress-future-date-preview .publishpress-future-date-preview-value {
    font-family: monospace;
    background-color: #e7e7e7;
    padding: 2px 4px;
}

.publishpress-future-date-preview.compact .publishpress-future-date-preview-label {
    display: block;
}

.publishpress-future-date-preview.compact {
    margin-bottom: 8px;
}

.publishpress-future-date-preview.compact h4 {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: calc(8px);
    padding: 0px;
    flex-shrink: 0;
    margin-right: 12px;
    max-width: 75%;
    margin-top: 0;
}

.publishpress-future-notice.publishpress-future-notice-error {
    color: #dc3232;
}
`, "",{"version":3,"sources":["webpack://./assets/jsx/components/css/dateOffsetPreview.css"],"names":[],"mappings":"AAAA;IACI,sBAAsB;IACtB,yBAAyB;IACzB,gBAAgB;AACpB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,yBAAyB;IACzB,qBAAqB;IACrB,wBAAwB;IACxB,YAAY;IACZ,cAAc;IACd,kBAAkB;IAClB,cAAc;IACd,aAAa;AACjB;;AAEA;IACI,cAAc;AAClB","sourcesContent":[".publishpress-future-date-preview .publishpress-future-date-preview-value {\n    font-family: monospace;\n    background-color: #e7e7e7;\n    padding: 2px 4px;\n}\n\n.publishpress-future-date-preview.compact .publishpress-future-date-preview-label {\n    display: block;\n}\n\n.publishpress-future-date-preview.compact {\n    margin-bottom: 8px;\n}\n\n.publishpress-future-date-preview.compact h4 {\n    font-size: 11px;\n    font-weight: 500;\n    line-height: 1.4;\n    text-transform: uppercase;\n    display: inline-block;\n    margin-bottom: calc(8px);\n    padding: 0px;\n    flex-shrink: 0;\n    margin-right: 12px;\n    max-width: 75%;\n    margin-top: 0;\n}\n\n.publishpress-future-notice.publishpress-future-notice-error {\n    color: #dc3232;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./assets/jsx/components/css/dateOffsetPreview.css":
/*!*********************************************************!*\
  !*** ./assets/jsx/components/css/dateOffsetPreview.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js!./dateOffsetPreview.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/dateOffsetPreview.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "&config.bulk-edit":
/*!***************************************************!*\
  !*** external "publishpressFutureBulkEditConfig" ***!
  \***************************************************/
/***/ ((module) => {

module.exports = publishpressFutureBulkEditConfig;

/***/ }),

/***/ "&window":
/*!*************************!*\
  !*** external "window" ***!
  \*************************/
/***/ ((module) => {

module.exports = window;

/***/ }),

/***/ "&wp":
/*!*********************!*\
  !*** external "wp" ***!
  \*********************/
/***/ ((module) => {

module.exports = wp;

/***/ }),

/***/ "@wordpress/components":
/*!********************************!*\
  !*** external "wp.components" ***!
  \********************************/
/***/ ((module) => {

module.exports = wp.components;

/***/ }),

/***/ "@wordpress/data":
/*!**************************!*\
  !*** external "wp.data" ***!
  \**************************/
/***/ ((module) => {

module.exports = wp.data;

/***/ }),

/***/ "@wordpress/element":
/*!*****************************!*\
  !*** external "wp.element" ***!
  \*****************************/
/***/ ((module) => {

module.exports = wp.element;

/***/ }),

/***/ "@wordpress/hooks":
/*!***************************!*\
  !*** external "wp.hooks" ***!
  \***************************/
/***/ ((module) => {

module.exports = wp.hooks;

/***/ }),

/***/ "@wordpress/plugins":
/*!*****************************!*\
  !*** external "wp.plugins" ***!
  \*****************************/
/***/ ((module) => {

module.exports = wp.plugins;

/***/ }),

/***/ "@wordpress/url":
/*!*************************!*\
  !*** external "wp.url" ***!
  \*************************/
/***/ ((module) => {

module.exports = wp.url;

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./assets/jsx/bulk-edit.jsx ***!
  \**********************************/


var _components = __webpack_require__(/*! ./components */ "./assets/jsx/components/index.jsx");

var _data = __webpack_require__(/*! ./data */ "./assets/jsx/data.jsx");

var _element = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");

var _data2 = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

var _window = __webpack_require__(/*! &window */ "&window");

var _config = __webpack_require__(/*! &config.bulk-edit */ "&config.bulk-edit");

var storeName = 'publishpress-future/future-action-bulk-edit';
var delayToUnmountAfterSaving = 1000;

// We create a copy of the WP inline set bulk function
var wpInlineSetBulk = _window.inlineEditPost.setBulk;
var wpInlineEditRevert = _window.inlineEditPost.revert;

var getPostId = function getPostId(id) {
    // If id is a string or a number, return it directly
    if (typeof id === 'string' || typeof id === 'number') {
        return id;
    }

    // Otherwise, assume it's an HTML element and extract the post ID
    var trElement = id.closest('tr');
    var trId = trElement.id;
    var postId = trId.split('-')[1];

    return postId;
};

/**
 * We override the function with our own code so we can detect when
 * the inline edit row is displayed to recreate the React component.
 */
_window.inlineEditPost.setBulk = function (id) {
    // Call the original WP edit function.
    wpInlineSetBulk.apply(this, arguments);

    if ((0, _data2.select)(storeName)) {
        (0, _data2.dispatch)(storeName).setAction(_config.postTypeDefaultConfig.expireType);
        (0, _data2.dispatch)(storeName).setDate(_config.postTypeDefaultConfig.defaultDate);
        (0, _data2.dispatch)(storeName).setTaxonomy(_config.postTypeDefaultConfig.taxonomy);
        (0, _data2.dispatch)(storeName).setTerms(_config.postTypeDefaultConfig.terms);
        (0, _data2.dispatch)(storeName).setChangeAction('no-change');
    } else {
        (0, _data.createStore)({
            name: storeName,
            defaultState: {
                action: _config.postTypeDefaultConfig.expireType,
                newStatus: _config.postTypeDefaultConfig.newStatus,
                date: _config.defaultDate,
                taxonomy: _config.postTypeDefaultConfig.taxonomy,
                terms: _config.postTypeDefaultConfig.terms,
                changeAction: 'no-change'
            }
        });
    }

    var container = document.getElementById("publishpress-future-bulk-edit");
    var root = (0, _element.createRoot)(container);

    var saveButton = document.querySelector('#bulk_edit');
    if (saveButton) {
        saveButton.onclick = function () {
            setTimeout(function () {
                root.unmount();
            }, delayToUnmountAfterSaving);
        };
    }

    var component = React.createElement(_components.FutureActionPanelBulkEdit, {
        storeName: storeName,
        postType: _config.postType,
        isNewPost: _config.isNewPost,
        actionsSelectOptions: _config.actionsSelectOptions,
        statusesSelectOptions: _config.statusesSelectOptions,
        is12Hour: _config.is12Hour,
        timeFormat: _config.timeFormat,
        startOfWeek: _config.startOfWeek,
        strings: _config.strings,
        taxonomyName: _config.taxonomyName,
        nonce: _config.nonce
    });

    root.render(component);

    _window.inlineEditPost.revert = function () {
        root.unmount();

        // Call the original WP revert function.
        wpInlineEditRevert.apply(this, arguments);
    };
};
/******/ })()
;
//# sourceMappingURL=bulk-edit.js.map