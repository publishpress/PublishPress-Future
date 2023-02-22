/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./vendor/publishpress/post-expirator/assets/jsx/settings/components/SettingRow.jsx":
/*!******************************************************************************************!*\
  !*** ./vendor/publishpress/post-expirator/assets/jsx/settings/components/SettingRow.jsx ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(/*! react */ "react");

var _TrueFalseField = __webpack_require__(/*! ./fields/TrueFalseField */ "./vendor/publishpress/post-expirator/assets/jsx/settings/components/fields/TrueFalseField.jsx");

var _TrueFalseField2 = _interopRequireDefault(_TrueFalseField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

var SettingRow = function SettingRow(props) {
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

exports["default"] = SettingRow;

/***/ }),

/***/ "./vendor/publishpress/post-expirator/assets/jsx/settings/components/fields/TrueFalseField.jsx":
/*!*****************************************************************************************************!*\
  !*** ./vendor/publishpress/post-expirator/assets/jsx/settings/components/fields/TrueFalseField.jsx ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(/*! react */ "react");

var TrueFalseField = function TrueFalseField(props) {
    var onChange = function onChange(e) {
        if (props.onChange) {
            props.onChange(e.target.value === props.trueValue && jQuery(e.target).is(':checked'));
            // Check only the true radio... using the field name? or directly the ID
        }
    };

    return React.createElement(
        _react.Fragment,
        null,
        React.createElement("input", {
            type: "radio",
            name: props.name,
            id: props.name + '-true',
            value: props.trueValue,
            defaultChecked: props.selected,
            onChange: onChange
        }),
        React.createElement(
            "label",
            { htmlFor: props.name + '-true' },
            props.trueLabel
        ),
        "\xA0\xA0",
        React.createElement("input", {
            type: "radio",
            name: props.name,
            defaultChecked: !props.selected,
            id: props.name + '-false',
            value: props.falseValue,
            onChange: onChange
        }),
        React.createElement(
            "label",
            {
                htmlFor: props.name + '-false' },
            props.falseLabel
        ),
        React.createElement(
            "p",
            { className: "description" },
            props.description
        )
    );
}; /*
    * Copyright (c) 2023. PublishPress, All rights reserved.
    */

exports["default"] = TrueFalseField;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

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
/*!**********************************************!*\
  !*** ./src/assets/jsx/settings/settings.jsx ***!
  \**********************************************/


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright (c) 2023. PublishPress, All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _SettingRow = __webpack_require__(/*! post-expirator/assets/jsx/settings/components/SettingRow */ "./vendor/publishpress/post-expirator/assets/jsx/settings/components/SettingRow.jsx");

var _SettingRow2 = _interopRequireDefault(_SettingRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

wp.hooks.addFilter('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro/debug', function (settingsRows, props, settingActive, useState) {
    var defaultEnabledCustomStatuses = [];
    if (publishpressFutureProSettings.settings.enabledCustomStatuses) {
        defaultEnabledCustomStatuses = publishpressFutureProSettings.settings.enabledCustomStatuses[props.postType] || [];
    }

    var _useState = useState(defaultEnabledCustomStatuses),
        _useState2 = _slicedToArray(_useState, 2),
        enabledCustomStatuses = _useState2[0],
        setEnabledCustomStatuses = _useState2[1];

    var handleCustomStatusesChange = function handleCustomStatusesChange(event) {
        if (jQuery(event.target).is(':checked')) {
            setEnabledCustomStatuses([].concat(_toConsumableArray(enabledCustomStatuses), [event.target.value]));
        } else {
            setEnabledCustomStatuses(enabledCustomStatuses.filter(function (status) {
                return status !== event.target.value;
            }));
        }
    };

    var handleSelectAll = function handleSelectAll(event) {
        event.preventDefault();

        setEnabledCustomStatuses(publishpressFutureProSettings.customPostStatuses.map(function (postStatus) {
            return postStatus.value;
        }));
    };

    var handleUnselectAll = function handleUnselectAll(event) {
        event.preventDefault();

        setEnabledCustomStatuses([]);
    };

    if (settingActive) {
        if (publishpressFutureProSettings.customPostStatuses.length === 0) {
            return settingsRows;
        }

        var postStatusesCheckboxes = publishpressFutureProSettings.customPostStatuses.map(function (postStatus) {
            var checked = enabledCustomStatuses.includes(postStatus.value);
            var fieldId = 'expirationdate_custom-statuses-' + props.postType + '-' + postStatus.value;

            return React.createElement(
                'div',
                { className: 'pp-checkbox' },
                React.createElement('input', {
                    type: 'checkbox',
                    name: 'expirationdate_custom-statuses-' + props.postType + '[]',
                    id: fieldId,
                    value: postStatus.value,
                    checked: checked,
                    onChange: handleCustomStatusesChange,
                    key: postStatus.value
                }),
                React.createElement(
                    'label',
                    { htmlFor: fieldId },
                    postStatus.label
                )
            );
        });

        settingsRows.push(React.createElement(
            _SettingRow2.default,
            { label: publishpressFutureProSettings.text.enableCustomStatuses },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    publishpressFutureProSettings.text.enableCustomStatusesDesc
                )
            ),
            React.createElement(
                'div',
                { className: 'future_pro_checkbox_selection_control' },
                React.createElement(
                    'a',
                    { href: '#', onClick: handleSelectAll },
                    'Select all'
                ),
                ' ',
                React.createElement(
                    'a',
                    { href: '#', onClick: handleUnselectAll },
                    'Unselect all'
                )
            ),
            postStatusesCheckboxes
        ));
    }

    return settingsRows;
});
})();

/******/ })()
;
//# sourceMappingURL=settings.js.map