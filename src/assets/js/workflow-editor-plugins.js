/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/jsx/workflow-editor-plugins/plugins/recurrent-date-field/index.jsx":
/*!***************************************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor-plugins/plugins/recurrent-date-field/index.jsx ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RecurrentDateField)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


function RecurrentDateField() {
  var cronScheduleOptions = futureWorkflowEditor.cronSchedules;
  cronScheduleOptions = cronScheduleOptions.map(function (schedule) {
    return {
      name: schedule.label,
      id: "cron_".concat(schedule.value)
    };
  });
  var recurrenceOptions = [{
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Non-repeating", "post-expirator"),
    id: "single"
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Custom interval in seconds", "post-expirator"),
    id: "custom"
  }].concat(_toConsumableArray(cronScheduleOptions));
  var repeatUntilOptions = [{
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Forever", "post-expirator"),
    id: "forever"
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Specific date", "post-expirator"),
    id: "date"
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("For a number of times", "post-expirator"),
    id: "times"
  }];
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Fill, {
    name: "DateOffsetAfterDateSourceField"
  }, function (_ref) {
    var defaultValue = _ref.defaultValue,
      onChangeSetting = _ref.onChangeSetting;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TreeSelect, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Repeating Action", "post-expirator"),
      tree: recurrenceOptions,
      selectedId: defaultValue.recurrence,
      onChange: function onChange(value) {
        return onChangeSetting({
          settingName: "recurrence",
          value: value
        });
      }
    }), defaultValue.recurrence === "custom" && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Interval in seconds", "post-expirator"),
      value: defaultValue.repeatInterval,
      onChange: function onChange(value) {
        return onChangeSetting({
          settingName: "repeatInterval",
          value: value
        });
      }
    }), defaultValue.recurrence !== "single" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TreeSelect, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Repeat until", "post-expirator"),
      tree: repeatUntilOptions,
      selectedId: defaultValue.repeatUntil,
      onChange: function onChange(value) {
        return onChangeSetting({
          settingName: "repeatUntil",
          value: value
        });
      }
    }), defaultValue.repeatUntil === 'times' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Times to repeat", "post-expirator"),
      value: defaultValue.repeatTimes,
      onChange: function onChange(value) {
        return onChangeSetting({
          settingName: "repeatTimes",
          value: value
        });
      }
    }), defaultValue.repeatUntil === 'date' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.DatePicker, {
      currentDate: defaultValue.repeatUntilDate,
      onChange: function onChange(value) {
        return onChangeSetting({
          settingName: "repeatUntilDate",
          value: value
        });
      }
    })));
  });
}

/***/ }),

/***/ "@wordpress/components":
/*!********************************!*\
  !*** external "wp.components" ***!
  \********************************/
/***/ ((module) => {

module.exports = wp.components;

/***/ }),

/***/ "@wordpress/i18n":
/*!**************************!*\
  !*** external "wp.i18n" ***!
  \**************************/
/***/ ((module) => {

module.exports = wp.i18n;

/***/ }),

/***/ "@wordpress/plugins":
/*!*****************************!*\
  !*** external "wp.plugins" ***!
  \*****************************/
/***/ ((module) => {

module.exports = wp.plugins;

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
var __webpack_exports__ = {};
/*!**********************************************************!*\
  !*** ./src/assets/jsx/workflow-editor-plugins/index.jsx ***!
  \**********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _plugins_recurrent_date_field_index_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugins/recurrent-date-field/index.jsx */ "./src/assets/jsx/workflow-editor-plugins/plugins/recurrent-date-field/index.jsx");


(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)('recurrent-date-field', {
  render: _plugins_recurrent_date_field_index_jsx__WEBPACK_IMPORTED_MODULE_1__["default"],
  scope: 'future-workflow-editor'
});
/******/ })()
;