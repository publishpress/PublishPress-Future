import { formatUnixTimeToTimestamp, getCurrentTimeAsTimestamp, normalizeUnixTimeToSeconds } from './time';
import { isNumber } from './utils';
import { register, createReduxStore } from '@wordpress/data';

export const createStore = (props) => {
    if (props.defaultState.terms && typeof props.defaultState.terms === 'string') {
        props.defaultState.terms = props.defaultState.terms.split(',').map(term => parseInt(term));
    }

    let defaultState = {
        postId: props.defaultState.postId ? props.defaultState.postId : 0,
        action: props.defaultState.action,
        date: props.defaultState.date ? props.defaultState.date : getCurrentTimeAsTimestamp(),
        enabled: props.defaultState.autoEnable,
        terms: props.defaultState.terms ? props.defaultState.terms : [],
        taxonomy: props.defaultState.taxonomy ? props.defaultState.taxonomy : null,
        newStatus: props.defaultState.newStatus ? props.defaultState.newStatus : 'draft',
        termsListByName: null,
        termsListById: null,
        taxonomyName: null,
        isFetchingTerms: false,
        changeAction: 'no-change',
        calendarIsVisible: true,
        hasValidData: true,
        extraData: props.defaultState.extraData ? props.defaultState.extraData : {},
    }

    const store = createReduxStore(props.name, {
        reducer(state = defaultState, action) {
            switch (action.type) {
                case 'SET_POST_ID':
                    return {
                        ...state,
                        postId: action.postId,
                    };
                case 'SET_ACTION':
                    return {
                        ...state,
                        action: action.action,
                    };
                case 'SET_NEW_STATUS':
                    return {
                        ...state,
                        newStatus: action.newStatus,
                    };
                case 'SET_DATE':
                    // Make sure the date is a number, if it is a string with only numbers
                    if (typeof action.date !== 'number' && isNumber(action.date)) {
                        action.date = parseInt(action.date);
                    }

                    // If string, convert to unix time
                    if (typeof action.date === 'string') {
                        action.date = new Date(action.date).getTime();
                    }

                    // Make sure the time is always in seconds
                    action.date = normalizeUnixTimeToSeconds(action.date);

                    // Convert to formated string format, considering it is in the site's timezone
                    action.date = formatUnixTimeToTimestamp(action.date);

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
                case 'SET_CHANGE_ACTION':
                    return {
                        ...state,
                        changeAction: action.changeAction,
                    }
                case 'SET_CALENDAR_IS_VISIBLE':
                    return {
                        ...state,
                        calendarIsVisible: action.calendarIsVisible,
                    }
                case 'SET_HAS_VALID_DATA':
                    return {
                        ...state,
                        hasValidData: action.hasValidData,
                    }

                case 'SET_EXTRA_DATA':
                    return {
                        ...state,
                        extraData: {
                            ...action.extraData,
                        }
                    }

                case 'SET_EXTRA_DATA_BY_NAME':
                    const extraData = {
                        ...state.extraData,
                        [action.name]: action.value
                    };

                    return {
                        ...state,
                        extraData: {...extraData}
                    }
            }

            return state;
        },
        actions: {
            setPostId(postId) {
                return {
                    type: 'SET_POST_ID',
                    postId: postId
                };
            },
            setAction(action) {
                return {
                    type: 'SET_ACTION',
                    action: action
                };
            },
            setNewStatus(newStatus) {
                return {
                    type: 'SET_NEW_STATUS',
                    newStatus: newStatus
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
            },
            setChangeAction(changeAction) {
                return {
                    type: 'SET_CHANGE_ACTION',
                    changeAction: changeAction
                }
            },
            setCalendarIsVisible(calendarIsVisible) {
                return {
                    type: 'SET_CALENDAR_IS_VISIBLE',
                    calendarIsVisible: calendarIsVisible
                }
            },
            setHasValidData(hasValidData) {
                return {
                    type: 'SET_HAS_VALID_DATA',
                    hasValidData: hasValidData
                }
            },
            setExtraData(extraData) {
                return {
                    type: 'SET_EXTRA_DATA',
                    extraData: extraData
                }
            },
            setExtraDataByName(name, value) {
                return {
                    type: 'SET_EXTRA_DATA_BY_NAME',
                    name: name,
                    value: value
                }
            }
        },
        selectors: {
            getPostId(state) {
                return state.postId;
            },
            getAction(state) {
                return state.action;
            },
            getNewStatus(state) {
                return state.newStatus;
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
            },
            getChangeAction(state) {
                return state.changeAction;
            },
            getCalendarIsVisible(state) {
                return state.calendarIsVisible;
            },
            getHasValidData(state) {
                return state.hasValidData;
            },
            getExtraData(state) {
                return state.extraData;
            },
            getExtraDataByName(state, name) {
                return state.extraData[name] || null;
            }
        }
    });

    register(store);

    return store;
}
