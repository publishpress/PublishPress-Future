/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());




var Fields = function Fields(_ref) {
  var storeName = _ref.storeName;
  var workflowsOptions = [{
    label: 'Workflow 1',
    value: 'workflow-1'
  }, {
    label: 'Workflow 2',
    value: 'workflow-2'
  }];
  var defaultWorkflow = workflowsOptions[0].value;
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, action === 'trigger-workflow' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelRow, {
    className: "future-action-panel-content future-action-full-width"
  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Workflow to trigger', 'publishpress-future-pro'),
    value: workflow,
    options: workflowsOptions,
    onChange: handleActionChange
  })));
};
var LegacyActionFields = function LegacyActionFields() {
  return /*#__PURE__*/React.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../../../lib/vendor/publishpress/publishpress-future/assets/jsx/components/FutureActionPanelAfterActionField'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, function (_ref2) {
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