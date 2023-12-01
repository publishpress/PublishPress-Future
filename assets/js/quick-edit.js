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
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var CheckboxControl = exports.CheckboxControl = function CheckboxControl(props) {
    var _wp$element = wp.element,
        Fragment = _wp$element.Fragment,
        useState = _wp$element.useState;

    var WPCheckboxControl = wp.components.CheckboxControl;

    var _useState = useState(props.checked || false),
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
        Fragment,
        null,
        React.createElement(WPCheckboxControl, {
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

var _utils = __webpack_require__(/*! ../utils */ "./assets/jsx/utils.jsx");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _wp$components = wp.components,
    PanelRow = _wp$components.PanelRow,
    DateTimePicker = _wp$components.DateTimePicker,
    CheckboxControl = _wp$components.CheckboxControl,
    SelectControl = _wp$components.SelectControl,
    FormTokenField = _wp$components.FormTokenField,
    Spinner = _wp$components.Spinner;
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

    var _useDispatch = useDispatch(props.storeName),
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
        if (props.autoEnableAndHideCheckbox) {
            setEnabled(true);
        } else {
            setEnabled(props.enabled);
        }

        setAction(props.action);
        setDate(props.date);
        setTerms(props.terms);
        setTaxonomy(props.taxonomy);

        // We need to get the value directly from the props because the value from the store is not updated yet
        if (props.enabled) {
            if (props.isCleanNewPost) {
                // Force populate the default values
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

    return React.createElement(
        Fragment,
        null,
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
                { className: 'future-action-date-panel' },
                React.createElement(DateTimePicker, {
                    currentDate: date,
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
                props.strings.loading + ' (' + taxonomy + ')',
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
                suggestions: termsListByNameKeys,
                onChange: handleTermsChange,
                maxSuggestions: 10
            }))
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
        React.createElement(_.FutureActionPanel, {
            postType: props.postType,
            isCleanNewPost: props.isCleanNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            enabled: data.enabled,
            action: data.action,
            date: data.date,
            terms: data.terms,
            taxonomy: data.taxonomy,
            onChangeData: onChangeData,
            is12hours: props.is12hours,
            startOfWeek: props.startOfWeek,
            storeName: props.storeName,
            strings: props.strings })
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
            autoEnableAndHideCheckbox: true,
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            enabled: true,
            action: action,
            date: date,
            terms: terms,
            taxonomy: taxonomy,
            onChangeData: onChangeData,
            is12hours: props.is12hours,
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

var FutureActionPanelClassicEditor = exports.FutureActionPanelClassicEditor = function FutureActionPanelClassicEditor(props) {
    var select = wp.data.select;

    var browserTimezoneOffset = new Date().getTimezoneOffset();

    var getElementByName = function getElementByName(name) {
        return document.getElementsByName(name)[0];
    };

    var onChangeData = function onChangeData(attribute, value) {
        var store = select(props.storeName);

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
        'div',
        { className: 'post-expirator-panel' },
        React.createElement(_.FutureActionPanel, {
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            enabled: data.enabled,
            action: data.action,
            date: data.date,
            terms: data.terms,
            taxonomy: data.taxonomy,
            onChangeData: onChangeData,
            is12hours: props.is12hours,
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

var FutureActionPanelQuickEdit = exports.FutureActionPanelQuickEdit = function FutureActionPanelQuickEdit(props) {
    var useSelect = wp.data.useSelect;


    var onChangeData = function onChangeData(attribute, value) {};

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

    var termsString = terms;
    if ((typeof terms === 'undefined' ? 'undefined' : _typeof(terms)) === 'object') {
        termsString = terms.join(',');
    }

    return React.createElement(
        'div',
        { className: 'post-expirator-panel' },
        React.createElement(_.FutureActionPanel, {
            postType: props.postType,
            isCleanNewPost: props.isNewPost,
            actionsSelectOptions: props.actionsSelectOptions,
            enabled: enabled,
            action: action,
            date: date,
            terms: terms,
            taxonomy: taxonomy,
            onChangeData: onChangeData,
            is12hours: props.is12hours,
            startOfWeek: props.startOfWeek,
            storeName: props.storeName,
            strings: props.strings }),
        React.createElement('input', { type: 'hidden', name: 'future_action_enabled', value: enabled ? 1 : 0 }),
        React.createElement('input', { type: 'hidden', name: 'future_action_action', value: action }),
        React.createElement('input', { type: 'hidden', name: 'future_action_date', value: date }),
        React.createElement('input', { type: 'hidden', name: 'future_action_terms', value: termsString }),
        React.createElement('input', { type: 'hidden', name: 'future_action_taxonomy', value: taxonomy }),
        React.createElement('input', { type: 'hidden', name: 'future_action_view', value: 'quick-edit' }),
        React.createElement('input', { type: 'hidden', name: '_future_action_nonce', value: props.nonce })
    );
};

/***/ }),

/***/ "./assets/jsx/components/NonceControl.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/NonceControl.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
var NonceControl = exports.NonceControl = function NonceControl(props) {
    var Fragment = wp.element.Fragment;


    if (!props.name) {
        props.name = '_wpnonce';
    }

    if (!props.referrer) {
        props.referrer = true;
    }

    return React.createElement(
        Fragment,
        null,
        React.createElement("input", { type: "hidden", name: props.name, id: props.name, value: props.nonce }),
        props.referrer && React.createElement("input", { type: "hidden", name: "_wp_http_referer", value: props.referrer })
    );
};

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

var PostTypeSettingsPanel = exports.PostTypeSettingsPanel = function PostTypeSettingsPanel(props) {
    var _wp$element = wp.element,
        useState = _wp$element.useState,
        useEffect = _wp$element.useEffect;
    var addQueryArgs = wp.url.addQueryArgs;
    var applyFilters = wp.hooks.applyFilters;
    var _wp = wp,
        apiFetch = _wp.apiFetch;

    var _useState = useState(props.settings.taxonomy),
        _useState2 = _slicedToArray(_useState, 2),
        postTypeTaxonomy = _useState2[0],
        setPostTypeTaxonomy = _useState2[1];

    var _useState3 = useState([]),
        _useState4 = _slicedToArray(_useState3, 2),
        termOptions = _useState4[0],
        setTermOptions = _useState4[1];

    var _useState5 = useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        termsSelectIsLoading = _useState6[0],
        setTermsSelectIsLoading = _useState6[1];

    var _useState7 = useState([]),
        _useState8 = _slicedToArray(_useState7, 2),
        selectedTerms = _useState8[0],
        setSelectedTerms = _useState8[1];

    var _useState9 = useState(props.settings.howToExpire),
        _useState10 = _slicedToArray(_useState9, 2),
        settingHowToExpire = _useState10[0],
        setSettingHowToExpire = _useState10[1];

    var _useState11 = useState(props.settings.active),
        _useState12 = _slicedToArray(_useState11, 2),
        isActive = _useState12[0],
        setIsActive = _useState12[1];

    var _useState13 = useState(props.settings.defaultExpireOffset),
        _useState14 = _slicedToArray(_useState13, 2),
        expireOffset = _useState14[0],
        setExpireOffset = _useState14[1];

    var _useState15 = useState(props.settings.emailNotification),
        _useState16 = _slicedToArray(_useState15, 2),
        emailNotification = _useState16[0],
        setEmailNotification = _useState16[1];

    var _useState17 = useState(props.settings.autoEnabled),
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

    useEffect(function () {
        var updateTermsOptionsState = function updateTermsOptionsState(list) {
            var options = [];

            var settingsTermsOptions = null;
            var option = void 0;
            list.forEach(function (term) {
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

        if (!postTypeTaxonomy && props.postType === 'post' || postTypeTaxonomy === 'category') {
            setTermsSelectIsLoading(true);
            apiFetch({
                path: addQueryArgs('wp/v2/categories', { per_page: -1 })
            }).then(updateTermsOptionsState);
        } else {
            if (!postTypeTaxonomy || !props.taxonomiesList) {
                return;
            }

            setTermsSelectIsLoading(true);
            apiFetch({
                path: addQueryArgs('wp/v2/taxonomies/' + postTypeTaxonomy)
            }).then(function (taxAttributes) {
                // fetch all terms
                apiFetch({
                    path: addQueryArgs('wp/v2/' + taxAttributes.rest_base)
                }).then(updateTermsOptionsState);
            }).catch(function (error) {
                console.debug('Taxonomy terms error', error);
                setTermsSelectIsLoading(false);
            });
        }
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

    settingsRows = applyFilters('expirationdate_settings_posttype', settingsRows, props, isActive, useState);

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
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SelectControl = exports.SelectControl = function SelectControl(props) {
    var Fragment = wp.element.Fragment;
    var SelectControl = wp.components.SelectControl;


    var onChange = function onChange(value) {
        props.onChange(value);
    };

    return React.createElement(
        Fragment,
        null,
        props.options.length === 0 && React.createElement(
            "div",
            null,
            props.noItemFoundMessage
        ),
        props.options.length > 0 && React.createElement(SelectControl, {
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
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingRow = exports.SettingRow = function SettingRow(props) {
    var Fragment = wp.element.Fragment;


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
};

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
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingsSection = exports.SettingsSection = function SettingsSection(props) {
    var Fragment = wp.element.Fragment;

    return React.createElement(
        Fragment,
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
};

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
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var TextControl = exports.TextControl = function TextControl(props) {
    var Fragment = wp.element.Fragment;

    var WPTextControl = wp.components.TextControl;

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
        Fragment,
        null,
        React.createElement(WPTextControl, {
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

/***/ "./assets/jsx/components/TokensControl.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/TokensControl.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var TokensControl = exports.TokensControl = function TokensControl(props) {
    var _wp$element = wp.element,
        Fragment = _wp$element.Fragment,
        useState = _wp$element.useState,
        useEffect = _wp$element.useEffect;
    var FormTokenField = wp.components.FormTokenField;

    var _useState = useState(''),
        _useState2 = _slicedToArray(_useState, 2),
        stringValue = _useState2[0],
        setStringValue = _useState2[1];

    useEffect(function () {
        if (props.value) {
            setStringValue(props.value.join(','));
        }
    }, [props.value]);

    var description = void 0;

    if (props.description) {
        if (props.unescapedDescription) {
            // If using this option, the HTML has to be escaped before injected into the JS interface.
            description = React.createElement('p', { className: 'description', dangerouslySetInnerHTML: { __html: props.description } });
        } else {
            description = React.createElement(
                'p',
                { className: 'description' },
                props.description
            );
        }
    }

    var onChange = function onChange(value) {
        if (props.onChange) {
            props.onChange(value);
        }

        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            setStringValue(value.join(','));
        } else {
            setStringValue('');
        }
    };

    var value = props.value ? props.value : [];

    return React.createElement(
        Fragment,
        null,
        React.createElement(FormTokenField, {
            label: props.label,
            value: value,
            suggestions: props.options,
            onChange: onChange,
            maxSuggestions: 10,
            className: 'publishpres-future-token-field'
        }),
        React.createElement('input', { type: 'hidden', name: props.name, value: stringValue }),
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
        termsListByName: null,
        termsListById: null,
        taxonomyName: null,
        isFetchingTerms: false,
        changeAction: 'no-change'
    };

    var store = createReduxStore(props.name, {
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
                case 'SET_CHANGE_ACTION':
                    return _extends({}, state, {
                        changeAction: action.changeAction
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
            },
            setChangeAction: function setChangeAction(changeAction) {
                return {
                    type: 'SET_CHANGE_ACTION',
                    changeAction: changeAction
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
            },
            getChangeAction: function getChangeAction(state) {
                return state.changeAction;
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
var getCurrentTimeInSeconds = exports.getCurrentTimeInSeconds = function getCurrentTimeInSeconds() {
    return normalizeUnixTimeToSeconds(new Date().getTime());
};

var getCurrentTimeAsTimestamp = exports.getCurrentTimeAsTimestamp = function getCurrentTimeAsTimestamp() {
    return formatUnixTimeToTimestamp(getCurrentTimeInSeconds());
};

var formatUnixTimeToTimestamp = exports.formatUnixTimeToTimestamp = function formatUnixTimeToTimestamp(unixTimestamp) {
    var date = new Date(normalizeUnixTimeToMilliseconds(unixTimestamp));

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
    return parseInt(time).toString().length === 10;
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
/*!***********************************!*\
  !*** ./assets/jsx/quick-edit.jsx ***!
  \***********************************/


var _components = __webpack_require__(/*! ./components */ "./assets/jsx/components/index.jsx");

var _data = __webpack_require__(/*! ./data */ "./assets/jsx/data.jsx");

var _utils = __webpack_require__(/*! ./utils */ "./assets/jsx/utils.jsx");

(function (wp, config, inlineEditPost) {
    var storeName = 'publishpress-future/future-action-quick-edit';
    var delayToUnmountAfterSaving = 1000;

    // We create a copy of the WP inline edit post function
    var wpInlineEdit = inlineEditPost.edit;
    var wpInlineEditRevert = inlineEditPost.revert;

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
    inlineEditPost.edit = function (id) {
        var createRoot = wp.element.createRoot;
        var _wp$data = wp.data,
            select = _wp$data.select,
            dispatch = _wp$data.dispatch;

        // Call the original WP edit function.

        wpInlineEdit.apply(this, arguments);

        var postId = getPostId(id);
        var enabled = (0, _utils.getFieldValueByNameAsBool)('enabled', postId);
        var action = (0, _utils.getFieldValueByName)('action', postId);
        var date = (0, _utils.getFieldValueByName)('date', postId);
        var terms = (0, _utils.getFieldValueByName)('terms', postId);
        var taxonomy = (0, _utils.getFieldValueByName)('taxonomy', postId);

        var termsList = terms.split(',');

        // if store exists, update the state. Otherwise, create it.
        if (select(storeName)) {
            dispatch(storeName).setEnabled(enabled);
            dispatch(storeName).setAction(action);
            dispatch(storeName).setDate(date);
            dispatch(storeName).setTaxonomy(taxonomy);
            dispatch(storeName).setTerms(termsList);
        } else {
            (0, _data.createStore)({
                name: storeName,
                defaultState: {
                    autoEnable: enabled,
                    action: action,
                    date: date,
                    taxonomy: taxonomy,
                    terms: termsList
                }
            });
        }

        var saveButton = document.querySelector('.inline-edit-save .save');
        if (saveButton) {
            saveButton.onclick = function () {
                setTimeout(function () {
                    root.unmount();
                }, delayToUnmountAfterSaving);
            };
        }

        var container = document.getElementById("publishpress-future-quick-edit");
        var root = createRoot(container);

        root.render(React.createElement(_components.FutureActionPanelQuickEdit, {
            storeName: storeName,
            postType: config.postType,
            isNewPost: config.isNewPost,
            actionsSelectOptions: config.actionsSelectOptions,
            is12hours: config.is12hours,
            startOfWeek: config.startOfWeek,
            strings: config.strings,
            nonce: config.nonce
        }));

        inlineEditPost.revert = function () {
            root.unmount();

            // Call the original WP revert function.
            wpInlineEditRevert.apply(this, arguments);
        };
    };
})(window.wp, window.publishpressFutureQuickEdit, inlineEditPost);
})();

/******/ })()
;
//# sourceMappingURL=quick-edit.js.map