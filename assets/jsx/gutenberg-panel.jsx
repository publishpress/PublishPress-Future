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
        }

        componentWillMount() {
            const {attributes} = this.state;

            const postMeta = wp.data.select('core/editor').getEditedPostAttribute('meta');
            const postType = wp.data.select('core/editor').getCurrentPostType();
            const setPostMeta = (newMeta) => wp.data.dispatch('core/editor').editPost({meta: newMeta});

            let enabled = false;
            let date = new Date();

            let expireAction = this.getExpireType(postMeta);

            let categories = [];
            if (expireAction.includes('category')) {
                categories = this.getCategories(postMeta);
            }

            if (postMeta['_expiration-date-status'] && postMeta['_expiration-date-status'] === 'saved') {
                enabled = true;
            }

            let browserTimezoneOffset = date.getTimezoneOffset() * 60;
            let wpTimezoneOffset = config.timezone_offset * 60;

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

            let taxonomy = config.defaults.taxonomy || 'category';

            this.setState({
                enabled: enabled,
                date: date,
                expireAction: expireAction,
                categories: categories,
                taxonomy: taxonomy,
            });

            // Force all the metadata to be saved. Required for making sure the default settings are stored correctly.
            setPostMeta({'_expiration-date-status': (enabled ? 'saved' : '')});
            setPostMeta({'_expiration-date': (date.getTime()) / 1000});
            setPostMeta({'_expiration-date-type': expireAction});
            setPostMeta({'_expiration-date-categories': categories});

            let categoriesList = [];
            let catIdVsName = [];

            if ((!taxonomy && postType === 'post') || taxonomy === 'category') {
                wp.apiFetch({
                    path: wp.url.addQueryArgs('wp/v2/categories', {per_page: -1}),
                }).then((list) => {
                    list.forEach(cat => {
                        categoriesList[cat.name] = cat;
                        catIdVsName[cat.id] = cat.name;
                    });
                    this.setState({categoriesList: categoriesList, catIdVsName: catIdVsName, taxonomy: config.strings.category});
                });
            } else if (postType !== 'page') {
                wp.apiFetch({
                    path: wp.url.addQueryArgs(`wp/v2/taxonomies/${taxonomy}`, {context: 'edit'}),
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
            const {enabled, date, expireAction, categories, attribute} = this.state;
            const setPostMeta = (newMeta) => wp.data.dispatch('core/editor').editPost({meta: newMeta});
            const postMeta = wp.data.select('core/editor').getEditedPostAttribute('meta');

            switch (attribute) {
                case 'enabled':
                    setPostMeta({'_expiration-date-status': (enabled ? 'saved' : '')});
                    // if date is not set when the checkbox is enabled, set it to the default date
                    // this is to prevent the user from having to click the date to set it
                    if (!postMeta['_expiration-date']) {
                        setPostMeta({'_expiration-date': this.getDate(date)});
                    }
                    break;
                case 'date':
                    if (typeof date === 'string') {
                        setPostMeta({'_expiration-date': this.getDate(date)});
                    }
                    break;
                case 'action':
                    setPostMeta({'_expiration-date-type': expireAction});
                    if (!expireAction.includes('category')) {
                        setPostMeta({'_expiration-date-categories': []});
                    }
                    break;
                case 'category':
                    setPostMeta({'_expiration-date-categories': categories});
                    break;
            }

        }

        render() {
            const {categoriesList, catIdVsName} = this.state;
            const {enabled, date, expireAction, categories, taxonomy} = this.state;

            const postType = wp.data.select('core/editor').getCurrentPostType();

            let actionsList = [
                {label: config.strings.draft, value: 'draft'},
                {label: config.strings.delete, value: 'delete'},
                {label: config.strings.trash, value: 'trash'},
                {label: config.strings.private, value: 'private'},
                {label: config.strings.stick, value: 'stick'},
                {label: config.strings.unstick, value: 'unstick'},
            ];

            if (postType !== 'page') {
                actionsList = _.union(actionsList, [
                    {label: config.strings.categoryReplace, value: 'category'},
                    {label: config.strings.categoryAdd, value: 'category-add'},
                    {label: config.strings.categoryRemove, value: 'category-remove'},
                ]);
            }

            let selectedCats = categories && compact(categories.map((id) => catIdVsName[id] || false));
            if (typeof selectedCats === 'string') {
                selectedCats = [];
            }

            return (
                <PluginDocumentSettingPanel title={config.strings.postExpirator} icon="calendar"
                                            initialOpen={enabled} className={'post-expirator-panel'}>
                    <PanelRow>
                        <CheckboxControl
                            label={config.strings.enablePostExpiration}
                            checked={enabled}
                            onChange={(value) => {
                                this.setState({enabled: !enabled, attribute: 'enabled'})
                            }}
                        />
                    </PanelRow>
                    {enabled && (
                        <Fragment>
                            <PanelRow>
                                <DateTimePicker
                                    currentDate={date}
                                    onChange={(value) => this.setState({date: value, attribute: 'date'})}
                                    is_12_hours={config.is_12_hours}
                                />
                            </PanelRow>
                            <SelectControl
                                label={config.strings.howToExpire}
                                value={expireAction}
                                options={actionsList}
                                onChange={(value) => {
                                    this.setState({expireAction: value, attribute: 'action'})
                                }}
                            />
                            {expireAction.includes('category') &&
                            (
                                (isEmpty(keys(categoriesList)) && (
                                    <Fragment>
                                        {config.strings.loading + ` (${taxonomy})`}
                                        <Spinner/>
                                    </Fragment>
                                ))
                                ||
                                (
                                    <FormTokenField
                                        label={config.strings.expirationCategories + ` (${taxonomy})`}
                                        value={selectedCats}
                                        suggestions={Object.keys(categoriesList)}
                                        onChange={(value) => {
                                            this.setState({
                                                categories: this.selectCategories(value),
                                                attribute: 'category'
                                            })
                                        }}
                                        maxSuggestions={10}
                                    />
                                )
                            )}
                        </Fragment>
                    )}
                </PluginDocumentSettingPanel>
            );
        }

        // what action to take on expiration
        getExpireType(postMeta) {
            let typeNew = postMeta['_expiration-date-type'];
            let typeOld = postMeta['_expiration-date-options'] && postMeta['_expiration-date-options']['expireType'];



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
        getCategories(postMeta) {
            let categoriesNew = postMeta['_expiration-date-categories'] && postMeta['_expiration-date-categories'];
            let categoriesOld = postMeta['_expiration-date-options'] && postMeta['_expiration-date-options']['category'];

            if (typeof categoriesNew === 'object' && categoriesNew.length > 0) {
                return categoriesNew;
            }

            if (categoriesOld && typeof categoriesOld !== 'undefined' && typeof categoriesOld !== 'object') {
                categories = [categoriesOld];
            }

            return categoriesOld;

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

        getDate(date) {
            let newDate = new Date();
            let browserTimezoneOffset = new Date().getTimezoneOffset() * 60;
            let wpTimezoneOffset = config.timezone_offset * 60;
            newDate.setTime(Date.parse(date));
            newDate.setTime(newDate.getTime() - (browserTimezoneOffset + wpTimezoneOffset) * 1000);
            return ((newDate.getTime()) / 1000);
        }

    }

    registerPlugin('postexpirator-sidebar', {
        render: PostExpiratorSidebar
    });


})(window.wp, window.postExpiratorPanelConfig);
