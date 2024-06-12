"use strict";
(self["webpackChunkpublishpress_future_pro"] = self["webpackChunkpublishpress_future_pro"] || []).push([["src_assets_jsx_workflow-editor_components_node-dev-info-panel_index_jsx"],{

/***/ "./src/assets/jsx/workflow-editor/components/node-dev-info-panel/index.jsx":
/*!*********************************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/node-dev-info-panel/index.jsx ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeDevInfoPanel: () => (/* binding */ NodeDevInfoPanel),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_json_view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-json-view */ "./node_modules/react-json-view/dist/main.js");
/* harmony import */ var react_json_view__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_json_view__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _persistent_panel_body__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../persistent-panel-body */ "./src/assets/jsx/workflow-editor/components/persistent-panel-body/index.jsx");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




function NodeDevInfoPanel(_ref) {
  var node = _ref.node,
    nodeType = _ref.nodeType;
  var reactJSONParams = {
    collapsed: 1,
    collapseStringsAfterLength: 50,
    displayDataTypes: false,
    displayObjectSize: false,
    enableClipboard: false
  };
  return /*#__PURE__*/React.createElement(_persistent_panel_body__WEBPACK_IMPORTED_MODULE_3__["default"], {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Developer Info', 'publishpress-future-pro'),
    icon: 'admin-tools',
    className: "workflow-editor-dev-info-panel workflow-editor-dev-panel"
  }, node && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelRow, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Node', 'publishpress-future-pro')), /*#__PURE__*/React.createElement("div", {
    className: "workflow-editor-dev-info-wrapper"
  }, /*#__PURE__*/React.createElement((react_json_view__WEBPACK_IMPORTED_MODULE_2___default()), _extends({
    src: node
  }, reactJSONParams))))), nodeType && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelRow, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Node Type', 'publishpress-future-pro')), /*#__PURE__*/React.createElement("div", {
    className: "workflow-editor-dev-info-wrapper"
  }, /*#__PURE__*/React.createElement((react_json_view__WEBPACK_IMPORTED_MODULE_2___default()), _extends({
    src: nodeType
  }, reactJSONParams))))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NodeDevInfoPanel);

/***/ })

}]);
//# sourceMappingURL=src_assets_jsx_workflow-editor_components_node-dev-info-panel_index_jsx.editor.js.map