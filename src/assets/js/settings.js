/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/jsx/settings/custom-statuses.jsx":
/*!*****************************************************!*\
  !*** ./src/assets/jsx/settings/custom-statuses.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCustomStatusSettings: () => (/* binding */ addCustomStatusSettings)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '&publishpress-free/components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! &config.pro-settings */ "&config.pro-settings");
/* harmony import */ var _config_pro_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */



var addCustomStatusSettings = function addCustomStatusSettings(settingsRows, props, settingActive, useState) {
  var defaultEnabledCustomStatuses = [];
  if (_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.enabledCustomStatuses) {
    defaultEnabledCustomStatuses = _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.enabledCustomStatuses[props.postType] || [];
  }
  var _useState = useState(defaultEnabledCustomStatuses),
    _useState2 = _slicedToArray(_useState, 2),
    enabledCustomStatuses = _useState2[0],
    setEnabledCustomStatuses = _useState2[1];
  var handleCustomStatusesChange = function handleCustomStatusesChange(postStatus, checked) {
    var newEnabledCustomStatuses = _toConsumableArray(enabledCustomStatuses);
    if (checked) {
      newEnabledCustomStatuses.push(postStatus);
    } else {
      newEnabledCustomStatuses = newEnabledCustomStatuses.filter(function (status) {
        return status !== postStatus;
      });
    }

    // Remove duplicates.
    newEnabledCustomStatuses = _toConsumableArray(new Set(newEnabledCustomStatuses));
    setEnabledCustomStatuses(newEnabledCustomStatuses);
  };
  var handleSelectAll = function handleSelectAll(event) {
    event.preventDefault();
    setEnabledCustomStatuses(_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.customPostStatuses.map(function (postStatus) {
      return postStatus.value;
    }));
  };
  var handleUnselectAll = function handleUnselectAll(event) {
    event.preventDefault();
    setEnabledCustomStatuses([]);
  };
  if (settingActive) {
    if (_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.customPostStatuses.length === 0) {
      return settingsRows;
    }
    var postStatusesCheckboxes = _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.customPostStatuses.map(function (postStatus) {
      var checked = enabledCustomStatuses.includes(postStatus.value);
      var fieldId = 'expirationdate_custom-statuses-' + props.postType + '-' + postStatus.value;
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
        key: fieldId,
        name: 'expirationdate_custom-statuses-' + props.postType + '[]',
        id: fieldId,
        value: postStatus.value,
        label: postStatus.label,
        checked: checked || false,
        onChange: function onChange(checked) {
          return handleCustomStatusesChange(postStatus.value, checked);
        },
        title: postStatus.value
      });
    });
    settingsRows.push( /*#__PURE__*/React.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '&publishpress-free/components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
      label: _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.enableCustomStatuses,
      key: 'custom-statuses'
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.enableCustomStatusesDesc)), /*#__PURE__*/React.createElement("div", {
      className: 'future_pro_checkbox_selection_control'
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "link",
      onClick: handleSelectAll
    }, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.selectAll), " | ", /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "link",
      onClick: handleUnselectAll
    }, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.unselectAll)), postStatusesCheckboxes));
  }
  return settingsRows;
};

/***/ }),

/***/ "./src/assets/jsx/settings/metadata-map.jsx":
/*!**************************************************!*\
  !*** ./src/assets/jsx/settings/metadata-map.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMetadataSettings: () => (/* binding */ addMetadataSettings)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '&publishpress-free/components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! &config.pro-settings */ "&config.pro-settings");
/* harmony import */ var _config_pro_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */




