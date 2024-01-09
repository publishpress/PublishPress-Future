/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/jsx/blocks/future-action-date.jsx":
/*!******************************************************!*\
  !*** ./src/assets/jsx/blocks/future-action-date.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var storeName = 'publishpress-future/future-action';

var BlockEdit = function BlockEdit(props) {
    var useEffect = wp.element.useEffect;
    var useSelect = wp.data.useSelect;
    var attributes = props.attributes,
        setAttributes = props.setAttributes;
    var RichText = wp.blockEditor.RichText;

    var _useSelect = useSelect(function (select) {
        return {
            date: select(storeName).getDate(),
            enabled: select(storeName).getEnabled()
        };
    }),
        date = _useSelect.date,
        enabled = _useSelect.enabled;

    useEffect(function () {
        setAttributes({ date: date, enabled: enabled });
    }, [date, enabled]);

    return React.createElement(RichText, {
        tagName: "p",
        value: attributes.template,
        onChange: function onChange(value) {
            return setAttributes({ template: value });
        },
        placeholder: "Enter the template for the future action date block",
        className: "future-action-date",
        autocompleters: [{
            name: 'future-action-date',
            triggerPrefix: 'ACTION',
            options: [{
                value: 'ACTIONTIME',
                label: 'ACTIONTIME'
            }, {
                value: 'ACTIONDATE',
                label: 'ACTIONDATE'
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
    });
};

var FutureActionDateBlock = exports.FutureActionDateBlock = {
    title: 'Future Action Date',
    icon: 'clock',
    category: 'common',
    attributes: {
        enabled: {
            type: 'boolean',
            default: false
        },
        date: {
            type: 'string',
            default: ''
        },
        template: {
            type: 'string',
            default: 'Post expires at ACTIONTIME on ACTIONDATE'
        }
    },
    edit: BlockEdit,
    save: function save() {
        return null;
    }
};

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