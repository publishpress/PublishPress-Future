import { getCurrentTimeAsTimestamp } from './time';

export const createStore = (props) => {
    const {
        register,
        createReduxStore,
    } = wp.data;


    if (props.defaultState.terms && typeof props.defaultState.terms === 'string') {
        props.defaultState.terms = props.defaultState.terms.split(',').map(term => parseInt(term));
    }

    let defaultState = {
        action: props.defaultState.action,
        date: props.defaultState.date ? props.defaultState.date : getCurrentTimeAsTimestamp(),
        enabled: props.defaultState.autoEnable,
        terms: props.defaultState.terms ? props.defaultState.terms : [],
        taxonomy: props.defaultState.taxonomy ? props.defaultState.taxonomy : null,
        termsListByName: null,
        termsListById: null,
        taxonomyName: null,
        isFetchingTerms: false,
    }

    const store = createReduxStore(props.name, {
        reducer(state = defaultState, action) {
            switch (action.type) {
                case 'SET_ACTION':
                    return {
                        ...state,
                        action: action.action,
                    };
                case 'SET_DATE':
                    return {
                        ...state,
                        date: action.date,
                    }
                case 'SET_ENABLED':
                    return {
                        ...state,
                        enabled: action.enabled,
                    }
                case 'SET_TERMS':
                    return {
                        ...state,
                        terms: action.terms,
                    }
                case 'SET_TAXONOMY':
                    return {
                        ...state,
                        taxonomy: action.taxonomy,
                    }
                case 'SET_TERMS_LIST_BY_NAME':
                    return {
                        ...state,
                        termsListByName: action.termsListByName,
                    }
                case 'SET_TERMS_LIST_BY_ID':
                    return {
                        ...state,
                        termsListById: action.termsListById,
                    }
                case 'SET_TAXONOMY_NAME':
                    return {
                        ...state,
                        taxonomyName: action.taxonomyName,
                    }
            }

            return state;
        },
        actions: {
            setAction(action) {
                return {
                    type: 'SET_ACTION',
                    action: action
                };
            },
            setDate(date) {
                return {
                    type: 'SET_DATE',
                    date: date
                };
            },
            setEnabled(enabled) {
                return {
                    type: 'SET_ENABLED',
                    enabled: enabled
                };
            },
            setTerms(terms) {
                return {
                    type: 'SET_TERMS',
                    terms: terms
                };
            },
            setTaxonomy(taxonomy) {
                return {
                    type: 'SET_TAXONOMY',
                    taxonomy: taxonomy
                };
            },
            setTermsListByName(termsListByName) {
                return {
                    type: 'SET_TERMS_LIST_BY_NAME',
                    termsListByName: termsListByName
                };
            },
            setTermsListById(termsListById) {
                return {
                    type: 'SET_TERMS_LIST_BY_ID',
                    termsListById: termsListById
                };
            },
            setTaxonomyName(taxonomyName) {
                return {
                    type: 'SET_TAXONOMY_NAME',
                    taxonomyName: taxonomyName
                };
            },
            setIsFetchingTerms(isFetchingTerms) {
                return {
                    type: 'SET_IS_FETCHING_TERMS',
                    isFetchingTerms: isFetchingTerms
                }
            }
        },
        selectors: {
            getAction(state) {
                return state.action;
            },
            getDate(state) {
                return state.date;
            },
            getEnabled(state) {
                return state.enabled;
            },
            getTerms(state) {
                return state.terms;
            },
            getTaxonomy(state) {
                return state.taxonomy;
            },
            getTermsListByName(state) {
                return state.termsListByName;
            },
            getTermsListById(state) {
                return state.termsListById;
            },
            getTaxonomyName(state) {
                return state.taxonomyName;
            },
            getIsFetchingTerms(state) {
                return state.isFetchingTerms;
            }
        }
    });

    register(store);

    return store;
}
