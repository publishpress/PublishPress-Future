import { compact } from '../utils';
import { ToggleCalendarDatePicker } from './ToggleCalendarDatePicker';

const { PanelRow, CheckboxControl, SelectControl, FormTokenField, Spinner, BaseControl } = wp.components;
const { Fragment, useEffect } = wp.element;
const { decodeEntities } = wp.htmlEntities;
const { addQueryArgs } = wp.url;
const {
    useSelect,
    useDispatch
} = wp.data;
const { apiFetch } = wp;

export const FutureActionPanel = (props) => {
    const action = useSelect((select) => select(props.storeName).getAction(), []);
    const date = useSelect((select) => select(props.storeName).getDate(), []);
    const enabled = useSelect((select) => select(props.storeName).getEnabled(), []);
    const terms = useSelect((select) => select(props.storeName).getTerms(), []);
    const taxonomy = useSelect((select) => select(props.storeName).getTaxonomy(), []);
    const taxonomyName = useSelect((select) => select(props.storeName).getTaxonomyName(), []);
    const termsListByName = useSelect((select) => select(props.storeName).getTermsListByName(), []);
    const termsListById = useSelect((select) => select(props.storeName).getTermsListById(), []);
    const isFetchingTerms = useSelect((select) => select(props.storeName).getIsFetchingTerms(), []);
    const calendarIsVisible = useSelect((select) => select(props.storeName).getCalendarIsVisible(), []);

    const {
        setAction,
        setDate,
        setEnabled,
        setTerms,
        setTaxonomy,
        setTermsListByName,
        setTermsListById,
        setTaxonomyName,
        setIsFetchingTerms,
        setCalendarIsVisible
    } = useDispatch(props.storeName);

    const mapTermsListById = (terms) => {
        if (typeof terms !== 'object' || terms === null) {
            return {};
        }

        return terms.map((term) => {
            return termsListById[term];
        });
    }

    const insertTerm = (term) => {
        termsListByName[term] = {id: term, count: 0, description: "", link: "", name: term, slug: term, taxonomy: taxonomy};
        termsListById[term] = term;
        setTermsListByName(termsListByName);
        setTermsListById(termsListById);
        setTerms([...terms, term]);

    }

    const mapTermsListByName = (terms) => {
        if (typeof terms !== 'object' || terms === null) {
            return {};
        }

        return terms.map((term) => {
            if (termsListByName[term]) {
                return termsListByName[term].id;
            }

            insertTerm(term);

            return term;
        });
    }

    const callOnChangeData = (attribute, value) => {
        if (typeof props.onChangeData === 'function') {
            props.onChangeData(attribute, value);
        }
    }

    const handleEnabledChange = (isChecked) => {
        setEnabled(isChecked);

        if (isChecked) {
            setAction(props.action);
            setDate(props.date);
            setTerms(props.terms);
            setTaxonomy(props.taxonomy);

            fetchTerms();
        }

        callOnChangeData('enabled', isChecked);
    }

    const handleActionChange = (value) => {
        setAction(value);

        callOnChangeData('action', value);
    }

    const handleDateChange = (value) => {
        setDate(value);

        callOnChangeData('date', value);
    }

    const handleTermsChange = (value) => {
        value = mapTermsListByName(value);

        setTerms(value);

        callOnChangeData('terms', value);
    }

    const fetchTerms = () => {
        let termsListByName = {};
        let termsListById = {};

        if (!taxonomy) {
            return;
        }

        setIsFetchingTerms(true);

        apiFetch({
            path: addQueryArgs(`publishpress-future/v1/terms/${taxonomy}`),
        }).then((result) => {
            result.terms.forEach(term => {
                termsListByName[decodeEntities(term.name)] = term;
                termsListById[term.id] = decodeEntities(term.name);
            });

            setTermsListByName(termsListByName);
            setTermsListById(termsListById);
            setTaxonomyName(decodeEntities(result.taxonomyName));
            setIsFetchingTerms(false);
        });
    }

    const storeCalendarIsVisibleOnStorage = (value) => {
        localStorage.setItem('FUTURE_ACTION_CALENDAR_IS_VISIBLE_' + props.context, value ? '1' : '0');
    }

    const getCalendarIsVisibleFromStorage = () => {
        return localStorage.getItem('FUTURE_ACTION_CALENDAR_IS_VISIBLE_' + props.context);
    }

    useEffect(() => {
        if (props.autoEnableAndHideCheckbox)  {
            setEnabled(true);
        } else {
            setEnabled(props.enabled);
        }

        setAction(props.action);
        setDate(props.date);
        setTerms(props.terms);
        setTaxonomy(props.taxonomy);

        if (getCalendarIsVisibleFromStorage() === null) {
            setCalendarIsVisible(props.calendarIsVisible);
        } else {
            setCalendarIsVisible(getCalendarIsVisibleFromStorage() === '1');
        }

        // We need to get the value directly from the props because the value from the store is not updated yet
        if (props.enabled) {
            if (props.isCleanNewPost) {
                // Force populate the default values
                handleEnabledChange(true);
            }

            fetchTerms();
        }
    }, []);

    useEffect(() => {
        storeCalendarIsVisibleOnStorage(calendarIsVisible);
    }, [calendarIsVisible]);

    let selectedTerms = [];
    if (terms && terms.length > 0 && termsListById) {
        selectedTerms = compact(mapTermsListById(terms));

        if (typeof selectedTerms === 'string') {
            selectedTerms = [];
        }
    }

    let termsListByNameKeys = [];
    if (typeof termsListByName === 'object' && termsListByName !== null) {
        termsListByNameKeys = Object.keys(termsListByName);
    }

    const panelClass = calendarIsVisible ? 'future-action-panel' : 'future-action-panel hidden-calendar';
    const contentPanelClass = calendarIsVisible ? 'future-action-panel-content' : 'future-action-panel-content hidden-calendar';
    const datePanelClass = calendarIsVisible ? 'future-action-date-panel' : 'future-action-date-panel hidden-calendar';

    let is24hour;
    if (props.timeFormat === 'inherited') {
        is24hour = ! props.is12Hour;
    } else {
        is24hour = props.timeFormat === '24h';
    }


    const replaceCurlyBracketsWithLink = (string, href, target) => {
        const parts = string.split('{');
        const result = [];

        result.push(parts.shift());

        for (const part of parts) {
            const [before, after] = part.split('}');

            result.push(
                <a href={href} target={target} key={href}>{before}</a>
            );

            result.push(after);
        }

        return result;
    };

    // Remove items from actions list if related to taxonomies and there is no taxonmoy for the post type
    let actionsSelectOptions = props.actionsSelectOptions;
    if (! props.taxonomy) {
        actionsSelectOptions = props.actionsSelectOptions.filter((item) => {
            return ['category', 'category-add', 'category-remove', 'category-remove-all'].indexOf(item.value) === -1;
        });
    }

    const HelpText = replaceCurlyBracketsWithLink(props.strings.timezoneSettingsHelp, '/wp-admin/options-general.php#timezone_string', '_blank');
    const displayTaxonomyField = String(action).includes('category') && action !== 'category-remove-all';

    let termsFieldLabel = taxonomyName;
    switch (action) {
        case 'category':
            termsFieldLabel = props.strings.newTerms.replace('%s', taxonomyName);
            break;
        case 'category-remove':
            termsFieldLabel = props.strings.removeTerms.replace('%s', taxonomyName);
            break;
        case 'category-add':
            termsFieldLabel = props.strings.addTerms.replace('%s', taxonomyName);
            break;
    }

    return (
        <div className={panelClass}>
            {props.autoEnableAndHideCheckbox && (
                <input type="hidden" name={'future_action_enabled'} value={1} />
            )}

            {! props.autoEnableAndHideCheckbox && (
                <PanelRow>
                    <CheckboxControl
                        label={props.strings.enablePostExpiration}
                        checked={enabled || false}
                        onChange={handleEnabledChange}
                    />
                </PanelRow>
            )}

            {enabled && (
                <Fragment>
                    <PanelRow className={contentPanelClass + ' future-action-full-width'}>
                        <SelectControl
                            label={props.strings.action}
                            value={action}
                            options={actionsSelectOptions}
                            onChange={handleActionChange}
                        />
                    </PanelRow>

                    {
                        displayTaxonomyField && (
                            isFetchingTerms && (
                                <PanelRow>
                                    <BaseControl label={taxonomyName}>
                                        {`${props.strings.loading} (${taxonomyName})`}
                                        <Spinner />
                                    </BaseControl>
                                </PanelRow>
                            )
                            || (!taxonomy && (
                                <PanelRow>
                                    <BaseControl label={taxonomyName} className="future-action-warning">
                                        <div>
                                            <i className="dashicons dashicons-warning"></i> {props.strings.noTaxonomyFound}
                                        </div>
                                    </BaseControl>
                                </PanelRow>
                            )
                                || (
                                    termsListByNameKeys.length === 0 && (
                                        <PanelRow>
                                            <BaseControl label={taxonomyName} className="future-action-warning">
                                                <div>
                                                    <i className="dashicons dashicons-warning"></i> {props.strings.noTermsFound}
                                                </div>
                                            </BaseControl>
                                        </PanelRow>
                                    )
                                    || (
                                        <PanelRow className="future-action-full-width">
                                            <BaseControl>
                                                <FormTokenField
                                                    label={termsFieldLabel}
                                                    value={selectedTerms}
                                                    suggestions={termsListByNameKeys}
                                                    onChange={handleTermsChange}
                                                    maxSuggestions={1000}
                                                    __experimentalExpandOnFocus={true}
                                                    __experimentalAutoSelectFirstMatch={true}
                                                />
                                            </BaseControl>
                                        </PanelRow>
                                    )
                                )
                            )
                        )
                    }

                    <PanelRow className={datePanelClass}>
                        <ToggleCalendarDatePicker
                            currentDate={date}
                            onChangeDate={handleDateChange}
                            onToggleCalendar={() => setCalendarIsVisible(!calendarIsVisible)}
                            is12Hour={!is24hour}
                            startOfWeek={props.startOfWeek}
                            isExpanded={calendarIsVisible}
                            strings={props.strings}
                        />
                    </PanelRow>

                    <PanelRow>
                        <div className="future-action-help-text">
                            <hr />

                            <span className="dashicons dashicons-info"></span> {HelpText}
                        </div>
                    </PanelRow>
                </Fragment>
            )}
        </div>
    );
};
