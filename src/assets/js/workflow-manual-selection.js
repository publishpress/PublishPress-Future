/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelTop.jsx":
/*!****************************************************************************************************!*\
  !*** ./lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelTop.jsx ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelTop: () => (/* binding */ FutureActionPanelTop),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FutureActionPanelTop = function FutureActionPanelTop(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Fill, {
    name: "FutureActionPanelTop"
  }, children);
};
var FutureActionPanelTopSlot = function FutureActionPanelTopSlot(props) {
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Slot, _extends({
    name: "FutureActionPanelTop"
  }, props));
};
FutureActionPanelTop.Slot = FutureActionPanelTopSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FutureActionPanelTop);

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

/***/ "@wordpress/i18n":
/*!**************************!*\
  !*** external "wp.i18n" ***!
  \**************************/
/***/ ((module) => {

module.exports = wp.i18n;

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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************************************!*\
  !*** ./src/assets/jsx/workflow-manual-selection/index.jsx ***!
  \************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_vendor_publishpress_publishpress_future_assets_jsx_components_FutureActionPanelTop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelTop */ "./lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelTop.jsx");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);





var Fields = function Fields(_ref) {
  var storeName = _ref.storeName;
  var availableWorkflows = futureWorkflowManualSelection.workflows;
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
      var workflowSelections = availableWorkflows.map(function (workflow) {
        var isSelected = select(storeName).getExtraDataByName('workflowManualSelection' + workflow.value) || 0;
        return isSelected ? workflow.value : null;
      });
      return {
        getExtraDataByName: select(storeName).getExtraDataByName,
        workflowSelections: workflowSelections
      };
    }),
    workflowSelections = _useSelect.workflowSelections,
    getExtraDataByName = _useSelect.getExtraDataByName;
  var _dispatch = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)(storeName),
    setExtraDataByName = _dispatch.setExtraDataByName;
  var handleActionChange = function handleActionChange(workflowId, value) {
    setExtraDataByName('workflowManualSelection' + workflowId, value);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    availableWorkflows.forEach(function (workflow) {
      var enabled = workflowSelections.includes(workflow.value);
      handleActionChange(workflow.value, enabled);
    });
  }, []);
  var checkboxFields = availableWorkflows.map(function (workflow) {
    var isChecked = workflowSelections.includes(workflow.value);
    return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CheckboxControl, {
      key: workflow.value,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable workflow %s', 'publishpress-future-pro'), workflow.label),
      checked: isChecked,
      onChange: function onChange(value) {
        return handleActionChange(workflow.value, value);
      }
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, checkboxFields);
};
var LegacyPanelTop = function LegacyPanelTop() {
  return /*#__PURE__*/React.createElement(_lib_vendor_publishpress_publishpress_future_assets_jsx_components_FutureActionPanelTop__WEBPACK_IMPORTED_MODULE_3__.FutureActionPanelTop, null, function (_ref2) {
    var storeName = _ref2.storeName;
    return /*#__PURE__*/React.createElement(Fields, {
      storeName: storeName
    });
  });
};
wp.plugins.registerPlugin('workflow-manual-selection-plugin', {
  render: LegacyPanelTop,
  scope: 'publishpress-future'
});
})();

/******/ })()
;
//# sourceMappingURL=workflow-manual-selection.js.map