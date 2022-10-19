/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/jsx/gutenberg-panel.jsx":
/*!****************************************!*\
  !*** ./assets/jsx/gutenberg-panel.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wp, config) {
    var registerPlugin = wp.plugins.registerPlugin;
    var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;
    var _wp$components = wp.components,
        PanelRow = _wp$components.PanelRow,
        DateTimePicker = _wp$components.DateTimePicker,
        CheckboxControl = _wp$components.CheckboxControl,
        SelectControl = _wp$components.SelectControl,
        FormTokenField = _wp$components.FormTokenField,
        Spinner = _wp$components.Spinner;
    var _wp$element = wp.element,
        Fragment = _wp$element.Fragment,
        Component = _wp$element.Component;
    var decodeEntities = wp.htmlEntities.decodeEntities;
    var _lodash = lodash,
        isEmpty = _lodash.isEmpty,
        keys = _lodash.keys,
        compact = _lodash.compact;

    var PostExpiratorSidebar = function (_Component) {
        _inherits(PostExpiratorSidebar, _Component);

        function PostExpiratorSidebar() {
            _classCallCheck(this, PostExpiratorSidebar);

            var _this = _possibleConstructorReturn(this, (PostExpiratorSidebar.__proto__ || Object.getPrototypeOf(PostExpiratorSidebar)).apply(this, arguments));

            _this.state = {
                categoriesList: [],
                catIdVsName: []
            };
            return _this;
        }

        _createClass(PostExpiratorSidebar, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _this2 = this;

                var attributes = this.state.attributes;


                var postMeta = wp.data.select('core/editor').getEditedPostAttribute('meta');
                var postType = wp.data.select('core/editor').getCurrentPostType();
                var setPostMeta = function setPostMeta(newMeta) {
                    return wp.data.dispatch('core/editor').editPost({ meta: newMeta });
                };

                var enabled = false;
                var date = new Date();

                var expireAction = this.getExpireType(postMeta);

                var categories = [];
                if (expireAction.includes('category')) {
                    categories = this.getCategories(postMeta);
                }

                if (postMeta['_expiration-date-status'] && postMeta['_expiration-date-status'] === 'saved') {
                    enabled = true;
                }

                var browserTimezoneOffset = date.getTimezoneOffset() * 60;
                var wpTimezoneOffset = config.timezone_offset * 60;

                if (postMeta['_expiration-date']) {
                    date.setTime((postMeta['_expiration-date'] + browserTimezoneOffset + wpTimezoneOffset) * 1000);
                } else {
                    categories = config.default_categories;
                    if (config.default_date) {
                        date.setTime((parseInt(config.default_date) + browserTimezoneOffset + wpTimezoneOffset) * 1000);
                    }

                    // If the date is not set
                    enabled = false;
                }

                var taxonomy = config.defaults.taxonomy || 'category';

                this.setState({
                    enabled: enabled,
                    date: date,
                    expireAction: expireAction,
                    categories: categories,
                    taxonomy: taxonomy
                });

                // Force all the metadata to be saved. Required for making sure the default settings are stored correctly.
                setPostMeta({ '_expiration-date-status': enabled ? 'saved' : '' });
                setPostMeta({ '_expiration-date': date.getTime() / 1000 });
                setPostMeta({ '_expiration-date-type': expireAction });
                setPostMeta({ '_expiration-date-categories': categories });

                var categoriesList = [];
                var catIdVsName = [];

                if (!taxonomy && postType === 'post' || taxonomy === 'category') {
                    wp.apiFetch({
                        path: wp.url.addQueryArgs('wp/v2/categories', { per_page: -1 })
                    }).then(function (list) {
                        list.forEach(function (cat) {
                            categoriesList[cat.name] = cat;
                            catIdVsName[cat.id] = cat.name;
                        });
                        _this2.setState({ categoriesList: categoriesList, catIdVsName: catIdVsName, taxonomy: config.strings.category });
                    });
                } else {
                    wp.apiFetch({
                        path: wp.url.addQueryArgs('wp/v2/taxonomies/' + taxonomy, { context: 'edit' })
                    }).then(function (taxAttributes) {
                        // fetch all terms
                        wp.apiFetch({
                            path: wp.url.addQueryArgs('wp/v2/' + taxAttributes.rest_base, { context: 'edit' })
                        }).then(function (terms) {
                            terms.forEach(function (term) {
                                categoriesList[decodeEntities(term.name)] = term;
                                catIdVsName[term.id] = decodeEntities(term.name);
                            });
                            _this2.setState({
                                categoriesList: categoriesList,
                                catIdVsName: catIdVsName,
                                taxonomy: decodeEntities(taxAttributes.name)
                            });
                        });
                    });
                }
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
                var _state = this.state,
                    enabled = _state.enabled,
                    date = _state.date,
                    expireAction = _state.expireAction,
                    categories = _state.categories,
                    attribute = _state.attribute;

                var setPostMeta = function setPostMeta(newMeta) {
                    return wp.data.dispatch('core/editor').editPost({ meta: newMeta });
                };
                var postMeta = wp.data.select('core/editor').getEditedPostAttribute('meta');

                switch (attribute) {
                    case 'enabled':
                        setPostMeta({ '_expiration-date-status': enabled ? 'saved' : '' });
                        // if date is not set when the checkbox is enabled, set it to the default date
                        // this is to prevent the user from having to click the date to set it
                        if (!postMeta['_expiration-date']) {
                            setPostMeta({ '_expiration-date': this.getDate(date) });
                        }
                        break;
                    case 'date':
                        if (typeof date === 'string') {
                            setPostMeta({ '_expiration-date': this.getDate(date) });
                        }
                        break;
                    case 'action':
                        setPostMeta({ '_expiration-date-type': expireAction });
                        if (!expireAction.includes('category')) {
                            setPostMeta({ '_expiration-date-categories': [] });
                        }
                        break;
                    case 'category':
                        setPostMeta({ '_expiration-date-categories': categories });
                        break;
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this3 = this;

                var _state2 = this.state,
                    categoriesList = _state2.categoriesList,
                    catIdVsName = _state2.catIdVsName;
                var _state3 = this.state,
                    enabled = _state3.enabled,
                    date = _state3.date,
                    expireAction = _state3.expireAction,
                    categories = _state3.categories,
                    taxonomy = _state3.taxonomy;


                var postType = wp.data.select('core/editor').getCurrentPostType();

                var actionsList = [{ label: config.strings.draft, value: 'draft' }, { label: config.strings.delete, value: 'delete' }, { label: config.strings.trash, value: 'trash' }, { label: config.strings.private, value: 'private' }, { label: config.strings.stick, value: 'stick' }, { label: config.strings.unstick, value: 'unstick' }, { label: config.strings.categoryReplace, value: 'category' }, { label: config.strings.categoryAdd, value: 'category-add' }, { label: config.strings.categoryRemove, value: 'category-remove' }];

                var selectedCats = categories && compact(categories.map(function (id) {
                    return catIdVsName[id] || false;
                }));
                if (typeof selectedCats === 'string') {
                    selectedCats = [];
                }

                return React.createElement(
                    PluginDocumentSettingPanel,
                    { title: config.strings.postExpirator, icon: 'calendar',
                        initialOpen: enabled, className: 'post-expirator-panel' },
                    React.createElement(
                        PanelRow,
                        null,
                        React.createElement(CheckboxControl, {
                            label: config.strings.enablePostExpiration,
                            checked: enabled,
                            onChange: function onChange(value) {
                                _this3.setState({ enabled: !enabled, attribute: 'enabled' });
                            }
                        })
                    ),
                    enabled && React.createElement(
                        Fragment,
                        null,
                        React.createElement(
                            PanelRow,
                            null,
                            React.createElement(DateTimePicker, {
                                currentDate: date,
                                onChange: function onChange(value) {
                                    return _this3.setState({ date: value, attribute: 'date' });
                                },
                                is12Hour: config.is_12_hours
                            })
                        ),
                        React.createElement(SelectControl, {
                            label: config.strings.howToExpire,
                            value: expireAction,
                            options: actionsList,
                            onChange: function onChange(value) {
                                _this3.setState({ expireAction: value, attribute: 'action' });
                            }
                        }),
                        expireAction.includes('category') && (isEmpty(keys(categoriesList)) && React.createElement(
                            Fragment,
                            null,
                            config.strings.loading + (' (' + taxonomy + ')'),
                            React.createElement(Spinner, null)
                        ) || React.createElement(FormTokenField, {
                            label: config.strings.expirationCategories + (' (' + taxonomy + ')'),
                            value: selectedCats,
                            suggestions: Object.keys(categoriesList),
                            onChange: function onChange(value) {
                                _this3.setState({
                                    categories: _this3.selectCategories(value),
                                    attribute: 'category'
                                });
                            },
                            maxSuggestions: 10
                        }))
                    )
                );
            }

            // what action to take on expiration

        }, {
            key: 'getExpireType',
            value: function getExpireType(postMeta) {
                var typeNew = postMeta['_expiration-date-type'];
                var typeOld = postMeta['_expiration-date-options'] && postMeta['_expiration-date-options']['expireType'];

                if (typeNew) {
                    return typeNew;
                }

                if (typeOld) {
                    return typeOld;
                }

                if (config && config.defaults && config.defaults.expireType) {
                    return config.defaults.expireType;
                }

                return 'draft';
            }

            // what categories to add/remove/replace

        }, {
            key: 'getCategories',
            value: function getCategories(postMeta) {
                var categoriesNew = postMeta['_expiration-date-categories'] && postMeta['_expiration-date-categories'];
                var categoriesOld = postMeta['_expiration-date-options'] && postMeta['_expiration-date-options']['category'];

                if ((typeof categoriesNew === 'undefined' ? 'undefined' : _typeof(categoriesNew)) === 'object' && categoriesNew.length > 0) {
                    return categoriesNew;
                }

                if (categoriesOld && typeof categoriesOld !== 'undefined' && (typeof categoriesOld === 'undefined' ? 'undefined' : _typeof(categoriesOld)) !== 'object') {
                    categories = [categoriesOld];
                }

                return categoriesOld;
            }

            // fired for the autocomplete

        }, {
            key: 'selectCategories',
            value: function selectCategories(tokens) {
                var _state4 = this.state,
                    categoriesList = _state4.categoriesList,
                    catIdVsName = _state4.catIdVsName;


                var hasNoSuggestion = tokens.some(function (token) {
                    return typeof token === 'string' && !categoriesList[token];
                });

                if (hasNoSuggestion) {
                    return;
                }

                var categories = tokens.map(function (token) {
                    return typeof token === 'string' ? categoriesList[token] : token;
                });

                return categories.map(function (cat) {
                    return cat.id;
                });
            }
        }, {
            key: 'getDate',
            value: function getDate(date) {
                var newDate = new Date();
                var browserTimezoneOffset = new Date().getTimezoneOffset() * 60;
                var wpTimezoneOffset = config.timezone_offset * 60;
                newDate.setTime(Date.parse(date));
                newDate.setTime(newDate.getTime() - (browserTimezoneOffset + wpTimezoneOffset) * 1000);
                return newDate.getTime() / 1000;
            }
        }]);

        return PostExpiratorSidebar;
    }(Component);

    registerPlugin('postexpirator-sidebar', {
        render: PostExpiratorSidebar
    });
})(window.wp, window.postExpiratorPanelConfig);

/***/ }),

/***/ 0:
/*!**********************************************!*\
  !*** multi ./assets/jsx/gutenberg-panel.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./assets/jsx/gutenberg-panel.jsx */"./assets/jsx/gutenberg-panel.jsx");


/***/ })

/******/ });
//# sourceMappingURL=gutenberg-panel.js.map