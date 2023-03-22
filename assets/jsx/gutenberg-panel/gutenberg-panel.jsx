(function (wp, config) {

    const {registerPlugin} = wp.plugins;
    const {PluginDocumentSettingPanel} = wp.editPost;
    const {PanelRow, DateTimePicker, CheckboxControl, SelectControl, FormTokenField, Spinner} = wp.components;
    const {Fragment, Component} = wp.element;
    const {decodeEntities} = wp.htmlEntities;
    const {isEmpty, keys, compact} = lodash;

    class PostExpiratorSidebar extends Component {
        constructor() {
            super(...arguments);

            this.state = {
                categoriesList: [],
                catIdVsName: [],
            }

            wp.data.subscribe(this.listenToPostSave.bind(this));
            wp.hooks.addAction('after_save_post', 'publishpress-future', () => {
                console.log('getExpirationEnabled', this.getExpirationEnabled());
                this.saveCurrentPostData()
            });
        }

        listenToPostSave() {
            // Get the current post ID
            const postId = this.getPostId();

            const isSavingPost = this.getIsSavingPost();
            const itemKey = 'ppfuture-expiration-' + postId + '-isSavingPost';

            if (isSavingPost) {
                sessionStorage.setItem(itemKey, '1');
            }

            if (!isSavingPost) {
                let hasSavingRegistered = sessionStorage.getItem(itemKey) === '1';

                if (hasSavingRegistered) {
                    sessionStorage.removeItem(itemKey);
                    wp.hooks.doAction('after_save_post', 'publishpress-future');
                }
            }
        }

        getPostType() {
            return wp.data.select('core/editor').getCurrentPostType();
        }

        getPostId() {
            return wp.data.select('core/editor').getCurrentPostId();
        }

        getIsSavingPost() {
            return wp.data.select('core/editor').isSavingPost() || wp.data.select('core/editor').isAutosavingPost();
        }

        editPostAttribute(name, value) {
            let attribute = {};
            attribute[name] = value;

            wp.data.dispatch('core/editor').editPost(attribute);
        }

        getEditedPostAttribute(name) {
            return wp.data.select("core/editor").getEditedPostAttribute(name);
        }

        fetchExpirationDataFromApi() {
            return wp.apiFetch({path: 'publishpress-future/v1/post-expiration/' + this.getPostId()}).then((data) => {
                // this.editPostAttribute('expirationEnabled', data.enabled);
                // this.editPostAttribute('expirationAction', data.expireType);
                // this.editPostAttribute('expirationDate', data.date);
                // this.editPostAttribute('expirationTerms', data.category);
                // this.editPostAttribute('expirationTaxonomy', data.categoryTaxonomy);

                this.setState({
                    expirationEnabled: data.enabled,
                    expirationAction: data.expireType,
                    expirationDate: data.date,
                    expirationTerms: data.category,
                    expirationTaxonomy: data.categoryTaxonomy
                });

                console.log('API return', data);
            });
        }

        saveCurrentPostData() {
            //FIXME: Don't we need the editPostAttribute approach anymore? And in the other parts?
            const {expirationEnabled, expirationDate, expirationAction, expirationTerms} = this.state;
            let data;

            console.log(this.state);

            if (!expirationEnabled) {
                data = {'enabled': false, 'date': 0, 'action': '', 'terms': []};
            } else {
                data = {
                    enabled: expirationEnabled,
                    date: expirationDate,
                    action: expirationAction,
                    terms: expirationTerms,
                };
            }

            wp.apiFetch({
                path: 'publishpress-future/v1/post-expiration/' + this.getPostId(),
                method: 'POST',
                data: data,
            }).then((data) => {
                console.log('Post expiration data saved.');
                console.log(data);
            });
        }

        componentWillMount() {
            this.fetchExpirationDataFromApi().then(this.initialize.bind(this));
        }

        initialize() {
            const postType = this.getPostType();

            const expirationEnabled = this.getExpirationEnabled();
            const expirationAction = this.getExpirationAction();
            const expirationTerms = this.getExpirationTerms();
            const expirationDate = this.getExpirationDate();
            const expirationTaxonomy = this.getExpirationTaxonomy();

            console.log('Initialized', {
                enabled: expirationEnabled,
                date: expirationDate,
                expirationAction: expirationAction,
                categories: expirationTerms,
                taxonomy: expirationTaxonomy,
            });

            let categoriesList = [];
            let catIdVsName = [];

            if ((!expirationTaxonomy && postType === 'post') || expirationTaxonomy === 'category') {
                wp.apiFetch({
                    path: wp.url.addQueryArgs('wp/v2/categories', {per_page: -1}),
                }).then((list) => {
                    list.forEach(cat => {
                        categoriesList[cat.name] = cat;
                        catIdVsName[cat.id] = cat.name;
                    });
                    this.setState({
                        categoriesList: categoriesList,
                        catIdVsName: catIdVsName,
                        taxonomy: config.strings.category
                    });
                });
            } else {
                wp.apiFetch({
                    path: wp.url.addQueryArgs(`wp/v2/taxonomies/${expirationTaxonomy}`, {context: 'edit'}),
                }).then((taxAttributes) => {
                    // fetch all terms
                    wp.apiFetch({
                        path: wp.url.addQueryArgs(`wp/v2/${taxAttributes.rest_base}`, {context: 'edit'}),
                    }).then((terms) => {
                        terms.forEach(term => {
                            categoriesList[decodeEntities(term.name)] = term;
                            catIdVsName[term.id] = decodeEntities(term.name);
                        });
                        this.setState({
                            categoriesList: categoriesList,
                            catIdVsName: catIdVsName,
                            taxonomy: decodeEntities(taxAttributes.name)
                        });
                    });
                });
            }
        }

        componentDidUpdate() {
            const {expirationEnabled, expirationDate, expirationAction, expirationTerms, attribute} = this.state;
            
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

        getExpirationEnabled() {
            return this.getEditedPostAttribute('expirationEnabled') == true;
        }

        getExpirationDate() {
            let storedDate = parseInt(this.getEditedPostAttribute('expirationDate'));

            if (! storedDate) {
                if (config.default_date) {
                    storedDate = parseInt(config.default_date);
                } else {
                    storedDate = new Date().getTime();
                }
            }

            let date = new Date();
            // let browserTimezoneOffset = date.getTimezoneOffset() * 60;
            // let wpTimezoneOffset = config.timezone_offset * 60;

            // date.setTime((storedDate + browserTimezoneOffset + wpTimezoneOffset) * 1000);
            date.setTime(storedDate * 1000);

            return date.getTime()/1000;
        }

        // what action to take on expiration
        getExpirationAction() {
            let expirationAction = this.getEditedPostAttribute('expirationAction');

            if (expirationAction) {
                return expirationAction;
            }

            if (config && config.defaults && config.defaults.expireType) {
                return config.defaults.expireType;
            }

            return 'draft';
        }

        arrayIsEmpty(obj) {
            return !obj || obj.length === 0 || obj[0] === '';
        }

        // what categories to add/remove/replace
        getExpirationTerms() {
            let categories = this.getEditedPostAttribute('expirationTerms', true);

            let defaultCategories = config.defaults.terms ? config.defaults.terms.split(',') : [];

            if (this.arrayIsEmpty(categories)) {
                return defaultCategories;
            }

            if (categories && typeof categories !== 'undefined' && typeof categories !== 'object') {
                return [categories];
            }

            return categories;
        }

        getExpirationTaxonomy() {
            let taxonomy = this.getEditedPostAttribute('expirationTaxonomy');

            if (taxonomy) {
                return taxonomy;
            }

            if (config && config.defaults && config.defaults.taxonomy) {
                return config.defaults.taxonomy;
            }

            return 'category';
        }

        // fired for the autocomplete
        selectCategories(tokens) {
            const {categoriesList, catIdVsName} = this.state;

            var hasNoSuggestion = tokens.some(function (token) {
                return typeof token === 'string' && !categoriesList[token];
            });

            if (hasNoSuggestion) {
                return;
            }

            var categories = tokens.map(function (token) {
                return typeof token === 'string' ? categoriesList[token] : token;
            })

            return categories.map((cat) => cat.id);
        }

        onChangeEnabled(value) {
            this.setState({expirationEnabled: value, attribute: 'enabled'})
            this.editPostAttribute('expirationEnabled', value);
            console.log(value);
        }

        onChangeDate(value) {
            const date = new Date(value).getTime()/1000;
            this.setState({expirationDate: date, attribute: 'date'});
            this.editPostAttribute('expirationDate', date);
            console.log('New date', date, new Date(date * 1000));
            console.log('Getdate', this.getExpirationDate());
        }

        onChangeAction(value) {
            this.setState({expirationAction: value, attribute: 'action'})
            this.editPostAttribute('expirationAction', value);
        }

        onChangeTerms(value) {
            this.setState({
                expirationTerms: this.selectCategories(value),
                attribute: 'category'
            });
            this.editPostAttribute('expirationTerms', value);
        }

        render() {
            const {categoriesList, catIdVsName} = this.state;
            const {expirationEnabled, expirationDate, expirationAction, expirationTerms, expirationTaxonomy} = this.state;

            let selectedCats = expirationTerms && compact(expirationTerms.map((id) => catIdVsName[id] || false));
            if (typeof selectedCats === 'string') {
                selectedCats = [];
            }

            return (
                <PluginDocumentSettingPanel title={config.strings.postExpirator} icon="calendar"
                                            initialOpen={expirationEnabled} className={'post-expirator-panel'}>
                    <PanelRow>
                        <CheckboxControl
                            label={config.strings.enablePostExpiration}
                            checked={expirationEnabled}
                            onChange={this.onChangeEnabled.bind(this)}
                        />
                    </PanelRow>
                    {expirationEnabled && (
                        <Fragment>
                            <PanelRow>
                                <DateTimePicker
                                    currentDate={expirationDate*1000}
                                    onChange={this.onChangeDate.bind(this)}
                                    is12Hour={config.is_12_hours}
                                />
                            </PanelRow>
                            <SelectControl
                                label={config.strings.howToExpire}
                                value={expirationAction}
                                options={config.actions_options}
                                onChange={this.onChangeAction.bind(this)}
                            />
                            {expirationAction.includes('category') &&
                                (
                                    (isEmpty(keys(categoriesList)) && (
                                        <Fragment>
                                            {config.strings.loading + ` (${expirationTaxonomy})`}
                                            <Spinner/>
                                        </Fragment>
                                    ))
                                    ||
                                    (
                                        <FormTokenField
                                            label={config.strings.expirationCategories + ` (${expirationTaxonomy})`}
                                            value={selectedCats}
                                            suggestions={Object.keys(categoriesList)}
                                            onChange={this.onChangeTerms.bind(this)}
                                            maxSuggestions={10}
                                        />
                                    )
                                )}
                        </Fragment>
                    )}
                </PluginDocumentSettingPanel>
            );
        }
    }

    registerPlugin('postexpirator-sidebar', {
        render: PostExpiratorSidebar
    });

})(window.wp, window.postExpiratorPanelConfig);
