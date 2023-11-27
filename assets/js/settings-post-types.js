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

var ButtonsPanel = function ButtonsPanel(props) {
    return React.createElement(
        "div",
        null,
        props.children
    );
};

exports["default"] = ButtonsPanel;

/***/ }),

/***/ "./assets/jsx/components/PostTypeSettingsPanel.jsx":
/*!*********************************************************!*\
  !*** ./assets/jsx/components/PostTypeSettingsPanel.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _TrueFalseField = __webpack_require__(/*! ./fields/TrueFalseField */ "./assets/jsx/components/fields/TrueFalseField.jsx");

var _TrueFalseField2 = _interopRequireDefault(_TrueFalseField);

var _SettingRow = __webpack_require__(/*! ./SettingRow */ "./assets/jsx/components/SettingRow.jsx");

var _SettingRow2 = _interopRequireDefault(_SettingRow);

var _SettingsFieldset = __webpack_require__(/*! ./SettingsFieldset */ "./assets/jsx/components/SettingsFieldset.jsx");

var _SettingsFieldset2 = _interopRequireDefault(_SettingsFieldset);

var _SettingsTable = __webpack_require__(/*! ./SettingsTable */ "./assets/jsx/components/SettingsTable.jsx");

var _SettingsTable2 = _interopRequireDefault(_SettingsTable);

var _SelectField = __webpack_require__(/*! ./fields/SelectField */ "./assets/jsx/components/fields/SelectField.jsx");

var _SelectField2 = _interopRequireDefault(_SelectField);

var _TextField = __webpack_require__(/*! ./fields/TextField */ "./assets/jsx/components/fields/TextField.jsx");

var _TextField2 = _interopRequireDefault(_TextField);

var _TokensField = __webpack_require__(/*! ./fields/TokensField */ "./assets/jsx/components/fields/TokensField.jsx");

var _TokensField2 = _interopRequireDefault(_TokensField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PostTypeSettingsPanel = function PostTypeSettingsPanel(props) {
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
        settingActive = _useState12[0],
        setSettingActive = _useState12[1];

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
        setSettingActive(value);
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

        console.log('options', termOptions);

        if (!postTypeTaxonomy && props.postType === 'post' || postTypeTaxonomy === 'category') {
            setTermsSelectIsLoading(true);
            apiFetch({
                path: addQueryArgs("wp/v2/categories", { per_page: -1 })
            }).then(updateTermsOptionsState);
        } else {
            if (!postTypeTaxonomy || !props.taxonomiesList) {
                return;
            }

            setTermsSelectIsLoading(true);
            apiFetch({
                path: addQueryArgs("wp/v2/taxonomies/" + postTypeTaxonomy)
            }).then(function (taxAttributes) {
                // fetch all terms
                apiFetch({
                    path: addQueryArgs("wp/v2/" + taxAttributes.rest_base)
                }).then(updateTermsOptionsState);
            }).catch(function (error) {
                console.log('Taxonomy terms error', error);
                setTermsSelectIsLoading(false);
            });
        }
    }, [postTypeTaxonomy]);

    var termOptionsLabels = termOptions.map(function (term) {
        return term.label;
    });
    console.log('termOptionsLabels', termOptionsLabels);
    console.log('selectedTerms', selectedTerms);

    var settingsRows = [React.createElement(
        _SettingRow2.default,
        { label: props.text.fieldActive, key: 'expirationdate_activemeta-' + props.postType },
        React.createElement(_TrueFalseField2.default, {
            name: 'expirationdate_activemeta-' + props.postType,
            trueLabel: props.text.fieldActiveTrue,
            trueValue: 'active',
            falseLabel: props.text.fieldActiveFalse,
            falseValue: 'inactive',
            description: props.text.fieldActiveDescription,
            selected: props.settings.active,
            onChange: onChangeActive
        })
    )];

    if (settingActive) {
        settingsRows.push(React.createElement(
            _SettingRow2.default,
            { label: props.text.fieldAutoEnable, key: 'expirationdate_autoenable-' + props.postType },
            React.createElement(_TrueFalseField2.default, {
                name: 'expirationdate_autoenable-' + props.postType,
                trueLabel: props.text.fieldAutoEnableTrue,
                trueValue: '1',
                falseLabel: props.text.fieldAutoEnableFalse,
                falseValue: '0',
                description: props.text.fieldAutoEnableDescription,
                selected: props.settings.autoEnabled
            })
        ));

        settingsRows.push(React.createElement(
            _SettingRow2.default,
            { label: props.text.fieldTaxonomy, key: 'expirationdate_taxonomy-' + props.postType },
            React.createElement(_SelectField2.default, {
                name: 'expirationdate_taxonomy-' + props.postType,
                options: props.taxonomiesList,
                selected: postTypeTaxonomy,
                noItemFoundMessage: props.text.noItemsfound,
                data: props.postType,
                onChange: onChangeTaxonomy
            })
        ));

        settingsRows.push(React.createElement(
            _SettingRow2.default,
            { label: props.text.fieldHowToExpire, key: 'expirationdate_expiretype-' + props.postType },
            React.createElement(_SelectField2.default, {
                name: 'expirationdate_expiretype-' + props.postType,
                className: 'pe-howtoexpire',
                options: props.expireTypeList[props.postType],
                description: props.text.fieldHowToExpireDescription,
                selected: props.settings.howToExpire,
                onChange: onChangeHowToExpire
            }),
            props.taxonomiesList.length > 0 && ['category', 'category-add', 'category-remove'].indexOf(settingHowToExpire) > -1 && React.createElement(_TokensField2.default, {
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
            _SettingRow2.default,
            { label: props.text.fieldDefaultDateTimeOffset, key: 'expired-custom-date-' + props.postType },
            React.createElement(_TextField2.default, {
                name: 'expired-custom-date-' + props.postType,
                value: props.settings.defaultExpireOffset,
                placeholder: props.settings.globalDefaultExpireOffset,
                description: props.text.fieldDefaultDateTimeOffsetDescription,
                unescapedDescription: true
            })
        ));

        settingsRows.push(React.createElement(
            _SettingRow2.default,
            { label: props.text.fieldWhoToNotify, key: 'expirationdate_emailnotification-' + props.postType },
            React.createElement(_TextField2.default, {
                name: 'expirationdate_emailnotification-' + props.postType,
                className: "large-text",
                value: props.settings.emailNotification,
                description: props.text.fieldWhoToNotifyDescription
            })
        ));
    }

    settingsRows = applyFilters('expirationdate_settings_posttype', settingsRows, props, settingActive, useState);

    return React.createElement(
        _SettingsFieldset2.default,
        { legend: props.legend },
        React.createElement(_SettingsTable2.default, { bodyChildren: settingsRows })
    );
};

exports["default"] = PostTypeSettingsPanel;

/***/ }),

