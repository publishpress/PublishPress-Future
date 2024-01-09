/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/jsx/blocks/future-action-date.jsx":
/*!******************************************************!*\
  !*** ./src/assets/jsx/blocks/future-action-date.jsx ***!
  \******************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: Unexpected token (24:89)\n\n\u001b[0m \u001b[90m 22 | \u001b[39m            tagName\u001b[33m=\u001b[39m\u001b[32m\"p\"\u001b[39m\n \u001b[90m 23 | \u001b[39m            value\u001b[33m=\u001b[39m{attributes\u001b[33m.\u001b[39mtemplate}\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 24 | \u001b[39m            onChange\u001b[33m=\u001b[39m{(value) \u001b[33m=>\u001b[39m {setAttributes({ template\u001b[33m:\u001b[39m value })\u001b[33m;\u001b[39m console\u001b[33m.\u001b[39mlog(value)\u001b[33m;\u001b[39m)}}\n \u001b[90m    | \u001b[39m                                                                                         \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 25 | \u001b[39m            placeholder\u001b[33m=\u001b[39m\u001b[32m\"Enter the template for the future action date block\"\u001b[39m\n \u001b[90m 26 | \u001b[39m            className\u001b[33m=\u001b[39m\u001b[32m\"future-action-date\"\u001b[39m\n \u001b[90m 27 | \u001b[39m            autocompleters\u001b[33m=\u001b[39m{[\u001b[0m\n");

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************!*\
  !*** ./src/assets/jsx/blocks.jsx ***!
  \***********************************/


var _futureActionDate = __webpack_require__(/*! ./blocks/future-action-date */ "./src/assets/jsx/blocks/future-action-date.jsx");

var registerBlockType = wp.blocks.registerBlockType;


registerBlockType('publishpress-future-pro/future-action-date', _futureActionDate.FutureActionDateBlock);
})();

/******/ })()
;
//# sourceMappingURL=blocks.js.map