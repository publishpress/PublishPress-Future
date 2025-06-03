/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./assets/jsx/i18n.jsx ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __: () => (/* binding */ __),
/* harmony export */   _n: () => (/* binding */ _n),
/* harmony export */   _n_noop: () => (/* binding */ _n_noop),
/* harmony export */   _nx: () => (/* binding */ _nx),
/* harmony export */   _nx_noop: () => (/* binding */ _nx_noop),
/* harmony export */   _x: () => (/* binding */ _x),
/* harmony export */   isRTL: () => (/* binding */ isRTL),
/* harmony export */   sprintf: () => (/* binding */ sprintf)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

var __ = function __(text, domain) {
  var _data$locale_data;
  var data = window.publishpressI18nConfig.data;
  var dataDomain = (data === null || data === void 0 ? void 0 : data.domain) || null;
  if (dataDomain === null) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(text, domain);
  }
  var localeData = (data === null || data === void 0 || (_data$locale_data = data.locale_data) === null || _data$locale_data === void 0 ? void 0 : _data$locale_data[dataDomain]) || null;
  if (localeData === null) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(text, domain);
  }
  if (localeData !== null && localeData !== void 0 && localeData[text]) {
    return localeData[text][0];
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(text, domain);
};
var sprintf = function sprintf(text) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf.apply(void 0, [text].concat(args));
};
var isRTL = function isRTL() {
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.isRTL)();
};
var _n = function _n(single, plural, number, domain) {
  single = __(single, domain);
  plural = __(plural, domain);
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)(single, plural, number, domain);
};
var _x = function _x(text, context, domain) {
  text = __(text, domain);
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)(text, context, domain);
};
var _nx = function _nx(single, plural, number, context, domain) {
  single = __(single, domain);
  plural = __(plural, domain);
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._nx)(single, plural, number, context, domain);
};
var _n_noop = function _n_noop(single, plural, domain) {
  single = __(single, domain);
  plural = __(plural, domain);
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n_noop)(single, plural, domain);
};
var _nx_noop = function _nx_noop(single, plural, context, domain) {
  single = __(single, domain);
  plural = __(plural, domain);
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._nx_noop)(single, plural, context, domain);
};
if (typeof window.publishpress === 'undefined') {
  window.publishpress = {};
}
if (typeof window.publishpress.i18n === 'undefined') {
  window.publishpress.i18n = {};
}
window.publishpress.i18n.__ = __;
window.publishpress.i18n.sprintf = sprintf;
window.publishpress.i18n.isRTL = isRTL;
window.publishpress.i18n._n = _n;
window.publishpress.i18n._x = _x;
window.publishpress.i18n._nx = _nx;
window.publishpress.i18n._n_noop = _n_noop;
window.publishpress.i18n._nx_noop = _nx_noop;
})();

/******/ })()
;
//# sourceMappingURL=i18n.js.map