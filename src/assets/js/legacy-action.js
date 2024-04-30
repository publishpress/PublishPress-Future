/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField.jsx":
/*!*****************************************************************************************************************!*\
  !*** ./lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField.jsx ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelAfterActionField: () => (/* binding */ FutureActionPanelAfterActionField),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FutureActionPanelAfterActionField = function FutureActionPanelAfterActionField(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Fill, {
    name: "FutureActionPanelAfterActionField"
  }, children);
};
var FutureActionPanelAfterActionFieldSlot = function FutureActionPanelAfterActionFieldSlot(props) {
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Slot, _extends({
    name: "FutureActionPanelAfterActionField"
  }, props));
};
FutureActionPanelAfterActionField.Slot = FutureActionPanelAfterActionFieldSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FutureActionPanelAfterActionField);

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
/*!************************************************!*\
  !*** ./src/assets/jsx/legacy-action/index.jsx ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_vendor_publishpress_publishpress_future_assets_jsx_components_FutureActionPanelAfterActionField__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField */ "./lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField.jsx");




var Fields = function Fields(_ref) {
  var storeName = _ref.storeName;
  var workflowsOptions = futureWorkflows.workflows;
  var defaultWorkflow = workflowsOptions.length > 0 ? workflowsOptions[0].value : 0;
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(function (select) {
      return {
        action: select(storeName).getAction(),
        workflow: select(storeName).getExtraDataByName('workflow') || defaultWorkflow
      };
    }),
    action = _useSelect.action,
    workflow = _useSelect.workflow;
  var _dispatch = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(storeName),
    setExtraDataByName = _dispatch.setExtraDataByName;
  var handleActionChange = function handleActionChange(value) {
    setExtraDataByName('workflow', value);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, workflowsOptions.length > 0 && action === 'trigger-workflow' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelRow, {
    className: "future-action-panel-content future-action-full-width"
  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Workflow to trigger', 'publishpress-future-pro'),
    value: workflow,
    options: workflowsOptions,
    onChange: handleActionChange
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "future_action_pro_workflow",
    value: workflow
  })), workflowsOptions.length === 0 && action === 'trigger-workflow' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelRow, {
    className: "future-action-panel-content future-action-full-width"
  }, /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No workflows available.', 'publishpress-future-pro'))));
};
var LegacyActionFields = function LegacyActionFields() {
  return /*#__PURE__*/React.createElement(_lib_vendor_publishpress_publishpress_future_assets_jsx_components_FutureActionPanelAfterActionField__WEBPACK_IMPORTED_MODULE_3__.FutureActionPanelAfterActionField, null, function (_ref2) {
    var storeName = _ref2.storeName;
    return /*#__PURE__*/React.createElement(Fields, {
      storeName: storeName
    });
  });
};
wp.plugins.registerPlugin('legacy-action-plugin', {
  render: LegacyActionFields,
  scope: 'publishpress-future'
});
})();

/******/ })()
;
//# sourceMappingURL=legacy-action.js.map