/***/ "./assets/jsx/components/PostTypesSettingsPanels.jsx":
/*!***********************************************************!*\
  !*** ./assets/jsx/components/PostTypesSettingsPanels.jsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _PostTypeSettingsPanel = __webpack_require__(/*! ./PostTypeSettingsPanel */ "./assets/jsx/components/PostTypeSettingsPanel.jsx");

var _PostTypeSettingsPanel2 = _interopRequireDefault(_PostTypeSettingsPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PostTypesSettingsPanels = function PostTypesSettingsPanels(props) {
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

            panels.push(React.createElement(_PostTypeSettingsPanel2.default, {
                legend: postTypeSettings.label,
                text: props.text,
                postType: postType,
                settings: postTypeSettings,
                expireTypeList: props.expireTypeList,
                taxonomiesList: props.taxonomiesList[postType],
                key: postType
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

exports["default"] = PostTypesSettingsPanels;

/***/ }),

/***/ "./assets/jsx/components/SettingRow.jsx":
/*!**********************************************!*\
  !*** ./assets/jsx/components/SettingRow.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _TrueFalseField = __webpack_require__(/*! ./fields/TrueFalseField */ "./assets/jsx/components/fields/TrueFalseField.jsx");

var _TrueFalseField2 = _interopRequireDefault(_TrueFalseField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingRow = function SettingRow(props) {
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
}; /*
    * Copyright (c) 2023. PublishPress, All rights reserved.
    */

exports["default"] = SettingRow;

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

var SettingsFieldset = function SettingsFieldset(props) {
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

exports["default"] = SettingsFieldset;

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

var SettingsForm = function SettingsForm(props) {
    return React.createElement(
        "form",
        { method: "post" },
        props.children
    );
};

exports["default"] = SettingsForm;

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

var SettingsSection = function SettingsSection(props) {
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

exports["default"] = SettingsSection;

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

var SettingsTable = function SettingsTable(props) {
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

exports["default"] = SettingsTable;

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

var SubmitButton = function SubmitButton(props) {
    return React.createElement("input", {
        type: "submit",
        name: props.name,
        value: props.text,
        className: "button-primary"
    });
};

exports["default"] = SubmitButton;

/***/ }),

/***/ "./assets/jsx/components/fields/NonceField.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/fields/NonceField.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
var NonceField = function NonceField(props) {
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

exports["default"] = NonceField;

/***/ }),

/***/ "./assets/jsx/components/fields/SelectField.jsx":
/*!******************************************************!*\
  !*** ./assets/jsx/components/fields/SelectField.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SelectField = function SelectField(props) {
    var Fragment = wp.element.Fragment;


    var optionsList = [];

    if (_typeof(props.options) === 'object' && props.options.forEach) {
        props.options.forEach(function (el) {
            optionsList.push(React.createElement(
                'option',
                { value: el.value, key: el.value },
                el.label
            ));
        });
    }

    if (optionsList.length === 0) {
        return React.createElement(
            'p',
            null,
            props.noItemFoundMessage ? props.noItemFoundMessage : 'No items found'
        );
    }

    var onChange = function onChange(e) {
        if (!props.onChange) {
            return;
        }

        props.onChange(jQuery(e.target).val());
    };

    return React.createElement(
        Fragment,
        null,
        React.createElement(
            'select',
            {
                name: props.name,
                id: props.name,
                className: props.className,
                defaultValue: props.selected,
                onChange: onChange,
                'data-data': props.data
            },
            optionsList
        ),
        props.children,
        React.createElement(
            'p',
            { className: 'description' },
            props.description
        )
    );
};

exports["default"] = SelectField;

/***/ }),

/***/ "./assets/jsx/components/fields/TextField.jsx":
/*!****************************************************!*\
  !*** ./assets/jsx/components/fields/TextField.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var TextField = function TextField(props) {
    var _wp$element = wp.element,
        Fragment = _wp$element.Fragment,
        useState = _wp$element.useState,
        useEffect = _wp$element.useEffect;


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

    var _useState = useState(props.value),
        _useState2 = _slicedToArray(_useState, 2),
        theValue = _useState2[0],
        setTheValue = _useState2[1];

    var onChange = function onChange(e) {
        setTheValue(jQuery(e.target).val());

        if (props.onChange) {
            props.onChange();
        }
    };

    useEffect(function () {
        setTheValue(props.value);
    }, [props.value]);

    return React.createElement(
        Fragment,
        null,
        React.createElement("input", {
            type: "text",
            name: props.name,
            id: props.name,
            className: props.className,
            value: theValue,
            placeholder: props.placeholder,
            onChange: onChange
        }),
        description
    );
};

exports["default"] = TextField;

/***/ }),

