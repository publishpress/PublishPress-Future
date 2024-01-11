/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/jsx/blocks/FutureActionDate.jsx":
/*!****************************************************!*\
  !*** ./src/assets/jsx/blocks/FutureActionDate.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var storeName = 'publishpress-future/future-action';

var BlockEdit = function BlockEdit(props) {
    var _wp$element = wp.element,
        useEffect = _wp$element.useEffect,
        Fragment = _wp$element.Fragment;
    var useSelect = wp.data.useSelect;
    var attributes = props.attributes,
        setAttributes = props.setAttributes,
        isSelected = props.isSelected;
    var _wp$blockEditor = wp.blockEditor,
        RichText = _wp$blockEditor.RichText,
        useBlockProps = _wp$blockEditor.useBlockProps;

    var _useSelect = useSelect(function (select) {
        var store = select(storeName);

        return {
            date: store ? store.getDate() : '',
            enabled: store ? store.getEnabled() : false
        };
    }),
        date = _useSelect.date,
        enabled = _useSelect.enabled;

    return React.createElement(
        'div',
        useBlockProps(),
        isSelected && React.createElement(RichText, {
            tagName: 'div',
            value: attributes.template,
            onChange: function onChange(value) {
                return setAttributes({ template: value });
            },
            placeholder: 'Future action block template. Type the text and # to see the autocomplete options.',
            className: 'future-action-block',
            autocompleters: [{
                name: 'future-action-placeholders',
                triggerPrefix: '#',
                options: [{
                    value: '#ACTIONTIME',
                    label: 'Action time'
                }, {
                    value: '#ACTIONDATE',
                    label: 'Action date'
                }, {
                    value: '#ACTIONDATETIME',
                    label: 'Action date and time'
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
        }),
        !isSelected && React.createElement(RichText.Content, {
            tagName: 'div',
            value: attributes.template,
            className: 'future-action-block'
        })
    );
};

var FutureActionDate = exports.FutureActionDate = {
    apiVersion: 2,
    title: 'Future Action Date',
    icon: 'clock',
    category: 'text',
    attributes: {
        template: {
            type: 'string',
            default: 'Post expires at #ACTIONTIME on #ACTIONDATE'
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
/*!*****************************************!*\
  !*** ./src/assets/jsx/block-editor.jsx ***!
  \*****************************************/


var _FutureActionDate = __webpack_require__(/*! ./blocks/FutureActionDate */ "./src/assets/jsx/blocks/FutureActionDate.jsx");

var registerBlockType = wp.blocks.registerBlockType;


registerBlockType('publishpress-future-pro/future-action-date', _FutureActionDate.FutureActionDate);
})();

/******/ })()
;
//# sourceMappingURL=block-editor.js.map