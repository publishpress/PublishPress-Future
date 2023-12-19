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


var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var _wp2 = __webpack_require__(/*! &wp.components */ "&wp.components");

var CheckboxControl = exports.CheckboxControl = function CheckboxControl(props) {
    var _useState = (0, _wp.useState)(props.checked || false),
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
        _wp.Fragment,
        null,
        React.createElement(_wp2.CheckboxControl, {
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

var _wp = __webpack_require__(/*! &wp.components */ "&wp.components");

var DateTimePicker = exports.DateTimePicker = function DateTimePicker(_ref) {
    var currentDate = _ref.currentDate,
        onChange = _ref.onChange,
        is12Hour = _ref.is12Hour,
        startOfWeek = _ref.startOfWeek;

    if (typeof currentDate === 'number') {
        currentDate = (0, _time.normalizeUnixTimeToMilliseconds)(currentDate);
    }

    return React.createElement(_wp.DateTimePicker, {
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(/*! ../utils */ "./assets/jsx/utils.jsx");

var _ToggleCalendarDatePicker = __webpack_require__(/*! ./ToggleCalendarDatePicker */ "./assets/jsx/components/ToggleCalendarDatePicker.jsx");

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
    useEffect = _wp$element.useEffect;
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
        setCalendarIsVisible = _useDispatch.setCalendarIsVisible;

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
            return ['category', 'category-add', 'category-remove'].indexOf(item.value) === -1;
        });
    }

    var HelpText = replaceCurlyBracketsWithLink(props.strings.timezoneSettingsHelp, '/wp-admin/options-general.php#timezone_string', '_blank');

    return React.createElement(
        'div',
        { className: panelClass },
        props.autoEnableAndHideCheckbox && React.createElement('input', { type: 'hidden', name: 'future_action_enabled', value: 1 }),
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
            String(action).includes('category') && (isFetchingTerms && React.createElement(
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
                    React.createElement('i', { className: 'dashicons dashicons-warning' }),
                    ' ',
                    props.strings.noTaxonomyFound
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
                        label: taxonomyName,
                        value: selectedTerms,
                        suggestions: termsListByNameKeys,
                        onChange: handleTermsChange,
                        maxSuggestions: 10
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
            )
        )
    );
};

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
            newAttribute['date'] = store.getDate();
            newAttribute['terms'] = store.getTerms();
            newAttribute['taxonomy'] = store.getTaxonomy();
        }

        editPostAttribute(newAttribute);
    };

    var data = select('core/editor').getEditedPostAttribute('publishpress_future_action');

    return React.createElement(
        PluginDocumentSettingPanel,
        {
            name: 'publishpress-future-action-panel',
            title: props.strings.panelTitle,
            icon: 'calendar',
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
                enabled: data.enabled,
                calendarIsVisible: true,
                action: data.action,
                date: data.date,
                terms: data.terms,
                taxonomy: data.taxonomy,
                taxonomyName: props.taxonomyName,
                onChangeData: onChangeData,
                is12Hour: props.is12Hour,
                timeFormat: props.timeFormat,
                startOfWeek: props.startOfWeek,
                storeName: props.storeName,
                strings: props.strings })
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


    var onChangeData = function onChangeData(attribute, value) {
        (0, _utils.getElementByName)('future_action_bulk_enabled').value = select(props.storeName).getEnabled() ? 1 : 0;
        (0, _utils.getElementByName)('future_action_bulk_action').value = select(props.storeName).getAction();
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
    var terms = useSelect(function (select) {
        return select(props.storeName).getTerms();
    }, []);
    var taxonomy = useSelect(function (select) {
        return select(props.storeName).getTaxonomy();
    }, []);
    var changeAction = useSelect(function (select) {
        return select(props.storeName).getChangeAction();
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
            enabled: true,
            calendarIsVisible: false,
            action: action,
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

var _wp = __webpack_require__(/*! &wp.data */ "&wp.data");

var FutureActionPanelClassicEditor = exports.FutureActionPanelClassicEditor = function FutureActionPanelClassicEditor(props) {
    var browserTimezoneOffset = new Date().getTimezoneOffset();

    var getElementByName = function getElementByName(name) {
        return document.getElementsByName(name)[0];
    };

    var onChangeData = function onChangeData(attribute, value) {
        var store = (0, _wp.select)(props.storeName);

        getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
        getElementByName('future_action_action').value = store.getAction();
        getElementByName('future_action_date').value = store.getDate();
        getElementByName('future_action_terms').value = store.getTerms().join(',');
        getElementByName('future_action_taxonomy').value = store.getTaxonomy();
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

    return React.createElement(
        "div",
        { className: 'post-expirator-panel' },
        React.createElement(_.FutureActionPanel, {
            context: 'classic-editor',
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            enabled: data.enabled,
            calendarIsVisible: true,
            action: data.action,
            date: data.date,
            terms: data.terms,
            taxonomy: data.taxonomy,
            taxonomyName: props.taxonomyName,
            onChangeData: onChangeData,
            is12Hour: props.is12Hour,
            timeFormat: props.timeFormat,
            startOfWeek: props.startOfWeek,
            storeName: props.storeName,
            strings: props.strings })
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

var _wp = __webpack_require__(/*! &wp.data */ "&wp.data");

var FutureActionPanelQuickEdit = exports.FutureActionPanelQuickEdit = function FutureActionPanelQuickEdit(props) {
    var onChangeData = function onChangeData(attribute, value) {};

    var date = (0, _wp.useSelect)(function (select) {
        return select(props.storeName).getDate();
    }, []);
    var enabled = (0, _wp.useSelect)(function (select) {
        return select(props.storeName).getEnabled();
    }, []);
    var action = (0, _wp.useSelect)(function (select) {
        return select(props.storeName).getAction();
    }, []);
    var terms = (0, _wp.useSelect)(function (select) {
        return select(props.storeName).getTerms();
    }, []);
    var taxonomy = (0, _wp.useSelect)(function (select) {
        return select(props.storeName).getTaxonomy();
    }, []);

    var termsString = terms;
    if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) === 'object') {
        termsString = terms.join(',');
    }

    return React.createElement(
        'div',
        { className: 'post-expirator-panel' },
        React.createElement(_.FutureActionPanel, {
            context: 'quick-edit',
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            enabled: enabled,
            calendarIsVisible: false,
            action: action,
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
        React.createElement('input', { type: 'hidden', name: 'future_action_enabled', value: enabled ? 1 : 0 }),
        React.createElement('input', { type: 'hidden', name: 'future_action_action', value: action ? action : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_date', value: date ? date : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_terms', value: termsString ? termsString : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_taxonomy', value: taxonomy ? taxonomy : '' }),
        React.createElement('input', { type: 'hidden', name: 'future_action_view', value: 'quick-edit' }),
        React.createElement('input', { type: 'hidden', name: '_future_action_nonce', value: props.nonce })
    );
};

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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var NonceControl = exports.NonceControl = function NonceControl(props) {
    if (!props.name) {
        props.name = '_wpnonce';
    }

    if (!props.referrer) {
        props.referrer = true;
    }

    return React.createElement(
        _wp.Fragment,
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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var _wp2 = __webpack_require__(/*! &wp.url */ "&wp.url");

var _wp3 = __webpack_require__(/*! &wp.hooks */ "&wp.hooks");

var _wp4 = __webpack_require__(/*! &wp */ "&wp");

var PostTypeSettingsPanel = exports.PostTypeSettingsPanel = function PostTypeSettingsPanel(props) {
    var _useState = (0, _wp.useState)(props.settings.taxonomy),
        _useState2 = _slicedToArray(_useState, 2),
        postTypeTaxonomy = _useState2[0],
        setPostTypeTaxonomy = _useState2[1];

    var _useState3 = (0, _wp.useState)([]),
        _useState4 = _slicedToArray(_useState3, 2),
        termOptions = _useState4[0],
        setTermOptions = _useState4[1];

    var _useState5 = (0, _wp.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        termsSelectIsLoading = _useState6[0],
        setTermsSelectIsLoading = _useState6[1];

    var _useState7 = (0, _wp.useState)([]),
        _useState8 = _slicedToArray(_useState7, 2),
        selectedTerms = _useState8[0],
        setSelectedTerms = _useState8[1];

    var _useState9 = (0, _wp.useState)(props.settings.howToExpire),
        _useState10 = _slicedToArray(_useState9, 2),
        settingHowToExpire = _useState10[0],
        setSettingHowToExpire = _useState10[1];

    var _useState11 = (0, _wp.useState)(props.settings.active),
        _useState12 = _slicedToArray(_useState11, 2),
        isActive = _useState12[0],
        setIsActive = _useState12[1];

    var _useState13 = (0, _wp.useState)(props.settings.defaultExpireOffset),
        _useState14 = _slicedToArray(_useState13, 2),
        expireOffset = _useState14[0],
        setExpireOffset = _useState14[1];

    var _useState15 = (0, _wp.useState)(props.settings.emailNotification),
        _useState16 = _slicedToArray(_useState15, 2),
        emailNotification = _useState16[0],
        setEmailNotification = _useState16[1];

    var _useState17 = (0, _wp.useState)(props.settings.autoEnabled),
        _useState18 = _slicedToArray(_useState17, 2),
        isAutoEnabled = _useState18[0],
        setIsAutoEnabled = _useState18[1];

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

    (0, _wp.useEffect)(function () {
        if (!postTypeTaxonomy || !props.taxonomiesList) {
            return;
        }

        setTermsSelectIsLoading(true);
        (0, _wp4.apiFetch)({
            path: (0, _wp2.addQueryArgs)('publishpress-future/v1/terms/' + postTypeTaxonomy)
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
    }, [postTypeTaxonomy]);

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
                data: props.postType,
                onChange: onChangeTaxonomy
            })
        ));

        // Remove items from expireTypeList if related to taxonomies and there is no taxonmoy for the post type
        if (props.taxonomiesList.length === 0) {
            props.expireTypeList[props.postType] = props.expireTypeList[props.postType].filter(function (item) {
                return ['category', 'category-add', 'category-remove'].indexOf(item.value) === -1;
            });
        }

        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldHowToExpire, key: 'expirationdate_expiretype-' + props.postType },
            React.createElement(_.SelectControl, {
                name: 'expirationdate_expiretype-' + props.postType,
                className: 'pe-howtoexpire',
                options: props.expireTypeList[props.postType],
                description: props.text.fieldHowToExpireDescription,
                selected: settingHowToExpire,
                onChange: onChangeHowToExpire
            }),
            props.taxonomiesList.length > 0 && ['category', 'category-add', 'category-remove'].indexOf(settingHowToExpire) > -1 && React.createElement(_.TokensControl, {
                label: props.text.fieldTerm,
                name: 'expirationdate_terms-' + props.postType,
                options: termOptionsLabels,
                value: selectedTerms,
                isLoading: termsSelectIsLoading,
                onChange: onChangeTerms,
                description: props.text.fieldTermDescription
            })
        ));

        settingsRows.push(React.createElement(
            _.SettingRow,
            { label: props.text.fieldDefaultDateTimeOffset, key: 'expired-custom-date-' + props.postType },
            React.createElement(_.TextControl, {
                name: 'expired-custom-date-' + props.postType,
                value: expireOffset,
                placeholder: props.settings.globalDefaultExpireOffset,
                description: props.text.fieldDefaultDateTimeOffsetDescription,
                unescapedDescription: true,
                onChange: onChangeExpireOffset
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

    settingsRows = (0, _wp3.applyFilters)('expirationdate_settings_posttype', settingsRows, props, isActive, _wp.useState);

    return React.createElement(
        _.SettingsFieldset,
        { legend: props.legend },
        React.createElement(_.SettingsTable, { bodyChildren: settingsRows })
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

var PostTypesSettingsPanels = exports.PostTypesSettingsPanels = function PostTypesSettingsPanels(props) {
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
                key: postType + "-panel"
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

    return panels;
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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var _wp2 = __webpack_require__(/*! &wp.components */ "&wp.components");

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
var SelectControl = exports.SelectControl = function SelectControl(props) {
    var onChange = function onChange(value) {
        props.onChange(value);
    };

    return React.createElement(
        _wp.Fragment,
        null,
        props.options.length === 0 && React.createElement(
            "div",
            null,
            props.noItemFoundMessage
        ),
        props.options.length > 0 && React.createElement(_wp2.SelectControl, {
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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

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
        null,
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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var SettingsSection = exports.SettingsSection = function SettingsSection(props) {
    return React.createElement(
        _wp.Fragment,
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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var _wp2 = __webpack_require__(/*! &wp.components */ "&wp.components");

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
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

    return React.createElement(
        _wp.Fragment,
        null,
        React.createElement(_wp2.TextControl, {
            type: "text",
            label: props.label,
            name: props.name,
            id: props.name,
            className: props.className,
            value: props.value,
            placeholder: props.placeholder,
            onChange: onChange
        }),
        description
    );
};

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

var _wp = __webpack_require__(/*! &wp.components */ "&wp.components");

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

    return React.createElement(_wp.Button, {
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

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var ToggleCalendarDatePicker = exports.ToggleCalendarDatePicker = function ToggleCalendarDatePicker(_ref) {
    var isExpanded = _ref.isExpanded,
        strings = _ref.strings,
        onToggleCalendar = _ref.onToggleCalendar,
        currentDate = _ref.currentDate,
        onChangeDate = _ref.onChangeDate,
        is12Hour = _ref.is12Hour,
        startOfWeek = _ref.startOfWeek;

    (0, _wp.useEffect)(function () {
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
        _wp.Fragment,
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


var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var _wp2 = __webpack_require__(/*! &wp.components */ "&wp.components");

var TokensControl = exports.TokensControl = function TokensControl(props) {
    var _useState = (0, _wp.useState)(''),
        _useState2 = _slicedToArray(_useState, 2),
        stringValue = _useState2[0],
        setStringValue = _useState2[1];

    (0, _wp.useEffect)(function () {
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
        _wp.Fragment,
        null,
        React.createElement(_wp2.FormTokenField, {
            label: props.label,
            value: value,
            suggestions: props.options,
            onChange: onChange,
            maxSuggestions: 10,
            className: "publishpres-future-token-field"
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

    return {
        enabled: columnData.dataset.actionEnabled === '1',
        action: columnData.dataset.actionType,
        date: columnData.dataset.actionDate,
        dateUnix: columnData.dataset.actionDateUnix,
        taxonomy: columnData.dataset.actionTaxonomy,
        terms: columnData.dataset.actionTerms
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

/***/ "&ReactDOM":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

/***/ }),

/***/ "&config/settings-post-types":
/*!***************************************************!*\
  !*** external "publishpressFutureSettingsConfig" ***!
  \***************************************************/
/***/ ((module) => {

module.exports = publishpressFutureSettingsConfig;

/***/ }),

/***/ "&wp":
/*!*********************!*\
  !*** external "wp" ***!
  \*********************/
/***/ ((module) => {

module.exports = wp;

/***/ }),

/***/ "&wp.components":
/*!********************************!*\
  !*** external "wp.components" ***!
  \********************************/
/***/ ((module) => {

module.exports = wp.components;

/***/ }),

/***/ "&wp.data":
/*!**************************!*\
  !*** external "wp.data" ***!
  \**************************/
/***/ ((module) => {

module.exports = wp.data;

/***/ }),

/***/ "&wp.element":
/*!*****************************!*\
  !*** external "wp.element" ***!
  \*****************************/
/***/ ((module) => {

module.exports = wp.element;

/***/ }),

/***/ "&wp.hooks":
/*!***************************!*\
  !*** external "wp.hooks" ***!
  \***************************/
/***/ ((module) => {

module.exports = wp.hooks;

/***/ }),

/***/ "&wp.url":
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
/*!********************************************!*\
  !*** ./assets/jsx/settings-post-types.jsx ***!
  \********************************************/


var _components = __webpack_require__(/*! ./components */ "./assets/jsx/components/index.jsx");

var _wp = __webpack_require__(/*! &wp.element */ "&wp.element");

var _settingsPostTypes = __webpack_require__(/*! &config/settings-post-types */ "&config/settings-post-types");

var _ReactDOM = __webpack_require__(/*! &ReactDOM */ "&ReactDOM");

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingsFormPanel = function SettingsFormPanel(props) {
    return React.createElement(
        _wp.StrictMode,
        null,
        React.createElement(
            _components.SettingsForm,
            null,
            React.createElement(_components.NonceControl, {
                name: "_postExpiratorMenuDefaults_nonce",
                nonce: _settingsPostTypes.nonce,
                referrer: _settingsPostTypes.referrer
            }),
            React.createElement(
                _components.SettingsSection,
                {
                    title: _settingsPostTypes.text.settingsSectionTitle,
                    description: _settingsPostTypes.text.settingsSectionDescription },
                React.createElement(_components.PostTypesSettingsPanels, {
                    settings: _settingsPostTypes.settings,
                    text: _settingsPostTypes.text,
                    expireTypeList: _settingsPostTypes.expireTypeList,
                    taxonomiesList: _settingsPostTypes.taxonomiesList
                })
            ),
            React.createElement(
                _components.ButtonsPanel,
                null,
                React.createElement(_components.SubmitButton, {
                    name: "expirationdateSaveDefaults",
                    text: _settingsPostTypes.text.saveChanges
                })
            )
        )
    );
};

var container = document.getElementById("publishpress-future-settings-post-types");
var component = React.createElement(SettingsFormPanel, null);
if (_wp.createRoot) {
    (0, _wp.createRoot)(container).render(component);
} else {
    (0, _ReactDOM.render)(component, container);
}
})();

/******/ })()
;
//# sourceMappingURL=settings-post-types.js.map