/***/ "./assets/jsx/components/fields/TokensField.jsx":
/*!******************************************************!*\
  !*** ./assets/jsx/components/fields/TokensField.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var TokensField = function TokensField(props) {
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

exports["default"] = TokensField;

/***/ }),

/***/ "./assets/jsx/components/fields/TrueFalseField.jsx":
/*!*********************************************************!*\
  !*** ./assets/jsx/components/fields/TrueFalseField.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var TrueFalseField = function TrueFalseField(props) {
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

exports["default"] = TrueFalseField;

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


var _SettingsSection = __webpack_require__(/*! ./components/SettingsSection */ "./assets/jsx/components/SettingsSection.jsx");

var _SettingsSection2 = _interopRequireDefault(_SettingsSection);

var _SettingsForm = __webpack_require__(/*! ./components/SettingsForm */ "./assets/jsx/components/SettingsForm.jsx");

var _SettingsForm2 = _interopRequireDefault(_SettingsForm);

var _PostTypesSettingsPanels = __webpack_require__(/*! ./components/PostTypesSettingsPanels */ "./assets/jsx/components/PostTypesSettingsPanels.jsx");

var _PostTypesSettingsPanels2 = _interopRequireDefault(_PostTypesSettingsPanels);

var _SubmitButton = __webpack_require__(/*! ./components/SubmitButton */ "./assets/jsx/components/SubmitButton.jsx");

var _SubmitButton2 = _interopRequireDefault(_SubmitButton);

var _ButtonsPanel = __webpack_require__(/*! ./components/ButtonsPanel */ "./assets/jsx/components/ButtonsPanel.jsx");

var _ButtonsPanel2 = _interopRequireDefault(_ButtonsPanel);

var _NonceField = __webpack_require__(/*! ./components/fields/NonceField */ "./assets/jsx/components/fields/NonceField.jsx");

var _NonceField2 = _interopRequireDefault(_NonceField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
(function (wp, config) {
    var _wp$element = wp.element,
        StrictMode = _wp$element.StrictMode,
        createRoot = _wp$element.createRoot;


    var SettingsFormPanel = function SettingsFormPanel(props) {
        return React.createElement(
            StrictMode,
            null,
            React.createElement(
                _SettingsForm2.default,
                null,
                React.createElement(_NonceField2.default, {
                    name: "_postExpiratorMenuDefaults_nonce",
                    nonce: config.nonce,
                    referrer: config.referrer
                }),
                React.createElement(
                    _SettingsSection2.default,
                    {
                        title: config.text.settingsSectionTitle,
                        description: config.text.settingsSectionDescription },
                    React.createElement(_PostTypesSettingsPanels2.default, {
                        settings: config.settings,
                        text: config.text,
                        expireTypeList: config.expireTypeList,
                        taxonomiesList: config.taxonomiesList
                    })
                ),
                React.createElement(
                    _ButtonsPanel2.default,
                    null,
                    React.createElement(_SubmitButton2.default, {
                        name: "expirationdateSaveDefaults",
                        text: config.text.saveChanges
                    })
                )
            )
        );
    };

    var container = document.getElementById("publishpress-future-settings-post-types");
    var root = createRoot(container);

    root.render(React.createElement(SettingsFormPanel, null));
})(window.wp, window.publishpressFutureConfig);
})();

/******/ })()
;
//# sourceMappingURL=settings-post-types.js.map