var SectionTitle = function SectionTitle(props) {
  return /*#__PURE__*/React.createElement("h3", null, props.children);
};
var MetadataMapTable = function MetadataMapTable(props) {
  var handleMetadataMapChange = function handleMetadataMapChange(originalMetaKey, mappedMetaKey) {
    var newMetadataMapping = _objectSpread({}, props.metadataMapping);
    if (!newMetadataMapping) {
      newMetadataMapping = {};
    }
    newMetadataMapping[originalMetaKey] = mappedMetaKey;
    props.onChangeMetadataMapping(newMetadataMapping);
  };
  return /*#__PURE__*/React.createElement("table", {
    className: "wp-list-table widefat fixed striped table-view-list"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, props.columns.map(function (column) {
    return /*#__PURE__*/React.createElement("th", {
      key: column
    }, column);
  }))), /*#__PURE__*/React.createElement("tbody", null, props.metadataFields.map(function (field) {
    return /*#__PURE__*/React.createElement("tr", {
      key: field.originalKey,
      className: "future_pro_metadata_mapping_row"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "mapping-label-container"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: 'expirationdate_metadata_mapping_' + props.postType + '_' + field.originalKey
    }, field.label), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
      text: field.description
    }, /*#__PURE__*/React.createElement("span", {
      className: "dashicons dashicons-editor-help"
    })))), /*#__PURE__*/React.createElement("td", null, field.originalKey), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: 'expirationdate_metadata_mapping[' + props.postType + '][' + field.originalKey + ']',
      id: 'expirationdate_metadata_mapping_' + props.postType + '_' + field.originalKey,
      value: props.metadataMapping[field.originalKey] ? props.metadataMapping[field.originalKey] : '',
      placeholder: field.originalKey,
      onChange: function onChange(e) {
        return handleMetadataMapChange(field.originalKey, e.target.value);
      }
    })));
  })));
};
var HelpText = function HelpText(props) {
  return /*#__PURE__*/React.createElement("p", {
    className: "description"
  }, props.children);
};
var FieldRow = function FieldRow(props) {
  var className = 'publishpress-settings-field-row';
  if (props.className) {
    className += ' ' + props.className;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, props.children);
};
var addMetadataSettings = function addMetadataSettings(settingsRows, props, settingActive, useState) {
  var defaultEnabledMetadaMapping = false;
  if (_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.metadataMappingStatus) {
    defaultEnabledMetadaMapping = _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.metadataMappingStatus[props.postType] || false;
  }
  var defaultHideMetabox = false;
  if (_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.metadataHideMetabox) {
    defaultHideMetabox = _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.metadataHideMetabox[props.postType] || false;
  }
  var defaultMetadataMapping = {};
  if (_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.metadataMapping) {
    defaultMetadataMapping = _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.settings.metadataMapping[props.postType] || {};
  }
  var _useState = useState(defaultEnabledMetadaMapping),
    _useState2 = _slicedToArray(_useState, 2),
    enableMetadataMapping = _useState2[0],
    setEnableMetadataMapping = _useState2[1];
  var _useState3 = useState(defaultHideMetabox),
    _useState4 = _slicedToArray(_useState3, 2),
    hideMetabox = _useState4[0],
    setHideMetabox = _useState4[1];
  var _useState5 = useState(defaultMetadataMapping),
    _useState6 = _slicedToArray(_useState5, 2),
    metadataMapping = _useState6[0],
    setMetadataMapping = _useState6[1];
  var handleMetadataMapStatusChange = function handleMetadataMapStatusChange(checked) {
    setEnableMetadataMapping(checked);
  };
  var handleMetaboxStatusChange = function handleMetaboxStatusChange(checked) {
    setHideMetabox(checked);
  };
  if (settingActive) {
    settingsRows.push( /*#__PURE__*/React.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '&publishpress-free/components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
      label: _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.enableMetadataDrivenScheduling,
      key: 'metadata_mapping'
    }, /*#__PURE__*/React.createElement(FieldRow, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
      name: 'expirationdate_metadata_mapping_enabled[' + props.postType + ']',
      id: 'expirationdate_metadata_mapping_enabled_' + props.postType,
      value: '1',
      label: _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.enableMetadataDrivenSchedulingDesc,
      checked: enableMetadataMapping,
      onChange: function onChange(checked) {
        return handleMetadataMapStatusChange(checked);
      }
    }), /*#__PURE__*/React.createElement(HelpText, null, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.enableMetadataDrivenSchedulingHelp)), enableMetadataMapping && /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/React.createElement(FieldRow, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
      name: 'expirationdate_hide_metabox[' + props.postType + ']',
      id: 'expirationdate_hide_metabox_' + props.postType,
      value: '1',
      label: _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.hideMetabox,
      checked: hideMetabox,
      onChange: function onChange(checked) {
        return handleMetaboxStatusChange(checked);
      }
    }), /*#__PURE__*/React.createElement(HelpText, null, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.hideMetaboxHelp)), /*#__PURE__*/React.createElement(FieldRow, {
      className: "expirationdate_metadata_metakeys"
    }, /*#__PURE__*/React.createElement(SectionTitle, null, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.metadataMapping), /*#__PURE__*/React.createElement(MetadataMapTable, {
      columns: [_config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.description, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.originalKey, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.mappedKey],
      postType: props.postType,
      metadataFields: publishpressFutureProSettings.metadataFields,
      metadataMapping: metadataMapping,
      onChangeMetadataMapping: function onChangeMetadataMapping(newMetadataMapping) {
        return setMetadataMapping(newMetadataMapping);
      }
    }), /*#__PURE__*/React.createElement(HelpText, null, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.enableMetadataMappingHelp, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
      href: _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.readmoreMetadataMappingHelpUrl,
      target: "_blank"
    }, _config_pro_settings__WEBPACK_IMPORTED_MODULE_1__.text.readmoreMetadataMappingHelp))))));
  }
  return settingsRows;
};

/***/ }),

/***/ "./src/assets/jsx/settings/settings.jsx":
/*!**********************************************!*\
  !*** ./src/assets/jsx/settings/settings.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _custom_statuses__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./custom-statuses */ "./src/assets/jsx/settings/custom-statuses.jsx");
/* harmony import */ var _metadata_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./metadata-map */ "./src/assets/jsx/settings/metadata-map.jsx");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);



(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', _custom_statuses__WEBPACK_IMPORTED_MODULE_0__.addCustomStatusSettings);
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)('expirationdate_settings_posttype', 'publishpress/publishpress-future-pro', _metadata_map__WEBPACK_IMPORTED_MODULE_1__.addMetadataSettings);

/***/ }),

/***/ "&config.pro-settings":
/*!************************************************!*\
  !*** external "publishpressFutureProSettings" ***!
  \************************************************/
/***/ ((module) => {

module.exports = publishpressFutureProSettings;

/***/ }),

/***/ "@wordpress/components":
/*!********************************!*\
  !*** external "wp.components" ***!
  \********************************/
/***/ ((module) => {

module.exports = wp.components;

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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/assets/jsx/settings/custom-statuses.jsx");
/******/ 	__webpack_require__("./src/assets/jsx/settings/metadata-map.jsx");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/assets/jsx/settings/settings.jsx");
/******/ 	
/******/ })()
;
//# sourceMappingURL=settings.js.map