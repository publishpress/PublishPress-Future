/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/jsx/blocks/FutureActionDate.jsx":
/*!****************************************************!*\
  !*** ./src/assets/jsx/blocks/FutureActionDate.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionDate: () => (/* binding */ FutureActionDate)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var storeName = 'publishpress-future/future-action';
var FutureActionDate = {
  apiVersion: 3,
  title: publishpressFutureProBlocks.text.blockTitle,
  icon: 'clock',
  description: publishpressFutureProBlocks.text.blockDescription,
  category: 'text',
  attributes: {
    template: {
      type: 'string',
      default: publishpressFutureProBlocks.text.defaultTemplate
    },
    alignment: {
      type: 'string',
      default: 'none'
    }
  },
  example: {
    attributes: {
      template: publishpressFutureProBlocks.text.defaultTemplate,
      alignment: 'none'
    }
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes,
      isSelected = _ref.isSelected;
    var useSelect = wp.data.useSelect;
    var _wp$blockEditor = wp.blockEditor,
      RichText = _wp$blockEditor.RichText,
      useBlockProps = _wp$blockEditor.useBlockProps,
      BlockControls = _wp$blockEditor.BlockControls,
      AlignmentToolbar = _wp$blockEditor.AlignmentToolbar,
      InspectorControls = _wp$blockEditor.InspectorControls;
    var _wp$richText = wp.richText,
      insert = _wp$richText.insert,
      insertObject = _wp$richText.insertObject;
    var __ = wp.i18n.__;
    var _wp$components = wp.components,
      __experimentalToolsPanel = _wp$components.__experimentalToolsPanel,
      ToolbarDropdownMenu = _wp$components.ToolbarDropdownMenu;
    var _useSelect = useSelect(function (select) {
        var store = select(storeName);
        return {
          date: store ? store.getDate() : '',
          enabled: store ? store.getEnabled() : false
        };
      }),
      date = _useSelect.date,
      enabled = _useSelect.enabled;
    var onChangeTemplate = function onChangeTemplate(value) {
      setAttributes({
        template: value
      });
    };
    var onChangeAligmment = function onChangeAligmment(value) {
      setAttributes({
        alignment: value
      });
    };
    return /*#__PURE__*/React.createElement("div", useBlockProps(), isSelected && /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/React.createElement(BlockControls, null, /*#__PURE__*/React.createElement(AlignmentToolbar, {
      value: attributes.alignment,
      onChange: onChangeAligmment
    })), /*#__PURE__*/React.createElement(InspectorControls, {
      key: "help"
    }, /*#__PURE__*/React.createElement(__experimentalToolsPanel, {
      label: "Help"
    }, /*#__PURE__*/React.createElement("div", {
      className: "future-action-tools-panel-help"
    }, publishpressFutureProBlocks.text.helpPanelText, /*#__PURE__*/React.createElement("h2", null, publishpressFutureProBlocks.text.availablePlaceholders), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "#ACTIONDATE"), /*#__PURE__*/React.createElement("li", null, "#ACTIONTIME"))))), /*#__PURE__*/React.createElement(RichText, {
      tagName: "div",
      value: attributes.template,
      onChange: onChangeTemplate,
      style: {
        textAlign: attributes.alignment
      },
      placeholder: publishpressFutureProBlocks.text.editorPlaceholder,
      className: "future-action-block",
      autocompleters: [{
        name: 'future-action-placeholders',
        triggerPrefix: '#',
        options: [{
          value: '#ACTIONTIME',
          label: publishpressFutureProBlocks.text.actionTimeLabel
        }, {
          value: '#ACTIONDATE',
          label: publishpressFutureProBlocks.text.actionDateLabel
        }],
        getOptionLabel: function getOptionLabel(option) {
          return option.label;
        },
        getOptionKeywords: function getOptionKeywords(option) {
          return [option.value];
        },
        getOptionCompletion: function getOptionCompletion(option) {
          return option.value;
        }
      }]
    })), !isSelected && /*#__PURE__*/React.createElement(RichText.Content, {
      tagName: "div",
      value: attributes.template,
      style: {
        textAlign: attributes.alignment
      },
      className: 'future-action-block'
    }));
  },
  save: function save() {
    return null;
  }
};

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "@wordpress/blocks":
/*!****************************!*\
  !*** external "wp.blocks" ***!
  \****************************/
/***/ ((module) => {

module.exports = wp.blocks;

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
/*!*****************************************!*\
  !*** ./src/assets/jsx/block-editor.jsx ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_FutureActionDate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blocks/FutureActionDate */ "./src/assets/jsx/blocks/FutureActionDate.jsx");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);


(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('publishpress-future-pro/future-action-date', _blocks_FutureActionDate__WEBPACK_IMPORTED_MODULE_0__.FutureActionDate);
/******/ })()
;