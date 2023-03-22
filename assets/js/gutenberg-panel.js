/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************************************!*\
  !*** ./assets/jsx/gutenberg-panel/gutenberg-panel.jsx ***!
  \********************************************************/


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

            wp.data.subscribe(_this.listenToPostSave.bind(_this));
            wp.hooks.addAction('after_save_post', 'publishpress-future', function () {
                console.log('getExpirationEnabled', _this.getExpirationEnabled());
                _this.saveCurrentPostData();
            });
            return _this;
        }

        _createClass(PostExpiratorSidebar, [{
            key: 'listenToPostSave',
            value: function listenToPostSave() {
                // Get the current post ID
                var postId = this.getPostId();

                var isSavingPost = this.getIsSavingPost();
                var itemKey = 'ppfuture-expiration-' + postId + '-isSavingPost';

                if (isSavingPost) {
                    sessionStorage.setItem(itemKey, '1');
                }

                if (!isSavingPost) {
                    var hasSavingRegistered = sessionStorage.getItem(itemKey) === '1';

                    if (hasSavingRegistered) {
                        sessionStorage.removeItem(itemKey);
                        wp.hooks.doAction('after_save_post', 'publishpress-future');
                    }
                }
            }
        }, {
            key: 'getPostType',
            value: function getPostType() {
                return wp.data.select('core/editor').getCurrentPostType();
            }
        }, {
            key: 'getPostId',
            value: function getPostId() {
                return wp.data.select('core/editor').getCurrentPostId();
            }
        }, {
            key: 'getIsSavingPost',
            value: function getIsSavingPost() {
                return wp.data.select('core/editor').isSavingPost() || wp.data.select('core/editor').isAutosavingPost();
            }
        }, {
            key: 'editPostAttribute',
            value: function editPostAttribute(name, value) {
                var attribute = {};
                attribute[name] = value;

                wp.data.dispatch('core/editor').editPost(attribute);
            }
        }, {
            key: 'getEditedPostAttribute',
            value: function getEditedPostAttribute(name) {
                return wp.data.select("core/editor").getEditedPostAttribute(name);
            }
        }, {
            key: 'fetchExpirationDataFromApi',
            value: function fetchExpirationDataFromApi() {
                var _this2 = this;

                return wp.apiFetch({ path: 'publishpress-future/v1/post-expiration/' + this.getPostId() }).then(function (data) {
                    // this.editPostAttribute('expirationEnabled', data.enabled);
                    // this.editPostAttribute('expirationAction', data.expireType);
                    // this.editPostAttribute('expirationDate', data.date);
                    // this.editPostAttribute('expirationTerms', data.category);
                    // this.editPostAttribute('expirationTaxonomy', data.categoryTaxonomy);

                    _this2.setState({
                        expirationEnabled: data.enabled,
                        expirationAction: data.expireType,
                        expirationDate: data.date,
                        expirationTerms: data.category,
                        expirationTaxonomy: data.categoryTaxonomy
                    });

                    console.log('API return', data);
                });
            }
        }, {
            key: 'saveCurrentPostData',
            value: function saveCurrentPostData() {
                var _state = this.state,
                    expirationEnabled = _state.expirationEnabled,
                    expirationDate = _state.expirationDate,
                    expirationAction = _state.expirationAction,
                    expirationTerms = _state.expirationTerms;

                var data = void 0;

                console.log(this.state);

                if (!expirationEnabled) {
                    data = { 'enabled': false, 'date': 0, 'action': '', 'terms': [] };
                } else {
                    data = {
                        enabled: expirationEnabled,
                        date: expirationDate,
                        action: expirationAction,
                        terms: expirationTerms
                    };
                }

                wp.apiFetch({
                    path: 'publishpress-future/v1/post-expiration/' + this.getPostId(),
                    method: 'POST',
                    data: data
                }).then(function (data) {
                    console.log('Post expiration data saved.');
                    console.log(data);
                });
            }
        }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
                this.fetchExpirationDataFromApi().then(this.initialize.bind(this));
            }
        }, {
            key: 'initialize',
            value: function initialize() {
                var _this3 = this;

                var postType = this.getPostType();

                var expirationEnabled = this.getExpirationEnabled();
                var expirationAction = this.getExpirationAction();
                var expirationTerms = this.getExpirationTerms();
                var expirationDate = this.getExpirationDate();
                var expirationTaxonomy = this.getExpirationTaxonomy();

                console.log('Initialized', {
                    enabled: expirationEnabled,
                    date: expirationDate,
                    expirationAction: expirationAction,
                    categories: expirationTerms,
                    taxonomy: expirationTaxonomy
                });

                var categoriesList = [];
                var catIdVsName = [];

                if (!expirationTaxonomy && postType === 'post' || expirationTaxonomy === 'category') {
                    wp.apiFetch({
                        path: wp.url.addQueryArgs('wp/v2/categories', { per_page: -1 })
                    }).then(function (list) {
                        list.forEach(function (cat) {
                            categoriesList[cat.name] = cat;
                            catIdVsName[cat.id] = cat.name;
                        });
                        _this3.setState({
                            categoriesList: categoriesList,
                            catIdVsName: catIdVsName,
                            taxonomy: config.strings.category
                        });
                    });
                } else {
                    wp.apiFetch({
                        path: wp.url.addQueryArgs('wp/v2/taxonomies/' + expirationTaxonomy, { context: 'edit' })
                    }).then(function (taxAttributes) {
                        // fetch all terms
                        wp.apiFetch({
                            path: wp.url.addQueryArgs('wp/v2/' + taxAttributes.rest_base, { context: 'edit' })
                        }).then(function (terms) {
                            terms.forEach(function (term) {
                                categoriesList[decodeEntities(term.name)] = term;
                                catIdVsName[term.id] = decodeEntities(term.name);
                            });
                            _this3.setState({
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
                var _state2 = this.state,
                    expirationEnabled = _state2.expirationEnabled,
                    expirationDate = _state2.expirationDate,
                    expirationAction = _state2.expirationAction,
                    expirationTerms = _state2.expirationTerms,
                    attribute = _state2.attribute;


                switch (attribute) {
                    case 'enabled':
                        this.editPostAttribute('expirationEnabled', expirationEnabled);
                        break;

                    case 'date':
                        this.editPostAttribute('expirationDate', expirationDate);
                        break;

                    case 'action':
                        this.editPostAttribute('expirationAction', expirationAction);
                        if (!expirationAction.includes('category')) {
                            this.editPostAttribute('expirationTerms', []);
                        }
                        break;
                    case 'category':
                        this.editPostAttribute('expirationTerms', expirationTerms);
                        break;
                }
            }
        }, {
            key: 'getExpirationEnabled',
            value: function getExpirationEnabled() {
                return this.getEditedPostAttribute('expirationEnabled') == true;
            }
        }, {
            key: 'getExpirationDate',
            value: function getExpirationDate() {
                var storedDate = parseInt(this.getEditedPostAttribute('expirationDate'));

                if (!storedDate) {
                    if (config.default_date) {
                        storedDate = parseInt(config.default_date);
                    } else {
                        storedDate = new Date().getTime();
                    }
                }

                var date = new Date();
                // let browserTimezoneOffset = date.getTimezoneOffset() * 60;
                // let wpTimezoneOffset = config.timezone_offset * 60;

                // date.setTime((storedDate + browserTimezoneOffset + wpTimezoneOffset) * 1000);
                date.setTime(storedDate * 1000);

                return date.getTime() / 1000;
            }

            // what action to take on expiration

        }, {
            key: 'getExpirationAction',
            value: function getExpirationAction() {
                var expirationAction = this.getEditedPostAttribute('expirationAction');

                if (expirationAction) {
                    return expirationAction;
                }

                if (config && config.defaults && config.defaults.expireType) {
                    return config.defaults.expireType;
                }

                return 'draft';
            }
        }, {
            key: 'arrayIsEmpty',
            value: function arrayIsEmpty(obj) {
                return !obj || obj.length === 0 || obj[0] === '';
            }

            // what categories to add/remove/replace

        }, {
            key: 'getExpirationTerms',
            value: function getExpirationTerms() {
                var categories = this.getEditedPostAttribute('expirationTerms', true);

                var defaultCategories = config.defaults.terms ? config.defaults.terms.split(',') : [];

                if (this.arrayIsEmpty(categories)) {
                    return defaultCategories;
                }

                if (categories && typeof categories !== 'undefined' && (typeof categories === 'undefined' ? 'undefined' : _typeof(categories)) !== 'object') {
                    return [categories];
                }

                return categories;
            }
        }, {
            key: 'getExpirationTaxonomy',
            value: function getExpirationTaxonomy() {
                var taxonomy = this.getEditedPostAttribute('expirationTaxonomy');

                if (taxonomy) {
                    return taxonomy;
                }

                if (config && config.defaults && config.defaults.taxonomy) {
                    return config.defaults.taxonomy;
                }

                return 'category';
            }

            // fired for the autocomplete

        }, {
            key: 'selectCategories',
            value: function selectCategories(tokens) {
                var _state3 = this.state,
                    categoriesList = _state3.categoriesList,
                    catIdVsName = _state3.catIdVsName;


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
            key: 'onChangeEnabled',
            value: function onChangeEnabled(value) {
                this.setState({ expirationEnabled: value, attribute: 'enabled' });
                this.editPostAttribute('expirationEnabled', value);
                console.log(value);
            }
        }, {
            key: 'onChangeDate',
            value: function onChangeDate(value) {
                var date = new Date(value).getTime() / 1000;
                this.setState({ expirationDate: date, attribute: 'date' });
                this.editPostAttribute('expirationDate', date);
                console.log('New date', date, new Date(date * 1000));
                console.log('Getdate', this.getExpirationDate());
            }
        }, {
            key: 'onChangeAction',
            value: function onChangeAction(value) {
                this.setState({ expirationAction: value, attribute: 'action' });
                this.editPostAttribute('expirationAction', value);
            }
        }, {
            key: 'onChangeTerms',
            value: function onChangeTerms(value) {
                this.setState({
                    expirationTerms: this.selectCategories(value),
                    attribute: 'category'
                });
                this.editPostAttribute('expirationTerms', value);
            }
        }, {
            key: 'render',
            value: function render() {
                var _state4 = this.state,
                    categoriesList = _state4.categoriesList,
                    catIdVsName = _state4.catIdVsName;
                var _state5 = this.state,
                    expirationEnabled = _state5.expirationEnabled,
                    expirationDate = _state5.expirationDate,
                    expirationAction = _state5.expirationAction,
                    expirationTerms = _state5.expirationTerms,
                    expirationTaxonomy = _state5.expirationTaxonomy;


                var selectedCats = expirationTerms && compact(expirationTerms.map(function (id) {
                    return catIdVsName[id] || false;
                }));
                if (typeof selectedCats === 'string') {
                    selectedCats = [];
                }

                return React.createElement(
                    PluginDocumentSettingPanel,
                    { title: config.strings.postExpirator, icon: 'calendar',
                        initialOpen: expirationEnabled, className: 'post-expirator-panel' },
                    React.createElement(
                        PanelRow,
                        null,
                        React.createElement(CheckboxControl, {
                            label: config.strings.enablePostExpiration,
                            checked: expirationEnabled,
                            onChange: this.onChangeEnabled.bind(this)
                        })
                    ),
                    expirationEnabled && React.createElement(
                        Fragment,
                        null,
                        React.createElement(
                            PanelRow,
                            null,
                            React.createElement(DateTimePicker, {
                                currentDate: expirationDate * 1000,
                                onChange: this.onChangeDate.bind(this),
                                is12Hour: config.is_12_hours
                            })
                        ),
                        React.createElement(SelectControl, {
                            label: config.strings.howToExpire,
                            value: expirationAction,
                            options: config.actions_options,
                            onChange: this.onChangeAction.bind(this)
                        }),
                        expirationAction.includes('category') && (isEmpty(keys(categoriesList)) && React.createElement(
                            Fragment,
                            null,
                            config.strings.loading + (' (' + expirationTaxonomy + ')'),
                            React.createElement(Spinner, null)
                        ) || React.createElement(FormTokenField, {
                            label: config.strings.expirationCategories + (' (' + expirationTaxonomy + ')'),
                            value: selectedCats,
                            suggestions: Object.keys(categoriesList),
                            onChange: this.onChangeTerms.bind(this),
                            maxSuggestions: 10
                        }))
                    )
                );
            }
        }]);

        return PostExpiratorSidebar;
    }(Component);

    registerPlugin('postexpirator-sidebar', {
        render: PostExpiratorSidebar
    });
})(window.wp, window.postExpiratorPanelConfig);
/******/ })()
;
//# sourceMappingURL=gutenberg-panel.js.map