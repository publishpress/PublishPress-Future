/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/compose/build-module/higher-order/compose.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/higher-order/compose.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pipe */ "./node_modules/@wordpress/compose/build-module/higher-order/pipe.js");
/**
 * Internal dependencies
 */


/**
 * Composes multiple higher-order components into a single higher-order component. Performs right-to-left function
 * composition, where each successive invocation is supplied the return value of the previous.
 *
 * This is inspired by `lodash`'s `flowRight` function.
 *
 * @see https://docs-lodash.com/v4/flow-right/
 */
const compose = (0,_pipe__WEBPACK_IMPORTED_MODULE_0__.basePipe)(true);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (compose);
//# sourceMappingURL=compose.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/higher-order/if-condition/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/higher-order/if-condition/index.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_create_higher_order_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/create-higher-order-component */ "./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js");

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


/**
 * Higher-order component creator, creating a new component which renders if
 * the given condition is satisfied or with the given optional prop name.
 *
 * @example
 * ```ts
 * type Props = { foo: string };
 * const Component = ( props: Props ) => <div>{ props.foo }</div>;
 * const ConditionalComponent = ifCondition( ( props: Props ) => props.foo.length !== 0 )( Component );
 * <ConditionalComponent foo="" />; // => null
 * <ConditionalComponent foo="bar" />; // => <div>bar</div>;
 * ```
 *
 * @param predicate Function to test condition.
 *
 * @return Higher-order component.
 */
function ifCondition(predicate) {
  return (0,_utils_create_higher_order_component__WEBPACK_IMPORTED_MODULE_1__.createHigherOrderComponent)(WrappedComponent => props => {
    if (!predicate(props)) {
      return null;
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(WrappedComponent, {
      ...props
    });
  }, 'ifCondition');
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ifCondition);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/higher-order/pipe.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/higher-order/pipe.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basePipe: () => (/* binding */ basePipe),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Parts of this source were derived and modified from lodash,
 * released under the MIT license.
 *
 * https://github.com/lodash/lodash
 *
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 *
 * Based on Underscore.js, copyright Jeremy Ashkenas,
 * DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/lodash/lodash
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * ====
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Creates a pipe function.
 *
 * Allows to choose whether to perform left-to-right or right-to-left composition.
 *
 * @see https://docs-lodash.com/v4/flow/
 *
 * @param {boolean} reverse True if right-to-left, false for left-to-right composition.
 */
const basePipe = (reverse = false) => (...funcs) => (...args) => {
  const functions = funcs.flat();
  if (reverse) {
    functions.reverse();
  }
  return functions.reduce((prev, func) => [func(...prev)], args)[0];
};

/**
 * Composes multiple higher-order components into a single higher-order component. Performs left-to-right function
 * composition, where each successive invocation is supplied the return value of the previous.
 *
 * This is inspired by `lodash`'s `flow` function.
 *
 * @see https://docs-lodash.com/v4/flow/
 */
const pipe = basePipe();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pipe);
//# sourceMappingURL=pipe.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/higher-order/pure/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/higher-order/pure/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/is-shallow-equal */ "./node_modules/@wordpress/is-shallow-equal/build-module/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_create_higher_order_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/create-higher-order-component */ "./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


/**
 * Given a component returns the enhanced component augmented with a component
 * only re-rendering when its props/state change
 *
 * @deprecated Use `memo` or `PureComponent` instead.
 */
const pure = (0,_utils_create_higher_order_component__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(function (WrappedComponent) {
  if (WrappedComponent.prototype instanceof _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Component) {
    return class extends WrappedComponent {
      shouldComponentUpdate(nextProps, nextState) {
        return !(0,_wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_3__["default"])(nextProps, this.props) || !(0,_wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_3__["default"])(nextState, this.state);
      }
    };
  }
  return class extends _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Component {
    shouldComponentUpdate(nextProps) {
      return !(0,_wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_3__["default"])(nextProps, this.props);
    }
    render() {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(WrappedComponent, {
        ...this.props
      });
    }
  };
}, 'pure');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pure);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/hooks/use-media-query/index.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/hooks/use-media-query/index.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useMediaQuery)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * A new MediaQueryList object for the media query
 *
 * @param {string} [query] Media Query.
 * @return {MediaQueryList|null} A new object for the media query
 */
function getMediaQueryList(query) {
  if (query && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia(query);
  }
  return null;
}

/**
 * Runs a media query and returns its value when it changes.
 *
 * @param {string} [query] Media Query.
 * @return {boolean} return value of the media query.
 */
function useMediaQuery(query) {
  const source = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const mediaQueryList = getMediaQueryList(query);
    return {
      /** @type {(onStoreChange: () => void) => () => void} */
      subscribe(onStoreChange) {
        if (!mediaQueryList) {
          return () => {};
        }

        // Avoid a fatal error when browsers don't support `addEventListener` on MediaQueryList.
        mediaQueryList.addEventListener?.('change', onStoreChange);
        return () => {
          mediaQueryList.removeEventListener?.('change', onStoreChange);
        };
      },
      getValue() {
        var _mediaQueryList$match;
        return (_mediaQueryList$match = mediaQueryList?.matches) !== null && _mediaQueryList$match !== void 0 ? _mediaQueryList$match : false;
      }
    };
  }, [query]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore)(source.subscribe, source.getValue, () => false);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/hooks/use-merge-refs/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/hooks/use-merge-refs/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useMergeRefs)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/* eslint-disable jsdoc/valid-types */
/**
 * @template T
 * @typedef {T extends import('react').Ref<infer R> ? R : never} TypeFromRef
 */
/* eslint-enable jsdoc/valid-types */

/**
 * @template T
 * @param {import('react').Ref<T>} ref
 * @param {T}                      value
 */
function assignRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && ref.hasOwnProperty('current')) {
    /* eslint-disable jsdoc/no-undefined-types */
    /** @type {import('react').MutableRefObject<T>} */ref.current = value;
    /* eslint-enable jsdoc/no-undefined-types */
  }
}

/**
 * Merges refs into one ref callback.
 *
 * It also ensures that the merged ref callbacks are only called when they
 * change (as a result of a `useCallback` dependency update) OR when the ref
 * value changes, just as React does when passing a single ref callback to the
 * component.
 *
 * As expected, if you pass a new function on every render, the ref callback
 * will be called after every render.
 *
 * If you don't wish a ref callback to be called after every render, wrap it
 * with `useCallback( callback, dependencies )`. When a dependency changes, the
 * old ref callback will be called with `null` and the new ref callback will be
 * called with the same value.
 *
 * To make ref callbacks easier to use, you can also pass the result of
 * `useRefEffect`, which makes cleanup easier by allowing you to return a
 * cleanup function instead of handling `null`.
 *
 * It's also possible to _disable_ a ref (and its behaviour) by simply not
 * passing the ref.
 *
 * ```jsx
 * const ref = useRefEffect( ( node ) => {
 *   node.addEventListener( ... );
 *   return () => {
 *     node.removeEventListener( ... );
 *   };
 * }, [ ...dependencies ] );
 * const otherRef = useRef();
 * const mergedRefs useMergeRefs( [
 *   enabled && ref,
 *   otherRef,
 * ] );
 * return <div ref={ mergedRefs } />;
 * ```
 *
 * @template {import('react').Ref<any>} TRef
 * @param {Array<TRef>} refs The refs to be merged.
 *
 * @return {import('react').RefCallback<TypeFromRef<TRef>>} The merged ref callback.
 */
function useMergeRefs(refs) {
  const element = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const isAttached = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const didElementChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  /* eslint-disable jsdoc/no-undefined-types */
  /** @type {import('react').MutableRefObject<TRef[]>} */
  /* eslint-enable jsdoc/no-undefined-types */
  const previousRefs = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  const currentRefs = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(refs);

  // Update on render before the ref callback is called, so the ref callback
  // always has access to the current refs.
  currentRefs.current = refs;

  // If any of the refs change, call the previous ref with `null` and the new
  // ref with the node, except when the element changes in the same cycle, in
  // which case the ref callbacks will already have been called.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    if (didElementChange.current === false && isAttached.current === true) {
      refs.forEach((ref, index) => {
        const previousRef = previousRefs.current[index];
        if (ref !== previousRef) {
          assignRef(previousRef, null);
          assignRef(ref, element.current);
        }
      });
    }
    previousRefs.current = refs;
  }, refs);

  // No dependencies, must be reset after every render so ref callbacks are
  // correctly called after a ref change.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    didElementChange.current = false;
  });

  // There should be no dependencies so that `callback` is only called when
  // the node changes.
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(value => {
    // Update the element so it can be used when calling ref callbacks on a
    // dependency change.
    assignRef(element, value);
    didElementChange.current = true;
    isAttached.current = value !== null;

    // When an element changes, the current ref callback should be called
    // with the new element and the previous one with `null`.
    const refsToAssign = value ? currentRefs.current : previousRefs.current;

    // Update the latest refs.
    for (const ref of refsToAssign) {
      assignRef(ref, value);
    }
  }, []);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/hooks/use-viewport-match/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/hooks/use-viewport-match/index.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _use_media_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-media-query */ "./node_modules/@wordpress/compose/build-module/hooks/use-media-query/index.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


/**
 * @typedef {"huge" | "wide" | "large" | "medium" | "small" | "mobile"} WPBreakpoint
 */

/**
 * Hash of breakpoint names with pixel width at which it becomes effective.
 *
 * @see _breakpoints.scss
 *
 * @type {Record<WPBreakpoint, number>}
 */
const BREAKPOINTS = {
  huge: 1440,
  wide: 1280,
  large: 960,
  medium: 782,
  small: 600,
  mobile: 480
};

/**
 * @typedef {">=" | "<"} WPViewportOperator
 */

/**
 * Object mapping media query operators to the condition to be used.
 *
 * @type {Record<WPViewportOperator, string>}
 */
const CONDITIONS = {
  '>=': 'min-width',
  '<': 'max-width'
};

/**
 * Object mapping media query operators to a function that given a breakpointValue and a width evaluates if the operator matches the values.
 *
 * @type {Record<WPViewportOperator, (breakpointValue: number, width: number) => boolean>}
 */
const OPERATOR_EVALUATORS = {
  '>=': (breakpointValue, width) => width >= breakpointValue,
  '<': (breakpointValue, width) => width < breakpointValue
};
const ViewportMatchWidthContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)( /** @type {null | number} */null);

/**
 * Returns true if the viewport matches the given query, or false otherwise.
 *
 * @param {WPBreakpoint}       breakpoint      Breakpoint size name.
 * @param {WPViewportOperator} [operator=">="] Viewport operator.
 *
 * @example
 *
 * ```js
 * useViewportMatch( 'huge', '<' );
 * useViewportMatch( 'medium' );
 * ```
 *
 * @return {boolean} Whether viewport matches query.
 */
const useViewportMatch = (breakpoint, operator = '>=') => {
  const simulatedWidth = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(ViewportMatchWidthContext);
  const mediaQuery = !simulatedWidth && `(${CONDITIONS[operator]}: ${BREAKPOINTS[breakpoint]}px)`;
  const mediaQueryResult = (0,_use_media_query__WEBPACK_IMPORTED_MODULE_1__["default"])(mediaQuery || undefined);
  if (simulatedWidth) {
    return OPERATOR_EVALUATORS[operator](BREAKPOINTS[breakpoint], simulatedWidth);
  }
  return mediaQueryResult;
};
useViewportMatch.__experimentalWidthProvider = ViewportMatchWidthContext.Provider;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useViewportMatch);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHigherOrderComponent: () => (/* binding */ createHigherOrderComponent)
/* harmony export */ });
/* harmony import */ var change_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! change-case */ "./node_modules/pascal-case/dist.es2015/index.js");
/**
 * External dependencies
 */

/**
 * Given a function mapping a component to an enhanced component and modifier
 * name, returns the enhanced component augmented with a generated displayName.
 *
 * @param mapComponent Function mapping component to enhanced component.
 * @param modifierName Seed name from which to generated display name.
 *
 * @return Component class with generated display name assigned.
 */
function createHigherOrderComponent(mapComponent, modifierName) {
  return Inner => {
    const Outer = mapComponent(Inner);
    Outer.displayName = hocName(modifierName, Inner);
    return Outer;
  };
}

/**
 * Returns a displayName for a higher-order component, given a wrapper name.
 *
 * @example
 *     hocName( 'MyMemo', Widget ) === 'MyMemo(Widget)';
 *     hocName( 'MyMemo', <div /> ) === 'MyMemo(Component)';
 *
 * @param name  Name assigned to higher-order component's wrapper component.
 * @param Inner Wrapped component inside higher-order component.
 * @return       Wrapped name of higher-order component.
 */
const hocName = (name, Inner) => {
  const inner = Inner.displayName || Inner.name || 'Component';
  const outer = (0,change_case__WEBPACK_IMPORTED_MODULE_0__.pascalCase)(name !== null && name !== void 0 ? name : '');
  return `${outer}(${inner})`;
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/compose/build-module/utils/debounce/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/compose/build-module/utils/debounce/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: () => (/* binding */ debounce)
/* harmony export */ });
/**
 * Parts of this source were derived and modified from lodash,
 * released under the MIT license.
 *
 * https://github.com/lodash/lodash
 *
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 *
 * Based on Underscore.js, copyright Jeremy Ashkenas,
 * DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/lodash/lodash
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * ====
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * A simplified and properly typed version of lodash's `debounce`, that
 * always uses timers instead of sometimes using rAF.
 *
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel delayed
 * `func` invocations and a `flush` method to immediately invoke them. Provide
 * `options` to indicate whether `func` should be invoked on the leading and/or
 * trailing edge of the `wait` timeout. The `func` is invoked with the last
 * arguments provided to the debounced function. Subsequent calls to the debounced
 * function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * @param {Function}                   func             The function to debounce.
 * @param {number}                     wait             The number of milliseconds to delay.
 * @param {Partial< DebounceOptions >} options          The options object.
 * @param {boolean}                    options.leading  Specify invoking on the leading edge of the timeout.
 * @param {number}                     options.maxWait  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean}                    options.trailing Specify invoking on the trailing edge of the timeout.
 *
 * @return Returns the new debounced function.
 */
const debounce = (func, wait, options) => {
  let lastArgs;
  let lastThis;
  let maxWait = 0;
  let result;
  let timerId;
  let lastCallTime;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  if (options) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    if (options.maxWait !== undefined) {
      maxWait = Math.max(options.maxWait, wait);
    }
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function startTimer(pendingFunc, waitTime) {
    timerId = setTimeout(pendingFunc, waitTime);
  }
  function cancelTimer() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  }
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }
  function getTimeSinceLastCall(time) {
    return time - (lastCallTime || 0);
  }
  function remainingWait(time) {
    const timeSinceLastCall = getTimeSinceLastCall(time);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = getTimeSinceLastCall(time);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    startTimer(timerExpired, remainingWait(time));
    return undefined;
  }
  function clearTimer() {
    timerId = undefined;
  }
  function trailingEdge(time) {
    clearTimer();

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  function cancel() {
    cancelTimer();
    lastInvokeTime = 0;
    clearTimer();
    lastArgs = lastCallTime = lastThis = undefined;
  }
  function flush() {
    return pending() ? trailingEdge(Date.now()) : result;
  }
  function pending() {
    return timerId !== undefined;
  }
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (!pending()) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (!pending()) {
      startTimer(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/deprecated/build-module/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/deprecated/build-module/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ deprecated),
/* harmony export */   logged: () => (/* binding */ logged)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "./node_modules/@wordpress/hooks/build-module/index.js");
/**
 * WordPress dependencies
 */


/**
 * Object map tracking messages which have been logged, for use in ensuring a
 * message is only logged once.
 *
 * @type {Record<string, true | undefined>}
 */
const logged = Object.create(null);

/**
 * Logs a message to notify developers about a deprecated feature.
 *
 * @param {string} feature               Name of the deprecated feature.
 * @param {Object} [options]             Personalisation options
 * @param {string} [options.since]       Version in which the feature was deprecated.
 * @param {string} [options.version]     Version in which the feature will be removed.
 * @param {string} [options.alternative] Feature to use instead
 * @param {string} [options.plugin]      Plugin name if it's a plugin feature
 * @param {string} [options.link]        Link to documentation
 * @param {string} [options.hint]        Additional message to help transition away from the deprecated feature.
 *
 * @example
 * ```js
 * import deprecated from '@wordpress/deprecated';
 *
 * deprecated( 'Eating meat', {
 * 	since: '2019.01.01'
 * 	version: '2020.01.01',
 * 	alternative: 'vegetables',
 * 	plugin: 'the earth',
 * 	hint: 'You may find it beneficial to transition gradually.',
 * } );
 *
 * // Logs: 'Eating meat is deprecated since version 2019.01.01 and will be removed from the earth in version 2020.01.01. Please use vegetables instead. Note: You may find it beneficial to transition gradually.'
 * ```
 */
function deprecated(feature, options = {}) {
  const {
    since,
    version,
    alternative,
    plugin,
    link,
    hint
  } = options;
  const pluginMessage = plugin ? ` from ${plugin}` : '';
  const sinceMessage = since ? ` since version ${since}` : '';
  const versionMessage = version ? ` and will be removed${pluginMessage} in version ${version}` : '';
  const useInsteadMessage = alternative ? ` Please use ${alternative} instead.` : '';
  const linkMessage = link ? ` See: ${link}` : '';
  const hintMessage = hint ? ` Note: ${hint}` : '';
  const message = `${feature} is deprecated${sinceMessage}${versionMessage}.${useInsteadMessage}${linkMessage}${hintMessage}`;

  // Skip if already logged.
  if (message in logged) {
    return;
  }

  /**
   * Fires whenever a deprecated feature is encountered
   *
   * @param {string}  feature             Name of the deprecated feature.
   * @param {?Object} options             Personalisation options
   * @param {string}  options.since       Version in which the feature was deprecated.
   * @param {?string} options.version     Version in which the feature will be removed.
   * @param {?string} options.alternative Feature to use instead
   * @param {?string} options.plugin      Plugin name if it's a plugin feature
   * @param {?string} options.link        Link to documentation
   * @param {?string} options.hint        Additional message to help transition away from the deprecated feature.
   * @param {?string} message             Message sent to console.warn
   */
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.doAction)('deprecated', feature, options, message);

  // eslint-disable-next-line no-console
  console.warn(message);
  logged[message] = true;
}

/** @typedef {import('utility-types').NonUndefined<Parameters<typeof deprecated>[1]>} DeprecatedOptions */
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createAddHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createAddHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validateNamespace.js */ "./node_modules/@wordpress/hooks/build-module/validateNamespace.js");
/* harmony import */ var _validateHookName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./validateHookName.js */ "./node_modules/@wordpress/hooks/build-module/validateHookName.js");
/**
 * Internal dependencies
 */



/**
 * @callback AddHook
 *
 * Adds the hook to the appropriate hooks container.
 *
 * @param {string}               hookName      Name of hook to add
 * @param {string}               namespace     The unique namespace identifying the callback in the form `vendor/plugin/function`.
 * @param {import('.').Callback} callback      Function to call when the hook is run
 * @param {number}               [priority=10] Priority of this hook
 */

/**
 * Returns a function which, when invoked, will add a hook.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {AddHook} Function that adds a new hook.
 */
function createAddHook(hooks, storeKey) {
  return function addHook(hookName, namespace, callback, priority = 10) {
    const hooksStore = hooks[storeKey];
    if (!(0,_validateHookName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(hookName)) {
      return;
    }
    if (!(0,_validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace)) {
      return;
    }
    if ('function' !== typeof callback) {
      // eslint-disable-next-line no-console
      console.error('The hook callback must be a function.');
      return;
    }

    // Validate numeric priority
    if ('number' !== typeof priority) {
      // eslint-disable-next-line no-console
      console.error('If specified, the hook priority must be a number.');
      return;
    }
    const handler = {
      callback,
      priority,
      namespace
    };
    if (hooksStore[hookName]) {
      // Find the correct insert index of the new hook.
      const handlers = hooksStore[hookName].handlers;

      /** @type {number} */
      let i;
      for (i = handlers.length; i > 0; i--) {
        if (priority >= handlers[i - 1].priority) {
          break;
        }
      }
      if (i === handlers.length) {
        // If append, operate via direct assignment.
        handlers[i] = handler;
      } else {
        // Otherwise, insert before index via splice.
        handlers.splice(i, 0, handler);
      }

      // We may also be currently executing this hook.  If the callback
      // we're adding would come after the current callback, there's no
      // problem; otherwise we need to increase the execution index of
      // any other runs by 1 to account for the added element.
      hooksStore.__current.forEach(hookInfo => {
        if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
          hookInfo.currentIndex++;
        }
      });
    } else {
      // This is the first hook of its type.
      hooksStore[hookName] = {
        handlers: [handler],
        runs: 0
      };
    }
    if (hookName !== 'hookAdded') {
      hooks.doAction('hookAdded', hookName, namespace, callback, priority);
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAddHook);
//# sourceMappingURL=createAddHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createCurrentHook.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createCurrentHook.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Returns a function which, when invoked, will return the name of the
 * currently running hook, or `null` if no hook of the given type is currently
 * running.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {() => string | null} Function that returns the current hook name or null.
 */
function createCurrentHook(hooks, storeKey) {
  return function currentHook() {
    var _hooksStore$__current;
    const hooksStore = hooks[storeKey];
    return (_hooksStore$__current = hooksStore.__current[hooksStore.__current.length - 1]?.name) !== null && _hooksStore$__current !== void 0 ? _hooksStore$__current : null;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCurrentHook);
//# sourceMappingURL=createCurrentHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createDidHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createDidHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validateHookName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validateHookName.js */ "./node_modules/@wordpress/hooks/build-module/validateHookName.js");
/**
 * Internal dependencies
 */


/**
 * @callback DidHook
 *
 * Returns the number of times an action has been fired.
 *
 * @param {string} hookName The hook name to check.
 *
 * @return {number | undefined} The number of times the hook has run.
 */

/**
 * Returns a function which, when invoked, will return the number of times a
 * hook has been called.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {DidHook} Function that returns a hook's call count.
 */
function createDidHook(hooks, storeKey) {
  return function didHook(hookName) {
    const hooksStore = hooks[storeKey];
    if (!(0,_validateHookName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(hookName)) {
      return;
    }
    return hooksStore[hookName] && hooksStore[hookName].runs ? hooksStore[hookName].runs : 0;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createDidHook);
//# sourceMappingURL=createDidHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createDoingHook.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createDoingHook.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @callback DoingHook
 * Returns whether a hook is currently being executed.
 *
 * @param {string} [hookName] The name of the hook to check for.  If
 *                            omitted, will check for any hook being executed.
 *
 * @return {boolean} Whether the hook is being executed.
 */

/**
 * Returns a function which, when invoked, will return whether a hook is
 * currently being executed.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {DoingHook} Function that returns whether a hook is currently
 *                     being executed.
 */
function createDoingHook(hooks, storeKey) {
  return function doingHook(hookName) {
    const hooksStore = hooks[storeKey];

    // If the hookName was not passed, check for any current hook.
    if ('undefined' === typeof hookName) {
      return 'undefined' !== typeof hooksStore.__current[0];
    }

    // Return the __current hook.
    return hooksStore.__current[0] ? hookName === hooksStore.__current[0].name : false;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createDoingHook);
//# sourceMappingURL=createDoingHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createHasHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createHasHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @callback HasHook
 *
 * Returns whether any handlers are attached for the given hookName and optional namespace.
 *
 * @param {string} hookName    The name of the hook to check for.
 * @param {string} [namespace] Optional. The unique namespace identifying the callback
 *                             in the form `vendor/plugin/function`.
 *
 * @return {boolean} Whether there are handlers that are attached to the given hook.
 */
/**
 * Returns a function which, when invoked, will return whether any handlers are
 * attached to a particular hook.
 *
 * @param {import('.').Hooks}    hooks    Hooks instance.
 * @param {import('.').StoreKey} storeKey
 *
 * @return {HasHook} Function that returns whether any handlers are
 *                   attached to a particular hook and optional namespace.
 */
function createHasHook(hooks, storeKey) {
  return function hasHook(hookName, namespace) {
    const hooksStore = hooks[storeKey];

    // Use the namespace if provided.
    if ('undefined' !== typeof namespace) {
      return hookName in hooksStore && hooksStore[hookName].handlers.some(hook => hook.namespace === namespace);
    }
    return hookName in hooksStore;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createHasHook);
//# sourceMappingURL=createHasHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createHooks.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createHooks.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _Hooks: () => (/* binding */ _Hooks),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createAddHook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createAddHook */ "./node_modules/@wordpress/hooks/build-module/createAddHook.js");
/* harmony import */ var _createRemoveHook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createRemoveHook */ "./node_modules/@wordpress/hooks/build-module/createRemoveHook.js");
/* harmony import */ var _createHasHook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createHasHook */ "./node_modules/@wordpress/hooks/build-module/createHasHook.js");
/* harmony import */ var _createRunHook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createRunHook */ "./node_modules/@wordpress/hooks/build-module/createRunHook.js");
/* harmony import */ var _createCurrentHook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createCurrentHook */ "./node_modules/@wordpress/hooks/build-module/createCurrentHook.js");
/* harmony import */ var _createDoingHook__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createDoingHook */ "./node_modules/@wordpress/hooks/build-module/createDoingHook.js");
/* harmony import */ var _createDidHook__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./createDidHook */ "./node_modules/@wordpress/hooks/build-module/createDidHook.js");
/**
 * Internal dependencies
 */








/**
 * Internal class for constructing hooks. Use `createHooks()` function
 *
 * Note, it is necessary to expose this class to make its type public.
 *
 * @private
 */
class _Hooks {
  constructor() {
    /** @type {import('.').Store} actions */
    this.actions = Object.create(null);
    this.actions.__current = [];

    /** @type {import('.').Store} filters */
    this.filters = Object.create(null);
    this.filters.__current = [];
    this.addAction = (0,_createAddHook__WEBPACK_IMPORTED_MODULE_0__["default"])(this, 'actions');
    this.addFilter = (0,_createAddHook__WEBPACK_IMPORTED_MODULE_0__["default"])(this, 'filters');
    this.removeAction = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'actions');
    this.removeFilter = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'filters');
    this.hasAction = (0,_createHasHook__WEBPACK_IMPORTED_MODULE_2__["default"])(this, 'actions');
    this.hasFilter = (0,_createHasHook__WEBPACK_IMPORTED_MODULE_2__["default"])(this, 'filters');
    this.removeAllActions = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'actions', true);
    this.removeAllFilters = (0,_createRemoveHook__WEBPACK_IMPORTED_MODULE_1__["default"])(this, 'filters', true);
    this.doAction = (0,_createRunHook__WEBPACK_IMPORTED_MODULE_3__["default"])(this, 'actions');
    this.applyFilters = (0,_createRunHook__WEBPACK_IMPORTED_MODULE_3__["default"])(this, 'filters', true);
    this.currentAction = (0,_createCurrentHook__WEBPACK_IMPORTED_MODULE_4__["default"])(this, 'actions');
    this.currentFilter = (0,_createCurrentHook__WEBPACK_IMPORTED_MODULE_4__["default"])(this, 'filters');
    this.doingAction = (0,_createDoingHook__WEBPACK_IMPORTED_MODULE_5__["default"])(this, 'actions');
    this.doingFilter = (0,_createDoingHook__WEBPACK_IMPORTED_MODULE_5__["default"])(this, 'filters');
    this.didAction = (0,_createDidHook__WEBPACK_IMPORTED_MODULE_6__["default"])(this, 'actions');
    this.didFilter = (0,_createDidHook__WEBPACK_IMPORTED_MODULE_6__["default"])(this, 'filters');
  }
}

/** @typedef {_Hooks} Hooks */

/**
 * Returns an instance of the hooks object.
 *
 * @return {Hooks} A Hooks instance.
 */
function createHooks() {
  return new _Hooks();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createHooks);
//# sourceMappingURL=createHooks.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createRemoveHook.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createRemoveHook.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validateNamespace.js */ "./node_modules/@wordpress/hooks/build-module/validateNamespace.js");
/* harmony import */ var _validateHookName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./validateHookName.js */ "./node_modules/@wordpress/hooks/build-module/validateHookName.js");
/**
 * Internal dependencies
 */



/**
 * @callback RemoveHook
 * Removes the specified callback (or all callbacks) from the hook with a given hookName
 * and namespace.
 *
 * @param {string} hookName  The name of the hook to modify.
 * @param {string} namespace The unique namespace identifying the callback in the
 *                           form `vendor/plugin/function`.
 *
 * @return {number | undefined} The number of callbacks removed.
 */

/**
 * Returns a function which, when invoked, will remove a specified hook or all
 * hooks by the given name.
 *
 * @param {import('.').Hooks}    hooks             Hooks instance.
 * @param {import('.').StoreKey} storeKey
 * @param {boolean}              [removeAll=false] Whether to remove all callbacks for a hookName,
 *                                                 without regard to namespace. Used to create
 *                                                 `removeAll*` functions.
 *
 * @return {RemoveHook} Function that removes hooks.
 */
function createRemoveHook(hooks, storeKey, removeAll = false) {
  return function removeHook(hookName, namespace) {
    const hooksStore = hooks[storeKey];
    if (!(0,_validateHookName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(hookName)) {
      return;
    }
    if (!removeAll && !(0,_validateNamespace_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace)) {
      return;
    }

    // Bail if no hooks exist by this name.
    if (!hooksStore[hookName]) {
      return 0;
    }
    let handlersRemoved = 0;
    if (removeAll) {
      handlersRemoved = hooksStore[hookName].handlers.length;
      hooksStore[hookName] = {
        runs: hooksStore[hookName].runs,
        handlers: []
      };
    } else {
      // Try to find the specified callback to remove.
      const handlers = hooksStore[hookName].handlers;
      for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].namespace === namespace) {
          handlers.splice(i, 1);
          handlersRemoved++;
          // This callback may also be part of a hook that is
          // currently executing.  If the callback we're removing
          // comes after the current callback, there's no problem;
          // otherwise we need to decrease the execution index of any
          // other runs by 1 to account for the removed element.
          hooksStore.__current.forEach(hookInfo => {
            if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
              hookInfo.currentIndex--;
            }
          });
        }
      }
    }
    if (hookName !== 'hookRemoved') {
      hooks.doAction('hookRemoved', hookName, namespace);
    }
    return handlersRemoved;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRemoveHook);
//# sourceMappingURL=createRemoveHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/createRunHook.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/createRunHook.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Returns a function which, when invoked, will execute all callbacks
 * registered to a hook of the specified type, optionally returning the final
 * value of the call chain.
 *
 * @param {import('.').Hooks}    hooks                  Hooks instance.
 * @param {import('.').StoreKey} storeKey
 * @param {boolean}              [returnFirstArg=false] Whether each hook callback is expected to
 *                                                      return its first argument.
 *
 * @return {(hookName:string, ...args: unknown[]) => undefined|unknown} Function that runs hook callbacks.
 */
function createRunHook(hooks, storeKey, returnFirstArg = false) {
  return function runHooks(hookName, ...args) {
    const hooksStore = hooks[storeKey];
    if (!hooksStore[hookName]) {
      hooksStore[hookName] = {
        handlers: [],
        runs: 0
      };
    }
    hooksStore[hookName].runs++;
    const handlers = hooksStore[hookName].handlers;

    // The following code is stripped from production builds.
    if (true) {
      // Handle any 'all' hooks registered.
      if ('hookAdded' !== hookName && hooksStore.all) {
        handlers.push(...hooksStore.all.handlers);
      }
    }
    if (!handlers || !handlers.length) {
      return returnFirstArg ? args[0] : undefined;
    }
    const hookInfo = {
      name: hookName,
      currentIndex: 0
    };
    hooksStore.__current.push(hookInfo);
    while (hookInfo.currentIndex < handlers.length) {
      const handler = handlers[hookInfo.currentIndex];
      const result = handler.callback.apply(null, args);
      if (returnFirstArg) {
        args[0] = result;
      }
      hookInfo.currentIndex++;
    }
    hooksStore.__current.pop();
    if (returnFirstArg) {
      return args[0];
    }
    return undefined;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRunHook);
//# sourceMappingURL=createRunHook.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actions: () => (/* binding */ actions),
/* harmony export */   addAction: () => (/* binding */ addAction),
/* harmony export */   addFilter: () => (/* binding */ addFilter),
/* harmony export */   applyFilters: () => (/* binding */ applyFilters),
/* harmony export */   createHooks: () => (/* reexport safe */ _createHooks__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   currentAction: () => (/* binding */ currentAction),
/* harmony export */   currentFilter: () => (/* binding */ currentFilter),
/* harmony export */   defaultHooks: () => (/* binding */ defaultHooks),
/* harmony export */   didAction: () => (/* binding */ didAction),
/* harmony export */   didFilter: () => (/* binding */ didFilter),
/* harmony export */   doAction: () => (/* binding */ doAction),
/* harmony export */   doingAction: () => (/* binding */ doingAction),
/* harmony export */   doingFilter: () => (/* binding */ doingFilter),
/* harmony export */   filters: () => (/* binding */ filters),
/* harmony export */   hasAction: () => (/* binding */ hasAction),
/* harmony export */   hasFilter: () => (/* binding */ hasFilter),
/* harmony export */   removeAction: () => (/* binding */ removeAction),
/* harmony export */   removeAllActions: () => (/* binding */ removeAllActions),
/* harmony export */   removeAllFilters: () => (/* binding */ removeAllFilters),
/* harmony export */   removeFilter: () => (/* binding */ removeFilter)
/* harmony export */ });
/* harmony import */ var _createHooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createHooks */ "./node_modules/@wordpress/hooks/build-module/createHooks.js");
/**
 * Internal dependencies
 */


/** @typedef {(...args: any[])=>any} Callback */

/**
 * @typedef Handler
 * @property {Callback} callback  The callback
 * @property {string}   namespace The namespace
 * @property {number}   priority  The namespace
 */

/**
 * @typedef Hook
 * @property {Handler[]} handlers Array of handlers
 * @property {number}    runs     Run counter
 */

/**
 * @typedef Current
 * @property {string} name         Hook name
 * @property {number} currentIndex The index
 */

/**
 * @typedef {Record<string, Hook> & {__current: Current[]}} Store
 */

/**
 * @typedef {'actions' | 'filters'} StoreKey
 */

/**
 * @typedef {import('./createHooks').Hooks} Hooks
 */

const defaultHooks = (0,_createHooks__WEBPACK_IMPORTED_MODULE_0__["default"])();
const {
  addAction,
  addFilter,
  removeAction,
  removeFilter,
  hasAction,
  hasFilter,
  removeAllActions,
  removeAllFilters,
  doAction,
  applyFilters,
  currentAction,
  currentFilter,
  doingAction,
  doingFilter,
  didAction,
  didFilter,
  actions,
  filters
} = defaultHooks;

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/validateHookName.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/validateHookName.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Validate a hookName string.
 *
 * @param {string} hookName The hook name to validate. Should be a non empty string containing
 *                          only numbers, letters, dashes, periods and underscores. Also,
 *                          the hook name cannot begin with `__`.
 *
 * @return {boolean} Whether the hook name is valid.
 */
function validateHookName(hookName) {
  if ('string' !== typeof hookName || '' === hookName) {
    // eslint-disable-next-line no-console
    console.error('The hook name must be a non-empty string.');
    return false;
  }
  if (/^__/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name cannot begin with `__`.');
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name can only contain numbers, letters, dashes, periods and underscores.');
    return false;
  }
  return true;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validateHookName);
//# sourceMappingURL=validateHookName.js.map

/***/ }),

/***/ "./node_modules/@wordpress/hooks/build-module/validateNamespace.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/hooks/build-module/validateNamespace.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Validate a namespace string.
 *
 * @param {string} namespace The namespace to validate - should take the form
 *                           `vendor/plugin/function`.
 *
 * @return {boolean} Whether the namespace is valid.
 */
function validateNamespace(namespace) {
  if ('string' !== typeof namespace || '' === namespace) {
    // eslint-disable-next-line no-console
    console.error('The namespace must be a non-empty string.');
    return false;
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(namespace)) {
    // eslint-disable-next-line no-console
    console.error('The namespace can only contain numbers, letters, dashes, periods, underscores and slashes.');
    return false;
  }
  return true;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validateNamespace);
//# sourceMappingURL=validateNamespace.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/check.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/check.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const check = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M16.7 7.1l-6.3 8.5-3.3-2.5-.9 1.2 4.5 3.4L17.9 8z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (check);
//# sourceMappingURL=check.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/close-small.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/close-small.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const closeSmall = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (closeSmall);
//# sourceMappingURL=close-small.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/plugins.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/plugins.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const plugins = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M10.5 4v4h3V4H15v4h1.5a1 1 0 011 1v4l-3 4v2a1 1 0 01-1 1h-3a1 1 0 01-1-1v-2l-3-4V9a1 1 0 011-1H9V4h1.5zm.5 12.5v2h2v-2l3-4v-3H8v3l3 4z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugins);
//# sourceMappingURL=plugins.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/star-empty.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/star-empty.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const starEmpty = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  fillRule: "evenodd",
  d: "M9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0L9.706 8.646zM12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957L12 7.39z",
  clipRule: "evenodd"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (starEmpty);
//# sourceMappingURL=star-empty.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/star-filled.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/star-filled.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const starFilled = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M11.776 4.454a.25.25 0 01.448 0l2.069 4.192a.25.25 0 00.188.137l4.626.672a.25.25 0 01.139.426l-3.348 3.263a.25.25 0 00-.072.222l.79 4.607a.25.25 0 01-.362.263l-4.138-2.175a.25.25 0 00-.232 0l-4.138 2.175a.25.25 0 01-.363-.263l.79-4.607a.25.25 0 00-.071-.222L4.754 9.881a.25.25 0 01.139-.426l4.626-.672a.25.25 0 00.188-.137l2.069-4.192z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (starFilled);
//# sourceMappingURL=star-filled.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/wordpress.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/wordpress.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "./node_modules/@wordpress/primitives/build-module/svg/index.js");

/**
 * WordPress dependencies
 */

const wordpress = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "-2 -2 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M20 10c0-5.51-4.49-10-10-10C4.48 0 0 4.49 0 10c0 5.52 4.48 10 10 10 5.51 0 10-4.48 10-10zM7.78 15.37L4.37 6.22c.55-.02 1.17-.08 1.17-.08.5-.06.44-1.13-.06-1.11 0 0-1.45.11-2.37.11-.18 0-.37 0-.58-.01C4.12 2.69 6.87 1.11 10 1.11c2.33 0 4.45.87 6.05 2.34-.68-.11-1.65.39-1.65 1.58 0 .74.45 1.36.9 2.1.35.61.55 1.36.55 2.46 0 1.49-1.4 5-1.4 5l-3.03-8.37c.54-.02.82-.17.82-.17.5-.05.44-1.25-.06-1.22 0 0-1.44.12-2.38.12-.87 0-2.33-.12-2.33-.12-.5-.03-.56 1.2-.06 1.22l.92.08 1.26 3.41zM17.41 10c.24-.64.74-1.87.43-4.25.7 1.29 1.05 2.71 1.05 4.25 0 3.29-1.73 6.24-4.4 7.78.97-2.59 1.94-5.2 2.92-7.78zM6.1 18.09C3.12 16.65 1.11 13.53 1.11 10c0-1.3.23-2.48.72-3.59C3.25 10.3 4.67 14.2 6.1 18.09zm4.03-6.63l2.58 6.98c-.86.29-1.76.45-2.71.45-.79 0-1.57-.11-2.29-.33.81-2.38 1.62-4.74 2.42-7.1z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (wordpress);
//# sourceMappingURL=wordpress.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/action-item/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/action-item/index.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);

/**
 * WordPress dependencies
 */


const noop = () => {};
function ActionItemSlot({
  name,
  as: Component = _wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup,
  fillProps = {},
  bubblesVirtually,
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Slot, {
    name: name,
    bubblesVirtually: bubblesVirtually,
    fillProps: fillProps
  }, fills => {
    if (!_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Children.toArray(fills).length) {
      return null;
    }

    // Special handling exists for backward compatibility.
    // It ensures that menu items created by plugin authors aren't
    // duplicated with automatically injected menu items coming
    // from pinnable plugin sidebars.
    // @see https://github.com/WordPress/gutenberg/issues/14457
    const initializedByPlugins = [];
    _wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Children.forEach(fills, ({
      props: {
        __unstableExplicitMenuItem,
        __unstableTarget
      }
    }) => {
      if (__unstableTarget && __unstableExplicitMenuItem) {
        initializedByPlugins.push(__unstableTarget);
      }
    });
    const children = _wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Children.map(fills, child => {
      if (!child.props.__unstableExplicitMenuItem && initializedByPlugins.includes(child.props.__unstableTarget)) {
        return null;
      }
      return child;
    });
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Component, {
      ...props
    }, children);
  });
}
function ActionItem({
  name,
  as: Component = _wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button,
  onClick,
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Fill, {
    name: name
  }, ({
    onClick: fpOnClick
  }) => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Component, {
      onClick: onClick || fpOnClick ? (...args) => {
        (onClick || noop)(...args);
        (fpOnClick || noop)(...args);
      } : undefined,
      ...props
    });
  });
}
ActionItem.Slot = ActionItemSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActionItem);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/complementary-area-context/index.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/complementary-area-context/index.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/plugins */ "./node_modules/@wordpress/plugins/build-module/index.js");
/**
 * WordPress dependencies
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.withPluginContext)((context, ownProps) => {
  return {
    icon: ownProps.icon || context.icon,
    identifier: ownProps.identifier || `${context.name}/${ownProps.name}`
  };
}));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/complementary-area-header/index.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/complementary-area-header/index.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close-small.js");
/* harmony import */ var _complementary_area_toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../complementary-area-toggle */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-toggle/index.js");

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */

const ComplementaryAreaHeader = ({
  smallScreenTitle,
  children,
  className,
  toggleButtonProps
}) => {
  const toggleButton = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_complementary_area_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
    ...toggleButtonProps
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "components-panel__header interface-complementary-area-header__small"
  }, smallScreenTitle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "interface-complementary-area-header__small-title"
  }, smallScreenTitle), toggleButton), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('components-panel__header', 'interface-complementary-area-header', className),
    tabIndex: -1
  }, children, toggleButton));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ComplementaryAreaHeader);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/complementary-area-more-menu-item/index.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/complementary-area-more-menu-item/index.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ComplementaryAreaMoreMenuItem)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/check.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _complementary_area_toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../complementary-area-toggle */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-toggle/index.js");
/* harmony import */ var _action_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../action-item */ "./node_modules/@wordpress/interface/build-module/components/action-item/index.js");

/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


const PluginsMenuItem = ({
  // Menu item is marked with unstable prop for backward compatibility.
  // They are removed so they don't leak to DOM elements.
  // @see https://github.com/WordPress/gutenberg/issues/14457
  __unstableExplicitMenuItem,
  __unstableTarget,
  ...restProps
}) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.MenuItem, {
  ...restProps
});
function ComplementaryAreaMoreMenuItem({
  scope,
  target,
  __unstableExplicitMenuItem,
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_complementary_area_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
    as: toggleProps => {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_action_item__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __unstableExplicitMenuItem: __unstableExplicitMenuItem,
        __unstableTarget: `${scope}/${target}`,
        as: PluginsMenuItem,
        name: `${scope}/plugin-more-menu`,
        ...toggleProps
      });
    },
    role: "menuitemcheckbox",
    selectedIcon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
    name: target,
    scope: scope,
    ...props
  });
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/complementary-area-toggle/index.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/complementary-area-toggle/index.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store */ "./node_modules/@wordpress/interface/build-module/store/index.js");
/* harmony import */ var _complementary_area_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../complementary-area-context */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-context/index.js");

/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


function ComplementaryAreaToggle({
  as = _wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button,
  scope,
  identifier,
  icon,
  selectedIcon,
  name,
  ...props
}) {
  const ComponentToUse = as;
  const isSelected = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => select(_store__WEBPACK_IMPORTED_MODULE_3__.store).getActiveComplementaryArea(scope) === identifier, [identifier, scope]);
  const {
    enableComplementaryArea,
    disableComplementaryArea
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_store__WEBPACK_IMPORTED_MODULE_3__.store);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ComponentToUse, {
    icon: selectedIcon && isSelected ? selectedIcon : icon,
    "aria-controls": identifier.replace('/', ':'),
    onClick: () => {
      if (isSelected) {
        disableComplementaryArea(scope);
      } else {
        enableComplementaryArea(scope, identifier);
      }
    },
    ...props
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_complementary_area_context__WEBPACK_IMPORTED_MODULE_4__["default"])(ComplementaryAreaToggle));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/complementary-area/index.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/complementary-area/index.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/check.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/star-filled.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/star-empty.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_viewport__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/viewport */ "./node_modules/@wordpress/viewport/build-module/index.js");
/* harmony import */ var _wordpress_preferences__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/preferences */ "./node_modules/@wordpress/preferences/build-module/store/index.js");
/* harmony import */ var _complementary_area_header__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../complementary-area-header */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-header/index.js");
/* harmony import */ var _complementary_area_more_menu_item__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../complementary-area-more-menu-item */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-more-menu-item/index.js");
/* harmony import */ var _complementary_area_toggle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../complementary-area-toggle */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-toggle/index.js");
/* harmony import */ var _complementary_area_context__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../complementary-area-context */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-context/index.js");
/* harmony import */ var _pinned_items__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../pinned-items */ "./node_modules/@wordpress/interface/build-module/components/pinned-items/index.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../store */ "./node_modules/@wordpress/interface/build-module/store/index.js");

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */








/**
 * Internal dependencies
 */






function ComplementaryAreaSlot({
  scope,
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Slot, {
    name: `ComplementaryArea/${scope}`,
    ...props
  });
}
function ComplementaryAreaFill({
  scope,
  children,
  className,
  id
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Fill, {
    name: `ComplementaryArea/${scope}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    id: id,
    className: className
  }, children));
}
function useAdjustComplementaryListener(scope, identifier, activeArea, isActive, isSmall) {
  const previousIsSmall = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useRef)(false);
  const shouldOpenWhenNotSmall = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useRef)(false);
  const {
    enableComplementaryArea,
    disableComplementaryArea
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)(_store__WEBPACK_IMPORTED_MODULE_7__.store);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    // If the complementary area is active and the editor is switching from
    // a big to a small window size.
    if (isActive && isSmall && !previousIsSmall.current) {
      disableComplementaryArea(scope);
      // Flag the complementary area to be reopened when the window size
      // goes from small to big.
      shouldOpenWhenNotSmall.current = true;
    } else if (
    // If there is a flag indicating the complementary area should be
    // enabled when we go from small to big window size and we are going
    // from a small to big window size.
    shouldOpenWhenNotSmall.current && !isSmall && previousIsSmall.current) {
      // Remove the flag indicating the complementary area should be
      // enabled.
      shouldOpenWhenNotSmall.current = false;
      enableComplementaryArea(scope, identifier);
    } else if (
    // If the flag is indicating the current complementary should be
    // reopened but another complementary area becomes active, remove
    // the flag.
    shouldOpenWhenNotSmall.current && activeArea && activeArea !== identifier) {
      shouldOpenWhenNotSmall.current = false;
    }
    if (isSmall !== previousIsSmall.current) {
      previousIsSmall.current = isSmall;
    }
  }, [isActive, isSmall, scope, identifier, activeArea, disableComplementaryArea, enableComplementaryArea]);
}
function ComplementaryArea({
  children,
  className,
  closeLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Close plugin'),
  identifier,
  header,
  headerClassName,
  icon,
  isPinnable = true,
  panelClassName,
  scope,
  name,
  smallScreenTitle,
  title,
  toggleShortcut,
  isActiveByDefault
}) {
  const {
    isLoading,
    isActive,
    isPinned,
    activeArea,
    isSmall,
    isLarge,
    showIconLabels
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getActiveComplementaryArea,
      isComplementaryAreaLoading,
      isItemPinned
    } = select(_store__WEBPACK_IMPORTED_MODULE_7__.store);
    const {
      get
    } = select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_8__.store);
    const _activeArea = getActiveComplementaryArea(scope);
    return {
      isLoading: isComplementaryAreaLoading(scope),
      isActive: _activeArea === identifier,
      isPinned: isItemPinned(scope, identifier),
      activeArea: _activeArea,
      isSmall: select(_wordpress_viewport__WEBPACK_IMPORTED_MODULE_6__.store).isViewportMatch('< medium'),
      isLarge: select(_wordpress_viewport__WEBPACK_IMPORTED_MODULE_6__.store).isViewportMatch('large'),
      showIconLabels: get('core', 'showIconLabels')
    };
  }, [identifier, scope]);
  useAdjustComplementaryListener(scope, identifier, activeArea, isActive, isSmall);
  const {
    enableComplementaryArea,
    disableComplementaryArea,
    pinItem,
    unpinItem
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)(_store__WEBPACK_IMPORTED_MODULE_7__.store);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    // Set initial visibility: For large screens, enable if it's active by
    // default. For small screens, always initially disable.
    if (isActiveByDefault && activeArea === undefined && !isSmall) {
      enableComplementaryArea(scope, identifier);
    } else if (activeArea === undefined && isSmall) {
      disableComplementaryArea(scope, identifier);
    }
  }, [activeArea, isActiveByDefault, scope, identifier, isSmall, enableComplementaryArea, disableComplementaryArea]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, isPinnable && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_pinned_items__WEBPACK_IMPORTED_MODULE_9__["default"], {
    scope: scope
  }, isPinned && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_complementary_area_toggle__WEBPACK_IMPORTED_MODULE_10__["default"], {
    scope: scope,
    identifier: identifier,
    isPressed: isActive && (!showIconLabels || isLarge),
    "aria-expanded": isActive,
    "aria-disabled": isLoading,
    label: title,
    icon: showIconLabels ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_11__["default"] : icon,
    showTooltip: !showIconLabels,
    variant: showIconLabels ? 'tertiary' : undefined,
    size: "compact"
  })), name && isPinnable && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_complementary_area_more_menu_item__WEBPACK_IMPORTED_MODULE_12__["default"], {
    target: name,
    scope: scope,
    icon: icon
  }, title), isActive && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ComplementaryAreaFill, {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('interface-complementary-area', className),
    scope: scope,
    id: identifier.replace('/', ':')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_complementary_area_header__WEBPACK_IMPORTED_MODULE_13__["default"], {
    className: headerClassName,
    closeLabel: closeLabel,
    onClose: () => disableComplementaryArea(scope),
    smallScreenTitle: smallScreenTitle,
    toggleButtonProps: {
      label: closeLabel,
      shortcut: toggleShortcut,
      scope,
      identifier
    }
  }, header || (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "interface-complementary-area-header__title"
  }, title), isPinnable && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    className: "interface-complementary-area__pin-unpin-item",
    icon: isPinned ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_14__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_15__["default"],
    label: isPinned ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Unpin from toolbar') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Pin to toolbar'),
    onClick: () => (isPinned ? unpinItem : pinItem)(scope, identifier),
    isPressed: isPinned,
    "aria-expanded": isPinned
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Panel, {
    className: panelClassName
  }, children)));
}
const ComplementaryAreaWrapped = (0,_complementary_area_context__WEBPACK_IMPORTED_MODULE_16__["default"])(ComplementaryArea);
ComplementaryAreaWrapped.Slot = ComplementaryAreaSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ComplementaryAreaWrapped);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/fullscreen-mode/index.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/fullscreen-mode/index.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */

const FullscreenMode = ({
  isActive
}) => {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let isSticky = false;
    // `is-fullscreen-mode` is set in PHP as a body class by Gutenberg, and this causes
    // `sticky-menu` to be applied by WordPress and prevents the admin menu being scrolled
    // even if `is-fullscreen-mode` is then removed. Let's remove `sticky-menu` here as
    // a consequence of the FullscreenMode setup.
    if (document.body.classList.contains('sticky-menu')) {
      isSticky = true;
      document.body.classList.remove('sticky-menu');
    }
    return () => {
      if (isSticky) {
        document.body.classList.add('sticky-menu');
      }
    };
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isActive) {
      document.body.classList.add('is-fullscreen-mode');
    } else {
      document.body.classList.remove('is-fullscreen-mode');
    }
    return () => {
      if (isActive) {
        document.body.classList.remove('is-fullscreen-mode');
      }
    };
  }, [isActive]);
  return null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FullscreenMode);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionItem: () => (/* reexport safe */ _action_item__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   ComplementaryArea: () => (/* reexport safe */ _complementary_area__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ComplementaryAreaMoreMenuItem: () => (/* reexport safe */ _complementary_area_more_menu_item__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   FullscreenMode: () => (/* reexport safe */ _fullscreen_mode__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   InterfaceSkeleton: () => (/* reexport safe */ _interface_skeleton__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   NavigableRegion: () => (/* reexport safe */ _navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   PinnedItems: () => (/* reexport safe */ _pinned_items__WEBPACK_IMPORTED_MODULE_4__["default"])
/* harmony export */ });
/* harmony import */ var _complementary_area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./complementary-area */ "./node_modules/@wordpress/interface/build-module/components/complementary-area/index.js");
/* harmony import */ var _complementary_area_more_menu_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./complementary-area-more-menu-item */ "./node_modules/@wordpress/interface/build-module/components/complementary-area-more-menu-item/index.js");
/* harmony import */ var _fullscreen_mode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fullscreen-mode */ "./node_modules/@wordpress/interface/build-module/components/fullscreen-mode/index.js");
/* harmony import */ var _interface_skeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interface-skeleton */ "./node_modules/@wordpress/interface/build-module/components/interface-skeleton/index.js");
/* harmony import */ var _pinned_items__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pinned-items */ "./node_modules/@wordpress/interface/build-module/components/pinned-items/index.js");
/* harmony import */ var _action_item__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./action-item */ "./node_modules/@wordpress/interface/build-module/components/action-item/index.js");
/* harmony import */ var _navigable_region__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./navigable-region */ "./node_modules/@wordpress/interface/build-module/components/navigable-region/index.js");







//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/interface-skeleton/index.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/interface-skeleton/index.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/hooks/use-merge-refs/index.js");
/* harmony import */ var _navigable_region__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../navigable-region */ "./node_modules/@wordpress/interface/build-module/components/navigable-region/index.js");

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */





/**
 * Internal dependencies
 */

function useHTMLClass(className) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const element = document && document.querySelector(`html:not(.${className})`);
    if (!element) {
      return;
    }
    element.classList.toggle(className);
    return () => {
      element.classList.toggle(className);
    };
  }, [className]);
}
const headerVariants = {
  hidden: {
    opacity: 0
  },
  hover: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0.2,
      delayChildren: 0.2
    }
  },
  distractionFreeInactive: {
    opacity: 1,
    transition: {
      delay: 0
    }
  }
};
function InterfaceSkeleton({
  isDistractionFree,
  footer,
  header,
  editorNotices,
  sidebar,
  secondarySidebar,
  notices,
  content,
  actions,
  labels,
  className,
  enableRegionNavigation = true,
  // Todo: does this need to be a prop.
  // Can we use a dependency to keyboard-shortcuts directly?
  shortcuts
}, ref) {
  const navigateRegionsProps = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__unstableUseNavigateRegions)(shortcuts);
  useHTMLClass('interface-interface-skeleton__html-container');
  const defaultLabels = {
    /* translators: accessibility text for the top bar landmark region. */
    header: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__._x)('Header', 'header landmark area'),
    /* translators: accessibility text for the content landmark region. */
    body: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Content'),
    /* translators: accessibility text for the secondary sidebar landmark region. */
    secondarySidebar: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Block Library'),
    /* translators: accessibility text for the settings landmark region. */
    sidebar: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Settings'),
    /* translators: accessibility text for the publish landmark region. */
    actions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Publish'),
    /* translators: accessibility text for the footer landmark region. */
    footer: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Footer')
  };
  const mergedLabels = {
    ...defaultLabels,
    ...labels
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...(enableRegionNavigation ? navigateRegionsProps : {}),
    ref: (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__["default"])([ref, enableRegionNavigation ? navigateRegionsProps.ref : undefined]),
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, 'interface-interface-skeleton', navigateRegionsProps.className, !!footer && 'has-footer')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "interface-interface-skeleton__editor"
  }, !!header && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"], {
    as: _wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__unstableMotion.div,
    className: "interface-interface-skeleton__header",
    "aria-label": mergedLabels.header,
    initial: isDistractionFree ? 'hidden' : 'distractionFreeInactive',
    whileHover: isDistractionFree ? 'hover' : 'distractionFreeInactive',
    animate: isDistractionFree ? 'hidden' : 'distractionFreeInactive',
    variants: headerVariants,
    transition: isDistractionFree ? {
      type: 'tween',
      delay: 0.8
    } : undefined
  }, header), isDistractionFree && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "interface-interface-skeleton__header"
  }, editorNotices), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "interface-interface-skeleton__body"
  }, !!secondarySidebar && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "interface-interface-skeleton__secondary-sidebar",
    ariaLabel: mergedLabels.secondarySidebar
  }, secondarySidebar), !!notices && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "interface-interface-skeleton__notices"
  }, notices), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "interface-interface-skeleton__content",
    ariaLabel: mergedLabels.body
  }, content), !!sidebar && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "interface-interface-skeleton__sidebar",
    ariaLabel: mergedLabels.sidebar
  }, sidebar), !!actions && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "interface-interface-skeleton__actions",
    ariaLabel: mergedLabels.actions
  }, actions))), !!footer && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_navigable_region__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "interface-interface-skeleton__footer",
    ariaLabel: mergedLabels.footer
  }, footer));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(InterfaceSkeleton));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/navigable-region/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/navigable-region/index.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NavigableRegion)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);

/**
 * External dependencies
 */

function NavigableRegion({
  children,
  className,
  ariaLabel,
  as: Tag = 'div',
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Tag, {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('interface-navigable-region', className),
    "aria-label": ariaLabel,
    role: "region",
    tabIndex: "-1",
    ...props
  }, children);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/components/pinned-items/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/components/pinned-items/index.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */

function PinnedItems({
  scope,
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Fill, {
    name: `PinnedItems/${scope}`,
    ...props
  });
}
function PinnedItemsSlot({
  scope,
  className,
  ...props
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Slot, {
    name: `PinnedItems/${scope}`,
    ...props
  }, fills => fills?.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, 'interface-pinned-items')
  }, fills));
}
PinnedItems.Slot = PinnedItemsSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PinnedItems);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionItem: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ActionItem),
/* harmony export */   ComplementaryArea: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ComplementaryArea),
/* harmony export */   ComplementaryAreaMoreMenuItem: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ComplementaryAreaMoreMenuItem),
/* harmony export */   FullscreenMode: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.FullscreenMode),
/* harmony export */   InterfaceSkeleton: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.InterfaceSkeleton),
/* harmony export */   NavigableRegion: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.NavigableRegion),
/* harmony export */   PinnedItems: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.PinnedItems),
/* harmony export */   store: () => (/* reexport safe */ _store__WEBPACK_IMPORTED_MODULE_1__.store)
/* harmony export */ });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ "./node_modules/@wordpress/interface/build-module/components/index.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./node_modules/@wordpress/interface/build-module/store/index.js");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/store/actions.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/store/actions.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeModal: () => (/* binding */ closeModal),
/* harmony export */   disableComplementaryArea: () => (/* binding */ disableComplementaryArea),
/* harmony export */   enableComplementaryArea: () => (/* binding */ enableComplementaryArea),
/* harmony export */   openModal: () => (/* binding */ openModal),
/* harmony export */   pinItem: () => (/* binding */ pinItem),
/* harmony export */   setDefaultComplementaryArea: () => (/* binding */ setDefaultComplementaryArea),
/* harmony export */   setFeatureDefaults: () => (/* binding */ setFeatureDefaults),
/* harmony export */   setFeatureValue: () => (/* binding */ setFeatureValue),
/* harmony export */   toggleFeature: () => (/* binding */ toggleFeature),
/* harmony export */   unpinItem: () => (/* binding */ unpinItem)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/deprecated */ "./node_modules/@wordpress/deprecated/build-module/index.js");
/* harmony import */ var _wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/preferences */ "./node_modules/@wordpress/preferences/build-module/store/index.js");
/**
 * WordPress dependencies
 */



/**
 * Set a default complementary area.
 *
 * @param {string} scope Complementary area scope.
 * @param {string} area  Area identifier.
 *
 * @return {Object} Action object.
 */
const setDefaultComplementaryArea = (scope, area) => ({
  type: 'SET_DEFAULT_COMPLEMENTARY_AREA',
  scope,
  area
});

/**
 * Enable the complementary area.
 *
 * @param {string} scope Complementary area scope.
 * @param {string} area  Area identifier.
 */
const enableComplementaryArea = (scope, area) => ({
  registry,
  dispatch
}) => {
  // Return early if there's no area.
  if (!area) {
    return;
  }
  const isComplementaryAreaVisible = registry.select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).get(scope, 'isComplementaryAreaVisible');
  if (!isComplementaryAreaVisible) {
    registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).set(scope, 'isComplementaryAreaVisible', true);
  }
  dispatch({
    type: 'ENABLE_COMPLEMENTARY_AREA',
    scope,
    area
  });
};

/**
 * Disable the complementary area.
 *
 * @param {string} scope Complementary area scope.
 */
const disableComplementaryArea = scope => ({
  registry
}) => {
  const isComplementaryAreaVisible = registry.select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).get(scope, 'isComplementaryAreaVisible');
  if (isComplementaryAreaVisible) {
    registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).set(scope, 'isComplementaryAreaVisible', false);
  }
};

/**
 * Pins an item.
 *
 * @param {string} scope Item scope.
 * @param {string} item  Item identifier.
 *
 * @return {Object} Action object.
 */
const pinItem = (scope, item) => ({
  registry
}) => {
  // Return early if there's no item.
  if (!item) {
    return;
  }
  const pinnedItems = registry.select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).get(scope, 'pinnedItems');

  // The item is already pinned, there's nothing to do.
  if (pinnedItems?.[item] === true) {
    return;
  }
  registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).set(scope, 'pinnedItems', {
    ...pinnedItems,
    [item]: true
  });
};

/**
 * Unpins an item.
 *
 * @param {string} scope Item scope.
 * @param {string} item  Item identifier.
 */
const unpinItem = (scope, item) => ({
  registry
}) => {
  // Return early if there's no item.
  if (!item) {
    return;
  }
  const pinnedItems = registry.select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).get(scope, 'pinnedItems');
  registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).set(scope, 'pinnedItems', {
    ...pinnedItems,
    [item]: false
  });
};

/**
 * Returns an action object used in signalling that a feature should be toggled.
 *
 * @param {string} scope       The feature scope (e.g. core/edit-post).
 * @param {string} featureName The feature name.
 */
function toggleFeature(scope, featureName) {
  return function ({
    registry
  }) {
    (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(`dispatch( 'core/interface' ).toggleFeature`, {
      since: '6.0',
      alternative: `dispatch( 'core/preferences' ).toggle`
    });
    registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).toggle(scope, featureName);
  };
}

/**
 * Returns an action object used in signalling that a feature should be set to
 * a true or false value
 *
 * @param {string}  scope       The feature scope (e.g. core/edit-post).
 * @param {string}  featureName The feature name.
 * @param {boolean} value       The value to set.
 *
 * @return {Object} Action object.
 */
function setFeatureValue(scope, featureName, value) {
  return function ({
    registry
  }) {
    (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(`dispatch( 'core/interface' ).setFeatureValue`, {
      since: '6.0',
      alternative: `dispatch( 'core/preferences' ).set`
    });
    registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).set(scope, featureName, !!value);
  };
}

/**
 * Returns an action object used in signalling that defaults should be set for features.
 *
 * @param {string}                  scope    The feature scope (e.g. core/edit-post).
 * @param {Object<string, boolean>} defaults A key/value map of feature names to values.
 *
 * @return {Object} Action object.
 */
function setFeatureDefaults(scope, defaults) {
  return function ({
    registry
  }) {
    (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(`dispatch( 'core/interface' ).setFeatureDefaults`, {
      since: '6.0',
      alternative: `dispatch( 'core/preferences' ).setDefaults`
    });
    registry.dispatch(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_0__.store).setDefaults(scope, defaults);
  };
}

/**
 * Returns an action object used in signalling that the user opened a modal.
 *
 * @param {string} name A string that uniquely identifies the modal.
 *
 * @return {Object} Action object.
 */
function openModal(name) {
  return {
    type: 'OPEN_MODAL',
    name
  };
}

/**
 * Returns an action object signalling that the user closed a modal.
 *
 * @return {Object} Action object.
 */
function closeModal() {
  return {
    type: 'CLOSE_MODAL'
  };
}
//# sourceMappingURL=actions.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/store/constants.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/store/constants.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME)
/* harmony export */ });
/**
 * The identifier for the data store.
 *
 * @type {string}
 */
const STORE_NAME = 'core/interface';
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/store/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/store/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   store: () => (/* binding */ store)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions */ "./node_modules/@wordpress/interface/build-module/store/actions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./selectors */ "./node_modules/@wordpress/interface/build-module/store/selectors.js");
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reducer */ "./node_modules/@wordpress/interface/build-module/store/reducer.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./node_modules/@wordpress/interface/build-module/store/constants.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */





/**
 * Store definition for the interface namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
const store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(_constants__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME, {
  reducer: _reducer__WEBPACK_IMPORTED_MODULE_2__["default"],
  actions: _actions__WEBPACK_IMPORTED_MODULE_3__,
  selectors: _selectors__WEBPACK_IMPORTED_MODULE_4__
});

// Once we build a more generic persistence plugin that works across types of stores
// we'd be able to replace this with a register call.
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/store/reducer.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/store/reducer.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activeModal: () => (/* binding */ activeModal),
/* harmony export */   complementaryAreas: () => (/* binding */ complementaryAreas),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */

function complementaryAreas(state = {}, action) {
  switch (action.type) {
    case 'SET_DEFAULT_COMPLEMENTARY_AREA':
      {
        const {
          scope,
          area
        } = action;

        // If there's already an area, don't overwrite it.
        if (state[scope]) {
          return state;
        }
        return {
          ...state,
          [scope]: area
        };
      }
    case 'ENABLE_COMPLEMENTARY_AREA':
      {
        const {
          scope,
          area
        } = action;
        return {
          ...state,
          [scope]: area
        };
      }
  }
  return state;
}

/**
 * Reducer for storing the name of the open modal, or null if no modal is open.
 *
 * @param {Object} state  Previous state.
 * @param {Object} action Action object containing the `name` of the modal
 *
 * @return {Object} Updated state
 */
function activeModal(state = null, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return action.name;
    case 'CLOSE_MODAL':
      return null;
  }
  return state;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  complementaryAreas,
  activeModal
}));
//# sourceMappingURL=reducer.js.map

/***/ }),

/***/ "./node_modules/@wordpress/interface/build-module/store/selectors.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/interface/build-module/store/selectors.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getActiveComplementaryArea: () => (/* binding */ getActiveComplementaryArea),
/* harmony export */   isComplementaryAreaLoading: () => (/* binding */ isComplementaryAreaLoading),
/* harmony export */   isFeatureActive: () => (/* binding */ isFeatureActive),
/* harmony export */   isItemPinned: () => (/* binding */ isItemPinned),
/* harmony export */   isModalActive: () => (/* binding */ isModalActive)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/deprecated */ "./node_modules/@wordpress/deprecated/build-module/index.js");
/* harmony import */ var _wordpress_preferences__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/preferences */ "./node_modules/@wordpress/preferences/build-module/store/index.js");
/**
 * WordPress dependencies
 */




/**
 * Returns the complementary area that is active in a given scope.
 *
 * @param {Object} state Global application state.
 * @param {string} scope Item scope.
 *
 * @return {string | null | undefined} The complementary area that is active in the given scope.
 */
const getActiveComplementaryArea = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createRegistrySelector)(select => (state, scope) => {
  const isComplementaryAreaVisible = select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_1__.store).get(scope, 'isComplementaryAreaVisible');

  // Return `undefined` to indicate that the user has never toggled
  // visibility, this is the vanilla default. Other code relies on this
  // nuance in the return value.
  if (isComplementaryAreaVisible === undefined) {
    return undefined;
  }

  // Return `null` to indicate the user hid the complementary area.
  if (isComplementaryAreaVisible === false) {
    return null;
  }
  return state?.complementaryAreas?.[scope];
});
const isComplementaryAreaLoading = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createRegistrySelector)(select => (state, scope) => {
  const isVisible = select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_1__.store).get(scope, 'isComplementaryAreaVisible');
  const identifier = state?.complementaryAreas?.[scope];
  return isVisible && identifier === undefined;
});

/**
 * Returns a boolean indicating if an item is pinned or not.
 *
 * @param {Object} state Global application state.
 * @param {string} scope Scope.
 * @param {string} item  Item to check.
 *
 * @return {boolean} True if the item is pinned and false otherwise.
 */
const isItemPinned = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createRegistrySelector)(select => (state, scope, item) => {
  var _pinnedItems$item;
  const pinnedItems = select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_1__.store).get(scope, 'pinnedItems');
  return (_pinnedItems$item = pinnedItems?.[item]) !== null && _pinnedItems$item !== void 0 ? _pinnedItems$item : true;
});

/**
 * Returns a boolean indicating whether a feature is active for a particular
 * scope.
 *
 * @param {Object} state       The store state.
 * @param {string} scope       The scope of the feature (e.g. core/edit-post).
 * @param {string} featureName The name of the feature.
 *
 * @return {boolean} Is the feature enabled?
 */
const isFeatureActive = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createRegistrySelector)(select => (state, scope, featureName) => {
  (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__["default"])(`select( 'core/interface' ).isFeatureActive( scope, featureName )`, {
    since: '6.0',
    alternative: `select( 'core/preferences' ).get( scope, featureName )`
  });
  return !!select(_wordpress_preferences__WEBPACK_IMPORTED_MODULE_1__.store).get(scope, featureName);
});

/**
 * Returns true if a modal is active, or false otherwise.
 *
 * @param {Object} state     Global application state.
 * @param {string} modalName A string that uniquely identifies the modal.
 *
 * @return {boolean} Whether the modal is active.
 */
function isModalActive(state, modalName) {
  return state.activeModal === modalName;
}
//# sourceMappingURL=selectors.js.map

/***/ }),

/***/ "./node_modules/@wordpress/is-shallow-equal/build-module/arrays.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/is-shallow-equal/build-module/arrays.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isShallowEqualArrays)
/* harmony export */ });
/**
 * Returns true if the two arrays are shallow equal, or false otherwise.
 *
 * @param {any[]} a First array to compare.
 * @param {any[]} b Second array to compare.
 *
 * @return {boolean} Whether the two arrays are shallow equal.
 */
function isShallowEqualArrays(a, b) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0, len = a.length; i < len; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
//# sourceMappingURL=arrays.js.map

/***/ }),

/***/ "./node_modules/@wordpress/is-shallow-equal/build-module/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/is-shallow-equal/build-module/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isShallowEqual),
/* harmony export */   isShallowEqualArrays: () => (/* reexport safe */ _arrays__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   isShallowEqualObjects: () => (/* reexport safe */ _objects__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects */ "./node_modules/@wordpress/is-shallow-equal/build-module/objects.js");
/* harmony import */ var _arrays__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrays */ "./node_modules/@wordpress/is-shallow-equal/build-module/arrays.js");
/**
 * Internal dependencies
 */





/**
 * @typedef {Record<string, any>} ComparableObject
 */

/**
 * Returns true if the two arrays or objects are shallow equal, or false
 * otherwise. Also handles primitive values, just in case.
 *
 * @param {unknown} a First object or array to compare.
 * @param {unknown} b Second object or array to compare.
 *
 * @return {boolean} Whether the two values are shallow equal.
 */
function isShallowEqual(a, b) {
  if (a && b) {
    if (a.constructor === Object && b.constructor === Object) {
      return (0,_objects__WEBPACK_IMPORTED_MODULE_0__["default"])(a, b);
    } else if (Array.isArray(a) && Array.isArray(b)) {
      return (0,_arrays__WEBPACK_IMPORTED_MODULE_1__["default"])(a, b);
    }
  }
  return a === b;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/is-shallow-equal/build-module/objects.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/is-shallow-equal/build-module/objects.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isShallowEqualObjects)
/* harmony export */ });
/**
 * Returns true if the two objects are shallow equal, or false otherwise.
 *
 * @param {import('.').ComparableObject} a First object to compare.
 * @param {import('.').ComparableObject} b Second object to compare.
 *
 * @return {boolean} Whether the two objects are shallow equal.
 */
function isShallowEqualObjects(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  let i = 0;
  while (i < aKeys.length) {
    const key = aKeys[i];
    const aValue = a[key];
    if (
    // In iterating only the keys of the first object after verifying
    // equal lengths, account for the case that an explicit `undefined`
    // value in the first is implicitly undefined in the second.
    //
    // Example: isShallowEqualObjects( { a: undefined }, { b: 5 } )
    aValue === undefined && !b.hasOwnProperty(key) || aValue !== b[key]) {
      return false;
    }
    i++;
  }
  return true;
}
//# sourceMappingURL=objects.js.map

/***/ }),

/***/ "./node_modules/@wordpress/plugins/build-module/api/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/plugins/build-module/api/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPlugin: () => (/* binding */ getPlugin),
/* harmony export */   getPlugins: () => (/* binding */ getPlugins),
/* harmony export */   registerPlugin: () => (/* binding */ registerPlugin),
/* harmony export */   unregisterPlugin: () => (/* binding */ unregisterPlugin)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "./node_modules/@wordpress/hooks/build-module/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plugins.js");
/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */


/**
 * Plugin definitions keyed by plugin name.
 */
const plugins = {};

/**
 * Registers a plugin to the editor.
 *
 * @param name     A string identifying the plugin. Must be
 *                 unique across all registered plugins.
 * @param settings The settings for this plugin.
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var el = React.createElement;
 * var Fragment = wp.element.Fragment;
 * var PluginSidebar = wp.editPost.PluginSidebar;
 * var PluginSidebarMoreMenuItem = wp.editPost.PluginSidebarMoreMenuItem;
 * var registerPlugin = wp.plugins.registerPlugin;
 * var moreIcon = React.createElement( 'svg' ); //... svg element.
 *
 * function Component() {
 * 	return el(
 * 		Fragment,
 * 		{},
 * 		el(
 * 			PluginSidebarMoreMenuItem,
 * 			{
 * 				target: 'sidebar-name',
 * 			},
 * 			'My Sidebar'
 * 		),
 * 		el(
 * 			PluginSidebar,
 * 			{
 * 				name: 'sidebar-name',
 * 				title: 'My Sidebar',
 * 			},
 * 			'Content of the sidebar'
 * 		)
 * 	);
 * }
 * registerPlugin( 'plugin-name', {
 * 	icon: moreIcon,
 * 	render: Component,
 * 	scope: 'my-page',
 * } );
 * ```
 *
 * @example
 * ```js
 * // Using ESNext syntax
 * import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
 * import { registerPlugin } from '@wordpress/plugins';
 * import { more } from '@wordpress/icons';
 *
 * const Component = () => (
 * 	<>
 * 		<PluginSidebarMoreMenuItem
 * 			target="sidebar-name"
 * 		>
 * 			My Sidebar
 * 		</PluginSidebarMoreMenuItem>
 * 		<PluginSidebar
 * 			name="sidebar-name"
 * 			title="My Sidebar"
 * 		>
 * 			Content of the sidebar
 * 		</PluginSidebar>
 * 	</>
 * );
 *
 * registerPlugin( 'plugin-name', {
 * 	icon: more,
 * 	render: Component,
 * 	scope: 'my-page',
 * } );
 * ```
 *
 * @return The final plugin settings object.
 */
function registerPlugin(name, settings) {
  if (typeof settings !== 'object') {
    console.error('No settings object provided!');
    return null;
  }
  if (typeof name !== 'string') {
    console.error('Plugin name must be string.');
    return null;
  }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error('Plugin name must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-plugin".');
    return null;
  }
  if (plugins[name]) {
    console.error(`Plugin "${name}" is already registered.`);
  }
  settings = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.applyFilters)('plugins.registerPlugin', settings, name);
  const {
    render,
    scope
  } = settings;
  if (typeof render !== 'function') {
    console.error('The "render" property must be specified and must be a valid function.');
    return null;
  }
  if (scope) {
    if (typeof scope !== 'string') {
      console.error('Plugin scope must be string.');
      return null;
    }
    if (!/^[a-z][a-z0-9-]*$/.test(scope)) {
      console.error('Plugin scope must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-page".');
      return null;
    }
  }
  plugins[name] = {
    name,
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
    ...settings
  };
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.doAction)('plugins.pluginRegistered', settings, name);
  return settings;
}

/**
 * Unregisters a plugin by name.
 *
 * @param name Plugin name.
 *
 * @example
 * ```js
 * // Using ES5 syntax
 * var unregisterPlugin = wp.plugins.unregisterPlugin;
 *
 * unregisterPlugin( 'plugin-name' );
 * ```
 *
 * @example
 * ```js
 * // Using ESNext syntax
 * import { unregisterPlugin } from '@wordpress/plugins';
 *
 * unregisterPlugin( 'plugin-name' );
 * ```
 *
 * @return The previous plugin settings object, if it has been
 *         successfully unregistered; otherwise `undefined`.
 */
function unregisterPlugin(name) {
  if (!plugins[name]) {
    console.error('Plugin "' + name + '" is not registered.');
    return;
  }
  const oldPlugin = plugins[name];
  delete plugins[name];
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.doAction)('plugins.pluginUnregistered', oldPlugin, name);
  return oldPlugin;
}

/**
 * Returns a registered plugin settings.
 *
 * @param name Plugin name.
 *
 * @return Plugin setting.
 */
function getPlugin(name) {
  return plugins[name];
}

/**
 * Returns all registered plugins without a scope or for a given scope.
 *
 * @param scope The scope to be used when rendering inside
 *              a plugin area. No scope by default.
 *
 * @return The list of plugins without a scope or for a given scope.
 */
function getPlugins(scope) {
  return Object.values(plugins).filter(plugin => plugin.scope === scope);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/plugins/build-module/components/index.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/plugins/build-module/components/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginArea: () => (/* reexport safe */ _plugin_area__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   usePluginContext: () => (/* reexport safe */ _plugin_context__WEBPACK_IMPORTED_MODULE_1__.usePluginContext),
/* harmony export */   withPluginContext: () => (/* reexport safe */ _plugin_context__WEBPACK_IMPORTED_MODULE_1__.withPluginContext)
/* harmony export */ });
/* harmony import */ var _plugin_area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugin-area */ "./node_modules/@wordpress/plugins/build-module/components/plugin-area/index.js");
/* harmony import */ var _plugin_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugin-context */ "./node_modules/@wordpress/plugins/build-module/components/plugin-context/index.js");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/plugins/build-module/components/plugin-area/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@wordpress/plugins/build-module/components/plugin-area/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var memize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! memize */ "./node_modules/memize/dist/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/hooks */ "./node_modules/@wordpress/hooks/build-module/index.js");
/* harmony import */ var _wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/is-shallow-equal */ "./node_modules/@wordpress/is-shallow-equal/build-module/index.js");
/* harmony import */ var _plugin_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../plugin-context */ "./node_modules/@wordpress/plugins/build-module/components/plugin-context/index.js");
/* harmony import */ var _plugin_error_boundary__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../plugin-error-boundary */ "./node_modules/@wordpress/plugins/build-module/components/plugin-error-boundary/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../api */ "./node_modules/@wordpress/plugins/build-module/api/index.js");

/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */



const getPluginContext = (0,memize__WEBPACK_IMPORTED_MODULE_1__["default"])((icon, name) => ({
  icon,
  name
}));

/**
 * A component that renders all plugin fills in a hidden div.
 *
 * @param  props
 * @param  props.scope
 * @param  props.onError
 * @example
 * ```js
 * // Using ES5 syntax
 * var el = React.createElement;
 * var PluginArea = wp.plugins.PluginArea;
 *
 * function Layout() {
 * 	return el(
 * 		'div',
 * 		{ scope: 'my-page' },
 * 		'Content of the page',
 * 		PluginArea
 * 	);
 * }
 * ```
 *
 * @example
 * ```js
 * // Using ESNext syntax
 * import { PluginArea } from '@wordpress/plugins';
 *
 * const Layout = () => (
 * 	<div>
 * 		Content of the page
 * 		<PluginArea scope="my-page" />
 * 	</div>
 * );
 * ```
 *
 * @return {Component} The component to be rendered.
 */
function PluginArea({
  scope,
  onError
}) {
  const store = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    let lastValue = [];
    return {
      subscribe(listener) {
        (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addAction)('plugins.pluginRegistered', 'core/plugins/plugin-area/plugins-registered', listener);
        (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addAction)('plugins.pluginUnregistered', 'core/plugins/plugin-area/plugins-unregistered', listener);
        return () => {
          (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.removeAction)('plugins.pluginRegistered', 'core/plugins/plugin-area/plugins-registered');
          (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.removeAction)('plugins.pluginUnregistered', 'core/plugins/plugin-area/plugins-unregistered');
        };
      },
      getValue() {
        const nextValue = (0,_api__WEBPACK_IMPORTED_MODULE_6__.getPlugins)(scope);
        if (!(0,_wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_7__["default"])(lastValue, nextValue)) {
          lastValue = nextValue;
        }
        return lastValue;
      }
    };
  }, [scope]);
  const plugins = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useSyncExternalStore)(store.subscribe, store.getValue);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'none'
    }
  }, plugins.map(({
    icon,
    name,
    render: Plugin
  }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_plugin_context__WEBPACK_IMPORTED_MODULE_4__.PluginContextProvider, {
    key: name,
    value: getPluginContext(icon, name)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_plugin_error_boundary__WEBPACK_IMPORTED_MODULE_5__.PluginErrorBoundary, {
    name: name,
    onError: onError
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Plugin, null)))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PluginArea);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/plugins/build-module/components/plugin-context/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@wordpress/plugins/build-module/components/plugin-context/index.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginContextProvider: () => (/* binding */ PluginContextProvider),
/* harmony export */   usePluginContext: () => (/* binding */ usePluginContext),
/* harmony export */   withPluginContext: () => (/* binding */ withPluginContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js");

/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */

const Context = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createContext)({
  name: null,
  icon: null
});
const PluginContextProvider = Context.Provider;

/**
 * A hook that returns the plugin context.
 *
 * @return {PluginContext} Plugin context
 */
function usePluginContext() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useContext)(Context);
}

/**
 * A Higher Order Component used to inject Plugin context to the
 * wrapped component.
 *
 * @param  mapContextToProps Function called on every context change,
 *                           expected to return object of props to
 *                           merge with the component's own props.
 *
 * @return {Component} Enhanced component with injected context as props.
 */
const withPluginContext = mapContextToProps => (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(OriginalComponent => {
  return props => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Context.Consumer, null, context => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(OriginalComponent, {
    ...props,
    ...mapContextToProps(context, props)
  }));
}, 'withPluginContext');
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/plugins/build-module/components/plugin-error-boundary/index.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@wordpress/plugins/build-module/components/plugin-error-boundary/index.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginErrorBoundary: () => (/* binding */ PluginErrorBoundary)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */

class PluginErrorBoundary extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  /**
   * @param {Error} error Error object passed by React.
   */
  componentDidCatch(error) {
    const {
      name,
      onError
    } = this.props;
    if (onError) {
      onError(name, error);
    }
  }
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return null;
  }
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/plugins/build-module/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@wordpress/plugins/build-module/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginArea: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.PluginArea),
/* harmony export */   getPlugin: () => (/* reexport safe */ _api__WEBPACK_IMPORTED_MODULE_1__.getPlugin),
/* harmony export */   getPlugins: () => (/* reexport safe */ _api__WEBPACK_IMPORTED_MODULE_1__.getPlugins),
/* harmony export */   registerPlugin: () => (/* reexport safe */ _api__WEBPACK_IMPORTED_MODULE_1__.registerPlugin),
/* harmony export */   unregisterPlugin: () => (/* reexport safe */ _api__WEBPACK_IMPORTED_MODULE_1__.unregisterPlugin),
/* harmony export */   usePluginContext: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.usePluginContext),
/* harmony export */   withPluginContext: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.withPluginContext)
/* harmony export */ });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ "./node_modules/@wordpress/plugins/build-module/components/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "./node_modules/@wordpress/plugins/build-module/api/index.js");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/preferences/build-module/store/actions.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/preferences/build-module/store/actions.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   setDefaults: () => (/* binding */ setDefaults),
/* harmony export */   setPersistenceLayer: () => (/* binding */ setPersistenceLayer),
/* harmony export */   toggle: () => (/* binding */ toggle)
/* harmony export */ });
/**
 * Returns an action object used in signalling that a preference should be
 * toggled.
 *
 * @param {string} scope The preference scope (e.g. core/edit-post).
 * @param {string} name  The preference name.
 */
function toggle(scope, name) {
  return function ({
    select,
    dispatch
  }) {
    const currentValue = select.get(scope, name);
    dispatch.set(scope, name, !currentValue);
  };
}

/**
 * Returns an action object used in signalling that a preference should be set
 * to a value
 *
 * @param {string} scope The preference scope (e.g. core/edit-post).
 * @param {string} name  The preference name.
 * @param {*}      value The value to set.
 *
 * @return {Object} Action object.
 */
function set(scope, name, value) {
  return {
    type: 'SET_PREFERENCE_VALUE',
    scope,
    name,
    value
  };
}

/**
 * Returns an action object used in signalling that preference defaults should
 * be set.
 *
 * @param {string}            scope    The preference scope (e.g. core/edit-post).
 * @param {Object<string, *>} defaults A key/value map of preference names to values.
 *
 * @return {Object} Action object.
 */
function setDefaults(scope, defaults) {
  return {
    type: 'SET_PREFERENCE_DEFAULTS',
    scope,
    defaults
  };
}

/** @typedef {() => Promise<Object>} WPPreferencesPersistenceLayerGet */
/** @typedef {(Object) => void} WPPreferencesPersistenceLayerSet */
/**
 * @typedef WPPreferencesPersistenceLayer
 *
 * @property {WPPreferencesPersistenceLayerGet} get An async function that gets data from the persistence layer.
 * @property {WPPreferencesPersistenceLayerSet} set A function that sets data in the persistence layer.
 */

/**
 * Sets the persistence layer.
 *
 * When a persistence layer is set, the preferences store will:
 * - call `get` immediately and update the store state to the value returned.
 * - call `set` with all preferences whenever a preference changes value.
 *
 * `setPersistenceLayer` should ideally be dispatched at the start of an
 * application's lifecycle, before any other actions have been dispatched to
 * the preferences store.
 *
 * @param {WPPreferencesPersistenceLayer} persistenceLayer The persistence layer.
 *
 * @return {Object} Action object.
 */
async function setPersistenceLayer(persistenceLayer) {
  const persistedData = await persistenceLayer.get();
  return {
    type: 'SET_PERSISTENCE_LAYER',
    persistenceLayer,
    persistedData
  };
}
//# sourceMappingURL=actions.js.map

/***/ }),

/***/ "./node_modules/@wordpress/preferences/build-module/store/constants.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@wordpress/preferences/build-module/store/constants.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME)
/* harmony export */ });
/**
 * The identifier for the data store.
 *
 * @type {string}
 */
const STORE_NAME = 'core/preferences';
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@wordpress/preferences/build-module/store/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/preferences/build-module/store/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   store: () => (/* binding */ store)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reducer */ "./node_modules/@wordpress/preferences/build-module/store/reducer.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions */ "./node_modules/@wordpress/preferences/build-module/store/actions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./selectors */ "./node_modules/@wordpress/preferences/build-module/store/selectors.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./node_modules/@wordpress/preferences/build-module/store/constants.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */





/**
 * Store definition for the preferences namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
const store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(_constants__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME, {
  reducer: _reducer__WEBPACK_IMPORTED_MODULE_2__["default"],
  actions: _actions__WEBPACK_IMPORTED_MODULE_3__,
  selectors: _selectors__WEBPACK_IMPORTED_MODULE_4__
});
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/preferences/build-module/store/reducer.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/preferences/build-module/store/reducer.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   defaults: () => (/* binding */ defaults),
/* harmony export */   preferences: () => (/* binding */ preferences)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * Reducer returning the defaults for user preferences.
 *
 * This is kept intentionally separate from the preferences
 * themselves so that defaults are not persisted.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function defaults(state = {}, action) {
  if (action.type === 'SET_PREFERENCE_DEFAULTS') {
    const {
      scope,
      defaults: values
    } = action;
    return {
      ...state,
      [scope]: {
        ...state[scope],
        ...values
      }
    };
  }
  return state;
}

/**
 * Higher order reducer that does the following:
 * - Merges any data from the persistence layer into the state when the
 *   `SET_PERSISTENCE_LAYER` action is received.
 * - Passes any preferences changes to the persistence layer.
 *
 * @param {Function} reducer The preferences reducer.
 *
 * @return {Function} The enhanced reducer.
 */
function withPersistenceLayer(reducer) {
  let persistenceLayer;
  return (state, action) => {
    // Setup the persistence layer, and return the persisted data
    // as the state.
    if (action.type === 'SET_PERSISTENCE_LAYER') {
      const {
        persistenceLayer: persistence,
        persistedData
      } = action;
      persistenceLayer = persistence;
      return persistedData;
    }
    const nextState = reducer(state, action);
    if (action.type === 'SET_PREFERENCE_VALUE') {
      persistenceLayer?.set(nextState);
    }
    return nextState;
  };
}

/**
 * Reducer returning the user preferences.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const preferences = withPersistenceLayer((state = {}, action) => {
  if (action.type === 'SET_PREFERENCE_VALUE') {
    const {
      scope,
      name,
      value
    } = action;
    return {
      ...state,
      [scope]: {
        ...state[scope],
        [name]: value
      }
    };
  }
  return state;
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  defaults,
  preferences
}));
//# sourceMappingURL=reducer.js.map

/***/ }),

/***/ "./node_modules/@wordpress/preferences/build-module/store/selectors.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@wordpress/preferences/build-module/store/selectors.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/deprecated */ "./node_modules/@wordpress/deprecated/build-module/index.js");
/**
 * WordPress dependencies
 */

const withDeprecatedKeys = originalGet => (state, scope, name) => {
  const settingsToMoveToCore = ['allowRightClickOverrides', 'distractionFree', 'editorMode', 'fixedToolbar', 'focusMode', 'hiddenBlockTypes', 'inactivePanels', 'keepCaretInsideBlock', 'mostUsedBlocks', 'openPanels', 'showBlockBreadcrumbs', 'showIconLabels', 'showListViewByDefault'];
  if (settingsToMoveToCore.includes(name) && ['core/edit-post', 'core/edit-site'].includes(scope)) {
    (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__["default"])(`wp.data.select( 'core/preferences' ).get( '${scope}', '${name}' )`, {
      since: '6.5',
      alternative: `wp.data.select( 'core/preferences' ).get( 'core', '${name}' )`
    });
    return originalGet(state, 'core', name);
  }
  return originalGet(state, scope, name);
};

/**
 * Returns a boolean indicating whether a prefer is active for a particular
 * scope.
 *
 * @param {Object} state The store state.
 * @param {string} scope The scope of the feature (e.g. core/edit-post).
 * @param {string} name  The name of the feature.
 *
 * @return {*} Is the feature enabled?
 */
const get = withDeprecatedKeys((state, scope, name) => {
  const value = state.preferences[scope]?.[name];
  return value !== undefined ? value : state.defaults[scope]?.[name];
});
//# sourceMappingURL=selectors.js.map

/***/ }),

/***/ "./node_modules/@wordpress/primitives/build-module/svg/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/primitives/build-module/svg/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Circle: () => (/* binding */ Circle),
/* harmony export */   Defs: () => (/* binding */ Defs),
/* harmony export */   G: () => (/* binding */ G),
/* harmony export */   Line: () => (/* binding */ Line),
/* harmony export */   LinearGradient: () => (/* binding */ LinearGradient),
/* harmony export */   Path: () => (/* binding */ Path),
/* harmony export */   Polygon: () => (/* binding */ Polygon),
/* harmony export */   RadialGradient: () => (/* binding */ RadialGradient),
/* harmony export */   Rect: () => (/* binding */ Rect),
/* harmony export */   SVG: () => (/* binding */ SVG),
/* harmony export */   Stop: () => (/* binding */ Stop)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */


/** @typedef {{isPressed?: boolean} & import('react').ComponentPropsWithoutRef<'svg'>} SVGProps */

/**
 * @param {import('react').ComponentPropsWithoutRef<'circle'>} props
 *
 * @return {JSX.Element} Circle component
 */
const Circle = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('circle', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'g'>} props
 *
 * @return {JSX.Element} G component
 */
const G = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('g', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'line'>} props
 *
 * @return {JSX.Element} Path component
 */
const Line = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('line', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'path'>} props
 *
 * @return {JSX.Element} Path component
 */
const Path = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('path', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'polygon'>} props
 *
 * @return {JSX.Element} Polygon component
 */
const Polygon = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('polygon', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'rect'>} props
 *
 * @return {JSX.Element} Rect component
 */
const Rect = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('rect', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'defs'>} props
 *
 * @return {JSX.Element} Defs component
 */
const Defs = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('defs', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'radialGradient'>} props
 *
 * @return {JSX.Element} RadialGradient component
 */
const RadialGradient = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('radialGradient', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'linearGradient'>} props
 *
 * @return {JSX.Element} LinearGradient component
 */
const LinearGradient = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('linearGradient', props);

/**
 * @param {import('react').ComponentPropsWithoutRef<'stop'>} props
 *
 * @return {JSX.Element} Stop component
 */
const Stop = props => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)('stop', props);
const SVG = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(
/**
 * @param {SVGProps}                                    props isPressed indicates whether the SVG should appear as pressed.
 *                                                            Other props will be passed through to svg component.
 * @param {import('react').ForwardedRef<SVGSVGElement>} ref   The forwarded ref to the SVG element.
 *
 * @return {JSX.Element} Stop component
 */
({
  className,
  isPressed,
  ...props
}, ref) => {
  const appliedProps = {
    ...props,
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, {
      'is-pressed': isPressed
    }) || undefined,
    'aria-hidden': true,
    focusable: false
  };

  // Disable reason: We need to have a way to render HTML tag for web.
  // eslint-disable-next-line react/forbid-elements
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("svg", {
    ...appliedProps,
    ref: ref
  });
});
SVG.displayName = 'SVG';
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/url/build-module/add-query-args.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/url/build-module/add-query-args.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addQueryArgs: () => (/* binding */ addQueryArgs)
/* harmony export */ });
/* harmony import */ var _get_query_args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-query-args */ "./node_modules/@wordpress/url/build-module/get-query-args.js");
/* harmony import */ var _build_query_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./build-query-string */ "./node_modules/@wordpress/url/build-module/build-query-string.js");
/**
 * Internal dependencies
 */



/**
 * Appends arguments as querystring to the provided URL. If the URL already
 * includes query arguments, the arguments are merged with (and take precedent
 * over) the existing set.
 *
 * @param {string} [url=''] URL to which arguments should be appended. If omitted,
 *                          only the resulting querystring is returned.
 * @param {Object} [args]   Query arguments to apply to URL.
 *
 * @example
 * ```js
 * const newURL = addQueryArgs( 'https://google.com', { q: 'test' } ); // https://google.com/?q=test
 * ```
 *
 * @return {string} URL with arguments applied.
 */
function addQueryArgs(url = '', args) {
  // If no arguments are to be appended, return original URL.
  if (!args || !Object.keys(args).length) {
    return url;
  }
  let baseUrl = url;

  // Determine whether URL already had query arguments.
  const queryStringIndex = url.indexOf('?');
  if (queryStringIndex !== -1) {
    // Merge into existing query arguments.
    args = Object.assign((0,_get_query_args__WEBPACK_IMPORTED_MODULE_0__.getQueryArgs)(url), args);

    // Change working base URL to omit previous query arguments.
    baseUrl = baseUrl.substr(0, queryStringIndex);
  }
  return baseUrl + '?' + (0,_build_query_string__WEBPACK_IMPORTED_MODULE_1__.buildQueryString)(args);
}
//# sourceMappingURL=add-query-args.js.map

/***/ }),

/***/ "./node_modules/@wordpress/url/build-module/build-query-string.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/url/build-module/build-query-string.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildQueryString: () => (/* binding */ buildQueryString)
/* harmony export */ });
/**
 * Generates URL-encoded query string using input query data.
 *
 * It is intended to behave equivalent as PHP's `http_build_query`, configured
 * with encoding type PHP_QUERY_RFC3986 (spaces as `%20`).
 *
 * @example
 * ```js
 * const queryString = buildQueryString( {
 *    simple: 'is ok',
 *    arrays: [ 'are', 'fine', 'too' ],
 *    objects: {
 *       evenNested: {
 *          ok: 'yes',
 *       },
 *    },
 * } );
 * // "simple=is%20ok&arrays%5B0%5D=are&arrays%5B1%5D=fine&arrays%5B2%5D=too&objects%5BevenNested%5D%5Bok%5D=yes"
 * ```
 *
 * @param {Record<string,*>} data Data to encode.
 *
 * @return {string} Query string.
 */
function buildQueryString(data) {
  let string = '';
  const stack = Object.entries(data);
  let pair;
  while (pair = stack.shift()) {
    let [key, value] = pair;

    // Support building deeply nested data, from array or object values.
    const hasNestedData = Array.isArray(value) || value && value.constructor === Object;
    if (hasNestedData) {
      // Push array or object values onto the stack as composed of their
      // original key and nested index or key, retaining order by a
      // combination of Array#reverse and Array#unshift onto the stack.
      const valuePairs = Object.entries(value).reverse();
      for (const [member, memberValue] of valuePairs) {
        stack.unshift([`${key}[${member}]`, memberValue]);
      }
    } else if (value !== undefined) {
      // Null is treated as special case, equivalent to empty string.
      if (value === null) {
        value = '';
      }
      string += '&' + [key, value].map(encodeURIComponent).join('=');
    }
  }

  // Loop will concatenate with leading `&`, but it's only expected for all
  // but the first query parameter. This strips the leading `&`, while still
  // accounting for the case that the string may in-fact be empty.
  return string.substr(1);
}
//# sourceMappingURL=build-query-string.js.map

/***/ }),

/***/ "./node_modules/@wordpress/url/build-module/get-query-args.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/url/build-module/get-query-args.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getQueryArgs: () => (/* binding */ getQueryArgs)
/* harmony export */ });
/* harmony import */ var _safe_decode_uri_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./safe-decode-uri-component */ "./node_modules/@wordpress/url/build-module/safe-decode-uri-component.js");
/* harmony import */ var _get_query_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-query-string */ "./node_modules/@wordpress/url/build-module/get-query-string.js");
/**
 * Internal dependencies
 */



/** @typedef {import('./get-query-arg').QueryArgParsed} QueryArgParsed */

/**
 * @typedef {Record<string,QueryArgParsed>} QueryArgs
 */

/**
 * Sets a value in object deeply by a given array of path segments. Mutates the
 * object reference.
 *
 * @param {Record<string,*>} object Object in which to assign.
 * @param {string[]}         path   Path segment at which to set value.
 * @param {*}                value  Value to set.
 */
function setPath(object, path, value) {
  const length = path.length;
  const lastIndex = length - 1;
  for (let i = 0; i < length; i++) {
    let key = path[i];
    if (!key && Array.isArray(object)) {
      // If key is empty string and next value is array, derive key from
      // the current length of the array.
      key = object.length.toString();
    }
    key = ['__proto__', 'constructor', 'prototype'].includes(key) ? key.toUpperCase() : key;

    // If the next key in the path is numeric (or empty string), it will be
    // created as an array. Otherwise, it will be created as an object.
    const isNextKeyArrayIndex = !isNaN(Number(path[i + 1]));
    object[key] = i === lastIndex ?
    // If at end of path, assign the intended value.
    value :
    // Otherwise, advance to the next object in the path, creating
    // it if it does not yet exist.
    object[key] || (isNextKeyArrayIndex ? [] : {});
    if (Array.isArray(object[key]) && !isNextKeyArrayIndex) {
      // If we current key is non-numeric, but the next value is an
      // array, coerce the value to an object.
      object[key] = {
        ...object[key]
      };
    }

    // Update working reference object to the next in the path.
    object = object[key];
  }
}

/**
 * Returns an object of query arguments of the given URL. If the given URL is
 * invalid or has no querystring, an empty object is returned.
 *
 * @param {string} url URL.
 *
 * @example
 * ```js
 * const foo = getQueryArgs( 'https://wordpress.org?foo=bar&bar=baz' );
 * // { "foo": "bar", "bar": "baz" }
 * ```
 *
 * @return {QueryArgs} Query args object.
 */
function getQueryArgs(url) {
  return ((0,_get_query_string__WEBPACK_IMPORTED_MODULE_0__.getQueryString)(url) || ''
  // Normalize space encoding, accounting for PHP URL encoding
  // corresponding to `application/x-www-form-urlencoded`.
  //
  // See: https://tools.ietf.org/html/rfc1866#section-8.2.1
  ).replace(/\+/g, '%20').split('&').reduce((accumulator, keyValue) => {
    const [key, value = ''] = keyValue.split('=')
    // Filtering avoids decoding as `undefined` for value, where
    // default is restored in destructuring assignment.
    .filter(Boolean).map(_safe_decode_uri_component__WEBPACK_IMPORTED_MODULE_1__.safeDecodeURIComponent);
    if (key) {
      const segments = key.replace(/\]/g, '').split('[');
      setPath(accumulator, segments, value);
    }
    return accumulator;
  }, Object.create(null));
}
//# sourceMappingURL=get-query-args.js.map

/***/ }),

/***/ "./node_modules/@wordpress/url/build-module/get-query-string.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/url/build-module/get-query-string.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getQueryString: () => (/* binding */ getQueryString)
/* harmony export */ });
/**
 * Returns the query string part of the URL.
 *
 * @param {string} url The full URL.
 *
 * @example
 * ```js
 * const queryString = getQueryString( 'http://localhost:8080/this/is/a/test?query=true#fragment' ); // 'query=true'
 * ```
 *
 * @return {string|void} The query string part of the URL.
 */
function getQueryString(url) {
  let query;
  try {
    query = new URL(url, 'http://example.com').search.substring(1);
  } catch (error) {}
  if (query) {
    return query;
  }
}
//# sourceMappingURL=get-query-string.js.map

/***/ }),

/***/ "./node_modules/@wordpress/url/build-module/safe-decode-uri-component.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@wordpress/url/build-module/safe-decode-uri-component.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   safeDecodeURIComponent: () => (/* binding */ safeDecodeURIComponent)
/* harmony export */ });
/**
 * Safely decodes a URI component with `decodeURIComponent`. Returns the URI component unmodified if
 * `decodeURIComponent` throws an error.
 *
 * @param {string} uriComponent URI component to decode.
 *
 * @return {string} Decoded URI component if possible.
 */
function safeDecodeURIComponent(uriComponent) {
  try {
    return decodeURIComponent(uriComponent);
  } catch (uriComponentError) {
    return uriComponent;
  }
}
//# sourceMappingURL=safe-decode-uri-component.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/if-viewport-matches.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/if-viewport-matches.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/higher-order/compose.js");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/higher-order/if-condition/index.js");
/* harmony import */ var _with_viewport_match__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./with-viewport-match */ "./node_modules/@wordpress/viewport/build-module/with-viewport-match.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


/**
 * Higher-order component creator, creating a new component which renders if
 * the viewport query is satisfied.
 *
 * @see withViewportMatches
 *
 * @param {string} query Viewport query.
 *
 * @example
 *
 * ```jsx
 * function MyMobileComponent() {
 * 	return <div>I'm only rendered on mobile viewports!</div>;
 * }
 *
 * MyMobileComponent = ifViewportMatches( '< small' )( MyMobileComponent );
 * ```
 *
 * @return {Function} Higher-order component.
 */
const ifViewportMatches = query => (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.createHigherOrderComponent)((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__["default"])([(0,_with_viewport_match__WEBPACK_IMPORTED_MODULE_0__["default"])({
  isViewportMatch: query
}), (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__["default"])(props => props.isViewportMatch)]), 'ifViewportMatches');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ifViewportMatches);
//# sourceMappingURL=if-viewport-matches.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ifViewportMatches: () => (/* reexport safe */ _if_viewport_matches__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   store: () => (/* reexport safe */ _store__WEBPACK_IMPORTED_MODULE_1__.store),
/* harmony export */   withViewportMatch: () => (/* reexport safe */ _with_viewport_match__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./listener */ "./node_modules/@wordpress/viewport/build-module/listener.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./node_modules/@wordpress/viewport/build-module/store/index.js");
/* harmony import */ var _if_viewport_matches__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./if-viewport-matches */ "./node_modules/@wordpress/viewport/build-module/if-viewport-matches.js");
/* harmony import */ var _with_viewport_match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./with-viewport-match */ "./node_modules/@wordpress/viewport/build-module/with-viewport-match.js");
/**
 * Internal dependencies
 */





/**
 * Hash of breakpoint names with pixel width at which it becomes effective.
 *
 * @see _breakpoints.scss
 *
 * @type {Object}
 */
const BREAKPOINTS = {
  huge: 1440,
  wide: 1280,
  large: 960,
  medium: 782,
  small: 600,
  mobile: 480
};

/**
 * Hash of query operators with corresponding condition for media query.
 *
 * @type {Object}
 */
const OPERATORS = {
  '<': 'max-width',
  '>=': 'min-width'
};
(0,_listener__WEBPACK_IMPORTED_MODULE_0__["default"])(BREAKPOINTS, OPERATORS);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/listener.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/listener.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/utils/debounce/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./node_modules/@wordpress/viewport/build-module/store/index.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */

const addDimensionsEventListener = (breakpoints, operators) => {
  /**
   * Callback invoked when media query state should be updated. Is invoked a
   * maximum of one time per call stack.
   */
  const setIsMatching = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.debounce)(() => {
    const values = Object.fromEntries(queries.map(([key, query]) => [key, query.matches]));
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_store__WEBPACK_IMPORTED_MODULE_1__.store).setIsMatching(values);
  }, 0, {
    leading: true
  });

  /**
   * Hash of breakpoint names with generated MediaQueryList for corresponding
   * media query.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
   *
   * @type {Object<string,MediaQueryList>}
   */
  const operatorEntries = Object.entries(operators);
  const queries = Object.entries(breakpoints).flatMap(([name, width]) => {
    return operatorEntries.map(([operator, condition]) => {
      const list = window.matchMedia(`(${condition}: ${width}px)`);
      list.addEventListener('change', setIsMatching);
      return [`${operator} ${name}`, list];
    });
  });
  window.addEventListener('orientationchange', setIsMatching);

  // Set initial values.
  setIsMatching();
  setIsMatching.flush();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addDimensionsEventListener);
//# sourceMappingURL=listener.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/store/actions.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/store/actions.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setIsMatching: () => (/* binding */ setIsMatching)
/* harmony export */ });
/**
 * Returns an action object used in signalling that viewport queries have been
 * updated. Values are specified as an object of breakpoint query keys where
 * value represents whether query matches.
 * Ignored from documentation as it is for internal use only.
 *
 * @ignore
 *
 * @param {Object} values Breakpoint query matches.
 *
 * @return {Object} Action object.
 */
function setIsMatching(values) {
  return {
    type: 'SET_IS_MATCHING',
    values
  };
}
//# sourceMappingURL=actions.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/store/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/store/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   store: () => (/* binding */ store)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reducer */ "./node_modules/@wordpress/viewport/build-module/store/reducer.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions */ "./node_modules/@wordpress/viewport/build-module/store/actions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectors */ "./node_modules/@wordpress/viewport/build-module/store/selectors.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */



const STORE_NAME = 'core/viewport';

/**
 * Store definition for the viewport namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
const store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(STORE_NAME, {
  reducer: _reducer__WEBPACK_IMPORTED_MODULE_1__["default"],
  actions: _actions__WEBPACK_IMPORTED_MODULE_2__,
  selectors: _selectors__WEBPACK_IMPORTED_MODULE_3__
});
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/store/reducer.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/store/reducer.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Reducer returning the viewport state, as keys of breakpoint queries with
 * boolean value representing whether query is matched.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function reducer(state = {}, action) {
  switch (action.type) {
    case 'SET_IS_MATCHING':
      return action.values;
  }
  return state;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer);
//# sourceMappingURL=reducer.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/store/selectors.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/store/selectors.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isViewportMatch: () => (/* binding */ isViewportMatch)
/* harmony export */ });
/**
 * Returns true if the viewport matches the given query, or false otherwise.
 *
 * @param {Object} state Viewport state object.
 * @param {string} query Query string. Includes operator and breakpoint name,
 *                       space separated. Operator defaults to >=.
 *
 * @example
 *
 * ```js
 * import { store as viewportStore } from '@wordpress/viewport';
 * import { useSelect } from '@wordpress/data';
 * import { __ } from '@wordpress/i18n';
 * const ExampleComponent = () => {
 *     const isMobile = useSelect(
 *         ( select ) => select( viewportStore ).isViewportMatch( '< small' ),
 *         []
 *     );
 *
 *     return isMobile ? (
 *         <div>{ __( 'Mobile' ) }</div>
 *     ) : (
 *         <div>{ __( 'Not Mobile' ) }</div>
 *     );
 * };
 * ```
 *
 * @return {boolean} Whether viewport matches query.
 */
function isViewportMatch(state, query) {
  // Default to `>=` if no operator is present.
  if (query.indexOf(' ') === -1) {
    query = '>= ' + query;
  }
  return !!state[query];
}
//# sourceMappingURL=selectors.js.map

/***/ }),

/***/ "./node_modules/@wordpress/viewport/build-module/with-viewport-match.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/viewport/build-module/with-viewport-match.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/hooks/use-viewport-match/index.js");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/utils/create-higher-order-component/index.js");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "./node_modules/@wordpress/compose/build-module/higher-order/pure/index.js");

/**
 * WordPress dependencies
 */


/**
 * Higher-order component creator, creating a new component which renders with
 * the given prop names, where the value passed to the underlying component is
 * the result of the query assigned as the object's value.
 *
 * @see isViewportMatch
 *
 * @param {Object} queries Object of prop name to viewport query.
 *
 * @example
 *
 * ```jsx
 * function MyComponent( { isMobile } ) {
 * 	return (
 * 		<div>Currently: { isMobile ? 'Mobile' : 'Not Mobile' }</div>
 * 	);
 * }
 *
 * MyComponent = withViewportMatch( { isMobile: '< small' } )( MyComponent );
 * ```
 *
 * @return {Function} Higher-order component.
 */
const withViewportMatch = queries => {
  const queryEntries = Object.entries(queries);
  const useViewPortQueriesResult = () => Object.fromEntries(queryEntries.map(([key, query]) => {
    let [operator, breakpointName] = query.split(' ');
    if (breakpointName === undefined) {
      breakpointName = operator;
      operator = '>=';
    }
    // Hooks should unconditionally execute in the same order,
    // we are respecting that as from the static query of the HOC we generate
    // a hook that calls other hooks always in the same order (because the query never changes).
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return [key, (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__["default"])(breakpointName, operator)];
  }));
  return (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(WrappedComponent => {
    return (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__["default"])(props => {
      const queriesResult = useViewPortQueriesResult();
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(WrappedComponent, {
        ...props,
        ...queriesResult
      });
    });
  }, 'withViewportMatch');
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (withViewportMatch);
//# sourceMappingURL=with-viewport-match.js.map

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/FullscreenModeClose.jsx":
/*!***************************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/FullscreenModeClose.jsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FullscreenModeClose: () => (/* binding */ FullscreenModeClose)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/url */ "./node_modules/@wordpress/url/build-module/add-query-args.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/wordpress.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store */ "./src/assets/jsx/workflow-editor/store.jsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/assets/jsx/workflow-editor/constants.jsx");







function FullscreenModeClose(_ref) {
  var showTooltip = _ref.showTooltip;
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(function (select) {
      var _select = select(_store__WEBPACK_IMPORTED_MODULE_3__.store),
        getPostType = _select.getPostType;
      var _select2 = select(_store__WEBPACK_IMPORTED_MODULE_3__.store),
        isFeatureActive = _select2.isFeatureActive;
      return {
        isActive: isFeatureActive('fullscreenMode'),
        postType: getPostType()
      };
    }, []),
    isActive = _useSelect.isActive,
    postType = _useSelect.postType;
  if (!isActive || !postType) {
    return null;
  }
  var buttonIcon = /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    size: "36px",
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"]
  });
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__unstableMotion.div, {
    whileHover: "expand"
  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    className: "edit-post-fullscreen-mode-close",
    href: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_6__.addQueryArgs)('edit.php', {
      post_type: _constants__WEBPACK_IMPORTED_MODULE_4__.POST_TYPE
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Back'),
    showTooltip: showTooltip
  }, buttonIcon));
}

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/LayoutContent.jsx":
/*!*********************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/LayoutContent.jsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutContent: () => (/* binding */ LayoutContent)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store */ "./src/assets/jsx/workflow-editor/store.jsx");
/* harmony import */ var reactflow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactflow */ "./node_modules/@reactflow/core/dist/esm/index.mjs");
/* harmony import */ var reactflow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reactflow */ "./node_modules/@reactflow/background/dist/esm/index.mjs");



var LayoutContent = function LayoutContent(props) {
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(function (select) {
      return {
        nodes: select(_store__WEBPACK_IMPORTED_MODULE_1__.store).getNodes(),
        edges: select(_store__WEBPACK_IMPORTED_MODULE_1__.store).getEdges()
      };
    }),
    nodes = _useSelect.nodes,
    edges = _useSelect.edges;
  var proOptions = {
    // TODO: Change this to true after we start supporting the pro version of ReactFlow.
    hideAttribution: false
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(reactflow__WEBPACK_IMPORTED_MODULE_2__.ReactFlowProvider, null, /*#__PURE__*/React.createElement(reactflow__WEBPACK_IMPORTED_MODULE_2__.ReactFlow, {
    defaultNodes: nodes,
    defaultEdges: edges,
    fitView: true,
    proOptions: proOptions,
    nodesDraggable: true
  }, /*#__PURE__*/React.createElement(reactflow__WEBPACK_IMPORTED_MODULE_3__.Background, null))));
};

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/LayoutFooter.jsx":
/*!********************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/LayoutFooter.jsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutFooter: () => (/* binding */ LayoutFooter)
/* harmony export */ });
var LayoutFooter = function LayoutFooter(props) {
  return /*#__PURE__*/React.createElement("div", null, "PublishPress Future Workflow Editor");
};

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/LayoutHeader.jsx":
/*!********************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/LayoutHeader.jsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutHeader: () => (/* binding */ LayoutHeader)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store */ "./src/assets/jsx/workflow-editor/store.jsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/assets/jsx/workflow-editor/constants.jsx");
/* harmony import */ var _FullscreenModeClose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FullscreenModeClose */ "./src/assets/jsx/workflow-editor/components/FullscreenModeClose.jsx");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);






var LayoutHeader = function LayoutHeader() {
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(function (select) {
      return {
        isFullscreenActive: select(_store__WEBPACK_IMPORTED_MODULE_1__.store).isFeatureActive(_constants__WEBPACK_IMPORTED_MODULE_2__.FEATURE_FULLSCREEN_MODE),
        hasReducedUI: select(_store__WEBPACK_IMPORTED_MODULE_1__.store).isFeatureActive(_constants__WEBPACK_IMPORTED_MODULE_2__.FEATURE_REDUCED_UI)
      };
    }),
    isFullscreenActive = _useSelect.isFullscreenActive,
    hasReducedUI = _useSelect.hasReducedUI;
  var headerClasses = 'edit-post-header ' + (hasReducedUI ? 'has-reduced-ui' : '');
  return /*#__PURE__*/React.createElement("div", {
    className: headerClasses
  }, isFullscreenActive && /*#__PURE__*/React.createElement(_FullscreenModeClose__WEBPACK_IMPORTED_MODULE_3__.FullscreenModeClose, null), /*#__PURE__*/React.createElement("div", {
    className: "edit-post-header__toolbar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "edit-post-header__settings"
  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    variant: "link"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Save Draft')), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    variant: "primary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Publish'))));
};

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/WorkflowEditorInterface.jsx":
/*!*******************************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/WorkflowEditorInterface.jsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkflowEditorInterface: () => (/* binding */ WorkflowEditorInterface)
/* harmony export */ });
/* harmony import */ var _wordpress_interface__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interface */ "./node_modules/@wordpress/interface/build-module/index.js");
/* harmony import */ var _LayoutContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LayoutContent */ "./src/assets/jsx/workflow-editor/components/LayoutContent.jsx");
/* harmony import */ var _LayoutFooter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LayoutFooter */ "./src/assets/jsx/workflow-editor/components/LayoutFooter.jsx");
/* harmony import */ var _LayoutHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LayoutHeader */ "./src/assets/jsx/workflow-editor/components/LayoutHeader.jsx");




function WorkflowEditorInterface(props) {
  return /*#__PURE__*/React.createElement(_wordpress_interface__WEBPACK_IMPORTED_MODULE_0__.InterfaceSkeleton, {
    header: /*#__PURE__*/React.createElement(_LayoutHeader__WEBPACK_IMPORTED_MODULE_3__.LayoutHeader, null),
    content: /*#__PURE__*/React.createElement(_LayoutContent__WEBPACK_IMPORTED_MODULE_1__.LayoutContent, null),
    footer: /*#__PURE__*/React.createElement(_LayoutFooter__WEBPACK_IMPORTED_MODULE_2__.LayoutFooter, null)
  });
}

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/WorkflowEditorLayout.jsx":
/*!****************************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/WorkflowEditorLayout.jsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkflowEditorLayout: () => (/* binding */ WorkflowEditorLayout)
/* harmony export */ });
/* harmony import */ var _wordpress_interface__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interface */ "./node_modules/@wordpress/interface/build-module/index.js");
/* harmony import */ var _WorkflowEditorInterface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WorkflowEditorInterface */ "./src/assets/jsx/workflow-editor/components/WorkflowEditorInterface.jsx");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/assets/jsx/workflow-editor/utils.jsx");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../store */ "./src/assets/jsx/workflow-editor/store.jsx");






function WorkflowEditorLayout() {
  var _useSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(function (select) {
      return {
        isFullscreenActive: select(_store__WEBPACK_IMPORTED_MODULE_5__.store).isFeatureActive('fullscreenMode')
      };
    }),
    isFullscreenActive = _useSelect.isFullscreenActive;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
    var bodyClasses = ['workflow-editor'];
    (0,_utils__WEBPACK_IMPORTED_MODULE_4__.addBodyClasses)(bodyClasses);
    return function () {
      (0,_utils__WEBPACK_IMPORTED_MODULE_4__.removeBodyClasses)(bodyClasses);
    };
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_interface__WEBPACK_IMPORTED_MODULE_0__.FullscreenMode, {
    isActive: isFullscreenActive
  }), /*#__PURE__*/React.createElement(_WorkflowEditorInterface__WEBPACK_IMPORTED_MODULE_1__.WorkflowEditorInterface, null));
}

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/components/index.jsx":
/*!*************************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/components/index.jsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutContent: () => (/* reexport safe */ _LayoutContent__WEBPACK_IMPORTED_MODULE_0__.LayoutContent),
/* harmony export */   LayoutFooter: () => (/* reexport safe */ _LayoutFooter__WEBPACK_IMPORTED_MODULE_1__.LayoutFooter),
/* harmony export */   LayoutHeader: () => (/* reexport safe */ _LayoutHeader__WEBPACK_IMPORTED_MODULE_2__.LayoutHeader),
/* harmony export */   WorkflowEditorInterface: () => (/* reexport safe */ _WorkflowEditorInterface__WEBPACK_IMPORTED_MODULE_3__.WorkflowEditorInterface),
/* harmony export */   WorkflowEditorLayout: () => (/* reexport safe */ _WorkflowEditorLayout__WEBPACK_IMPORTED_MODULE_4__.WorkflowEditorLayout)
/* harmony export */ });
/* harmony import */ var _LayoutContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LayoutContent */ "./src/assets/jsx/workflow-editor/components/LayoutContent.jsx");
/* harmony import */ var _LayoutFooter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LayoutFooter */ "./src/assets/jsx/workflow-editor/components/LayoutFooter.jsx");
/* harmony import */ var _LayoutHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LayoutHeader */ "./src/assets/jsx/workflow-editor/components/LayoutHeader.jsx");
/* harmony import */ var _WorkflowEditorInterface__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WorkflowEditorInterface */ "./src/assets/jsx/workflow-editor/components/WorkflowEditorInterface.jsx");
/* harmony import */ var _WorkflowEditorLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WorkflowEditorLayout */ "./src/assets/jsx/workflow-editor/components/WorkflowEditorLayout.jsx");







/***/ }),

/***/ "./src/assets/jsx/workflow-editor/constants.jsx":
/*!******************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/constants.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FEATURE_FULLSCREEN_MODE: () => (/* binding */ FEATURE_FULLSCREEN_MODE),
/* harmony export */   FEATURE_REDUCED_UI: () => (/* binding */ FEATURE_REDUCED_UI),
/* harmony export */   HTML_ELEMENT_ID: () => (/* binding */ HTML_ELEMENT_ID),
/* harmony export */   POST_TYPE: () => (/* binding */ POST_TYPE),
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME)
/* harmony export */ });
var POST_TYPE = 'ppfuture_workflow';
var STORE_NAME = 'publishpress-future/workflow-editor';
var HTML_ELEMENT_ID = 'future-workflow-editor';
var FEATURE_FULLSCREEN_MODE = 'fullscreenMode';
var FEATURE_REDUCED_UI = 'reducedUI';

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/demoData.jsx":
/*!*****************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/demoData.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   edges: () => (/* binding */ edges),
/* harmony export */   nodes: () => (/* binding */ nodes)
/* harmony export */ });
var nodeStyle = {
  color: '#0041d0',
  borderColor: '#0041d0'
};
var nodes = [{
  type: 'input',
  id: '1',
  data: {
    label: 'Thanks'
  },
  position: {
    x: 100,
    y: 0
  },
  style: nodeStyle
}, {
  id: '2',
  data: {
    label: 'for'
  },
  position: {
    x: 0,
    y: 100
  },
  style: nodeStyle
}, {
  id: '3',
  data: {
    label: 'using'
  },
  position: {
    x: 200,
    y: 100
  },
  style: nodeStyle
}, {
  id: '4',
  data: {
    label: 'React Flow Pro!'
  },
  position: {
    x: 100,
    y: 200
  },
  style: nodeStyle
}];
var edges = [{
  id: '1->2',
  source: '1',
  target: '2',
  animated: true
}, {
  id: '1->3',
  source: '1',
  target: '3',
  animated: true
}, {
  id: '2->4',
  source: '2',
  target: '4',
  animated: true
}, {
  id: '3->4',
  source: '3',
  target: '4',
  animated: true
}];

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/store.jsx":
/*!**************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/store.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   store: () => (/* binding */ store),
/* harmony export */   storeConfig: () => (/* binding */ storeConfig)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/assets/jsx/workflow-editor/constants.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var storeConfig = {
  activeFeatures: [_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_FULLSCREEN_MODE],
  postType: _constants__WEBPACK_IMPORTED_MODULE_1__.POST_TYPE,
  nodes: [],
  edges: []
};
var store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(_constants__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME, {
  reducer: function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : storeConfig;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    switch (action.type) {
      case 'SET_ACTIVE_FEATURES':
        return _objectSpread(_objectSpread({}, state), {}, {
          activeFeatures: action.payload
        });
      case 'TOGGLE_FEATURE':
        var feature = action.payload;
        var activeFeatures = _toConsumableArray(state.activeFeatures);
        if (activeFeatures.includes(feature)) {
          activeFeatures = activeFeatures.filter(function (f) {
            return f !== feature;
          });
        } else {
          activeFeatures.push(feature);
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          activeFeatures: activeFeatures
        });
      case 'SET_POST_TYPE':
        return _objectSpread(_objectSpread({}, state), {}, {
          postType: action.payload
        });
      case 'SET_NODES':
        return _objectSpread(_objectSpread({}, state), {}, {
          nodes: action.payload
        });
      case 'SET_EDGES':
        return _objectSpread(_objectSpread({}, state), {}, {
          edges: action.payload
        });
    }
    return state;
  },
  actions: {
    setActiveFeatures: function setActiveFeatures(activeFeatures) {
      return {
        type: 'SET_ACTIVE_FEATURES',
        payload: activeFeatures
      };
    },
    toggleFeature: function toggleFeature(feature) {
      return {
        type: 'TOGGLE_FEATURE',
        payload: feature
      };
    },
    setPostType: function setPostType(postType) {
      return {
        type: 'SET_POST_TYPE',
        payload: postType
      };
    },
    setNodes: function setNodes(nodes) {
      return {
        type: 'SET_NODES',
        payload: nodes
      };
    },
    setEdges: function setEdges(edges) {
      return {
        type: 'SET_EDGES',
        payload: edges
      };
    }
  },
  selectors: {
    getActiveFeatures: function getActiveFeatures(state) {
      return state.activeFeatures;
    },
    isFeatureActive: function isFeatureActive(state, feature) {
      return state.activeFeatures.includes(feature);
    },
    getPostType: function getPostType(state) {
      return state.postType;
    },
    getNodes: function getNodes(state) {
      return state.nodes;
    },
    getEdges: function getEdges(state) {
      return state.edges;
    }
  }
});
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);

/***/ }),

/***/ "./src/assets/jsx/workflow-editor/utils.jsx":
/*!**************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/utils.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBodyClass: () => (/* binding */ addBodyClass),
/* harmony export */   addBodyClasses: () => (/* binding */ addBodyClasses),
/* harmony export */   removeBodyClass: () => (/* binding */ removeBodyClass),
/* harmony export */   removeBodyClasses: () => (/* binding */ removeBodyClasses)
/* harmony export */ });
function addBodyClass(className) {
  if (document.body.classList.contains(className)) return;
  document.body.classList.add(className);
}
;
function removeBodyClass(className) {
  if (!document.body.classList.contains(className)) return;
  document.body.classList.remove(className);
}
function addBodyClasses(classNames) {
  classNames.forEach(function (className) {
    return addBodyClass(className);
  });
}
function removeBodyClasses(classNames) {
  classNames.forEach(function (className) {
    return removeBodyClass(className);
  });
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/reactflow/dist/style.css":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/reactflow/dist/style.css ***!
  \*******************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* this gets exported as style.css and can be used for the default theming */
/* these are the necessary styles for React Flow, they get used by base.css and style.css */
.react-flow__container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.react-flow__pane {
  z-index: 1;
  cursor: -webkit-grab;
  cursor: grab;
}
.react-flow__pane.selection {
    cursor: pointer;
  }
.react-flow__pane.dragging {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }
.react-flow__viewport {
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}
.react-flow__renderer {
  z-index: 4;
}
.react-flow__selection {
  z-index: 6;
}
.react-flow__nodesselection-rect:focus,
.react-flow__nodesselection-rect:focus-visible {
  outline: none;
}
.react-flow .react-flow__edges {
  pointer-events: none;
  overflow: visible;
}
.react-flow__edge-path,
.react-flow__connection-path {
  stroke: #b1b1b7;
  stroke-width: 1;
  fill: none;
}
.react-flow__edge {
  pointer-events: visibleStroke;
  cursor: pointer;
}
.react-flow__edge.animated path {
    stroke-dasharray: 5;
    -webkit-animation: dashdraw 0.5s linear infinite;
            animation: dashdraw 0.5s linear infinite;
  }
.react-flow__edge.animated path.react-flow__edge-interaction {
    stroke-dasharray: none;
    -webkit-animation: none;
            animation: none;
  }
.react-flow__edge.inactive {
    pointer-events: none;
  }
.react-flow__edge.selected,
  .react-flow__edge:focus,
  .react-flow__edge:focus-visible {
    outline: none;
  }
.react-flow__edge.selected .react-flow__edge-path,
  .react-flow__edge:focus .react-flow__edge-path,
  .react-flow__edge:focus-visible .react-flow__edge-path {
    stroke: #555;
  }
.react-flow__edge-textwrapper {
    pointer-events: all;
  }
.react-flow__edge-textbg {
    fill: white;
  }
.react-flow__edge .react-flow__edge-text {
    pointer-events: none;
    -webkit-user-select: none;
       -moz-user-select: none;
            user-select: none;
  }
.react-flow__connection {
  pointer-events: none;
}
.react-flow__connection .animated {
    stroke-dasharray: 5;
    -webkit-animation: dashdraw 0.5s linear infinite;
            animation: dashdraw 0.5s linear infinite;
  }
.react-flow__connectionline {
  z-index: 1001;
}
.react-flow__nodes {
  pointer-events: none;
  transform-origin: 0 0;
}
.react-flow__node {
  position: absolute;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  pointer-events: all;
  transform-origin: 0 0;
  box-sizing: border-box;
  cursor: -webkit-grab;
  cursor: grab;
}
.react-flow__node.dragging {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }
.react-flow__nodesselection {
  z-index: 3;
  transform-origin: left top;
  pointer-events: none;
}
.react-flow__nodesselection-rect {
    position: absolute;
    pointer-events: all;
    cursor: -webkit-grab;
    cursor: grab;
  }
.react-flow__handle {
  position: absolute;
  pointer-events: none;
  min-width: 5px;
  min-height: 5px;
  width: 6px;
  height: 6px;
  background: #1a192b;
  border: 1px solid white;
  border-radius: 100%;
}
.react-flow__handle.connectionindicator {
    pointer-events: all;
    cursor: crosshair;
  }
.react-flow__handle-bottom {
    top: auto;
    left: 50%;
    bottom: -4px;
    transform: translate(-50%, 0);
  }
.react-flow__handle-top {
    left: 50%;
    top: -4px;
    transform: translate(-50%, 0);
  }
.react-flow__handle-left {
    top: 50%;
    left: -4px;
    transform: translate(0, -50%);
  }
.react-flow__handle-right {
    right: -4px;
    top: 50%;
    transform: translate(0, -50%);
  }
.react-flow__edgeupdater {
  cursor: move;
  pointer-events: all;
}
.react-flow__panel {
  position: absolute;
  z-index: 5;
  margin: 15px;
}
.react-flow__panel.top {
    top: 0;
  }
.react-flow__panel.bottom {
    bottom: 0;
  }
.react-flow__panel.left {
    left: 0;
  }
.react-flow__panel.right {
    right: 0;
  }
.react-flow__panel.center {
    left: 50%;
    transform: translateX(-50%);
  }
.react-flow__attribution {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 2px 3px;
  margin: 0;
}
.react-flow__attribution a {
    text-decoration: none;
    color: #999;
  }
@-webkit-keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}
@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}
.react-flow__edgelabel-renderer {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.react-flow__edge.updating .react-flow__edge-path {
      stroke: #777;
    }
.react-flow__edge-text {
    font-size: 10px;
  }
.react-flow__node.selectable:focus,
  .react-flow__node.selectable:focus-visible {
    outline: none;
  }
.react-flow__node-default,
.react-flow__node-input,
.react-flow__node-output,
.react-flow__node-group {
  padding: 10px;
  border-radius: 3px;
  width: 150px;
  font-size: 12px;
  color: #222;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: #1a192b;
  background-color: white;
}
.react-flow__node-default.selectable:hover, .react-flow__node-input.selectable:hover, .react-flow__node-output.selectable:hover, .react-flow__node-group.selectable:hover {
      box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
    }
.react-flow__node-default.selectable.selected,
    .react-flow__node-default.selectable:focus,
    .react-flow__node-default.selectable:focus-visible,
    .react-flow__node-input.selectable.selected,
    .react-flow__node-input.selectable:focus,
    .react-flow__node-input.selectable:focus-visible,
    .react-flow__node-output.selectable.selected,
    .react-flow__node-output.selectable:focus,
    .react-flow__node-output.selectable:focus-visible,
    .react-flow__node-group.selectable.selected,
    .react-flow__node-group.selectable:focus,
    .react-flow__node-group.selectable:focus-visible {
      box-shadow: 0 0 0 0.5px #1a192b;
    }
.react-flow__node-group {
  background-color: rgba(240, 240, 240, 0.25);
}
.react-flow__nodesselection-rect,
.react-flow__selection {
  background: rgba(0, 89, 220, 0.08);
  border: 1px dotted rgba(0, 89, 220, 0.8);
}
.react-flow__nodesselection-rect:focus,
  .react-flow__nodesselection-rect:focus-visible,
  .react-flow__selection:focus,
  .react-flow__selection:focus-visible {
    outline: none;
  }
.react-flow__controls {
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
}
.react-flow__controls-button {
    border: none;
    background: #fefefe;
    border-bottom: 1px solid #eee;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    cursor: pointer;
    -webkit-user-select: none;
       -moz-user-select: none;
            user-select: none;
    padding: 5px;
  }
.react-flow__controls-button:hover {
      background: #f4f4f4;
    }
.react-flow__controls-button svg {
      width: 100%;
      max-width: 12px;
      max-height: 12px;
    }
.react-flow__controls-button:disabled {
      pointer-events: none;
    }
.react-flow__controls-button:disabled svg {
        fill-opacity: 0.4;
      }
.react-flow__minimap {
  background-color: #fff;
}
.react-flow__resize-control {
  position: absolute;
}
.react-flow__resize-control.left,
.react-flow__resize-control.right {
  cursor: ew-resize;
}
.react-flow__resize-control.top,
.react-flow__resize-control.bottom {
  cursor: ns-resize;
}
.react-flow__resize-control.top.left,
.react-flow__resize-control.bottom.right {
  cursor: nwse-resize;
}
.react-flow__resize-control.bottom.left,
.react-flow__resize-control.top.right {
  cursor: nesw-resize;
}
/* handle styles */
.react-flow__resize-control.handle {
  width: 4px;
  height: 4px;
  border: 1px solid #fff;
  border-radius: 1px;
  background-color: #3367d9;
  transform: translate(-50%, -50%);
}
.react-flow__resize-control.handle.left {
  left: 0;
  top: 50%;
}
.react-flow__resize-control.handle.right {
  left: 100%;
  top: 50%;
}
.react-flow__resize-control.handle.top {
  left: 50%;
  top: 0;
}
.react-flow__resize-control.handle.bottom {
  left: 50%;
  top: 100%;
}
.react-flow__resize-control.handle.top.left {
  left: 0;
}
.react-flow__resize-control.handle.bottom.left {
  left: 0;
}
.react-flow__resize-control.handle.top.right {
  left: 100%;
}
.react-flow__resize-control.handle.bottom.right {
  left: 100%;
}
/* line styles */
.react-flow__resize-control.line {
  border-color: #3367d9;
  border-width: 0;
  border-style: solid;
}
.react-flow__resize-control.line.left,
.react-flow__resize-control.line.right {
  width: 1px;
  transform: translate(-50%, 0);
  top: 0;
  height: 100%;
}
.react-flow__resize-control.line.left {
  left: 0;
  border-left-width: 1px;
}
.react-flow__resize-control.line.right {
  left: 100%;
  border-right-width: 1px;
}
.react-flow__resize-control.line.top,
.react-flow__resize-control.line.bottom {
  height: 1px;
  transform: translate(0, -50%);
  left: 0;
  width: 100%;
}
.react-flow__resize-control.line.top {
  top: 0;
  border-top-width: 1px;
}
.react-flow__resize-control.line.bottom {
  border-bottom-width: 1px;
  top: 100%;
}
`, "",{"version":3,"sources":["webpack://./node_modules/reactflow/dist/style.css"],"names":[],"mappings":"AAAA,4EAA4E;AAC5E,2FAA2F;AAC3F;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,MAAM;EACN,OAAO;AACT;AACA;EACE,UAAU;EACV,oBAAoB;EACpB,YAAY;AACd;AACA;IACI,eAAe;EACjB;AACF;IACI,wBAAwB;IACxB,gBAAgB;EAClB;AACF;EACE,qBAAqB;EACrB,UAAU;EACV,oBAAoB;AACtB;AACA;EACE,UAAU;AACZ;AACA;EACE,UAAU;AACZ;AACA;;EAEE,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,iBAAiB;AACnB;AACA;;EAEE,eAAe;EACf,eAAe;EACf,UAAU;AACZ;AACA;EACE,6BAA6B;EAC7B,eAAe;AACjB;AACA;IACI,mBAAmB;IACnB,gDAAgD;YACxC,wCAAwC;EAClD;AACF;IACI,sBAAsB;IACtB,uBAAuB;YACf,eAAe;EACzB;AACF;IACI,oBAAoB;EACtB;AACF;;;IAGI,aAAa;EACf;AACF;;;IAGI,YAAY;EACd;AACF;IACI,mBAAmB;EACrB;AACF;IACI,WAAW;EACb;AACF;IACI,oBAAoB;IACpB,yBAAyB;OACtB,sBAAsB;YACjB,iBAAiB;EAC3B;AACF;EACE,oBAAoB;AACtB;AACA;IACI,mBAAmB;IACnB,gDAAgD;YACxC,wCAAwC;EAClD;AACF;EACE,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,qBAAqB;AACvB;AACA;EACE,kBAAkB;EAClB,yBAAyB;KACtB,sBAAsB;UACjB,iBAAiB;EACzB,mBAAmB;EACnB,qBAAqB;EACrB,sBAAsB;EACtB,oBAAoB;EACpB,YAAY;AACd;AACA;IACI,wBAAwB;IACxB,gBAAgB;EAClB;AACF;EACE,UAAU;EACV,0BAA0B;EAC1B,oBAAoB;AACtB;AACA;IACI,kBAAkB;IAClB,mBAAmB;IACnB,oBAAoB;IACpB,YAAY;EACd;AACF;EACE,kBAAkB;EAClB,oBAAoB;EACpB,cAAc;EACd,eAAe;EACf,UAAU;EACV,WAAW;EACX,mBAAmB;EACnB,uBAAuB;EACvB,mBAAmB;AACrB;AACA;IACI,mBAAmB;IACnB,iBAAiB;EACnB;AACF;IACI,SAAS;IACT,SAAS;IACT,YAAY;IACZ,6BAA6B;EAC/B;AACF;IACI,SAAS;IACT,SAAS;IACT,6BAA6B;EAC/B;AACF;IACI,QAAQ;IACR,UAAU;IACV,6BAA6B;EAC/B;AACF;IACI,WAAW;IACX,QAAQ;IACR,6BAA6B;EAC/B;AACF;EACE,YAAY;EACZ,mBAAmB;AACrB;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,YAAY;AACd;AACA;IACI,MAAM;EACR;AACF;IACI,SAAS;EACX;AACF;IACI,OAAO;EACT;AACF;IACI,QAAQ;EACV;AACF;IACI,SAAS;IACT,2BAA2B;EAC7B;AACF;EACE,eAAe;EACf,oCAAoC;EACpC,gBAAgB;EAChB,SAAS;AACX;AACA;IACI,qBAAqB;IACrB,WAAW;EACb;AACF;EACE;IACE,qBAAqB;EACvB;AACF;AACA;EACE;IACE,qBAAqB;EACvB;AACF;AACA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,yBAAyB;KACtB,sBAAsB;UACjB,iBAAiB;AAC3B;AACA;MACM,YAAY;IACd;AACJ;IACI,eAAe;EACjB;AACF;;IAEI,aAAa;EACf;AACF;;;;EAIE,aAAa;EACb,kBAAkB;EAClB,YAAY;EACZ,eAAe;EACf,WAAW;EACX,kBAAkB;EAClB,iBAAiB;EACjB,mBAAmB;EACnB,qBAAqB;EACrB,uBAAuB;AACzB;AACA;MACM,6CAA6C;IAC/C;AACJ;;;;;;;;;;;;MAYM,+BAA+B;IACjC;AACJ;EACE,2CAA2C;AAC7C;AACA;;EAEE,kCAAkC;EAClC,wCAAwC;AAC1C;AACA;;;;IAII,aAAa;EACf;AACF;EACE,2CAA2C;AAC7C;AACA;IACI,YAAY;IACZ,mBAAmB;IACnB,6BAA6B;IAC7B,uBAAuB;IACvB,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,WAAW;IACX,YAAY;IACZ,eAAe;IACf,yBAAyB;OACtB,sBAAsB;YACjB,iBAAiB;IACzB,YAAY;EACd;AACF;MACM,mBAAmB;IACrB;AACJ;MACM,WAAW;MACX,eAAe;MACf,gBAAgB;IAClB;AACJ;MACM,oBAAoB;IACtB;AACJ;QACQ,iBAAiB;MACnB;AACN;EACE,sBAAsB;AACxB;AACA;EACE,kBAAkB;AACpB;AACA;;EAEE,iBAAiB;AACnB;AACA;;EAEE,iBAAiB;AACnB;AACA;;EAEE,mBAAmB;AACrB;AACA;;EAEE,mBAAmB;AACrB;AACA,kBAAkB;AAClB;EACE,UAAU;EACV,WAAW;EACX,sBAAsB;EACtB,kBAAkB;EAClB,yBAAyB;EACzB,gCAAgC;AAClC;AACA;EACE,OAAO;EACP,QAAQ;AACV;AACA;EACE,UAAU;EACV,QAAQ;AACV;AACA;EACE,SAAS;EACT,MAAM;AACR;AACA;EACE,SAAS;EACT,SAAS;AACX;AACA;EACE,OAAO;AACT;AACA;EACE,OAAO;AACT;AACA;EACE,UAAU;AACZ;AACA;EACE,UAAU;AACZ;AACA,gBAAgB;AAChB;EACE,qBAAqB;EACrB,eAAe;EACf,mBAAmB;AACrB;AACA;;EAEE,UAAU;EACV,6BAA6B;EAC7B,MAAM;EACN,YAAY;AACd;AACA;EACE,OAAO;EACP,sBAAsB;AACxB;AACA;EACE,UAAU;EACV,uBAAuB;AACzB;AACA;;EAEE,WAAW;EACX,6BAA6B;EAC7B,OAAO;EACP,WAAW;AACb;AACA;EACE,MAAM;EACN,qBAAqB;AACvB;AACA;EACE,wBAAwB;EACxB,SAAS;AACX","sourcesContent":["/* this gets exported as style.css and can be used for the default theming */\n/* these are the necessary styles for React Flow, they get used by base.css and style.css */\n.react-flow__container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n.react-flow__pane {\n  z-index: 1;\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n.react-flow__pane.selection {\n    cursor: pointer;\n  }\n.react-flow__pane.dragging {\n    cursor: -webkit-grabbing;\n    cursor: grabbing;\n  }\n.react-flow__viewport {\n  transform-origin: 0 0;\n  z-index: 2;\n  pointer-events: none;\n}\n.react-flow__renderer {\n  z-index: 4;\n}\n.react-flow__selection {\n  z-index: 6;\n}\n.react-flow__nodesselection-rect:focus,\n.react-flow__nodesselection-rect:focus-visible {\n  outline: none;\n}\n.react-flow .react-flow__edges {\n  pointer-events: none;\n  overflow: visible;\n}\n.react-flow__edge-path,\n.react-flow__connection-path {\n  stroke: #b1b1b7;\n  stroke-width: 1;\n  fill: none;\n}\n.react-flow__edge {\n  pointer-events: visibleStroke;\n  cursor: pointer;\n}\n.react-flow__edge.animated path {\n    stroke-dasharray: 5;\n    -webkit-animation: dashdraw 0.5s linear infinite;\n            animation: dashdraw 0.5s linear infinite;\n  }\n.react-flow__edge.animated path.react-flow__edge-interaction {\n    stroke-dasharray: none;\n    -webkit-animation: none;\n            animation: none;\n  }\n.react-flow__edge.inactive {\n    pointer-events: none;\n  }\n.react-flow__edge.selected,\n  .react-flow__edge:focus,\n  .react-flow__edge:focus-visible {\n    outline: none;\n  }\n.react-flow__edge.selected .react-flow__edge-path,\n  .react-flow__edge:focus .react-flow__edge-path,\n  .react-flow__edge:focus-visible .react-flow__edge-path {\n    stroke: #555;\n  }\n.react-flow__edge-textwrapper {\n    pointer-events: all;\n  }\n.react-flow__edge-textbg {\n    fill: white;\n  }\n.react-flow__edge .react-flow__edge-text {\n    pointer-events: none;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n  }\n.react-flow__connection {\n  pointer-events: none;\n}\n.react-flow__connection .animated {\n    stroke-dasharray: 5;\n    -webkit-animation: dashdraw 0.5s linear infinite;\n            animation: dashdraw 0.5s linear infinite;\n  }\n.react-flow__connectionline {\n  z-index: 1001;\n}\n.react-flow__nodes {\n  pointer-events: none;\n  transform-origin: 0 0;\n}\n.react-flow__node {\n  position: absolute;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  pointer-events: all;\n  transform-origin: 0 0;\n  box-sizing: border-box;\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n.react-flow__node.dragging {\n    cursor: -webkit-grabbing;\n    cursor: grabbing;\n  }\n.react-flow__nodesselection {\n  z-index: 3;\n  transform-origin: left top;\n  pointer-events: none;\n}\n.react-flow__nodesselection-rect {\n    position: absolute;\n    pointer-events: all;\n    cursor: -webkit-grab;\n    cursor: grab;\n  }\n.react-flow__handle {\n  position: absolute;\n  pointer-events: none;\n  min-width: 5px;\n  min-height: 5px;\n  width: 6px;\n  height: 6px;\n  background: #1a192b;\n  border: 1px solid white;\n  border-radius: 100%;\n}\n.react-flow__handle.connectionindicator {\n    pointer-events: all;\n    cursor: crosshair;\n  }\n.react-flow__handle-bottom {\n    top: auto;\n    left: 50%;\n    bottom: -4px;\n    transform: translate(-50%, 0);\n  }\n.react-flow__handle-top {\n    left: 50%;\n    top: -4px;\n    transform: translate(-50%, 0);\n  }\n.react-flow__handle-left {\n    top: 50%;\n    left: -4px;\n    transform: translate(0, -50%);\n  }\n.react-flow__handle-right {\n    right: -4px;\n    top: 50%;\n    transform: translate(0, -50%);\n  }\n.react-flow__edgeupdater {\n  cursor: move;\n  pointer-events: all;\n}\n.react-flow__panel {\n  position: absolute;\n  z-index: 5;\n  margin: 15px;\n}\n.react-flow__panel.top {\n    top: 0;\n  }\n.react-flow__panel.bottom {\n    bottom: 0;\n  }\n.react-flow__panel.left {\n    left: 0;\n  }\n.react-flow__panel.right {\n    right: 0;\n  }\n.react-flow__panel.center {\n    left: 50%;\n    transform: translateX(-50%);\n  }\n.react-flow__attribution {\n  font-size: 10px;\n  background: rgba(255, 255, 255, 0.5);\n  padding: 2px 3px;\n  margin: 0;\n}\n.react-flow__attribution a {\n    text-decoration: none;\n    color: #999;\n  }\n@-webkit-keyframes dashdraw {\n  from {\n    stroke-dashoffset: 10;\n  }\n}\n@keyframes dashdraw {\n  from {\n    stroke-dashoffset: 10;\n  }\n}\n.react-flow__edgelabel-renderer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.react-flow__edge.updating .react-flow__edge-path {\n      stroke: #777;\n    }\n.react-flow__edge-text {\n    font-size: 10px;\n  }\n.react-flow__node.selectable:focus,\n  .react-flow__node.selectable:focus-visible {\n    outline: none;\n  }\n.react-flow__node-default,\n.react-flow__node-input,\n.react-flow__node-output,\n.react-flow__node-group {\n  padding: 10px;\n  border-radius: 3px;\n  width: 150px;\n  font-size: 12px;\n  color: #222;\n  text-align: center;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #1a192b;\n  background-color: white;\n}\n.react-flow__node-default.selectable:hover, .react-flow__node-input.selectable:hover, .react-flow__node-output.selectable:hover, .react-flow__node-group.selectable:hover {\n      box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);\n    }\n.react-flow__node-default.selectable.selected,\n    .react-flow__node-default.selectable:focus,\n    .react-flow__node-default.selectable:focus-visible,\n    .react-flow__node-input.selectable.selected,\n    .react-flow__node-input.selectable:focus,\n    .react-flow__node-input.selectable:focus-visible,\n    .react-flow__node-output.selectable.selected,\n    .react-flow__node-output.selectable:focus,\n    .react-flow__node-output.selectable:focus-visible,\n    .react-flow__node-group.selectable.selected,\n    .react-flow__node-group.selectable:focus,\n    .react-flow__node-group.selectable:focus-visible {\n      box-shadow: 0 0 0 0.5px #1a192b;\n    }\n.react-flow__node-group {\n  background-color: rgba(240, 240, 240, 0.25);\n}\n.react-flow__nodesselection-rect,\n.react-flow__selection {\n  background: rgba(0, 89, 220, 0.08);\n  border: 1px dotted rgba(0, 89, 220, 0.8);\n}\n.react-flow__nodesselection-rect:focus,\n  .react-flow__nodesselection-rect:focus-visible,\n  .react-flow__selection:focus,\n  .react-flow__selection:focus-visible {\n    outline: none;\n  }\n.react-flow__controls {\n  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n}\n.react-flow__controls-button {\n    border: none;\n    background: #fefefe;\n    border-bottom: 1px solid #eee;\n    box-sizing: content-box;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 16px;\n    height: 16px;\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n    padding: 5px;\n  }\n.react-flow__controls-button:hover {\n      background: #f4f4f4;\n    }\n.react-flow__controls-button svg {\n      width: 100%;\n      max-width: 12px;\n      max-height: 12px;\n    }\n.react-flow__controls-button:disabled {\n      pointer-events: none;\n    }\n.react-flow__controls-button:disabled svg {\n        fill-opacity: 0.4;\n      }\n.react-flow__minimap {\n  background-color: #fff;\n}\n.react-flow__resize-control {\n  position: absolute;\n}\n.react-flow__resize-control.left,\n.react-flow__resize-control.right {\n  cursor: ew-resize;\n}\n.react-flow__resize-control.top,\n.react-flow__resize-control.bottom {\n  cursor: ns-resize;\n}\n.react-flow__resize-control.top.left,\n.react-flow__resize-control.bottom.right {\n  cursor: nwse-resize;\n}\n.react-flow__resize-control.bottom.left,\n.react-flow__resize-control.top.right {\n  cursor: nesw-resize;\n}\n/* handle styles */\n.react-flow__resize-control.handle {\n  width: 4px;\n  height: 4px;\n  border: 1px solid #fff;\n  border-radius: 1px;\n  background-color: #3367d9;\n  transform: translate(-50%, -50%);\n}\n.react-flow__resize-control.handle.left {\n  left: 0;\n  top: 50%;\n}\n.react-flow__resize-control.handle.right {\n  left: 100%;\n  top: 50%;\n}\n.react-flow__resize-control.handle.top {\n  left: 50%;\n  top: 0;\n}\n.react-flow__resize-control.handle.bottom {\n  left: 50%;\n  top: 100%;\n}\n.react-flow__resize-control.handle.top.left {\n  left: 0;\n}\n.react-flow__resize-control.handle.bottom.left {\n  left: 0;\n}\n.react-flow__resize-control.handle.top.right {\n  left: 100%;\n}\n.react-flow__resize-control.handle.bottom.right {\n  left: 100%;\n}\n/* line styles */\n.react-flow__resize-control.line {\n  border-color: #3367d9;\n  border-width: 0;\n  border-style: solid;\n}\n.react-flow__resize-control.line.left,\n.react-flow__resize-control.line.right {\n  width: 1px;\n  transform: translate(-50%, 0);\n  top: 0;\n  height: 100%;\n}\n.react-flow__resize-control.line.left {\n  left: 0;\n  border-left-width: 1px;\n}\n.react-flow__resize-control.line.right {\n  left: 100%;\n  border-right-width: 1px;\n}\n.react-flow__resize-control.line.top,\n.react-flow__resize-control.line.bottom {\n  height: 1px;\n  transform: translate(0, -50%);\n  left: 0;\n  width: 100%;\n}\n.react-flow__resize-control.line.top {\n  top: 0;\n  border-top-width: 1px;\n}\n.react-flow__resize-control.line.bottom {\n  border-bottom-width: 1px;\n  top: 100%;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/assets/jsx/workflow-editor/css/editor.css":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/assets/jsx/workflow-editor/css/editor.css ***!
  \***************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_custom_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../../../../node_modules/css-loader/dist/cjs.js!./custom.css */ "./node_modules/css-loader/dist/cjs.js!./src/assets/jsx/workflow-editor/css/custom.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_custom_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
`, "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/jsx/workflow-editor/css/custom.css":
/*!*********************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/assets/jsx/workflow-editor/css/custom.css ***!
  \*********************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#wpfooter {
    display: none !important;
}

.react-flow {
    height: 100vh !important;
    width: 100% !important;
}
`, "",{"version":3,"sources":["webpack://./src/assets/jsx/workflow-editor/css/custom.css"],"names":[],"mappings":"AAAA;IACI,wBAAwB;AAC5B;;AAEA;IACI,wBAAwB;IACxB,sBAAsB;AAC1B","sourcesContent":["#wpfooter {\n    display: none !important;\n}\n\n.react-flow {\n    height: 100vh !important;\n    width: 100% !important;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/lower-case/dist.es2015/index.js":
/*!******************************************************!*\
  !*** ./node_modules/lower-case/dist.es2015/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   localeLowerCase: () => (/* binding */ localeLowerCase),
/* harmony export */   lowerCase: () => (/* binding */ lowerCase)
/* harmony export */ });
/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    az: {
        regexp: /\u0130/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303",
        },
    },
};
/**
 * Localized lower case.
 */
function localeLowerCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang)
        return lowerCase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowerCase(str);
}
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/no-case/dist.es2015/index.js":
/*!***************************************************!*\
  !*** ./node_modules/no-case/dist.es2015/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   noCase: () => (/* binding */ noCase)
/* harmony export */ });
/* harmony import */ var lower_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lower-case */ "./node_modules/lower-case/dist.es2015/index.js");

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lower_case__WEBPACK_IMPORTED_MODULE_0__.lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/pascal-case/dist.es2015/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/pascal-case/dist.es2015/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pascalCase: () => (/* binding */ pascalCase),
/* harmony export */   pascalCaseTransform: () => (/* binding */ pascalCaseTransform),
/* harmony export */   pascalCaseTransformMerge: () => (/* binding */ pascalCaseTransformMerge)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var no_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! no-case */ "./node_modules/no-case/dist.es2015/index.js");


function pascalCaseTransform(input, index) {
    var firstChar = input.charAt(0);
    var lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return "_" + firstChar + lowerChars;
    }
    return "" + firstChar.toUpperCase() + lowerChars;
}
function pascalCaseTransformMerge(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
function pascalCase(input, options) {
    if (options === void 0) { options = {}; }
    return (0,no_case__WEBPACK_IMPORTED_MODULE_0__.noCase)(input, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({ delimiter: "", transform: pascalCaseTransform }, options));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/reactflow/dist/style.css":
/*!***********************************************!*\
  !*** ./node_modules/reactflow/dist/style.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../css-loader/dist/cjs.js!../../postcss-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/reactflow/dist/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/assets/jsx/workflow-editor/css/editor.css":
/*!*******************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/css/editor.css ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_editor_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!../../../../../node_modules/postcss-loader/dist/cjs.js!./editor.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/assets/jsx/workflow-editor/css/editor.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
}
          var React = __webpack_require__(/*! react */ "react");

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
  ;
}

var objectIs = typeof Object.is === 'function' ? Object.is : is;

// dispatch for CommonJS interop named imports.

var useState = React.useState,
    useEffect = React.useEffect,
    useLayoutEffect = React.useLayoutEffect,
    useDebugValue = React.useDebugValue;
var didWarnOld18Alpha = false;
var didWarnUncachedGetSnapshot = false; // Disclaimer: This shim breaks many of the rules of React, and only works
// because of a very particular set of implementation details and assumptions
// -- change any one of them and it will break. The most important assumption
// is that updates are always synchronous, because concurrent rendering is
// only available in versions of React that also have a built-in
// useSyncExternalStore API. And we only use this shim when the built-in API
// does not exist.
//
// Do not assume that the clever hacks used by this hook also work in general.
// The point of this shim is to replace the need for hacks by other libraries.

function useSyncExternalStore(subscribe, getSnapshot, // Note: The shim does not use getServerSnapshot, because pre-18 versions of
// React do not expose a way to check if we're hydrating. So users of the shim
// will need to track that themselves and return the correct value
// from `getSnapshot`.
getServerSnapshot) {
  {
    if (!didWarnOld18Alpha) {
      if (React.startTransition !== undefined) {
        didWarnOld18Alpha = true;

        error('You are using an outdated, pre-release alpha of React 18 that ' + 'does not support useSyncExternalStore. The ' + 'use-sync-external-store shim will not work correctly. Upgrade ' + 'to a newer pre-release.');
      }
    }
  } // Read the current snapshot from the store on every render. Again, this
  // breaks the rules of React, and only works here because of specific
  // implementation details, most importantly that updates are
  // always synchronous.


  var value = getSnapshot();

  {
    if (!didWarnUncachedGetSnapshot) {
      var cachedValue = getSnapshot();

      if (!objectIs(value, cachedValue)) {
        error('The result of getSnapshot should be cached to avoid an infinite loop');

        didWarnUncachedGetSnapshot = true;
      }
    }
  } // Because updates are synchronous, we don't queue them. Instead we force a
  // re-render whenever the subscribed state changes by updating an some
  // arbitrary useState hook. Then, during render, we call getSnapshot to read
  // the current value.
  //
  // Because we don't actually use the state returned by the useState hook, we
  // can save a bit of memory by storing other stuff in that slot.
  //
  // To implement the early bailout, we need to track some things on a mutable
  // object. Usually, we would put that in a useRef hook, but we can stash it in
  // our useState hook instead.
  //
  // To force a re-render, we call forceUpdate({inst}). That works because the
  // new object always fails an equality check.


  var _useState = useState({
    inst: {
      value: value,
      getSnapshot: getSnapshot
    }
  }),
      inst = _useState[0].inst,
      forceUpdate = _useState[1]; // Track the latest getSnapshot function with a ref. This needs to be updated
  // in the layout phase so we can access it during the tearing check that
  // happens on subscribe.


  useLayoutEffect(function () {
    inst.value = value;
    inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
    // commit phase if there was an interleaved mutation. In concurrent mode
    // this can happen all the time, but even in synchronous mode, an earlier
    // effect may have mutated the store.

    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({
        inst: inst
      });
    }
  }, [subscribe, value, getSnapshot]);
  useEffect(function () {
    // Check for changes right before subscribing. Subsequent changes will be
    // detected in the subscription handler.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({
        inst: inst
      });
    }

    var handleStoreChange = function () {
      // TODO: Because there is no cross-renderer API for batching updates, it's
      // up to the consumer of this library to wrap their subscription event
      // with unstable_batchedUpdates. Should we try to detect when this isn't
      // the case and print a warning in development?
      // The store changed. Check if the snapshot changed since the last time we
      // read from the store.
      if (checkIfSnapshotChanged(inst)) {
        // Force a re-render.
        forceUpdate({
          inst: inst
        });
      }
    }; // Subscribe to the store and return a clean-up function.


    return subscribe(handleStoreChange);
  }, [subscribe]);
  useDebugValue(value);
  return value;
}

function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  var prevValue = inst.value;

  try {
    var nextValue = latestGetSnapshot();
    return !objectIs(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}

function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
  // Note: The shim does not use getServerSnapshot, because pre-18 versions of
  // React do not expose a way to check if we're hydrating. So users of the shim
  // will need to track that themselves and return the correct value
  // from `getSnapshot`.
  return getSnapshot();
}

var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');

var isServerEnvironment = !canUseDOM;

var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
var useSyncExternalStore$2 = React.useSyncExternalStore !== undefined ? React.useSyncExternalStore : shim;

exports.useSyncExternalStore = useSyncExternalStore$2;
          /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
}
        
  })();
}


/***/ }),

/***/ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
}
          var React = __webpack_require__(/*! react */ "react");
var shim = __webpack_require__(/*! use-sync-external-store/shim */ "./node_modules/use-sync-external-store/shim/index.js");

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
  ;
}

var objectIs = typeof Object.is === 'function' ? Object.is : is;

var useSyncExternalStore = shim.useSyncExternalStore;

// for CommonJS interop.

var useRef = React.useRef,
    useEffect = React.useEffect,
    useMemo = React.useMemo,
    useDebugValue = React.useDebugValue; // Same as useSyncExternalStore, but supports selector and isEqual arguments.

function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  // Use this to track the rendered snapshot.
  var instRef = useRef(null);
  var inst;

  if (instRef.current === null) {
    inst = {
      hasValue: false,
      value: null
    };
    instRef.current = inst;
  } else {
    inst = instRef.current;
  }

  var _useMemo = useMemo(function () {
    // Track the memoized state using closure variables that are local to this
    // memoized instance of a getSnapshot function. Intentionally not using a
    // useRef hook, because that state would be shared across all concurrent
    // copies of the hook/component.
    var hasMemo = false;
    var memoizedSnapshot;
    var memoizedSelection;

    var memoizedSelector = function (nextSnapshot) {
      if (!hasMemo) {
        // The first time the hook is called, there is no memoized result.
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;

        var _nextSelection = selector(nextSnapshot);

        if (isEqual !== undefined) {
          // Even if the selector has changed, the currently rendered selection
          // may be equal to the new selection. We should attempt to reuse the
          // current value if possible, to preserve downstream memoizations.
          if (inst.hasValue) {
            var currentSelection = inst.value;

            if (isEqual(currentSelection, _nextSelection)) {
              memoizedSelection = currentSelection;
              return currentSelection;
            }
          }
        }

        memoizedSelection = _nextSelection;
        return _nextSelection;
      } // We may be able to reuse the previous invocation's result.


      // We may be able to reuse the previous invocation's result.
      var prevSnapshot = memoizedSnapshot;
      var prevSelection = memoizedSelection;

      if (objectIs(prevSnapshot, nextSnapshot)) {
        // The snapshot is the same as last time. Reuse the previous selection.
        return prevSelection;
      } // The snapshot has changed, so we need to compute a new selection.


      // The snapshot has changed, so we need to compute a new selection.
      var nextSelection = selector(nextSnapshot); // If a custom isEqual function is provided, use that to check if the data
      // has changed. If it hasn't, return the previous selection. That signals
      // to React that the selections are conceptually equal, and we can bail
      // out of rendering.

      // If a custom isEqual function is provided, use that to check if the data
      // has changed. If it hasn't, return the previous selection. That signals
      // to React that the selections are conceptually equal, and we can bail
      // out of rendering.
      if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
        return prevSelection;
      }

      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    }; // Assigning this to a constant so that Flow knows it can't change.


    // Assigning this to a constant so that Flow knows it can't change.
    var maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot;

    var getSnapshotWithSelector = function () {
      return memoizedSelector(getSnapshot());
    };

    var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? undefined : function () {
      return memoizedSelector(maybeGetServerSnapshot());
    };
    return [getSnapshotWithSelector, getServerSnapshotWithSelector];
  }, [getSnapshot, getServerSnapshot, selector, isEqual]),
      getSelection = _useMemo[0],
      getServerSelection = _useMemo[1];

  var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
  useEffect(function () {
    inst.hasValue = true;
    inst.value = value;
  }, [value]);
  useDebugValue(value);
  return value;
}

exports.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector;
          /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
}
        
  })();
}


/***/ }),

/***/ "./node_modules/use-sync-external-store/shim/index.js":
/*!************************************************************!*\
  !*** ./node_modules/use-sync-external-store/shim/index.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js");
}


/***/ }),

/***/ "./node_modules/use-sync-external-store/shim/with-selector.js":
/*!********************************************************************!*\
  !*** ./node_modules/use-sync-external-store/shim/with-selector.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim/with-selector.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js");
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = ReactDOM;

/***/ }),

/***/ "@wordpress/components":
/*!********************************!*\
  !*** external "wp.components" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = wp.components;

/***/ }),

/***/ "@wordpress/data":
/*!**************************!*\
  !*** external "wp.data" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = wp.data;

/***/ }),

/***/ "@wordpress/element":
/*!*****************************!*\
  !*** external "wp.element" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = wp.element;

/***/ }),

/***/ "@wordpress/i18n":
/*!**************************!*\
  !*** external "wp.i18n" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = wp.i18n;

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/@reactflow/background/dist/esm/index.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@reactflow/background/dist/esm/index.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Background: () => (/* binding */ Background$1),
/* harmony export */   BackgroundVariant: () => (/* binding */ BackgroundVariant)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var classcat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classcat */ "./node_modules/classcat/index.js");
/* harmony import */ var _reactflow_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @reactflow/core */ "./node_modules/@reactflow/core/dist/esm/index.mjs");
/* harmony import */ var zustand_shallow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! zustand/shallow */ "./node_modules/zustand/esm/shallow.mjs");





var BackgroundVariant;
(function (BackgroundVariant) {
    BackgroundVariant["Lines"] = "lines";
    BackgroundVariant["Dots"] = "dots";
    BackgroundVariant["Cross"] = "cross";
})(BackgroundVariant || (BackgroundVariant = {}));

function LinePattern({ color, dimensions, lineWidth }) {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { stroke: color, strokeWidth: lineWidth, d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}` }));
}
function DotPattern({ color, radius }) {
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: radius, cy: radius, r: radius, fill: color });
}

const defaultColor = {
    [BackgroundVariant.Dots]: '#91919a',
    [BackgroundVariant.Lines]: '#eee',
    [BackgroundVariant.Cross]: '#e2e2e2',
};
const defaultSize = {
    [BackgroundVariant.Dots]: 1,
    [BackgroundVariant.Lines]: 1,
    [BackgroundVariant.Cross]: 6,
};
const selector = (s) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });
function Background({ id, variant = BackgroundVariant.Dots, 
// only used for dots and cross
gap = 20, 
// only used for lines and cross
size, lineWidth = 1, offset = 2, color, style, className, }) {
    const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const { transform, patternId } = (0,_reactflow_core__WEBPACK_IMPORTED_MODULE_2__.useStore)(selector, zustand_shallow__WEBPACK_IMPORTED_MODULE_3__.shallow);
    const patternColor = color || defaultColor[variant];
    const patternSize = size || defaultSize[variant];
    const isDots = variant === BackgroundVariant.Dots;
    const isCross = variant === BackgroundVariant.Cross;
    const gapXY = Array.isArray(gap) ? gap : [gap, gap];
    const scaledGap = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
    const scaledSize = patternSize * transform[2];
    const patternDimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
    const patternOffset = isDots
        ? [scaledSize / offset, scaledSize / offset]
        : [patternDimensions[0] / offset, patternDimensions[1] / offset];
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow__background', className]), style: {
            ...style,
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
        }, ref: ref, "data-testid": "rf__background" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("pattern", { id: patternId + id, x: transform[0] % scaledGap[0], y: transform[1] % scaledGap[1], width: scaledGap[0], height: scaledGap[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${patternOffset[0]},-${patternOffset[1]})` }, isDots ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(DotPattern, { color: patternColor, radius: scaledSize / offset })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(LinePattern, { dimensions: patternDimensions, color: patternColor, lineWidth: lineWidth }))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${patternId + id})` })));
}
Background.displayName = 'Background';
var Background$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(Background);




/***/ }),

/***/ "./node_modules/@reactflow/core/dist/esm/index.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@reactflow/core/dist/esm/index.mjs ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseEdge: () => (/* binding */ BaseEdge),
/* harmony export */   BezierEdge: () => (/* binding */ BezierEdge),
/* harmony export */   ConnectionLineType: () => (/* binding */ ConnectionLineType),
/* harmony export */   ConnectionMode: () => (/* binding */ ConnectionMode),
/* harmony export */   EdgeLabelRenderer: () => (/* binding */ EdgeLabelRenderer),
/* harmony export */   EdgeText: () => (/* binding */ EdgeText$1),
/* harmony export */   Handle: () => (/* binding */ Handle$1),
/* harmony export */   MarkerType: () => (/* binding */ MarkerType),
/* harmony export */   PanOnScrollMode: () => (/* binding */ PanOnScrollMode),
/* harmony export */   Panel: () => (/* binding */ Panel),
/* harmony export */   Position: () => (/* binding */ Position),
/* harmony export */   ReactFlow: () => (/* binding */ ReactFlow),
/* harmony export */   ReactFlowProvider: () => (/* binding */ ReactFlowProvider),
/* harmony export */   SelectionMode: () => (/* binding */ SelectionMode),
/* harmony export */   SimpleBezierEdge: () => (/* binding */ SimpleBezierEdge),
/* harmony export */   SmoothStepEdge: () => (/* binding */ SmoothStepEdge),
/* harmony export */   StepEdge: () => (/* binding */ StepEdge),
/* harmony export */   StraightEdge: () => (/* binding */ StraightEdge),
/* harmony export */   addEdge: () => (/* binding */ addEdge),
/* harmony export */   applyEdgeChanges: () => (/* binding */ applyEdgeChanges),
/* harmony export */   applyNodeChanges: () => (/* binding */ applyNodeChanges),
/* harmony export */   boxToRect: () => (/* binding */ boxToRect),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   getBezierPath: () => (/* binding */ getBezierPath),
/* harmony export */   getBoundsOfRects: () => (/* binding */ getBoundsOfRects),
/* harmony export */   getConnectedEdges: () => (/* binding */ getConnectedEdges),
/* harmony export */   getIncomers: () => (/* binding */ getIncomers),
/* harmony export */   getMarkerEnd: () => (/* binding */ getMarkerEnd),
/* harmony export */   getNodePositionWithOrigin: () => (/* binding */ getNodePositionWithOrigin),
/* harmony export */   getNodesBounds: () => (/* binding */ getNodesBounds),
/* harmony export */   getOutgoers: () => (/* binding */ getOutgoers),
/* harmony export */   getRectOfNodes: () => (/* binding */ getRectOfNodes),
/* harmony export */   getSimpleBezierPath: () => (/* binding */ getSimpleBezierPath),
/* harmony export */   getSmoothStepPath: () => (/* binding */ getSmoothStepPath),
/* harmony export */   getStraightPath: () => (/* binding */ getStraightPath),
/* harmony export */   getTransformForBounds: () => (/* binding */ getTransformForBounds),
/* harmony export */   getViewportForBounds: () => (/* binding */ getViewportForBounds),
/* harmony export */   handleParentExpand: () => (/* binding */ handleParentExpand),
/* harmony export */   internalsSymbol: () => (/* binding */ internalsSymbol),
/* harmony export */   isEdge: () => (/* binding */ isEdge),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   rectToBox: () => (/* binding */ rectToBox),
/* harmony export */   updateEdge: () => (/* binding */ updateEdge),
/* harmony export */   useEdges: () => (/* binding */ useEdges),
/* harmony export */   useEdgesState: () => (/* binding */ useEdgesState),
/* harmony export */   useGetPointerPosition: () => (/* binding */ useGetPointerPosition),
/* harmony export */   useKeyPress: () => (/* binding */ useKeyPress),
/* harmony export */   useNodeId: () => (/* binding */ useNodeId),
/* harmony export */   useNodes: () => (/* binding */ useNodes),
/* harmony export */   useNodesInitialized: () => (/* binding */ useNodesInitialized),
/* harmony export */   useNodesState: () => (/* binding */ useNodesState),
/* harmony export */   useOnSelectionChange: () => (/* binding */ useOnSelectionChange),
/* harmony export */   useOnViewportChange: () => (/* binding */ useOnViewportChange),
/* harmony export */   useReactFlow: () => (/* binding */ useReactFlow),
/* harmony export */   useStore: () => (/* binding */ useStore),
/* harmony export */   useStoreApi: () => (/* binding */ useStoreApi),
/* harmony export */   useUpdateNodeInternals: () => (/* binding */ useUpdateNodeInternals),
/* harmony export */   useViewport: () => (/* binding */ useViewport)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var classcat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classcat */ "./node_modules/classcat/index.js");
/* harmony import */ var zustand_traditional__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! zustand/traditional */ "./node_modules/zustand/esm/traditional.mjs");
/* harmony import */ var zustand_shallow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! zustand/shallow */ "./node_modules/zustand/esm/shallow.mjs");
/* harmony import */ var d3_zoom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-zoom */ "./node_modules/d3-zoom/src/index.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/select.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/pointer.js");
/* harmony import */ var d3_drag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! d3-drag */ "./node_modules/d3-drag/src/drag.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "react-dom");









const StoreContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
const Provider$1 = StoreContext.Provider;

const errorMessages = {
    error001: () => '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001',
    error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
    error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
    error004: () => 'The React Flow parent container needs a width and a height to render the graph.',
    error005: () => 'Only child nodes can use a parent extent.',
    error006: () => "Can't create edge. An edge needs a source and a target.",
    error007: (id) => `The old edge with id=${id} does not exist.`,
    error009: (type) => `Marker type "${type}" doesn't exist.`,
    error008: (sourceHandle, edge) => `Couldn't create edge for ${!sourceHandle ? 'source' : 'target'} handle id: "${!sourceHandle ? edge.sourceHandle : edge.targetHandle}", edge id: ${edge.id}.`,
    error010: () => 'Handle: No node id found. Make sure to only use a Handle inside a custom Node.',
    error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
    error012: (id) => `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
};

const zustandErrorMessage = errorMessages['error001']();
function useStore(selector, equalityFn) {
    const store = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(StoreContext);
    if (store === null) {
        throw new Error(zustandErrorMessage);
    }
    return (0,zustand_traditional__WEBPACK_IMPORTED_MODULE_4__.useStoreWithEqualityFn)(store, selector, equalityFn);
}
const useStoreApi = () => {
    const store = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(StoreContext);
    if (store === null) {
        throw new Error(zustandErrorMessage);
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
        getState: store.getState,
        setState: store.setState,
        subscribe: store.subscribe,
        destroy: store.destroy,
    }), [store]);
};

const selector$g = (s) => (s.userSelectionActive ? 'none' : 'all');
function Panel({ position, children, className, style, ...rest }) {
    const pointerEvents = useStore(selector$g);
    const positionClasses = `${position}`.split('-');
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow__panel', className, ...positionClasses]), style: { ...style, pointerEvents }, ...rest }, children));
}

function Attribution({ proOptions, position = 'bottom-right' }) {
    if (proOptions?.hideAttribution) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(Panel, { position: position, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://reactflow.dev/pro" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution" }, "React Flow")));
}

const EdgeText = ({ x, y, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {}, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children, className, ...rest }) => {
    const edgeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const [edgeTextBbox, setEdgeTextBbox] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({ x: 0, y: 0, width: 0, height: 0 });
    const edgeTextClasses = (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow__edge-textwrapper', className]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (edgeRef.current) {
            const textBbox = edgeRef.current.getBBox();
            setEdgeTextBbox({
                x: textBbox.x,
                y: textBbox.y,
                width: textBbox.width,
                height: textBbox.height,
            });
        }
    }, [label]);
    if (typeof label === 'undefined' || !label) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("g", { transform: `translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`, className: edgeTextClasses, visibility: edgeTextBbox.width ? 'visible' : 'hidden', ...rest },
        labelShowBg && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius })),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeRef, style: labelStyle }, label),
        children));
};
var EdgeText$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(EdgeText);

const getDimensions = (node) => ({
    width: node.offsetWidth,
    height: node.offsetHeight,
});
const clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
const clampPosition = (position = { x: 0, y: 0 }, extent) => ({
    x: clamp(position.x, extent[0][0], extent[1][0]),
    y: clamp(position.y, extent[0][1], extent[1][1]),
});
// returns a number between 0 and 1 that represents the velocity of the movement
// when the mouse is close to the edge of the canvas
const calcAutoPanVelocity = (value, min, max) => {
    if (value < min) {
        return clamp(Math.abs(value - min), 1, 50) / 50;
    }
    else if (value > max) {
        return -clamp(Math.abs(value - max), 1, 50) / 50;
    }
    return 0;
};
const calcAutoPan = (pos, bounds) => {
    const xMovement = calcAutoPanVelocity(pos.x, 35, bounds.width - 35) * 20;
    const yMovement = calcAutoPanVelocity(pos.y, 35, bounds.height - 35) * 20;
    return [xMovement, yMovement];
};
const getHostForElement = (element) => element.getRootNode?.() || window?.document;
const getBoundsOfBoxes = (box1, box2) => ({
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2),
});
const rectToBox = ({ x, y, width, height }) => ({
    x,
    y,
    x2: x + width,
    y2: y + height,
});
const boxToRect = ({ x, y, x2, y2 }) => ({
    x,
    y,
    width: x2 - x,
    height: y2 - y,
});
const nodeToRect = (node) => ({
    ...(node.positionAbsolute || { x: 0, y: 0 }),
    width: node.width || 0,
    height: node.height || 0,
});
const getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
const getOverlappingArea = (rectA, rectB) => {
    const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
    const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
    return Math.ceil(xOverlap * yOverlap);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const isNumeric = (n) => !isNaN(n) && isFinite(n);
const internalsSymbol = Symbol.for('internals');
// used for a11y key board controls for nodes and edges
const elementSelectionKeys = ['Enter', ' ', 'Escape'];
const devWarn = (id, message) => {
    if (true) {
        console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id}`);
    }
};
const isReactKeyboardEvent = (event) => 'nativeEvent' in event;
function isInputDOMNode(event) {
    const kbEvent = isReactKeyboardEvent(event) ? event.nativeEvent : event;
    // using composed path for handling shadow dom
    const target = (kbEvent.composedPath?.()?.[0] || event.target);
    const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.nodeName) || target?.hasAttribute('contenteditable');
    // when an input field is focused we don't want to trigger deletion or movement of nodes
    return isInput || !!target?.closest('.nokey');
}
const isMouseEvent = (event) => 'clientX' in event;
const getEventPosition = (event, bounds) => {
    const isMouseTriggered = isMouseEvent(event);
    const evtX = isMouseTriggered ? event.clientX : event.touches?.[0].clientX;
    const evtY = isMouseTriggered ? event.clientY : event.touches?.[0].clientY;
    return {
        x: evtX - (bounds?.left ?? 0),
        y: evtY - (bounds?.top ?? 0),
    };
};
const isMacOs = () => typeof navigator !== 'undefined' && navigator?.userAgent?.indexOf('Mac') >= 0;

const BaseEdge = ({ id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth = 20, }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { id: id, style: style, d: path, fill: "none", className: "react-flow__edge-path", markerEnd: markerEnd, markerStart: markerStart }),
        interactionWidth && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: path, fill: "none", strokeOpacity: 0, strokeWidth: interactionWidth, className: "react-flow__edge-interaction" })),
        label && isNumeric(labelX) && isNumeric(labelY) ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeText$1, { x: labelX, y: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius })) : null));
};
BaseEdge.displayName = 'BaseEdge';

const getMarkerEnd = (markerType, markerEndId) => {
    if (typeof markerEndId !== 'undefined' && markerEndId) {
        return `url(#${markerEndId})`;
    }
    return typeof markerType !== 'undefined' ? `url(#react-flow__${markerType})` : 'none';
};
function getMouseHandler$1(id, getState, handler) {
    return handler === undefined
        ? handler
        : (event) => {
            const edge = getState().edges.find((e) => e.id === id);
            if (edge) {
                handler(event, { ...edge });
            }
        };
}
// this is used for straight edges and simple smoothstep edges (LTR, RTL, BTT, TTB)
function getEdgeCenter({ sourceX, sourceY, targetX, targetY, }) {
    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    return [centerX, centerY, xOffset, yOffset];
}
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY, }) {
    // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
    // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
    const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
    const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
    const offsetX = Math.abs(centerX - sourceX);
    const offsetY = Math.abs(centerY - sourceY);
    return [centerX, centerY, offsetX, offsetY];
}

var ConnectionMode;
(function (ConnectionMode) {
    ConnectionMode["Strict"] = "strict";
    ConnectionMode["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function (PanOnScrollMode) {
    PanOnScrollMode["Free"] = "free";
    PanOnScrollMode["Vertical"] = "vertical";
    PanOnScrollMode["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var SelectionMode;
(function (SelectionMode) {
    SelectionMode["Partial"] = "partial";
    SelectionMode["Full"] = "full";
})(SelectionMode || (SelectionMode = {}));

var ConnectionLineType;
(function (ConnectionLineType) {
    ConnectionLineType["Bezier"] = "default";
    ConnectionLineType["Straight"] = "straight";
    ConnectionLineType["Step"] = "step";
    ConnectionLineType["SmoothStep"] = "smoothstep";
    ConnectionLineType["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function (MarkerType) {
    MarkerType["Arrow"] = "arrow";
    MarkerType["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));

var Position;
(function (Position) {
    Position["Left"] = "left";
    Position["Top"] = "top";
    Position["Right"] = "right";
    Position["Bottom"] = "bottom";
})(Position || (Position = {}));

function getControl({ pos, x1, y1, x2, y2 }) {
    if (pos === Position.Left || pos === Position.Right) {
        return [0.5 * (x1 + x2), y1];
    }
    return [x1, 0.5 * (y1 + y2)];
}
function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, }) {
    const [sourceControlX, sourceControlY] = getControl({
        pos: sourcePosition,
        x1: sourceX,
        y1: sourceY,
        x2: targetX,
        y2: targetY,
    });
    const [targetControlX, targetControlY] = getControl({
        pos: targetPosition,
        x1: targetX,
        y1: targetY,
        x2: sourceX,
        y2: sourceY,
    });
    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceControlX,
        sourceControlY,
        targetControlX,
        targetControlY,
    });
    return [
        `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
        labelX,
        labelY,
        offsetX,
        offsetY,
    ];
}
const SimpleBezierEdge = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }) => {
    const [path, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
SimpleBezierEdge.displayName = 'SimpleBezierEdge';

const handleDirections = {
    [Position.Left]: { x: -1, y: 0 },
    [Position.Right]: { x: 1, y: 0 },
    [Position.Top]: { x: 0, y: -1 },
    [Position.Bottom]: { x: 0, y: 1 },
};
const getDirection = ({ source, sourcePosition = Position.Bottom, target, }) => {
    if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
        return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
    }
    return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};
const distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
// ith this function we try to mimic a orthogonal edge routing behaviour
// It's not as good as a real orthogonal edge routing but it's faster and good enough as a default for step and smooth step edges
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset, }) {
    const sourceDir = handleDirections[sourcePosition];
    const targetDir = handleDirections[targetPosition];
    const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
    const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
    const dir = getDirection({
        source: sourceGapped,
        sourcePosition,
        target: targetGapped,
    });
    const dirAccessor = dir.x !== 0 ? 'x' : 'y';
    const currDir = dir[dirAccessor];
    let points = [];
    let centerX, centerY;
    const sourceGapOffset = { x: 0, y: 0 };
    const targetGapOffset = { x: 0, y: 0 };
    const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
        sourceX: source.x,
        sourceY: source.y,
        targetX: target.x,
        targetY: target.y,
    });
    // opposite handle positions, default case
    if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
        centerX = center.x || defaultCenterX;
        centerY = center.y || defaultCenterY;
        //    --->
        //    |
        // >---
        const verticalSplit = [
            { x: centerX, y: sourceGapped.y },
            { x: centerX, y: targetGapped.y },
        ];
        //    |
        //  ---
        //  |
        const horizontalSplit = [
            { x: sourceGapped.x, y: centerY },
            { x: targetGapped.x, y: centerY },
        ];
        if (sourceDir[dirAccessor] === currDir) {
            points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
        }
        else {
            points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
        }
    }
    else {
        // sourceTarget means we take x from source and y from target, targetSource is the opposite
        const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
        const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
        // this handles edges with same handle positions
        if (dirAccessor === 'x') {
            points = sourceDir.x === currDir ? targetSource : sourceTarget;
        }
        else {
            points = sourceDir.y === currDir ? sourceTarget : targetSource;
        }
        if (sourcePosition === targetPosition) {
            const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
            // if an edge goes from right to right for example (sourcePosition === targetPosition) and the distance between source.x and target.x is less than the offset, the added point and the gapped source/target will overlap. This leads to a weird edge path. To avoid this we add a gapOffset to the source/target
            if (diff <= offset) {
                const gapOffset = Math.min(offset - 1, offset - diff);
                if (sourceDir[dirAccessor] === currDir) {
                    sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
                }
                else {
                    targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
                }
            }
        }
        // these are conditions for handling mixed handle positions like Right -> Bottom for example
        if (sourcePosition !== targetPosition) {
            const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
            const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
            const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
            const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
            const flipSourceTarget = (sourceDir[dirAccessor] === 1 && ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
                (sourceDir[dirAccessor] !== 1 && ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));
            if (flipSourceTarget) {
                points = dirAccessor === 'x' ? sourceTarget : targetSource;
            }
        }
        const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
        const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
        const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
        const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
        // we want to place the label on the longest segment of the edge
        if (maxXDistance >= maxYDistance) {
            centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
            centerY = points[0].y;
        }
        else {
            centerX = points[0].x;
            centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
        }
    }
    const pathPoints = [
        source,
        { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
        ...points,
        { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
        target,
    ];
    return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}
function getBend(a, b, c, size) {
    const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
    const { x, y } = b;
    // no bend
    if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
        return `L${x} ${y}`;
    }
    // first segment is horizontal
    if (a.y === y) {
        const xDir = a.x < c.x ? -1 : 1;
        const yDir = a.y < c.y ? 1 : -1;
        return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
    }
    const xDir = a.x < c.x ? 1 : -1;
    const yDir = a.y < c.y ? -1 : 1;
    return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20, }) {
    const [points, labelX, labelY, offsetX, offsetY] = getPoints({
        source: { x: sourceX, y: sourceY },
        sourcePosition,
        target: { x: targetX, y: targetY },
        targetPosition,
        center: { x: centerX, y: centerY },
        offset,
    });
    const path = points.reduce((res, p, i) => {
        let segment = '';
        if (i > 0 && i < points.length - 1) {
            segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
        }
        else {
            segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
        }
        res += segment;
        return res;
    }, '');
    return [path, labelX, labelY, offsetX, offsetY];
}
const SmoothStepEdge = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, sourcePosition = Position.Bottom, targetPosition = Position.Top, markerEnd, markerStart, pathOptions, interactionWidth, }) => {
    const [path, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: pathOptions?.borderRadius,
        offset: pathOptions?.offset,
    });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
SmoothStepEdge.displayName = 'SmoothStepEdge';

const StepEdge = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((props) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(SmoothStepEdge, { ...props, pathOptions: (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset]) })));
StepEdge.displayName = 'StepEdge';

function getStraightPath({ sourceX, sourceY, targetX, targetY, }) {
    const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
const StraightEdge = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth, }) => {
    const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
StraightEdge.displayName = 'StraightEdge';

function calculateControlOffset(distance, curvature) {
    if (distance >= 0) {
        return 0.5 * distance;
    }
    return curvature * 25 * Math.sqrt(-distance);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
    switch (pos) {
        case Position.Left:
            return [x1 - calculateControlOffset(x1 - x2, c), y1];
        case Position.Right:
            return [x1 + calculateControlOffset(x2 - x1, c), y1];
        case Position.Top:
            return [x1, y1 - calculateControlOffset(y1 - y2, c)];
        case Position.Bottom:
            return [x1, y1 + calculateControlOffset(y2 - y1, c)];
    }
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25, }) {
    const [sourceControlX, sourceControlY] = getControlWithCurvature({
        pos: sourcePosition,
        x1: sourceX,
        y1: sourceY,
        x2: targetX,
        y2: targetY,
        c: curvature,
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
        pos: targetPosition,
        x1: targetX,
        y1: targetY,
        x2: sourceX,
        y2: sourceY,
        c: curvature,
    });
    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceControlX,
        sourceControlY,
        targetControlX,
        targetControlY,
    });
    return [
        `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
        labelX,
        labelY,
        offsetX,
        offsetY,
    ];
}
const BezierEdge = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, pathOptions, interactionWidth, }) => {
    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: pathOptions?.curvature,
    });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(BaseEdge, { path: path, labelX: labelX, labelY: labelY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, style: style, markerEnd: markerEnd, markerStart: markerStart, interactionWidth: interactionWidth }));
});
BezierEdge.displayName = 'BezierEdge';

const NodeIdContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
const Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;
const useNodeId = () => {
    const nodeId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(NodeIdContext);
    return nodeId;
};

const isEdge = (element) => 'id' in element && 'source' in element && 'target' in element;
const isNode = (element) => 'id' in element && !('source' in element) && !('target' in element);
const getOutgoers = (node, nodes, edges) => {
    if (!isNode(node)) {
        return [];
    }
    const outgoerIds = edges.filter((e) => e.source === node.id).map((e) => e.target);
    return nodes.filter((n) => outgoerIds.includes(n.id));
};
const getIncomers = (node, nodes, edges) => {
    if (!isNode(node)) {
        return [];
    }
    const incomersIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
    return nodes.filter((n) => incomersIds.includes(n.id));
};
const getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `reactflow__edge-${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
const getMarkerId = (marker, rfId) => {
    if (typeof marker === 'undefined') {
        return '';
    }
    if (typeof marker === 'string') {
        return marker;
    }
    const idPrefix = rfId ? `${rfId}__` : '';
    return `${idPrefix}${Object.keys(marker)
        .sort()
        .map((key) => `${key}=${marker[key]}`)
        .join('&')}`;
};
const connectionExists = (edge, edges) => {
    return edges.some((el) => el.source === edge.source &&
        el.target === edge.target &&
        (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
        (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle)));
};
const addEdge = (edgeParams, edges) => {
    if (!edgeParams.source || !edgeParams.target) {
        devWarn('006', errorMessages['error006']());
        return edges;
    }
    let edge;
    if (isEdge(edgeParams)) {
        edge = { ...edgeParams };
    }
    else {
        edge = {
            ...edgeParams,
            id: getEdgeId(edgeParams),
        };
    }
    if (connectionExists(edge, edges)) {
        return edges;
    }
    return edges.concat(edge);
};
const updateEdge = (oldEdge, newConnection, edges, options = { shouldReplaceId: true }) => {
    const { id: oldEdgeId, ...rest } = oldEdge;
    if (!newConnection.source || !newConnection.target) {
        devWarn('006', errorMessages['error006']());
        return edges;
    }
    const foundEdge = edges.find((e) => e.id === oldEdgeId);
    if (!foundEdge) {
        devWarn('007', errorMessages['error007'](oldEdgeId));
        return edges;
    }
    // Remove old edge and create the new edge with parameters of old edge.
    const edge = {
        ...rest,
        id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle,
        targetHandle: newConnection.targetHandle,
    };
    return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
};
const pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid, [snapX, snapY]) => {
    const position = {
        x: (x - tx) / tScale,
        y: (y - ty) / tScale,
    };
    if (snapToGrid) {
        return {
            x: snapX * Math.round(position.x / snapX),
            y: snapY * Math.round(position.y / snapY),
        };
    }
    return position;
};
const rendererPointToPoint = ({ x, y }, [tx, ty, tScale]) => {
    return {
        x: x * tScale + tx,
        y: y * tScale + ty,
    };
};
const getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
    if (!node) {
        return {
            x: 0,
            y: 0,
            positionAbsolute: {
                x: 0,
                y: 0,
            },
        };
    }
    const offsetX = (node.width ?? 0) * nodeOrigin[0];
    const offsetY = (node.height ?? 0) * nodeOrigin[1];
    const position = {
        x: node.position.x - offsetX,
        y: node.position.y - offsetY,
    };
    return {
        ...position,
        positionAbsolute: node.positionAbsolute
            ? {
                x: node.positionAbsolute.x - offsetX,
                y: node.positionAbsolute.y - offsetY,
            }
            : position,
    };
};
const getNodesBounds = (nodes, nodeOrigin = [0, 0]) => {
    if (nodes.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    const box = nodes.reduce((currBox, node) => {
        const { x, y } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
        return getBoundsOfBoxes(currBox, rectToBox({
            x,
            y,
            width: node.width || 0,
            height: node.height || 0,
        }));
    }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    return boxToRect(box);
};
// @deprecated Use `getNodesBounds`.
const getRectOfNodes = (nodes, nodeOrigin = [0, 0]) => {
    console.warn('[DEPRECATED] `getRectOfNodes` is deprecated. Instead use `getNodesBounds` https://reactflow.dev/api-reference/utils/get-nodes-bounds.');
    return getNodesBounds(nodes, nodeOrigin);
};
const getNodesInside = (nodeInternals, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, 
// set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
excludeNonSelectableNodes = false, nodeOrigin = [0, 0]) => {
    const paneRect = {
        x: (rect.x - tx) / tScale,
        y: (rect.y - ty) / tScale,
        width: rect.width / tScale,
        height: rect.height / tScale,
    };
    const visibleNodes = [];
    nodeInternals.forEach((node) => {
        const { width, height, selectable = true, hidden = false } = node;
        if ((excludeNonSelectableNodes && !selectable) || hidden) {
            return false;
        }
        const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);
        const nodeRect = {
            x: positionAbsolute.x,
            y: positionAbsolute.y,
            width: width || 0,
            height: height || 0,
        };
        const overlappingArea = getOverlappingArea(paneRect, nodeRect);
        const notInitialized = typeof width === 'undefined' || typeof height === 'undefined' || width === null || height === null;
        const partiallyVisible = partially && overlappingArea > 0;
        const area = (width || 0) * (height || 0);
        const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;
        if (isVisible || node.dragging) {
            visibleNodes.push(node);
        }
    });
    return visibleNodes;
};
const getConnectedEdges = (nodes, edges) => {
    const nodeIds = nodes.map((node) => node.id);
    return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};
// @deprecated Use `getViewportForBounds`.
const getTransformForBounds = (bounds, width, height, minZoom, maxZoom, padding = 0.1) => {
    const { x, y, zoom } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding);
    console.warn('[DEPRECATED] `getTransformForBounds` is deprecated. Instead use `getViewportForBounds`. Beware that the return value is type Viewport (`{ x: number, y: number, zoom: number }`) instead of Transform (`[number, number, number]`). https://reactflow.dev/api-reference/utils/get-viewport-for-bounds');
    return [x, y, zoom];
};
const getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding = 0.1) => {
    const xZoom = width / (bounds.width * (1 + padding));
    const yZoom = height / (bounds.height * (1 + padding));
    const zoom = Math.min(xZoom, yZoom);
    const clampedZoom = clamp(zoom, minZoom, maxZoom);
    const boundsCenterX = bounds.x + bounds.width / 2;
    const boundsCenterY = bounds.y + bounds.height / 2;
    const x = width / 2 - boundsCenterX * clampedZoom;
    const y = height / 2 - boundsCenterY * clampedZoom;
    return { x, y, zoom: clampedZoom };
};
const getD3Transition = (selection, duration = 0) => {
    return selection.transition().duration(duration);
};

// this functions collects all handles and adds an absolute position
// so that we can later find the closest handle to the mouse position
function getHandles(node, handleBounds, type, currentHandle) {
    return (handleBounds[type] || []).reduce((res, h) => {
        if (`${node.id}-${h.id}-${type}` !== currentHandle) {
            res.push({
                id: h.id || null,
                type,
                nodeId: node.id,
                x: (node.positionAbsolute?.x ?? 0) + h.x + h.width / 2,
                y: (node.positionAbsolute?.y ?? 0) + h.y + h.height / 2,
            });
        }
        return res;
    }, []);
}
function getClosestHandle(event, doc, pos, connectionRadius, handles, validator) {
    // we always want to prioritize the handle below the mouse cursor over the closest distance handle,
    // because it could be that the center of another handle is closer to the mouse pointer than the handle below the cursor
    const { x, y } = getEventPosition(event);
    const domNodes = doc.elementsFromPoint(x, y);
    const handleBelow = domNodes.find((el) => el.classList.contains('react-flow__handle'));
    if (handleBelow) {
        const handleNodeId = handleBelow.getAttribute('data-nodeid');
        if (handleNodeId) {
            const handleType = getHandleType(undefined, handleBelow);
            const handleId = handleBelow.getAttribute('data-handleid');
            const validHandleResult = validator({ nodeId: handleNodeId, id: handleId, type: handleType });
            if (validHandleResult) {
                const handle = handles.find((h) => h.nodeId === handleNodeId && h.type === handleType && h.id === handleId);
                return {
                    handle: {
                        id: handleId,
                        type: handleType,
                        nodeId: handleNodeId,
                        x: handle?.x || pos.x,
                        y: handle?.y || pos.y,
                    },
                    validHandleResult,
                };
            }
        }
    }
    // if we couldn't find a handle below the mouse cursor we look for the closest distance based on the connectionRadius
    let closestHandles = [];
    let minDistance = Infinity;
    handles.forEach((handle) => {
        const distance = Math.sqrt((handle.x - pos.x) ** 2 + (handle.y - pos.y) ** 2);
        if (distance <= connectionRadius) {
            const validHandleResult = validator(handle);
            if (distance <= minDistance) {
                if (distance < minDistance) {
                    closestHandles = [{ handle, validHandleResult }];
                }
                else if (distance === minDistance) {
                    // when multiple handles are on the same distance we collect all of them
                    closestHandles.push({
                        handle,
                        validHandleResult,
                    });
                }
                minDistance = distance;
            }
        }
    });
    if (!closestHandles.length) {
        return { handle: null, validHandleResult: defaultResult() };
    }
    if (closestHandles.length === 1) {
        return closestHandles[0];
    }
    const hasValidHandle = closestHandles.some(({ validHandleResult }) => validHandleResult.isValid);
    const hasTargetHandle = closestHandles.some(({ handle }) => handle.type === 'target');
    // if multiple handles are layouted on top of each other we prefer the one with type = target and the one that is valid
    return (closestHandles.find(({ handle, validHandleResult }) => hasTargetHandle ? handle.type === 'target' : (hasValidHandle ? validHandleResult.isValid : true)) || closestHandles[0]);
}
const nullConnection = { source: null, target: null, sourceHandle: null, targetHandle: null };
const defaultResult = () => ({
    handleDomNode: null,
    isValid: false,
    connection: nullConnection,
    endHandle: null,
});
// checks if  and returns connection in fom of an object { source: 123, target: 312 }
function isValidHandle(handle, connectionMode, fromNodeId, fromHandleId, fromType, isValidConnection, doc) {
    const isTarget = fromType === 'target';
    const handleToCheck = doc.querySelector(`.react-flow__handle[data-id="${handle?.nodeId}-${handle?.id}-${handle?.type}"]`);
    const result = {
        ...defaultResult(),
        handleDomNode: handleToCheck,
    };
    if (handleToCheck) {
        const handleType = getHandleType(undefined, handleToCheck);
        const handleNodeId = handleToCheck.getAttribute('data-nodeid');
        const handleId = handleToCheck.getAttribute('data-handleid');
        const connectable = handleToCheck.classList.contains('connectable');
        const connectableEnd = handleToCheck.classList.contains('connectableend');
        const connection = {
            source: isTarget ? handleNodeId : fromNodeId,
            sourceHandle: isTarget ? handleId : fromHandleId,
            target: isTarget ? fromNodeId : handleNodeId,
            targetHandle: isTarget ? fromHandleId : handleId,
        };
        result.connection = connection;
        const isConnectable = connectable && connectableEnd;
        // in strict mode we don't allow target to target or source to source connections
        const isValid = isConnectable &&
            (connectionMode === ConnectionMode.Strict
                ? (isTarget && handleType === 'source') || (!isTarget && handleType === 'target')
                : handleNodeId !== fromNodeId || handleId !== fromHandleId);
        if (isValid) {
            result.endHandle = {
                nodeId: handleNodeId,
                handleId,
                type: handleType,
            };
            result.isValid = isValidConnection(connection);
        }
    }
    return result;
}
function getHandleLookup({ nodes, nodeId, handleId, handleType }) {
    return nodes.reduce((res, node) => {
        if (node[internalsSymbol]) {
            const { handleBounds } = node[internalsSymbol];
            let sourceHandles = [];
            let targetHandles = [];
            if (handleBounds) {
                sourceHandles = getHandles(node, handleBounds, 'source', `${nodeId}-${handleId}-${handleType}`);
                targetHandles = getHandles(node, handleBounds, 'target', `${nodeId}-${handleId}-${handleType}`);
            }
            res.push(...sourceHandles, ...targetHandles);
        }
        return res;
    }, []);
}
function getHandleType(edgeUpdaterType, handleDomNode) {
    if (edgeUpdaterType) {
        return edgeUpdaterType;
    }
    else if (handleDomNode?.classList.contains('target')) {
        return 'target';
    }
    else if (handleDomNode?.classList.contains('source')) {
        return 'source';
    }
    return null;
}
function resetRecentHandle(handleDomNode) {
    handleDomNode?.classList.remove('valid', 'connecting', 'react-flow__handle-valid', 'react-flow__handle-connecting');
}
function getConnectionStatus(isInsideConnectionRadius, isHandleValid) {
    let connectionStatus = null;
    if (isHandleValid) {
        connectionStatus = 'valid';
    }
    else if (isInsideConnectionRadius && !isHandleValid) {
        connectionStatus = 'invalid';
    }
    return connectionStatus;
}

function handlePointerDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, edgeUpdaterType, onEdgeUpdateEnd, }) {
    // when react-flow is used inside a shadow root we can't use document
    const doc = getHostForElement(event.target);
    const { connectionMode, domNode, autoPanOnConnect, connectionRadius, onConnectStart, panBy, getNodes, cancelConnection, } = getState();
    let autoPanId = 0;
    let closestHandle;
    const { x, y } = getEventPosition(event);
    const clickedHandle = doc?.elementFromPoint(x, y);
    const handleType = getHandleType(edgeUpdaterType, clickedHandle);
    const containerBounds = domNode?.getBoundingClientRect();
    if (!containerBounds || !handleType) {
        return;
    }
    let prevActiveHandle;
    let connectionPosition = getEventPosition(event, containerBounds);
    let autoPanStarted = false;
    let connection = null;
    let isValid = false;
    let handleDomNode = null;
    const handleLookup = getHandleLookup({
        nodes: getNodes(),
        nodeId,
        handleId,
        handleType,
    });
    // when the user is moving the mouse close to the edge of the canvas while connecting we move the canvas
    const autoPan = () => {
        if (!autoPanOnConnect) {
            return;
        }
        const [xMovement, yMovement] = calcAutoPan(connectionPosition, containerBounds);
        panBy({ x: xMovement, y: yMovement });
        autoPanId = requestAnimationFrame(autoPan);
    };
    setState({
        connectionPosition,
        connectionStatus: null,
        // connectionNodeId etc will be removed in the next major in favor of connectionStartHandle
        connectionNodeId: nodeId,
        connectionHandleId: handleId,
        connectionHandleType: handleType,
        connectionStartHandle: {
            nodeId,
            handleId,
            type: handleType,
        },
        connectionEndHandle: null,
    });
    onConnectStart?.(event, { nodeId, handleId, handleType });
    function onPointerMove(event) {
        const { transform } = getState();
        connectionPosition = getEventPosition(event, containerBounds);
        const { handle, validHandleResult } = getClosestHandle(event, doc, pointToRendererPoint(connectionPosition, transform, false, [1, 1]), connectionRadius, handleLookup, (handle) => isValidHandle(handle, connectionMode, nodeId, handleId, isTarget ? 'target' : 'source', isValidConnection, doc));
        closestHandle = handle;
        if (!autoPanStarted) {
            autoPan();
            autoPanStarted = true;
        }
        handleDomNode = validHandleResult.handleDomNode;
        connection = validHandleResult.connection;
        isValid = validHandleResult.isValid;
        setState({
            connectionPosition: closestHandle && isValid
                ? rendererPointToPoint({
                    x: closestHandle.x,
                    y: closestHandle.y,
                }, transform)
                : connectionPosition,
            connectionStatus: getConnectionStatus(!!closestHandle, isValid),
            connectionEndHandle: validHandleResult.endHandle,
        });
        if (!closestHandle && !isValid && !handleDomNode) {
            return resetRecentHandle(prevActiveHandle);
        }
        if (connection.source !== connection.target && handleDomNode) {
            resetRecentHandle(prevActiveHandle);
            prevActiveHandle = handleDomNode;
            // @todo: remove the old class names "react-flow__handle-" in the next major version
            handleDomNode.classList.add('connecting', 'react-flow__handle-connecting');
            handleDomNode.classList.toggle('valid', isValid);
            handleDomNode.classList.toggle('react-flow__handle-valid', isValid);
        }
    }
    function onPointerUp(event) {
        if ((closestHandle || handleDomNode) && connection && isValid) {
            onConnect?.(connection);
        }
        // it's important to get a fresh reference from the store here
        // in order to get the latest state of onConnectEnd
        getState().onConnectEnd?.(event);
        if (edgeUpdaterType) {
            onEdgeUpdateEnd?.(event);
        }
        resetRecentHandle(prevActiveHandle);
        cancelConnection();
        cancelAnimationFrame(autoPanId);
        autoPanStarted = false;
        isValid = false;
        connection = null;
        handleDomNode = null;
        doc.removeEventListener('mousemove', onPointerMove);
        doc.removeEventListener('mouseup', onPointerUp);
        doc.removeEventListener('touchmove', onPointerMove);
        doc.removeEventListener('touchend', onPointerUp);
    }
    doc.addEventListener('mousemove', onPointerMove);
    doc.addEventListener('mouseup', onPointerUp);
    doc.addEventListener('touchmove', onPointerMove);
    doc.addEventListener('touchend', onPointerUp);
}

const alwaysValid = () => true;
const selector$f = (s) => ({
    connectionStartHandle: s.connectionStartHandle,
    connectOnClick: s.connectOnClick,
    noPanClassName: s.noPanClassName,
});
const connectingSelector = (nodeId, handleId, type) => (state) => {
    const { connectionStartHandle: startHandle, connectionEndHandle: endHandle, connectionClickStartHandle: clickHandle, } = state;
    return {
        connecting: (startHandle?.nodeId === nodeId && startHandle?.handleId === handleId && startHandle?.type === type) ||
            (endHandle?.nodeId === nodeId && endHandle?.handleId === handleId && endHandle?.type === type),
        clickConnecting: clickHandle?.nodeId === nodeId && clickHandle?.handleId === handleId && clickHandle?.type === type,
    };
};
const Handle = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({ type = 'source', position = Position.Top, isValidConnection, isConnectable = true, isConnectableStart = true, isConnectableEnd = true, id, onConnect, children, className, onMouseDown, onTouchStart, ...rest }, ref) => {
    const handleId = id || null;
    const isTarget = type === 'target';
    const store = useStoreApi();
    const nodeId = useNodeId();
    const { connectOnClick, noPanClassName } = useStore(selector$f, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const { connecting, clickConnecting } = useStore(connectingSelector(nodeId, handleId, type), zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    if (!nodeId) {
        store.getState().onError?.('010', errorMessages['error010']());
    }
    const onConnectExtended = (params) => {
        const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
        const edgeParams = {
            ...defaultEdgeOptions,
            ...params,
        };
        if (hasDefaultEdges) {
            const { edges, setEdges } = store.getState();
            setEdges(addEdge(edgeParams, edges));
        }
        onConnectAction?.(edgeParams);
        onConnect?.(edgeParams);
    };
    const onPointerDown = (event) => {
        if (!nodeId) {
            return;
        }
        const isMouseTriggered = isMouseEvent(event);
        if (isConnectableStart && ((isMouseTriggered && event.button === 0) || !isMouseTriggered)) {
            handlePointerDown({
                event,
                handleId,
                nodeId,
                onConnect: onConnectExtended,
                isTarget,
                getState: store.getState,
                setState: store.setState,
                isValidConnection: isValidConnection || store.getState().isValidConnection || alwaysValid,
            });
        }
        if (isMouseTriggered) {
            onMouseDown?.(event);
        }
        else {
            onTouchStart?.(event);
        }
    };
    const onClick = (event) => {
        const { onClickConnectStart, onClickConnectEnd, connectionClickStartHandle, connectionMode, isValidConnection: isValidConnectionStore, } = store.getState();
        if (!nodeId || (!connectionClickStartHandle && !isConnectableStart)) {
            return;
        }
        if (!connectionClickStartHandle) {
            onClickConnectStart?.(event, { nodeId, handleId, handleType: type });
            store.setState({ connectionClickStartHandle: { nodeId, type, handleId } });
            return;
        }
        const doc = getHostForElement(event.target);
        const isValidConnectionHandler = isValidConnection || isValidConnectionStore || alwaysValid;
        const { connection, isValid } = isValidHandle({
            nodeId,
            id: handleId,
            type,
        }, connectionMode, connectionClickStartHandle.nodeId, connectionClickStartHandle.handleId || null, connectionClickStartHandle.type, isValidConnectionHandler, doc);
        if (isValid) {
            onConnectExtended(connection);
        }
        onClickConnectEnd?.(event);
        store.setState({ connectionClickStartHandle: null });
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, "data-id": `${nodeId}-${handleId}-${type}`, className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])([
            'react-flow__handle',
            `react-flow__handle-${position}`,
            'nodrag',
            noPanClassName,
            className,
            {
                source: !isTarget,
                target: isTarget,
                connectable: isConnectable,
                connectablestart: isConnectableStart,
                connectableend: isConnectableEnd,
                connecting: clickConnecting,
                // this class is used to style the handle when the user is connecting
                connectionindicator: isConnectable && ((isConnectableStart && !connecting) || (isConnectableEnd && connecting)),
            },
        ]), onMouseDown: onPointerDown, onTouchStart: onPointerDown, onClick: connectOnClick ? onClick : undefined, ref: ref, ...rest }, children));
});
Handle.displayName = 'Handle';
var Handle$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(Handle);

const DefaultNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom, }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Handle$1, { type: "target", position: targetPosition, isConnectable: isConnectable }),
        data?.label,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Handle$1, { type: "source", position: sourcePosition, isConnectable: isConnectable })));
};
DefaultNode.displayName = 'DefaultNode';
var DefaultNode$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(DefaultNode);

const InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
    data?.label,
    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Handle$1, { type: "source", position: sourcePosition, isConnectable: isConnectable })));
InputNode.displayName = 'InputNode';
var InputNode$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(InputNode);

const OutputNode = ({ data, isConnectable, targetPosition = Position.Top }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Handle$1, { type: "target", position: targetPosition, isConnectable: isConnectable }),
    data?.label));
OutputNode.displayName = 'OutputNode';
var OutputNode$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(OutputNode);

const GroupNode = () => null;
GroupNode.displayName = 'GroupNode';

const selector$e = (s) => ({
    selectedNodes: s.getNodes().filter((n) => n.selected),
    selectedEdges: s.edges.filter((e) => e.selected),
});
const selectId = (obj) => obj.id;
function areEqual(a, b) {
    return ((0,zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow)(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) &&
        (0,zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow)(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId)));
}
// This is just a helper component for calling the onSelectionChange listener.
// @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
const SelectionListener = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({ onSelectionChange }) => {
    const store = useStoreApi();
    const { selectedNodes, selectedEdges } = useStore(selector$e, areEqual);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const params = { nodes: selectedNodes, edges: selectedEdges };
        onSelectionChange?.(params);
        store.getState().onSelectionChange.forEach((fn) => fn(params));
    }, [selectedNodes, selectedEdges, onSelectionChange]);
    return null;
});
SelectionListener.displayName = 'SelectionListener';
const changeSelector = (s) => !!s.onSelectionChange;
function Wrapper$1({ onSelectionChange }) {
    const storeHasSelectionChange = useStore(changeSelector);
    if (onSelectionChange || storeHasSelectionChange) {
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement(SelectionListener, { onSelectionChange: onSelectionChange });
    }
    return null;
}

const selector$d = (s) => ({
    setNodes: s.setNodes,
    setEdges: s.setEdges,
    setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
    setMinZoom: s.setMinZoom,
    setMaxZoom: s.setMaxZoom,
    setTranslateExtent: s.setTranslateExtent,
    setNodeExtent: s.setNodeExtent,
    reset: s.reset,
});
function useStoreUpdater(value, setStoreState) {
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (typeof value !== 'undefined') {
            setStoreState(value);
        }
    }, [value]);
}
// updates with values in store that don't have a dedicated setter function
function useDirectStoreUpdater(key, value, setState) {
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (typeof value !== 'undefined') {
            setState({ [key]: value });
        }
    }, [value]);
}
const StoreUpdater = ({ nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, edgesUpdatable, elevateNodesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, elementsSelectable, connectionMode, snapGrid, snapToGrid, translateExtent, connectOnClick, defaultEdgeOptions, fitView, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDrag, onNodeDragStart, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId, autoPanOnConnect, autoPanOnNodeDrag, onError, connectionRadius, isValidConnection, nodeDragThreshold, }) => {
    const { setNodes, setEdges, setDefaultNodesAndEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset, } = useStore(selector$d, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const store = useStoreApi();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const edgesWithDefaults = defaultEdges?.map((e) => ({ ...e, ...defaultEdgeOptions }));
        setDefaultNodesAndEdges(defaultNodes, edgesWithDefaults);
        return () => {
            reset();
        };
    }, []);
    useDirectStoreUpdater('defaultEdgeOptions', defaultEdgeOptions, store.setState);
    useDirectStoreUpdater('connectionMode', connectionMode, store.setState);
    useDirectStoreUpdater('onConnect', onConnect, store.setState);
    useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
    useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);
    useDirectStoreUpdater('onClickConnectStart', onClickConnectStart, store.setState);
    useDirectStoreUpdater('onClickConnectEnd', onClickConnectEnd, store.setState);
    useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
    useDirectStoreUpdater('nodesConnectable', nodesConnectable, store.setState);
    useDirectStoreUpdater('nodesFocusable', nodesFocusable, store.setState);
    useDirectStoreUpdater('edgesFocusable', edgesFocusable, store.setState);
    useDirectStoreUpdater('edgesUpdatable', edgesUpdatable, store.setState);
    useDirectStoreUpdater('elementsSelectable', elementsSelectable, store.setState);
    useDirectStoreUpdater('elevateNodesOnSelect', elevateNodesOnSelect, store.setState);
    useDirectStoreUpdater('snapToGrid', snapToGrid, store.setState);
    useDirectStoreUpdater('snapGrid', snapGrid, store.setState);
    useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
    useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);
    useDirectStoreUpdater('connectOnClick', connectOnClick, store.setState);
    useDirectStoreUpdater('fitViewOnInit', fitView, store.setState);
    useDirectStoreUpdater('fitViewOnInitOptions', fitViewOptions, store.setState);
    useDirectStoreUpdater('onNodesDelete', onNodesDelete, store.setState);
    useDirectStoreUpdater('onEdgesDelete', onEdgesDelete, store.setState);
    useDirectStoreUpdater('onNodeDrag', onNodeDrag, store.setState);
    useDirectStoreUpdater('onNodeDragStart', onNodeDragStart, store.setState);
    useDirectStoreUpdater('onNodeDragStop', onNodeDragStop, store.setState);
    useDirectStoreUpdater('onSelectionDrag', onSelectionDrag, store.setState);
    useDirectStoreUpdater('onSelectionDragStart', onSelectionDragStart, store.setState);
    useDirectStoreUpdater('onSelectionDragStop', onSelectionDragStop, store.setState);
    useDirectStoreUpdater('noPanClassName', noPanClassName, store.setState);
    useDirectStoreUpdater('nodeOrigin', nodeOrigin, store.setState);
    useDirectStoreUpdater('rfId', rfId, store.setState);
    useDirectStoreUpdater('autoPanOnConnect', autoPanOnConnect, store.setState);
    useDirectStoreUpdater('autoPanOnNodeDrag', autoPanOnNodeDrag, store.setState);
    useDirectStoreUpdater('onError', onError, store.setState);
    useDirectStoreUpdater('connectionRadius', connectionRadius, store.setState);
    useDirectStoreUpdater('isValidConnection', isValidConnection, store.setState);
    useDirectStoreUpdater('nodeDragThreshold', nodeDragThreshold, store.setState);
    useStoreUpdater(nodes, setNodes);
    useStoreUpdater(edges, setEdges);
    useStoreUpdater(minZoom, setMinZoom);
    useStoreUpdater(maxZoom, setMaxZoom);
    useStoreUpdater(translateExtent, setTranslateExtent);
    useStoreUpdater(nodeExtent, setNodeExtent);
    return null;
};

const style = { display: 'none' };
const ariaLiveStyle = {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0px, 0px, 0px, 0px)',
    clipPath: 'inset(100%)',
};
const ARIA_NODE_DESC_KEY = 'react-flow__node-desc';
const ARIA_EDGE_DESC_KEY = 'react-flow__edge-desc';
const ARIA_LIVE_MESSAGE = 'react-flow__aria-live';
const selector$c = (s) => s.ariaLiveMessage;
function AriaLiveMessage({ rfId }) {
    const ariaLiveMessage = useStore(selector$c);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: `${ARIA_LIVE_MESSAGE}-${rfId}`, "aria-live": "assertive", "aria-atomic": "true", style: ariaLiveStyle }, ariaLiveMessage));
}
function A11yDescriptions({ rfId, disableKeyboardA11y }) {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: `${ARIA_NODE_DESC_KEY}-${rfId}`, style: style },
            "Press enter or space to select a node.",
            !disableKeyboardA11y && 'You can then use the arrow keys to move the node around.',
            " Press delete to remove it and escape to cancel.",
            ' '),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { id: `${ARIA_EDGE_DESC_KEY}-${rfId}`, style: style }, "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel."),
        !disableKeyboardA11y && react__WEBPACK_IMPORTED_MODULE_0__.createElement(AriaLiveMessage, { rfId: rfId })));
}

// the keycode can be a string 'a' or an array of strings ['a', 'a+d']
// a string means a single key 'a' or a combination when '+' is used 'a+d'
// an array means different possibilities. Explainer: ['a', 'd+s'] here the
// user can use the single key 'a' or the combination 'd' + 's'
var useKeyPress = (keyCode = null, options = { actInsideInputWithModifier: true }) => {
    const [keyPressed, setKeyPressed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    // we need to remember if a modifier key is pressed in order to track it
    const modifierPressed = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    // we need to remember the pressed keys in order to support combinations
    const pressedKeys = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Set([]));
    // keyCodes = array with single keys [['a']] or key combinations [['a', 's']]
    // keysToWatch = array with all keys flattened ['a', 'd', 'ShiftLeft']
    // used to check if we store event.code or event.key. When the code is in the list of keysToWatch
    // we use the code otherwise the key. Explainer: When you press the left "command" key, the code is "MetaLeft"
    // and the key is "Meta". We want users to be able to pass keys and codes so we assume that the key is meant when
    // we can't find it in the list of keysToWatch.
    const [keyCodes, keysToWatch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (keyCode !== null) {
            const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
            const keys = keyCodeArr.filter((kc) => typeof kc === 'string').map((kc) => kc.split('+'));
            const keysFlat = keys.reduce((res, item) => res.concat(...item), []);
            return [keys, keysFlat];
        }
        return [[], []];
    }, [keyCode]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const doc = typeof document !== 'undefined' ? document : null;
        const target = options?.target || doc;
        if (keyCode !== null) {
            const downHandler = (event) => {
                modifierPressed.current = event.ctrlKey || event.metaKey || event.shiftKey;
                const preventAction = (!modifierPressed.current || (modifierPressed.current && !options.actInsideInputWithModifier)) &&
                    isInputDOMNode(event);
                if (preventAction) {
                    return false;
                }
                const keyOrCode = useKeyOrCode(event.code, keysToWatch);
                pressedKeys.current.add(event[keyOrCode]);
                if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
                    event.preventDefault();
                    setKeyPressed(true);
                }
            };
            const upHandler = (event) => {
                const preventAction = (!modifierPressed.current || (modifierPressed.current && !options.actInsideInputWithModifier)) &&
                    isInputDOMNode(event);
                if (preventAction) {
                    return false;
                }
                const keyOrCode = useKeyOrCode(event.code, keysToWatch);
                if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
                    setKeyPressed(false);
                    pressedKeys.current.clear();
                }
                else {
                    pressedKeys.current.delete(event[keyOrCode]);
                }
                // fix for Mac: when cmd key is pressed, keyup is not triggered for any other key, see: https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key
                if (event.key === 'Meta') {
                    pressedKeys.current.clear();
                }
                modifierPressed.current = false;
            };
            const resetHandler = () => {
                pressedKeys.current.clear();
                setKeyPressed(false);
            };
            target?.addEventListener('keydown', downHandler);
            target?.addEventListener('keyup', upHandler);
            window.addEventListener('blur', resetHandler);
            return () => {
                target?.removeEventListener('keydown', downHandler);
                target?.removeEventListener('keyup', upHandler);
                window.removeEventListener('blur', resetHandler);
            };
        }
    }, [keyCode, setKeyPressed]);
    return keyPressed;
};
// utils
function isMatchingKey(keyCodes, pressedKeys, isUp) {
    return (keyCodes
        // we only want to compare same sizes of keyCode definitions
        // and pressed keys. When the user specified 'Meta' as a key somewhere
        // this would also be truthy without this filter when user presses 'Meta' + 'r'
        .filter((keys) => isUp || keys.length === pressedKeys.size)
        // since we want to support multiple possibilities only one of the
        // combinations need to be part of the pressed keys
        .some((keys) => keys.every((k) => pressedKeys.has(k))));
}
function useKeyOrCode(eventCode, keysToWatch) {
    return keysToWatch.includes(eventCode) ? 'code' : 'key';
}

function calculateXYZPosition(node, nodeInternals, result, nodeOrigin) {
    if (!node.parentNode) {
        return result;
    }
    const parentNode = nodeInternals.get(node.parentNode);
    const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);
    return calculateXYZPosition(parentNode, nodeInternals, {
        x: (result.x ?? 0) + parentNodePosition.x,
        y: (result.y ?? 0) + parentNodePosition.y,
        z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0,
    }, nodeOrigin);
}
function updateAbsoluteNodePositions(nodeInternals, nodeOrigin, parentNodes) {
    nodeInternals.forEach((node) => {
        if (node.parentNode && !nodeInternals.has(node.parentNode)) {
            throw new Error(`Parent node ${node.parentNode} not found`);
        }
        if (node.parentNode || parentNodes?.[node.id]) {
            const { x, y, z } = calculateXYZPosition(node, nodeInternals, {
                ...node.position,
                z: node[internalsSymbol]?.z ?? 0,
            }, nodeOrigin);
            node.positionAbsolute = {
                x,
                y,
            };
            node[internalsSymbol].z = z;
            if (parentNodes?.[node.id]) {
                node[internalsSymbol].isParent = true;
            }
        }
    });
}
function createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) {
    const nextNodeInternals = new Map();
    const parentNodes = {};
    const selectedNodeZ = elevateNodesOnSelect ? 1000 : 0;
    nodes.forEach((node) => {
        const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
        const currInternals = nodeInternals.get(node.id);
        const internals = {
            ...node,
            positionAbsolute: {
                x: node.position.x,
                y: node.position.y,
            },
        };
        if (node.parentNode) {
            parentNodes[node.parentNode] = true;
        }
        const resetHandleBounds = currInternals?.type && currInternals?.type !== node.type;
        Object.defineProperty(internals, internalsSymbol, {
            enumerable: false,
            value: {
                handleBounds: resetHandleBounds ? undefined : currInternals?.[internalsSymbol]?.handleBounds,
                z,
            },
        });
        nextNodeInternals.set(node.id, internals);
    });
    updateAbsoluteNodePositions(nextNodeInternals, nodeOrigin, parentNodes);
    return nextNodeInternals;
}
function fitView(get, options = {}) {
    const { getNodes, width, height, minZoom, maxZoom, d3Zoom, d3Selection, fitViewOnInitDone, fitViewOnInit, nodeOrigin, } = get();
    const isInitialFitView = options.initial && !fitViewOnInitDone && fitViewOnInit;
    const d3initialized = d3Zoom && d3Selection;
    if (d3initialized && (isInitialFitView || !options.initial)) {
        const nodes = getNodes().filter((n) => {
            const isVisible = options.includeHiddenNodes ? n.width && n.height : !n.hidden;
            if (options.nodes?.length) {
                return isVisible && options.nodes.some((optionNode) => optionNode.id === n.id);
            }
            return isVisible;
        });
        const nodesInitialized = nodes.every((n) => n.width && n.height);
        if (nodes.length > 0 && nodesInitialized) {
            const bounds = getNodesBounds(nodes, nodeOrigin);
            const { x, y, zoom } = getViewportForBounds(bounds, width, height, options.minZoom ?? minZoom, options.maxZoom ?? maxZoom, options.padding ?? 0.1);
            const nextTransform = d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoomIdentity.translate(x, y).scale(zoom);
            if (typeof options.duration === 'number' && options.duration > 0) {
                d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
            }
            else {
                d3Zoom.transform(d3Selection, nextTransform);
            }
            return true;
        }
    }
    return false;
}
function handleControlledNodeSelectionChange(nodeChanges, nodeInternals) {
    nodeChanges.forEach((change) => {
        const node = nodeInternals.get(change.id);
        if (node) {
            nodeInternals.set(node.id, {
                ...node,
                [internalsSymbol]: node[internalsSymbol],
                selected: change.selected,
            });
        }
    });
    return new Map(nodeInternals);
}
function handleControlledEdgeSelectionChange(edgeChanges, edges) {
    return edges.map((e) => {
        const change = edgeChanges.find((change) => change.id === e.id);
        if (change) {
            e.selected = change.selected;
        }
        return e;
    });
}
function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }) {
    const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();
    if (changedNodes?.length) {
        if (hasDefaultNodes) {
            set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
        }
        onNodesChange?.(changedNodes);
    }
    if (changedEdges?.length) {
        if (hasDefaultEdges) {
            set({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
        }
        onEdgesChange?.(changedEdges);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };
const initialViewportHelper = {
    zoomIn: noop,
    zoomOut: noop,
    zoomTo: noop,
    getZoom: () => 1,
    setViewport: noop,
    getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
    fitView: () => false,
    setCenter: noop,
    fitBounds: noop,
    project: (position) => position,
    screenToFlowPosition: (position) => position,
    flowToScreenPosition: (position) => position,
    viewportInitialized: false,
};
const selector$b = (s) => ({
    d3Zoom: s.d3Zoom,
    d3Selection: s.d3Selection,
});
const useViewportHelper = () => {
    const store = useStoreApi();
    const { d3Zoom, d3Selection } = useStore(selector$b, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const viewportHelperFunctions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (d3Selection && d3Zoom) {
            return {
                zoomIn: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1.2),
                zoomOut: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1 / 1.2),
                zoomTo: (zoomLevel, options) => d3Zoom.scaleTo(getD3Transition(d3Selection, options?.duration), zoomLevel),
                getZoom: () => store.getState().transform[2],
                setViewport: (transform, options) => {
                    const [x, y, zoom] = store.getState().transform;
                    const nextTransform = d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoomIdentity
                        .translate(transform.x ?? x, transform.y ?? y)
                        .scale(transform.zoom ?? zoom);
                    d3Zoom.transform(getD3Transition(d3Selection, options?.duration), nextTransform);
                },
                getViewport: () => {
                    const [x, y, zoom] = store.getState().transform;
                    return { x, y, zoom };
                },
                fitView: (options) => fitView(store.getState, options),
                setCenter: (x, y, options) => {
                    const { width, height, maxZoom } = store.getState();
                    const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
                    const centerX = width / 2 - x * nextZoom;
                    const centerY = height / 2 - y * nextZoom;
                    const transform = d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoomIdentity.translate(centerX, centerY).scale(nextZoom);
                    d3Zoom.transform(getD3Transition(d3Selection, options?.duration), transform);
                },
                fitBounds: (bounds, options) => {
                    const { width, height, minZoom, maxZoom } = store.getState();
                    const { x, y, zoom } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);
                    const transform = d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoomIdentity.translate(x, y).scale(zoom);
                    d3Zoom.transform(getD3Transition(d3Selection, options?.duration), transform);
                },
                // @deprecated Use `screenToFlowPosition`.
                project: (position) => {
                    const { transform, snapToGrid, snapGrid } = store.getState();
                    console.warn('[DEPRECATED] `project` is deprecated. Instead use `screenToFlowPosition`. There is no need to subtract the react flow bounds anymore! https://reactflow.dev/api-reference/types/react-flow-instance#screen-to-flow-position');
                    return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
                },
                screenToFlowPosition: (position) => {
                    const { transform, snapToGrid, snapGrid, domNode } = store.getState();
                    if (!domNode) {
                        return position;
                    }
                    const { x: domX, y: domY } = domNode.getBoundingClientRect();
                    const relativePosition = {
                        x: position.x - domX,
                        y: position.y - domY,
                    };
                    return pointToRendererPoint(relativePosition, transform, snapToGrid, snapGrid);
                },
                flowToScreenPosition: (position) => {
                    const { transform, domNode } = store.getState();
                    if (!domNode) {
                        return position;
                    }
                    const { x: domX, y: domY } = domNode.getBoundingClientRect();
                    const rendererPosition = rendererPointToPoint(position, transform);
                    return {
                        x: rendererPosition.x + domX,
                        y: rendererPosition.y + domY,
                    };
                },
                viewportInitialized: true,
            };
        }
        return initialViewportHelper;
    }, [d3Zoom, d3Selection]);
    return viewportHelperFunctions;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function useReactFlow() {
    const viewportHelper = useViewportHelper();
    const store = useStoreApi();
    const getNodes = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        return store
            .getState()
            .getNodes()
            .map((n) => ({ ...n }));
    }, []);
    const getNode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((id) => {
        return store.getState().nodeInternals.get(id);
    }, []);
    const getEdges = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        const { edges = [] } = store.getState();
        return edges.map((e) => ({ ...e }));
    }, []);
    const getEdge = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((id) => {
        const { edges = [] } = store.getState();
        return edges.find((e) => e.id === id);
    }, []);
    const setNodes = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((payload) => {
        const { getNodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
        const nodes = getNodes();
        const nextNodes = typeof payload === 'function' ? payload(nodes) : payload;
        if (hasDefaultNodes) {
            setNodes(nextNodes);
        }
        else if (onNodesChange) {
            const changes = nextNodes.length === 0
                ? nodes.map((node) => ({ type: 'remove', id: node.id }))
                : nextNodes.map((node) => ({ item: node, type: 'reset' }));
            onNodesChange(changes);
        }
    }, []);
    const setEdges = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((payload) => {
        const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
        const nextEdges = typeof payload === 'function' ? payload(edges) : payload;
        if (hasDefaultEdges) {
            setEdges(nextEdges);
        }
        else if (onEdgesChange) {
            const changes = nextEdges.length === 0
                ? edges.map((edge) => ({ type: 'remove', id: edge.id }))
                : nextEdges.map((edge) => ({ item: edge, type: 'reset' }));
            onEdgesChange(changes);
        }
    }, []);
    const addNodes = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((payload) => {
        const nodes = Array.isArray(payload) ? payload : [payload];
        const { getNodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
        if (hasDefaultNodes) {
            const currentNodes = getNodes();
            const nextNodes = [...currentNodes, ...nodes];
            setNodes(nextNodes);
        }
        else if (onNodesChange) {
            const changes = nodes.map((node) => ({ item: node, type: 'add' }));
            onNodesChange(changes);
        }
    }, []);
    const addEdges = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((payload) => {
        const nextEdges = Array.isArray(payload) ? payload : [payload];
        const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
        if (hasDefaultEdges) {
            setEdges([...edges, ...nextEdges]);
        }
        else if (onEdgesChange) {
            const changes = nextEdges.map((edge) => ({ item: edge, type: 'add' }));
            onEdgesChange(changes);
        }
    }, []);
    const toObject = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        const { getNodes, edges = [], transform } = store.getState();
        const [x, y, zoom] = transform;
        return {
            nodes: getNodes().map((n) => ({ ...n })),
            edges: edges.map((e) => ({ ...e })),
            viewport: {
                x,
                y,
                zoom,
            },
        };
    }, []);
    const deleteElements = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({ nodes: nodesDeleted, edges: edgesDeleted }) => {
        const { nodeInternals, getNodes, edges, hasDefaultNodes, hasDefaultEdges, onNodesDelete, onEdgesDelete, onNodesChange, onEdgesChange, } = store.getState();
        const nodeIds = (nodesDeleted || []).map((node) => node.id);
        const edgeIds = (edgesDeleted || []).map((edge) => edge.id);
        const nodesToRemove = getNodes().reduce((res, node) => {
            const parentHit = !nodeIds.includes(node.id) && node.parentNode && res.find((n) => n.id === node.parentNode);
            const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
            if (deletable && (nodeIds.includes(node.id) || parentHit)) {
                res.push(node);
            }
            return res;
        }, []);
        const deletableEdges = edges.filter((e) => (typeof e.deletable === 'boolean' ? e.deletable : true));
        const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
        if (nodesToRemove || initialHitEdges) {
            const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
            const edgesToRemove = [...initialHitEdges, ...connectedEdges];
            const edgeIdsToRemove = edgesToRemove.reduce((res, edge) => {
                if (!res.includes(edge.id)) {
                    res.push(edge.id);
                }
                return res;
            }, []);
            if (hasDefaultEdges || hasDefaultNodes) {
                if (hasDefaultEdges) {
                    store.setState({
                        edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id)),
                    });
                }
                if (hasDefaultNodes) {
                    nodesToRemove.forEach((node) => {
                        nodeInternals.delete(node.id);
                    });
                    store.setState({
                        nodeInternals: new Map(nodeInternals),
                    });
                }
            }
            if (edgeIdsToRemove.length > 0) {
                onEdgesDelete?.(edgesToRemove);
                if (onEdgesChange) {
                    onEdgesChange(edgeIdsToRemove.map((id) => ({
                        id,
                        type: 'remove',
                    })));
                }
            }
            if (nodesToRemove.length > 0) {
                onNodesDelete?.(nodesToRemove);
                if (onNodesChange) {
                    const nodeChanges = nodesToRemove.map((n) => ({ id: n.id, type: 'remove' }));
                    onNodesChange(nodeChanges);
                }
            }
        }
    }, []);
    const getNodeRect = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((nodeOrRect) => {
        const isRect = isRectObject(nodeOrRect);
        const node = isRect ? null : store.getState().nodeInternals.get(nodeOrRect.id);
        if (!isRect && !node) {
            return [null, null, isRect];
        }
        const nodeRect = isRect ? nodeOrRect : nodeToRect(node);
        return [nodeRect, node, isRect];
    }, []);
    const getIntersectingNodes = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((nodeOrRect, partially = true, nodes) => {
        const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);
        if (!nodeRect) {
            return [];
        }
        return (nodes || store.getState().getNodes()).filter((n) => {
            if (!isRect && (n.id === node.id || !n.positionAbsolute)) {
                return false;
            }
            const currNodeRect = nodeToRect(n);
            const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
            const partiallyVisible = partially && overlappingArea > 0;
            return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
        });
    }, []);
    const isNodeIntersecting = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((nodeOrRect, area, partially = true) => {
        const [nodeRect] = getNodeRect(nodeOrRect);
        if (!nodeRect) {
            return false;
        }
        const overlappingArea = getOverlappingArea(nodeRect, area);
        const partiallyVisible = partially && overlappingArea > 0;
        return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
    }, []);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        return {
            ...viewportHelper,
            getNodes,
            getNode,
            getEdges,
            getEdge,
            setNodes,
            setEdges,
            addNodes,
            addEdges,
            toObject,
            deleteElements,
            getIntersectingNodes,
            isNodeIntersecting,
        };
    }, [
        viewportHelper,
        getNodes,
        getNode,
        getEdges,
        getEdge,
        setNodes,
        setEdges,
        addNodes,
        addEdges,
        toObject,
        deleteElements,
        getIntersectingNodes,
        isNodeIntersecting,
    ]);
}

const deleteKeyOptions = { actInsideInputWithModifier: false };
var useGlobalKeyHandler = ({ deleteKeyCode, multiSelectionKeyCode }) => {
    const store = useStoreApi();
    const { deleteElements } = useReactFlow();
    const deleteKeyPressed = useKeyPress(deleteKeyCode, deleteKeyOptions);
    const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (deleteKeyPressed) {
            const { edges, getNodes } = store.getState();
            const selectedNodes = getNodes().filter((node) => node.selected);
            const selectedEdges = edges.filter((edge) => edge.selected);
            deleteElements({ nodes: selectedNodes, edges: selectedEdges });
            store.setState({ nodesSelectionActive: false });
        }
    }, [deleteKeyPressed]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        store.setState({ multiSelectionActive: multiSelectionKeyPressed });
    }, [multiSelectionKeyPressed]);
};

function useResizeHandler(rendererNode) {
    const store = useStoreApi();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        let resizeObserver;
        const updateDimensions = () => {
            if (!rendererNode.current) {
                return;
            }
            const size = getDimensions(rendererNode.current);
            if (size.height === 0 || size.width === 0) {
                store.getState().onError?.('004', errorMessages['error004']());
            }
            store.setState({ width: size.width || 500, height: size.height || 500 });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        if (rendererNode.current) {
            resizeObserver = new ResizeObserver(() => updateDimensions());
            resizeObserver.observe(rendererNode.current);
        }
        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (resizeObserver && rendererNode.current) {
                resizeObserver.unobserve(rendererNode.current);
            }
        };
    }, []);
}

const containerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
};

/* eslint-disable @typescript-eslint/ban-ts-comment */
const viewChanged = (prevViewport, eventTransform) => prevViewport.x !== eventTransform.x || prevViewport.y !== eventTransform.y || prevViewport.zoom !== eventTransform.k;
const eventToFlowTransform = (eventTransform) => ({
    x: eventTransform.x,
    y: eventTransform.y,
    zoom: eventTransform.k,
});
const isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
const isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
const wheelDelta = (event) => {
    const factor = event.ctrlKey && isMacOs() ? 10 : 1;
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
};
const selector$a = (s) => ({
    d3Zoom: s.d3Zoom,
    d3Selection: s.d3Selection,
    d3ZoomHandler: s.d3ZoomHandler,
    userSelectionActive: s.userSelectionActive,
});
const ZoomPane = ({ onMove, onMoveStart, onMoveEnd, onPaneContextMenu, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, elementsSelectable, panOnDrag = true, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children, noWheelClassName, noPanClassName, }) => {
    const timerId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
    const store = useStoreApi();
    const isZoomingOrPanning = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    const zoomedWithRightMouseButton = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    const zoomPane = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const prevTransform = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({ x: 0, y: 0, zoom: 0 });
    const { d3Zoom, d3Selection, d3ZoomHandler, userSelectionActive } = useStore(selector$a, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
    const mouseButton = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
    const isPanScrolling = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    const panScrollTimeout = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
    useResizeHandler(zoomPane);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (zoomPane.current) {
            const bbox = zoomPane.current.getBoundingClientRect();
            const d3ZoomInstance = (0,d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoom)().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
            const selection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_6__["default"])(zoomPane.current).call(d3ZoomInstance);
            const updatedTransform = d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoomIdentity
                .translate(defaultViewport.x, defaultViewport.y)
                .scale(clamp(defaultViewport.zoom, minZoom, maxZoom));
            const extent = [
                [0, 0],
                [bbox.width, bbox.height],
            ];
            const constrainedTransform = d3ZoomInstance.constrain()(updatedTransform, extent, translateExtent);
            d3ZoomInstance.transform(selection, constrainedTransform);
            d3ZoomInstance.wheelDelta(wheelDelta);
            store.setState({
                d3Zoom: d3ZoomInstance,
                d3Selection: selection,
                d3ZoomHandler: selection.on('wheel.zoom'),
                // we need to pass transform because zoom handler is not registered when we set the initial transform
                transform: [constrainedTransform.x, constrainedTransform.y, constrainedTransform.k],
                domNode: zoomPane.current.closest('.react-flow'),
            });
        }
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (d3Selection && d3Zoom) {
            if (panOnScroll && !zoomActivationKeyPressed && !userSelectionActive) {
                d3Selection.on('wheel.zoom', (event) => {
                    if (isWrappedWithClass(event, noWheelClassName)) {
                        return false;
                    }
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    const currentZoom = d3Selection.property('__zoom').k || 1;
                    const _isMacOs = isMacOs();
                    // macos sets ctrlKey=true for pinch gesture on a trackpad
                    if (event.ctrlKey && zoomOnPinch && _isMacOs) {
                        const point = (0,d3_selection__WEBPACK_IMPORTED_MODULE_7__["default"])(event);
                        const pinchDelta = wheelDelta(event);
                        const zoom = currentZoom * Math.pow(2, pinchDelta);
                        // @ts-ignore
                        d3Zoom.scaleTo(d3Selection, zoom, point, event);
                        return;
                    }
                    // increase scroll speed in firefox
                    // firefox: deltaMode === 1; chrome: deltaMode === 0
                    const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
                    let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
                    let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
                    // this enables vertical scrolling with shift + scroll on windows
                    if (!_isMacOs && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
                        deltaX = event.deltaY * deltaNormalize;
                        deltaY = 0;
                    }
                    d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed, 
                    // @ts-ignore
                    { internal: true });
                    const nextViewport = eventToFlowTransform(d3Selection.property('__zoom'));
                    const { onViewportChangeStart, onViewportChange, onViewportChangeEnd } = store.getState();
                    clearTimeout(panScrollTimeout.current);
                    // for pan on scroll we need to handle the event calls on our own
                    // we can't use the start, zoom and end events from d3-zoom
                    // because start and move gets called on every scroll event and not once at the beginning
                    if (!isPanScrolling.current) {
                        isPanScrolling.current = true;
                        onMoveStart?.(event, nextViewport);
                        onViewportChangeStart?.(nextViewport);
                    }
                    if (isPanScrolling.current) {
                        onMove?.(event, nextViewport);
                        onViewportChange?.(nextViewport);
                        panScrollTimeout.current = setTimeout(() => {
                            onMoveEnd?.(event, nextViewport);
                            onViewportChangeEnd?.(nextViewport);
                            isPanScrolling.current = false;
                        }, 150);
                    }
                }, { passive: false });
            }
            else if (typeof d3ZoomHandler !== 'undefined') {
                d3Selection.on('wheel.zoom', function (event, d) {
                    if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
                        return null;
                    }
                    event.preventDefault();
                    d3ZoomHandler.call(this, event, d);
                }, { passive: false });
            }
        }
    }, [
        userSelectionActive,
        panOnScroll,
        panOnScrollMode,
        d3Selection,
        d3Zoom,
        d3ZoomHandler,
        zoomActivationKeyPressed,
        zoomOnPinch,
        preventScrolling,
        noWheelClassName,
        onMoveStart,
        onMove,
        onMoveEnd,
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (d3Zoom) {
            d3Zoom.on('start', (event) => {
                if (!event.sourceEvent || event.sourceEvent.internal) {
                    return null;
                }
                // we need to remember it here, because it's always 0 in the "zoom" event
                mouseButton.current = event.sourceEvent?.button;
                const { onViewportChangeStart } = store.getState();
                const flowTransform = eventToFlowTransform(event.transform);
                isZoomingOrPanning.current = true;
                prevTransform.current = flowTransform;
                if (event.sourceEvent?.type === 'mousedown') {
                    store.setState({ paneDragging: true });
                }
                onViewportChangeStart?.(flowTransform);
                onMoveStart?.(event.sourceEvent, flowTransform);
            });
        }
    }, [d3Zoom, onMoveStart]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (d3Zoom) {
            if (userSelectionActive && !isZoomingOrPanning.current) {
                d3Zoom.on('zoom', null);
            }
            else if (!userSelectionActive) {
                d3Zoom.on('zoom', (event) => {
                    const { onViewportChange } = store.getState();
                    store.setState({ transform: [event.transform.x, event.transform.y, event.transform.k] });
                    zoomedWithRightMouseButton.current = !!(onPaneContextMenu && isRightClickPan(panOnDrag, mouseButton.current ?? 0));
                    if ((onMove || onViewportChange) && !event.sourceEvent?.internal) {
                        const flowTransform = eventToFlowTransform(event.transform);
                        onViewportChange?.(flowTransform);
                        onMove?.(event.sourceEvent, flowTransform);
                    }
                });
            }
        }
    }, [userSelectionActive, d3Zoom, onMove, panOnDrag, onPaneContextMenu]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (d3Zoom) {
            d3Zoom.on('end', (event) => {
                if (!event.sourceEvent || event.sourceEvent.internal) {
                    return null;
                }
                const { onViewportChangeEnd } = store.getState();
                isZoomingOrPanning.current = false;
                store.setState({ paneDragging: false });
                if (onPaneContextMenu &&
                    isRightClickPan(panOnDrag, mouseButton.current ?? 0) &&
                    !zoomedWithRightMouseButton.current) {
                    onPaneContextMenu(event.sourceEvent);
                }
                zoomedWithRightMouseButton.current = false;
                if ((onMoveEnd || onViewportChangeEnd) && viewChanged(prevTransform.current, event.transform)) {
                    const flowTransform = eventToFlowTransform(event.transform);
                    prevTransform.current = flowTransform;
                    clearTimeout(timerId.current);
                    timerId.current = setTimeout(() => {
                        onViewportChangeEnd?.(flowTransform);
                        onMoveEnd?.(event.sourceEvent, flowTransform);
                    }, panOnScroll ? 150 : 0);
                }
            });
        }
    }, [d3Zoom, panOnScroll, panOnDrag, onMoveEnd, onPaneContextMenu]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (d3Zoom) {
            d3Zoom.filter((event) => {
                const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
                const pinchZoom = zoomOnPinch && event.ctrlKey;
                if ((panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(1))) &&
                    event.button === 1 &&
                    event.type === 'mousedown' &&
                    (isWrappedWithClass(event, 'react-flow__node') || isWrappedWithClass(event, 'react-flow__edge'))) {
                    return true;
                }
                // if all interactions are disabled, we prevent all zoom events
                if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
                    return false;
                }
                // during a selection we prevent all other interactions
                if (userSelectionActive) {
                    return false;
                }
                // if zoom on double click is disabled, we prevent the double click event
                if (!zoomOnDoubleClick && event.type === 'dblclick') {
                    return false;
                }
                // if the target element is inside an element with the nowheel class, we prevent zooming
                if (isWrappedWithClass(event, noWheelClassName) && event.type === 'wheel') {
                    return false;
                }
                // if the target element is inside an element with the nopan class, we prevent panning
                if (isWrappedWithClass(event, noPanClassName) &&
                    (event.type !== 'wheel' || (panOnScroll && event.type === 'wheel' && !zoomActivationKeyPressed))) {
                    return false;
                }
                if (!zoomOnPinch && event.ctrlKey && event.type === 'wheel') {
                    return false;
                }
                // when there is no scroll handling enabled, we prevent all wheel events
                if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === 'wheel') {
                    return false;
                }
                // if the pane is not movable, we prevent dragging it with mousestart or touchstart
                if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
                    return false;
                }
                // if the pane is only movable using allowed clicks
                if (Array.isArray(panOnDrag) &&
                    !panOnDrag.includes(event.button) &&
                    (event.type === 'mousedown' || event.type === 'touchstart')) {
                    return false;
                }
                // We only allow right clicks if pan on drag is set to right click
                const buttonAllowed = (Array.isArray(panOnDrag) && panOnDrag.includes(event.button)) || !event.button || event.button <= 1;
                // default filter for d3-zoom
                return (!event.ctrlKey || event.type === 'wheel') && buttonAllowed;
            });
        }
    }, [
        userSelectionActive,
        d3Zoom,
        zoomOnScroll,
        zoomOnPinch,
        panOnScroll,
        zoomOnDoubleClick,
        panOnDrag,
        elementsSelectable,
        zoomActivationKeyPressed,
    ]);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "react-flow__renderer", ref: zoomPane, style: containerStyle }, children));
};

const selector$9 = (s) => ({
    userSelectionActive: s.userSelectionActive,
    userSelectionRect: s.userSelectionRect,
});
function UserSelection() {
    const { userSelectionActive, userSelectionRect } = useStore(selector$9, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const isActive = userSelectionActive && userSelectionRect;
    if (!isActive) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "react-flow__selection react-flow__container", style: {
            width: userSelectionRect.width,
            height: userSelectionRect.height,
            transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`,
        } }));
}

function handleParentExpand(res, updateItem) {
    const parent = res.find((e) => e.id === updateItem.parentNode);
    if (parent) {
        const extendWidth = updateItem.position.x + updateItem.width - parent.width;
        const extendHeight = updateItem.position.y + updateItem.height - parent.height;
        if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
            parent.style = { ...parent.style } || {};
            parent.style.width = parent.style.width ?? parent.width;
            parent.style.height = parent.style.height ?? parent.height;
            if (extendWidth > 0) {
                parent.style.width += extendWidth;
            }
            if (extendHeight > 0) {
                parent.style.height += extendHeight;
            }
            if (updateItem.position.x < 0) {
                const xDiff = Math.abs(updateItem.position.x);
                parent.position.x = parent.position.x - xDiff;
                parent.style.width += xDiff;
                updateItem.position.x = 0;
            }
            if (updateItem.position.y < 0) {
                const yDiff = Math.abs(updateItem.position.y);
                parent.position.y = parent.position.y - yDiff;
                parent.style.height += yDiff;
                updateItem.position.y = 0;
            }
            parent.width = parent.style.width;
            parent.height = parent.style.height;
        }
    }
}
function applyChanges(changes, elements) {
    // we need this hack to handle the setNodes and setEdges function of the useReactFlow hook for controlled flows
    if (changes.some((c) => c.type === 'reset')) {
        return changes.filter((c) => c.type === 'reset').map((c) => c.item);
    }
    const initElements = changes.filter((c) => c.type === 'add').map((c) => c.item);
    return elements.reduce((res, item) => {
        const currentChanges = changes.filter((c) => c.id === item.id);
        if (currentChanges.length === 0) {
            res.push(item);
            return res;
        }
        const updateItem = { ...item };
        for (const currentChange of currentChanges) {
            if (currentChange) {
                switch (currentChange.type) {
                    case 'select': {
                        updateItem.selected = currentChange.selected;
                        break;
                    }
                    case 'position': {
                        if (typeof currentChange.position !== 'undefined') {
                            updateItem.position = currentChange.position;
                        }
                        if (typeof currentChange.positionAbsolute !== 'undefined') {
                            updateItem.positionAbsolute = currentChange.positionAbsolute;
                        }
                        if (typeof currentChange.dragging !== 'undefined') {
                            updateItem.dragging = currentChange.dragging;
                        }
                        if (updateItem.expandParent) {
                            handleParentExpand(res, updateItem);
                        }
                        break;
                    }
                    case 'dimensions': {
                        if (typeof currentChange.dimensions !== 'undefined') {
                            updateItem.width = currentChange.dimensions.width;
                            updateItem.height = currentChange.dimensions.height;
                        }
                        if (typeof currentChange.updateStyle !== 'undefined') {
                            updateItem.style = { ...(updateItem.style || {}), ...currentChange.dimensions };
                        }
                        if (typeof currentChange.resizing === 'boolean') {
                            updateItem.resizing = currentChange.resizing;
                        }
                        if (updateItem.expandParent) {
                            handleParentExpand(res, updateItem);
                        }
                        break;
                    }
                    case 'remove': {
                        return res;
                    }
                }
            }
        }
        res.push(updateItem);
        return res;
    }, initElements);
}
function applyNodeChanges(changes, nodes) {
    return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
    return applyChanges(changes, edges);
}
const createSelectionChange = (id, selected) => ({
    id,
    type: 'select',
    selected,
});
function getSelectionChanges(items, selectedIds) {
    return items.reduce((res, item) => {
        const willBeSelected = selectedIds.includes(item.id);
        if (!item.selected && willBeSelected) {
            item.selected = true;
            res.push(createSelectionChange(item.id, true));
        }
        else if (item.selected && !willBeSelected) {
            item.selected = false;
            res.push(createSelectionChange(item.id, false));
        }
        return res;
    }, []);
}

/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */
const wrapHandler = (handler, containerRef) => {
    return (event) => {
        if (event.target !== containerRef.current) {
            return;
        }
        handler?.(event);
    };
};
const selector$8 = (s) => ({
    userSelectionActive: s.userSelectionActive,
    elementsSelectable: s.elementsSelectable,
    dragging: s.paneDragging,
});
const Pane = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({ isSelecting, selectionMode = SelectionMode.Full, panOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children, }) => {
    const container = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const store = useStoreApi();
    const prevSelectedNodesCount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
    const prevSelectedEdgesCount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
    const containerBounds = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
    const { userSelectionActive, elementsSelectable, dragging } = useStore(selector$8, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const resetUserSelection = () => {
        store.setState({ userSelectionActive: false, userSelectionRect: null });
        prevSelectedNodesCount.current = 0;
        prevSelectedEdgesCount.current = 0;
    };
    const onClick = (event) => {
        onPaneClick?.(event);
        store.getState().resetSelectedElements();
        store.setState({ nodesSelectionActive: false });
    };
    const onContextMenu = (event) => {
        if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
            event.preventDefault();
            return;
        }
        onPaneContextMenu?.(event);
    };
    const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : undefined;
    const onMouseDown = (event) => {
        const { resetSelectedElements, domNode } = store.getState();
        containerBounds.current = domNode?.getBoundingClientRect();
        if (!elementsSelectable ||
            !isSelecting ||
            event.button !== 0 ||
            event.target !== container.current ||
            !containerBounds.current) {
            return;
        }
        const { x, y } = getEventPosition(event, containerBounds.current);
        resetSelectedElements();
        store.setState({
            userSelectionRect: {
                width: 0,
                height: 0,
                startX: x,
                startY: y,
                x,
                y,
            },
        });
        onSelectionStart?.(event);
    };
    const onMouseMove = (event) => {
        const { userSelectionRect, nodeInternals, edges, transform, onNodesChange, onEdgesChange, nodeOrigin, getNodes } = store.getState();
        if (!isSelecting || !containerBounds.current || !userSelectionRect) {
            return;
        }
        store.setState({ userSelectionActive: true, nodesSelectionActive: false });
        const mousePos = getEventPosition(event, containerBounds.current);
        const startX = userSelectionRect.startX ?? 0;
        const startY = userSelectionRect.startY ?? 0;
        const nextUserSelectRect = {
            ...userSelectionRect,
            x: mousePos.x < startX ? mousePos.x : startX,
            y: mousePos.y < startY ? mousePos.y : startY,
            width: Math.abs(mousePos.x - startX),
            height: Math.abs(mousePos.y - startY),
        };
        const nodes = getNodes();
        const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, selectionMode === SelectionMode.Partial, true, nodeOrigin);
        const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
        const selectedNodeIds = selectedNodes.map((n) => n.id);
        if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
            prevSelectedNodesCount.current = selectedNodeIds.length;
            const changes = getSelectionChanges(nodes, selectedNodeIds);
            if (changes.length) {
                onNodesChange?.(changes);
            }
        }
        if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
            prevSelectedEdgesCount.current = selectedEdgeIds.length;
            const changes = getSelectionChanges(edges, selectedEdgeIds);
            if (changes.length) {
                onEdgesChange?.(changes);
            }
        }
        store.setState({
            userSelectionRect: nextUserSelectRect,
        });
    };
    const onMouseUp = (event) => {
        if (event.button !== 0) {
            return;
        }
        const { userSelectionRect } = store.getState();
        // We only want to trigger click functions when in selection mode if
        // the user did not move the mouse.
        if (!userSelectionActive && userSelectionRect && event.target === container.current) {
            onClick?.(event);
        }
        store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
        resetUserSelection();
        onSelectionEnd?.(event);
    };
    const onMouseLeave = (event) => {
        if (userSelectionActive) {
            store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
            onSelectionEnd?.(event);
        }
        resetUserSelection();
    };
    const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow__pane', { dragging, selection: isSelecting }]), onClick: hasActiveSelection ? undefined : wrapHandler(onClick, container), onContextMenu: wrapHandler(onContextMenu, container), onWheel: wrapHandler(onWheel, container), onMouseEnter: hasActiveSelection ? undefined : onPaneMouseEnter, onMouseDown: hasActiveSelection ? onMouseDown : undefined, onMouseMove: hasActiveSelection ? onMouseMove : onPaneMouseMove, onMouseUp: hasActiveSelection ? onMouseUp : undefined, onMouseLeave: hasActiveSelection ? onMouseLeave : onPaneMouseLeave, ref: container, style: containerStyle },
        children,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(UserSelection, null)));
});
Pane.displayName = 'Pane';

function isParentSelected(node, nodeInternals) {
    if (!node.parentNode) {
        return false;
    }
    const parentNode = nodeInternals.get(node.parentNode);
    if (!parentNode) {
        return false;
    }
    if (parentNode.selected) {
        return true;
    }
    return isParentSelected(parentNode, nodeInternals);
}
function hasSelector(target, selector, nodeRef) {
    let current = target;
    do {
        if (current?.matches(selector))
            return true;
        if (current === nodeRef.current)
            return false;
        current = current.parentElement;
    } while (current);
    return false;
}
// looks for all selected nodes and created a NodeDragItem for each of them
function getDragItems(nodeInternals, nodesDraggable, mousePos, nodeId) {
    return Array.from(nodeInternals.values())
        .filter((n) => (n.selected || n.id === nodeId) &&
        (!n.parentNode || !isParentSelected(n, nodeInternals)) &&
        (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined')))
        .map((n) => ({
        id: n.id,
        position: n.position || { x: 0, y: 0 },
        positionAbsolute: n.positionAbsolute || { x: 0, y: 0 },
        distance: {
            x: mousePos.x - (n.positionAbsolute?.x ?? 0),
            y: mousePos.y - (n.positionAbsolute?.y ?? 0),
        },
        delta: {
            x: 0,
            y: 0,
        },
        extent: n.extent,
        parentNode: n.parentNode,
        width: n.width,
        height: n.height,
        expandParent: n.expandParent,
    }));
}
function clampNodeExtent(node, extent) {
    if (!extent || extent === 'parent') {
        return extent;
    }
    return [extent[0], [extent[1][0] - (node.width || 0), extent[1][1] - (node.height || 0)]];
}
function calcNextPosition(node, nextPosition, nodeInternals, nodeExtent, nodeOrigin = [0, 0], onError) {
    const clampedNodeExtent = clampNodeExtent(node, node.extent || nodeExtent);
    let currentExtent = clampedNodeExtent;
    if (node.extent === 'parent' && !node.expandParent) {
        if (node.parentNode && node.width && node.height) {
            const parent = nodeInternals.get(node.parentNode);
            const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
            currentExtent =
                parent && isNumeric(parentX) && isNumeric(parentY) && isNumeric(parent.width) && isNumeric(parent.height)
                    ? [
                        [parentX + node.width * nodeOrigin[0], parentY + node.height * nodeOrigin[1]],
                        [
                            parentX + parent.width - node.width + node.width * nodeOrigin[0],
                            parentY + parent.height - node.height + node.height * nodeOrigin[1],
                        ],
                    ]
                    : currentExtent;
        }
        else {
            onError?.('005', errorMessages['error005']());
            currentExtent = clampedNodeExtent;
        }
    }
    else if (node.extent && node.parentNode && node.extent !== 'parent') {
        const parent = nodeInternals.get(node.parentNode);
        const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
        currentExtent = [
            [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
            [node.extent[1][0] + parentX, node.extent[1][1] + parentY],
        ];
    }
    let parentPosition = { x: 0, y: 0 };
    if (node.parentNode) {
        const parentNode = nodeInternals.get(node.parentNode);
        parentPosition = getNodePositionWithOrigin(parentNode, nodeOrigin).positionAbsolute;
    }
    const positionAbsolute = currentExtent && currentExtent !== 'parent'
        ? clampPosition(nextPosition, currentExtent)
        : nextPosition;
    return {
        position: {
            x: positionAbsolute.x - parentPosition.x,
            y: positionAbsolute.y - parentPosition.y,
        },
        positionAbsolute,
    };
}
// returns two params:
// 1. the dragged node (or the first of the list, if we are dragging a node selection)
// 2. array of selected nodes (for multi selections)
function getEventHandlerParams({ nodeId, dragItems, nodeInternals, }) {
    const extentedDragItems = dragItems.map((n) => {
        const node = nodeInternals.get(n.id);
        return {
            ...node,
            position: n.position,
            positionAbsolute: n.positionAbsolute,
        };
    });
    return [nodeId ? extentedDragItems.find((n) => n.id === nodeId) : extentedDragItems[0], extentedDragItems];
}

const getHandleBounds = (selector, nodeElement, zoom, nodeOrigin) => {
    const handles = nodeElement.querySelectorAll(selector);
    if (!handles || !handles.length) {
        return null;
    }
    const handlesArray = Array.from(handles);
    const nodeBounds = nodeElement.getBoundingClientRect();
    const nodeOffset = {
        x: nodeBounds.width * nodeOrigin[0],
        y: nodeBounds.height * nodeOrigin[1],
    };
    return handlesArray.map((handle) => {
        const handleBounds = handle.getBoundingClientRect();
        return {
            id: handle.getAttribute('data-handleid'),
            position: handle.getAttribute('data-handlepos'),
            x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
            y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
            ...getDimensions(handle),
        };
    });
};
function getMouseHandler(id, getState, handler) {
    return handler === undefined
        ? handler
        : (event) => {
            const node = getState().nodeInternals.get(id);
            if (node) {
                handler(event, { ...node });
            }
        };
}
// this handler is called by
// 1. the click handler when node is not draggable or selectNodesOnDrag = false
// or
// 2. the on drag start handler when node is draggable and selectNodesOnDrag = true
function handleNodeClick({ id, store, unselect = false, nodeRef, }) {
    const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals, onError } = store.getState();
    const node = nodeInternals.get(id);
    if (!node) {
        onError?.('012', errorMessages['error012'](id));
        return;
    }
    store.setState({ nodesSelectionActive: false });
    if (!node.selected) {
        addSelectedNodes([id]);
    }
    else if (unselect || (node.selected && multiSelectionActive)) {
        unselectNodesAndEdges({ nodes: [node], edges: [] });
        requestAnimationFrame(() => nodeRef?.current?.blur());
    }
}

function useGetPointerPosition() {
    const store = useStoreApi();
    // returns the pointer position projected to the RF coordinate system
    const getPointerPosition = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({ sourceEvent }) => {
        const { transform, snapGrid, snapToGrid } = store.getState();
        const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
        const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;
        const pointerPos = {
            x: (x - transform[0]) / transform[2],
            y: (y - transform[1]) / transform[2],
        };
        // we need the snapped position in order to be able to skip unnecessary drag events
        return {
            xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
            ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
            ...pointerPos,
        };
    }, []);
    return getPointerPosition;
}

function wrapSelectionDragFunc(selectionFunc) {
    return (event, _, nodes) => selectionFunc?.(event, nodes);
}
function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, selectNodesOnDrag, }) {
    const store = useStoreApi();
    const [dragging, setDragging] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const dragItems = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
    const lastPos = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({ x: null, y: null });
    const autoPanId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
    const containerBounds = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const mousePosition = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({ x: 0, y: 0 });
    const dragEvent = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const autoPanStarted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    const dragStarted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    const getPointerPosition = useGetPointerPosition();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (nodeRef?.current) {
            const selection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_6__["default"])(nodeRef.current);
            const updateNodes = ({ x, y }) => {
                const { nodeInternals, onNodeDrag, onSelectionDrag, updateNodePositions, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onError, } = store.getState();
                lastPos.current = { x, y };
                let hasChange = false;
                let nodesBox = { x: 0, y: 0, x2: 0, y2: 0 };
                if (dragItems.current.length > 1 && nodeExtent) {
                    const rect = getNodesBounds(dragItems.current, nodeOrigin);
                    nodesBox = rectToBox(rect);
                }
                dragItems.current = dragItems.current.map((n) => {
                    const nextPosition = { x: x - n.distance.x, y: y - n.distance.y };
                    if (snapToGrid) {
                        nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                        nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
                    }
                    // if there is selection with multiple nodes and a node extent is set, we need to adjust the node extent for each node
                    // based on its position so that the node stays at it's position relative to the selection.
                    const adjustedNodeExtent = [
                        [nodeExtent[0][0], nodeExtent[0][1]],
                        [nodeExtent[1][0], nodeExtent[1][1]],
                    ];
                    if (dragItems.current.length > 1 && nodeExtent && !n.extent) {
                        adjustedNodeExtent[0][0] = n.positionAbsolute.x - nodesBox.x + nodeExtent[0][0];
                        adjustedNodeExtent[1][0] = n.positionAbsolute.x + (n.width ?? 0) - nodesBox.x2 + nodeExtent[1][0];
                        adjustedNodeExtent[0][1] = n.positionAbsolute.y - nodesBox.y + nodeExtent[0][1];
                        adjustedNodeExtent[1][1] = n.positionAbsolute.y + (n.height ?? 0) - nodesBox.y2 + nodeExtent[1][1];
                    }
                    const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, adjustedNodeExtent, nodeOrigin, onError);
                    // we want to make sure that we only fire a change event when there is a change
                    hasChange = hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;
                    n.position = updatedPos.position;
                    n.positionAbsolute = updatedPos.positionAbsolute;
                    return n;
                });
                if (!hasChange) {
                    return;
                }
                updateNodePositions(dragItems.current, true, true);
                setDragging(true);
                const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);
                if (onDrag && dragEvent.current) {
                    const [currentNode, nodes] = getEventHandlerParams({
                        nodeId,
                        dragItems: dragItems.current,
                        nodeInternals,
                    });
                    onDrag(dragEvent.current, currentNode, nodes);
                }
            };
            const autoPan = () => {
                if (!containerBounds.current) {
                    return;
                }
                const [xMovement, yMovement] = calcAutoPan(mousePosition.current, containerBounds.current);
                if (xMovement !== 0 || yMovement !== 0) {
                    const { transform, panBy } = store.getState();
                    lastPos.current.x = (lastPos.current.x ?? 0) - xMovement / transform[2];
                    lastPos.current.y = (lastPos.current.y ?? 0) - yMovement / transform[2];
                    if (panBy({ x: xMovement, y: yMovement })) {
                        updateNodes(lastPos.current);
                    }
                }
                autoPanId.current = requestAnimationFrame(autoPan);
            };
            const startDrag = (event) => {
                const { nodeInternals, multiSelectionActive, nodesDraggable, unselectNodesAndEdges, onNodeDragStart, onSelectionDragStart, } = store.getState();
                dragStarted.current = true;
                const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);
                if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
                    if (!nodeInternals.get(nodeId)?.selected) {
                        // we need to reset selected nodes when selectNodesOnDrag=false
                        unselectNodesAndEdges();
                    }
                }
                if (nodeId && isSelectable && selectNodesOnDrag) {
                    handleNodeClick({
                        id: nodeId,
                        store,
                        nodeRef: nodeRef,
                    });
                }
                const pointerPos = getPointerPosition(event);
                lastPos.current = pointerPos;
                dragItems.current = getDragItems(nodeInternals, nodesDraggable, pointerPos, nodeId);
                if (onStart && dragItems.current) {
                    const [currentNode, nodes] = getEventHandlerParams({
                        nodeId,
                        dragItems: dragItems.current,
                        nodeInternals,
                    });
                    onStart(event.sourceEvent, currentNode, nodes);
                }
            };
            if (disabled) {
                selection.on('.drag', null);
            }
            else {
                const dragHandler = (0,d3_drag__WEBPACK_IMPORTED_MODULE_8__["default"])()
                    .on('start', (event) => {
                    const { domNode, nodeDragThreshold } = store.getState();
                    if (nodeDragThreshold === 0) {
                        startDrag(event);
                    }
                    const pointerPos = getPointerPosition(event);
                    lastPos.current = pointerPos;
                    containerBounds.current = domNode?.getBoundingClientRect() || null;
                    mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
                })
                    .on('drag', (event) => {
                    const pointerPos = getPointerPosition(event);
                    const { autoPanOnNodeDrag, nodeDragThreshold } = store.getState();
                    if (!autoPanStarted.current && dragStarted.current && autoPanOnNodeDrag) {
                        autoPanStarted.current = true;
                        autoPan();
                    }
                    if (!dragStarted.current) {
                        const x = pointerPos.xSnapped - (lastPos?.current?.x ?? 0);
                        const y = pointerPos.ySnapped - (lastPos?.current?.y ?? 0);
                        const distance = Math.sqrt(x * x + y * y);
                        if (distance > nodeDragThreshold) {
                            startDrag(event);
                        }
                    }
                    // skip events without movement
                    if ((lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) &&
                        dragItems.current &&
                        dragStarted.current) {
                        dragEvent.current = event.sourceEvent;
                        mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
                        updateNodes(pointerPos);
                    }
                })
                    .on('end', (event) => {
                    if (!dragStarted.current) {
                        return;
                    }
                    setDragging(false);
                    autoPanStarted.current = false;
                    dragStarted.current = false;
                    cancelAnimationFrame(autoPanId.current);
                    if (dragItems.current) {
                        const { updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop } = store.getState();
                        const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);
                        updateNodePositions(dragItems.current, false, false);
                        if (onStop) {
                            const [currentNode, nodes] = getEventHandlerParams({
                                nodeId,
                                dragItems: dragItems.current,
                                nodeInternals,
                            });
                            onStop(event.sourceEvent, currentNode, nodes);
                        }
                    }
                })
                    .filter((event) => {
                    const target = event.target;
                    const isDraggable = !event.button &&
                        (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, nodeRef)) &&
                        (!handleSelector || hasSelector(target, handleSelector, nodeRef));
                    return isDraggable;
                });
                selection.call(dragHandler);
                return () => {
                    selection.on('.drag', null);
                };
            }
        }
    }, [
        nodeRef,
        disabled,
        noDragClassName,
        handleSelector,
        isSelectable,
        store,
        nodeId,
        selectNodesOnDrag,
        getPointerPosition,
    ]);
    return dragging;
}

function useUpdateNodePositions() {
    const store = useStoreApi();
    const updatePositions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((params) => {
        const { nodeInternals, nodeExtent, updateNodePositions, getNodes, snapToGrid, snapGrid, onError, nodesDraggable } = store.getState();
        const selectedNodes = getNodes().filter((n) => n.selected && (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined')));
        // by default a node moves 5px on each key press, or 20px if shift is pressed
        // if snap grid is enabled, we use that for the velocity.
        const xVelo = snapToGrid ? snapGrid[0] : 5;
        const yVelo = snapToGrid ? snapGrid[1] : 5;
        const factor = params.isShiftPressed ? 4 : 1;
        const positionDiffX = params.x * xVelo * factor;
        const positionDiffY = params.y * yVelo * factor;
        const nodeUpdates = selectedNodes.map((n) => {
            if (n.positionAbsolute) {
                const nextPosition = { x: n.positionAbsolute.x + positionDiffX, y: n.positionAbsolute.y + positionDiffY };
                if (snapToGrid) {
                    nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                    nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
                }
                const { positionAbsolute, position } = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent, undefined, onError);
                n.position = position;
                n.positionAbsolute = positionAbsolute;
            }
            return n;
        });
        updateNodePositions(nodeUpdates, true, false);
    }, []);
    return updatePositions;
}

const arrowKeyDiffs = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
};
var wrapNode = (NodeComponent) => {
    const NodeWrapper = ({ id, type, data, xPos, yPos, xPosOrigin, yPosOrigin, selected, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, style, className, isDraggable, isSelectable, isConnectable, isFocusable, selectNodesOnDrag, sourcePosition, targetPosition, hidden, resizeObserver, dragHandle, zIndex, isParent, noDragClassName, noPanClassName, initialized, disableKeyboardA11y, ariaLabel, rfId, hasHandleBounds, }) => {
        const store = useStoreApi();
        const nodeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
        const prevSourcePosition = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(sourcePosition);
        const prevTargetPosition = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(targetPosition);
        const prevType = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(type);
        const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
        const updatePositions = useUpdateNodePositions();
        const onMouseEnterHandler = getMouseHandler(id, store.getState, onMouseEnter);
        const onMouseMoveHandler = getMouseHandler(id, store.getState, onMouseMove);
        const onMouseLeaveHandler = getMouseHandler(id, store.getState, onMouseLeave);
        const onContextMenuHandler = getMouseHandler(id, store.getState, onContextMenu);
        const onDoubleClickHandler = getMouseHandler(id, store.getState, onDoubleClick);
        const onSelectNodeHandler = (event) => {
            const { nodeDragThreshold } = store.getState();
            if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
                // this handler gets called within the drag start event when selectNodesOnDrag=true
                handleNodeClick({
                    id,
                    store,
                    nodeRef,
                });
            }
            if (onClick) {
                const node = store.getState().nodeInternals.get(id);
                if (node) {
                    onClick(event, { ...node });
                }
            }
        };
        const onKeyDown = (event) => {
            if (isInputDOMNode(event)) {
                return;
            }
            if (elementSelectionKeys.includes(event.key) && isSelectable) {
                const unselect = event.key === 'Escape';
                handleNodeClick({
                    id,
                    store,
                    unselect,
                    nodeRef,
                });
            }
            else if (!disableKeyboardA11y &&
                isDraggable &&
                selected &&
                Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
                store.setState({
                    ariaLiveMessage: `Moved selected node ${event.key
                        .replace('Arrow', '')
                        .toLowerCase()}. New position, x: ${~~xPos}, y: ${~~yPos}`,
                });
                updatePositions({
                    x: arrowKeyDiffs[event.key].x,
                    y: arrowKeyDiffs[event.key].y,
                    isShiftPressed: event.shiftKey,
                });
            }
        };
        (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
            return () => {
                if (nodeRef.current) {
                    resizeObserver?.unobserve(nodeRef.current);
                }
            };
        }, []);
        (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
            if (nodeRef.current && !hidden) {
                const currNode = nodeRef.current;
                if (!initialized || !hasHandleBounds) {
                    // At this point we always want to make sure that the node gets re-measured / re-initialized.
                    // We need to unobserve it first in case it is still observed
                    resizeObserver?.unobserve(currNode);
                    resizeObserver?.observe(currNode);
                }
            }
        }, [hidden, initialized, hasHandleBounds]);
        (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
            // when the user programmatically changes the source or handle position, we re-initialize the node
            const typeChanged = prevType.current !== type;
            const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
            const targetPosChanged = prevTargetPosition.current !== targetPosition;
            if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
                if (typeChanged) {
                    prevType.current = type;
                }
                if (sourcePosChanged) {
                    prevSourcePosition.current = sourcePosition;
                }
                if (targetPosChanged) {
                    prevTargetPosition.current = targetPosition;
                }
                store.getState().updateNodeDimensions([{ id, nodeElement: nodeRef.current, forceUpdate: true }]);
            }
        }, [id, type, sourcePosition, targetPosition]);
        const dragging = useDrag({
            nodeRef,
            disabled: hidden || !isDraggable,
            noDragClassName,
            handleSelector: dragHandle,
            nodeId: id,
            isSelectable,
            selectNodesOnDrag,
        });
        if (hidden) {
            return null;
        }
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])([
                'react-flow__node',
                `react-flow__node-${type}`,
                {
                    // this is overwritable by passing `nopan` as a class name
                    [noPanClassName]: isDraggable,
                },
                className,
                {
                    selected,
                    selectable: isSelectable,
                    parent: isParent,
                    dragging,
                },
            ]), ref: nodeRef, style: {
                zIndex,
                transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
                pointerEvents: hasPointerEvents ? 'all' : 'none',
                visibility: initialized ? 'visible' : 'hidden',
                ...style,
            }, "data-id": id, "data-testid": `rf__node-${id}`, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, onDoubleClick: onDoubleClickHandler, onKeyDown: isFocusable ? onKeyDown : undefined, tabIndex: isFocusable ? 0 : undefined, role: isFocusable ? 'button' : undefined, "aria-describedby": disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`, "aria-label": ariaLabel },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Provider, { value: id },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(NodeComponent, { id: id, data: data, type: type, xPos: xPos, yPos: yPos, selected: selected, isConnectable: isConnectable, sourcePosition: sourcePosition, targetPosition: targetPosition, dragging: dragging, dragHandle: dragHandle, zIndex: zIndex }))));
    };
    NodeWrapper.displayName = 'NodeWrapper';
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(NodeWrapper);
};

/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */
const selector$7 = (s) => {
    const selectedNodes = s.getNodes().filter((n) => n.selected);
    return {
        ...getNodesBounds(selectedNodes, s.nodeOrigin),
        transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
        userSelectionActive: s.userSelectionActive,
    };
};
function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
    const store = useStoreApi();
    const { width, height, x: left, y: top, transformString, userSelectionActive } = useStore(selector$7, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const updatePositions = useUpdateNodePositions();
    const nodeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (!disableKeyboardA11y) {
            nodeRef.current?.focus({
                preventScroll: true,
            });
        }
    }, [disableKeyboardA11y]);
    useDrag({
        nodeRef,
    });
    if (userSelectionActive || !width || !height) {
        return null;
    }
    const onContextMenu = onSelectionContextMenu
        ? (event) => {
            const selectedNodes = store
                .getState()
                .getNodes()
                .filter((n) => n.selected);
            onSelectionContextMenu(event, selectedNodes);
        }
        : undefined;
    const onKeyDown = (event) => {
        if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
            updatePositions({
                x: arrowKeyDiffs[event.key].x,
                y: arrowKeyDiffs[event.key].y,
                isShiftPressed: event.shiftKey,
            });
        }
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow__nodesselection', 'react-flow__container', noPanClassName]), style: {
            transform: transformString,
        } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu: onContextMenu, tabIndex: disableKeyboardA11y ? undefined : -1, onKeyDown: disableKeyboardA11y ? undefined : onKeyDown, style: {
                width,
                height,
                top,
                left,
            } })));
}
var NodesSelection$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(NodesSelection);

const selector$6 = (s) => s.nodesSelectionActive;
const FlowRenderer = ({ children, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, onMove, onMoveStart, onMoveEnd, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll: _panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: _panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y, }) => {
    const nodesSelectionActive = useStore(selector$6);
    const selectionKeyPressed = useKeyPress(selectionKeyCode);
    const panActivationKeyPressed = useKeyPress(panActivationKeyCode);
    const panOnDrag = panActivationKeyPressed || _panOnDrag;
    const panOnScroll = panActivationKeyPressed || _panOnScroll;
    const isSelecting = selectionKeyPressed || (selectionOnDrag && panOnDrag !== true);
    useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(ZoomPane, { onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, onPaneContextMenu: onPaneContextMenu, elementsSelectable: elementsSelectable, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, zoomOnDoubleClick: zoomOnDoubleClick, panOnDrag: !selectionKeyPressed && panOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, zoomActivationKeyCode: zoomActivationKeyCode, preventScrolling: preventScrolling, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Pane, { onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneContextMenu: onPaneContextMenu, onPaneScroll: onPaneScroll, panOnDrag: panOnDrag, isSelecting: !!isSelecting, selectionMode: selectionMode },
            children,
            nodesSelectionActive && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(NodesSelection$1, { onSelectionContextMenu: onSelectionContextMenu, noPanClassName: noPanClassName, disableKeyboardA11y: disableKeyboardA11y })))));
};
FlowRenderer.displayName = 'FlowRenderer';
var FlowRenderer$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(FlowRenderer);

function useVisibleNodes(onlyRenderVisible) {
    const nodes = useStore((0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((s) => onlyRenderVisible
        ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
        : s.getNodes(), [onlyRenderVisible]));
    return nodes;
}

function createNodeTypes(nodeTypes) {
    const standardTypes = {
        input: wrapNode((nodeTypes.input || InputNode$1)),
        default: wrapNode((nodeTypes.default || DefaultNode$1)),
        output: wrapNode((nodeTypes.output || OutputNode$1)),
        group: wrapNode((nodeTypes.group || GroupNode)),
    };
    const wrappedTypes = {};
    const specialTypes = Object.keys(nodeTypes)
        .filter((k) => !['input', 'default', 'output', 'group'].includes(k))
        .reduce((res, key) => {
        res[key] = wrapNode((nodeTypes[key] || DefaultNode$1));
        return res;
    }, wrappedTypes);
    return {
        ...standardTypes,
        ...specialTypes,
    };
}
const getPositionWithOrigin = ({ x, y, width, height, origin, }) => {
    if (!width || !height) {
        return { x, y };
    }
    if (origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) {
        return { x, y };
    }
    return {
        x: x - width * origin[0],
        y: y - height * origin[1],
    };
};

const selector$5 = (s) => ({
    nodesDraggable: s.nodesDraggable,
    nodesConnectable: s.nodesConnectable,
    nodesFocusable: s.nodesFocusable,
    elementsSelectable: s.elementsSelectable,
    updateNodeDimensions: s.updateNodeDimensions,
    onError: s.onError,
});
const NodeRenderer = (props) => {
    const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions, onError } = useStore(selector$5, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
    const resizeObserverRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
    const resizeObserver = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (typeof ResizeObserver === 'undefined') {
            return null;
        }
        const observer = new ResizeObserver((entries) => {
            const updates = entries.map((entry) => ({
                id: entry.target.getAttribute('data-id'),
                nodeElement: entry.target,
                forceUpdate: true,
            }));
            updateNodeDimensions(updates);
        });
        resizeObserverRef.current = observer;
        return observer;
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        return () => {
            resizeObserverRef?.current?.disconnect();
        };
    }, []);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "react-flow__nodes", style: containerStyle }, nodes.map((node) => {
        let nodeType = node.type || 'default';
        if (!props.nodeTypes[nodeType]) {
            onError?.('003', errorMessages['error003'](nodeType));
            nodeType = 'default';
        }
        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default);
        const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
        const isFocusable = !!(node.focusable || (nodesFocusable && typeof node.focusable === 'undefined'));
        const clampedPosition = props.nodeExtent
            ? clampPosition(node.positionAbsolute, props.nodeExtent)
            : node.positionAbsolute;
        const posX = clampedPosition?.x ?? 0;
        const posY = clampedPosition?.y ?? 0;
        const posOrigin = getPositionWithOrigin({
            x: posX,
            y: posY,
            width: node.width ?? 0,
            height: node.height ?? 0,
            origin: props.nodeOrigin,
        });
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(NodeComponent, { key: node.id, id: node.id, className: node.className, style: node.style, type: nodeType, data: node.data, sourcePosition: node.sourcePosition || Position.Bottom, targetPosition: node.targetPosition || Position.Top, hidden: node.hidden, xPos: posX, yPos: posY, xPosOrigin: posOrigin.x, yPosOrigin: posOrigin.y, selectNodesOnDrag: props.selectNodesOnDrag, onClick: props.onNodeClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onDoubleClick: props.onNodeDoubleClick, selected: !!node.selected, isDraggable: isDraggable, isSelectable: isSelectable, isConnectable: isConnectable, isFocusable: isFocusable, resizeObserver: resizeObserver, dragHandle: node.dragHandle, zIndex: node[internalsSymbol]?.z ?? 0, isParent: !!node[internalsSymbol]?.isParent, noDragClassName: props.noDragClassName, noPanClassName: props.noPanClassName, initialized: !!node.width && !!node.height, rfId: props.rfId, disableKeyboardA11y: props.disableKeyboardA11y, ariaLabel: node.ariaLabel, hasHandleBounds: !!node[internalsSymbol]?.handleBounds }));
    })));
};
NodeRenderer.displayName = 'NodeRenderer';
var NodeRenderer$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(NodeRenderer);

const shiftX = (x, shift, position) => {
    if (position === Position.Left)
        return x - shift;
    if (position === Position.Right)
        return x + shift;
    return x;
};
const shiftY = (y, shift, position) => {
    if (position === Position.Top)
        return y - shift;
    if (position === Position.Bottom)
        return y + shift;
    return y;
};
const EdgeUpdaterClassName = 'react-flow__edgeupdater';
const EdgeAnchor = ({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type, }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { onMouseDown: onMouseDown, onMouseEnter: onMouseEnter, onMouseOut: onMouseOut, className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]), cx: shiftX(centerX, radius, position), cy: shiftY(centerY, radius, position), r: radius, stroke: "transparent", fill: "transparent" }));

const alwaysValidConnection = () => true;
var wrapEdge = (EdgeComponent) => {
    const EdgeWrapper = ({ id, className, type, data, onClick, onEdgeDoubleClick, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, hidden, sourceHandleId, targetHandleId, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, edgeUpdaterRadius, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, markerEnd, markerStart, rfId, ariaLabel, isFocusable, isUpdatable, pathOptions, interactionWidth, }) => {
        const edgeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
        const [updateHover, setUpdateHover] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
        const [updating, setUpdating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
        const store = useStoreApi();
        const markerStartUrl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => `url('#${getMarkerId(markerStart, rfId)}')`, [markerStart, rfId]);
        const markerEndUrl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => `url('#${getMarkerId(markerEnd, rfId)}')`, [markerEnd, rfId]);
        if (hidden) {
            return null;
        }
        const onEdgeClick = (event) => {
            const { edges, addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();
            const edge = edges.find((e) => e.id === id);
            if (!edge) {
                return;
            }
            if (elementsSelectable) {
                store.setState({ nodesSelectionActive: false });
                if (edge.selected && multiSelectionActive) {
                    unselectNodesAndEdges({ nodes: [], edges: [edge] });
                    edgeRef.current?.blur();
                }
                else {
                    addSelectedEdges([id]);
                }
            }
            if (onClick) {
                onClick(event, edge);
            }
        };
        const onEdgeDoubleClickHandler = getMouseHandler$1(id, store.getState, onEdgeDoubleClick);
        const onEdgeContextMenu = getMouseHandler$1(id, store.getState, onContextMenu);
        const onEdgeMouseEnter = getMouseHandler$1(id, store.getState, onMouseEnter);
        const onEdgeMouseMove = getMouseHandler$1(id, store.getState, onMouseMove);
        const onEdgeMouseLeave = getMouseHandler$1(id, store.getState, onMouseLeave);
        const handleEdgeUpdater = (event, isSourceHandle) => {
            // avoid triggering edge updater if mouse btn is not left
            if (event.button !== 0) {
                return;
            }
            const { edges, isValidConnection: isValidConnectionStore } = store.getState();
            const nodeId = isSourceHandle ? target : source;
            const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
            const handleType = isSourceHandle ? 'target' : 'source';
            const isValidConnection = isValidConnectionStore || alwaysValidConnection;
            const isTarget = isSourceHandle;
            const edge = edges.find((e) => e.id === id);
            setUpdating(true);
            onEdgeUpdateStart?.(event, edge, handleType);
            const _onEdgeUpdateEnd = (evt) => {
                setUpdating(false);
                onEdgeUpdateEnd?.(evt, edge, handleType);
            };
            const onConnectEdge = (connection) => onEdgeUpdate?.(edge, connection);
            handlePointerDown({
                event,
                handleId,
                nodeId,
                onConnect: onConnectEdge,
                isTarget,
                getState: store.getState,
                setState: store.setState,
                isValidConnection,
                edgeUpdaterType: handleType,
                onEdgeUpdateEnd: _onEdgeUpdateEnd,
            });
        };
        const onEdgeUpdaterSourceMouseDown = (event) => handleEdgeUpdater(event, true);
        const onEdgeUpdaterTargetMouseDown = (event) => handleEdgeUpdater(event, false);
        const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
        const onEdgeUpdaterMouseOut = () => setUpdateHover(false);
        const inactive = !elementsSelectable && !onClick;
        const onKeyDown = (event) => {
            if (elementSelectionKeys.includes(event.key) && elementsSelectable) {
                const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
                const unselect = event.key === 'Escape';
                if (unselect) {
                    edgeRef.current?.blur();
                    unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id)] });
                }
                else {
                    addSelectedEdges([id]);
                }
            }
        };
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("g", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])([
                'react-flow__edge',
                `react-flow__edge-${type}`,
                className,
                { selected, animated, inactive, updating: updateHover },
            ]), onClick: onEdgeClick, onDoubleClick: onEdgeDoubleClickHandler, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onKeyDown: isFocusable ? onKeyDown : undefined, tabIndex: isFocusable ? 0 : undefined, role: isFocusable ? 'button' : 'img', "data-testid": `rf__edge-${id}`, "aria-label": ariaLabel === null ? undefined : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`, "aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined, ref: edgeRef },
            !updating && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeComponent, { id: id, source: source, target: target, selected: selected, animated: animated, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, data: data, style: style, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, sourceHandleId: sourceHandleId, targetHandleId: targetHandleId, markerStart: markerStartUrl, markerEnd: markerEndUrl, pathOptions: pathOptions, interactionWidth: interactionWidth })),
            isUpdatable && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
                (isUpdatable === 'source' || isUpdatable === true) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: edgeUpdaterRadius, onMouseDown: onEdgeUpdaterSourceMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "source" })),
                (isUpdatable === 'target' || isUpdatable === true) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: edgeUpdaterRadius, onMouseDown: onEdgeUpdaterTargetMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "target" }))))));
    };
    EdgeWrapper.displayName = 'EdgeWrapper';
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(EdgeWrapper);
};

function createEdgeTypes(edgeTypes) {
    const standardTypes = {
        default: wrapEdge((edgeTypes.default || BezierEdge)),
        straight: wrapEdge((edgeTypes.bezier || StraightEdge)),
        step: wrapEdge((edgeTypes.step || StepEdge)),
        smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge)),
        simplebezier: wrapEdge((edgeTypes.simplebezier || SimpleBezierEdge)),
    };
    const wrappedTypes = {};
    const specialTypes = Object.keys(edgeTypes)
        .filter((k) => !['default', 'bezier'].includes(k))
        .reduce((res, key) => {
        res[key] = wrapEdge((edgeTypes[key] || BezierEdge));
        return res;
    }, wrappedTypes);
    return {
        ...standardTypes,
        ...specialTypes,
    };
}
function getHandlePosition(position, nodeRect, handle = null) {
    const x = (handle?.x || 0) + nodeRect.x;
    const y = (handle?.y || 0) + nodeRect.y;
    const width = handle?.width || nodeRect.width;
    const height = handle?.height || nodeRect.height;
    switch (position) {
        case Position.Top:
            return {
                x: x + width / 2,
                y,
            };
        case Position.Right:
            return {
                x: x + width,
                y: y + height / 2,
            };
        case Position.Bottom:
            return {
                x: x + width / 2,
                y: y + height,
            };
        case Position.Left:
            return {
                x,
                y: y + height / 2,
            };
    }
}
function getHandle(bounds, handleId) {
    if (!bounds) {
        return null;
    }
    if (bounds.length === 1 || !handleId) {
        return bounds[0];
    }
    else if (handleId) {
        return bounds.find((d) => d.id === handleId) || null;
    }
    return null;
}
const getEdgePositions = (sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition) => {
    const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
    const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);
    return {
        sourceX: sourceHandlePos.x,
        sourceY: sourceHandlePos.y,
        targetX: targetHandlePos.x,
        targetY: targetHandlePos.y,
    };
};
function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, transform, }) {
    const edgeBox = {
        x: Math.min(sourcePos.x, targetPos.x),
        y: Math.min(sourcePos.y, targetPos.y),
        x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
        y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight),
    };
    if (edgeBox.x === edgeBox.x2) {
        edgeBox.x2 += 1;
    }
    if (edgeBox.y === edgeBox.y2) {
        edgeBox.y2 += 1;
    }
    const viewBox = rectToBox({
        x: (0 - transform[0]) / transform[2],
        y: (0 - transform[1]) / transform[2],
        width: width / transform[2],
        height: height / transform[2],
    });
    const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
    const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
    const overlappingArea = Math.ceil(xOverlap * yOverlap);
    return overlappingArea > 0;
}
function getNodeData(node) {
    const handleBounds = node?.[internalsSymbol]?.handleBounds || null;
    const isValid = handleBounds &&
        node?.width &&
        node?.height &&
        typeof node?.positionAbsolute?.x !== 'undefined' &&
        typeof node?.positionAbsolute?.y !== 'undefined';
    return [
        {
            x: node?.positionAbsolute?.x || 0,
            y: node?.positionAbsolute?.y || 0,
            width: node?.width || 0,
            height: node?.height || 0,
        },
        handleBounds,
        !!isValid,
    ];
}

const defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];
function groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect = false) {
    let maxLevel = -1;
    const levelLookup = edges.reduce((tree, edge) => {
        const hasZIndex = isNumeric(edge.zIndex);
        let z = hasZIndex ? edge.zIndex : 0;
        if (elevateEdgesOnSelect) {
            const targetNode = nodeInternals.get(edge.target);
            const sourceNode = nodeInternals.get(edge.source);
            const edgeOrConnectedNodeSelected = edge.selected || targetNode?.selected || sourceNode?.selected;
            const selectedZIndex = Math.max(sourceNode?.[internalsSymbol]?.z || 0, targetNode?.[internalsSymbol]?.z || 0, 1000);
            z = (hasZIndex ? edge.zIndex : 0) + (edgeOrConnectedNodeSelected ? selectedZIndex : 0);
        }
        if (tree[z]) {
            tree[z].push(edge);
        }
        else {
            tree[z] = [edge];
        }
        maxLevel = z > maxLevel ? z : maxLevel;
        return tree;
    }, {});
    const edgeTree = Object.entries(levelLookup).map(([key, edges]) => {
        const level = +key;
        return {
            edges,
            level,
            isMaxLevel: level === maxLevel,
        };
    });
    if (edgeTree.length === 0) {
        return defaultEdgeTree;
    }
    return edgeTree;
}
function useVisibleEdges(onlyRenderVisible, nodeInternals, elevateEdgesOnSelect) {
    const edges = useStore((0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((s) => {
        if (!onlyRenderVisible) {
            return s.edges;
        }
        return s.edges.filter((e) => {
            const sourceNode = nodeInternals.get(e.source);
            const targetNode = nodeInternals.get(e.target);
            return (sourceNode?.width &&
                sourceNode?.height &&
                targetNode?.width &&
                targetNode?.height &&
                isEdgeVisible({
                    sourcePos: sourceNode.positionAbsolute || { x: 0, y: 0 },
                    targetPos: targetNode.positionAbsolute || { x: 0, y: 0 },
                    sourceWidth: sourceNode.width,
                    sourceHeight: sourceNode.height,
                    targetWidth: targetNode.width,
                    targetHeight: targetNode.height,
                    width: s.width,
                    height: s.height,
                    transform: s.transform,
                }));
        });
    }, [onlyRenderVisible, nodeInternals]));
    return groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect);
}

const ArrowSymbol = ({ color = 'none', strokeWidth = 1 }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("polyline", { style: {
            stroke: color,
            strokeWidth,
        }, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", points: "-5,-4 0,0 -5,4" }));
};
const ArrowClosedSymbol = ({ color = 'none', strokeWidth = 1 }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("polyline", { style: {
            stroke: color,
            fill: color,
            strokeWidth,
        }, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" }));
};
const MarkerSymbols = {
    [MarkerType.Arrow]: ArrowSymbol,
    [MarkerType.ArrowClosed]: ArrowClosedSymbol,
};
function useMarkerSymbol(type) {
    const store = useStoreApi();
    const symbol = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);
        if (!symbolExists) {
            store.getState().onError?.('009', errorMessages['error009'](type));
            return null;
        }
        return MarkerSymbols[type];
    }, [type]);
    return symbol;
}

const Marker = ({ id, type, color, width = 12.5, height = 12.5, markerUnits = 'strokeWidth', strokeWidth, orient = 'auto-start-reverse', }) => {
    const Symbol = useMarkerSymbol(type);
    if (!Symbol) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("marker", { className: "react-flow__arrowhead", id: id, markerWidth: `${width}`, markerHeight: `${height}`, viewBox: "-10 -10 20 20", markerUnits: markerUnits, orient: orient, refX: "0", refY: "0" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Symbol, { color: color, strokeWidth: strokeWidth })));
};
const markerSelector = ({ defaultColor, rfId }) => (s) => {
    const ids = [];
    return s.edges
        .reduce((markers, edge) => {
        [edge.markerStart, edge.markerEnd].forEach((marker) => {
            if (marker && typeof marker === 'object') {
                const markerId = getMarkerId(marker, rfId);
                if (!ids.includes(markerId)) {
                    markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
                    ids.push(markerId);
                }
            }
        });
        return markers;
    }, [])
        .sort((a, b) => a.id.localeCompare(b.id));
};
// when you have multiple flows on a page and you hide the first one, the other ones have no markers anymore
// when they do have markers with the same ids. To prevent this the user can pass a unique id to the react flow wrapper
// that we can then use for creating our unique marker ids
const MarkerDefinitions = ({ defaultColor, rfId }) => {
    const markers = useStore((0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(markerSelector({ defaultColor, rfId }), [defaultColor, rfId]), 
    // the id includes all marker options, so we just need to look at that part of the marker
    (a, b) => !(a.length !== b.length || a.some((m, i) => m.id !== b[i].id)));
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("defs", null, markers.map((marker) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(Marker, { id: marker.id, key: marker.id, type: marker.type, color: marker.color, width: marker.width, height: marker.height, markerUnits: marker.markerUnits, strokeWidth: marker.strokeWidth, orient: marker.orient })))));
};
MarkerDefinitions.displayName = 'MarkerDefinitions';
var MarkerDefinitions$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(MarkerDefinitions);

const selector$4 = (s) => ({
    nodesConnectable: s.nodesConnectable,
    edgesFocusable: s.edgesFocusable,
    edgesUpdatable: s.edgesUpdatable,
    elementsSelectable: s.elementsSelectable,
    width: s.width,
    height: s.height,
    connectionMode: s.connectionMode,
    nodeInternals: s.nodeInternals,
    onError: s.onError,
});
const EdgeRenderer = ({ defaultMarkerColor, onlyRenderVisibleElements, elevateEdgesOnSelect, rfId, edgeTypes, noPanClassName, onEdgeUpdate, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeClick, edgeUpdaterRadius, onEdgeDoubleClick, onEdgeUpdateStart, onEdgeUpdateEnd, children, }) => {
    const { edgesFocusable, edgesUpdatable, elementsSelectable, width, height, connectionMode, nodeInternals, onError } = useStore(selector$4, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const edgeTree = useVisibleEdges(onlyRenderVisibleElements, nodeInternals, elevateEdgesOnSelect);
    if (!width) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        edgeTree.map(({ level, edges, isMaxLevel }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { key: level, style: { zIndex: level }, width: width, height: height, className: "react-flow__edges react-flow__container" },
            isMaxLevel && react__WEBPACK_IMPORTED_MODULE_0__.createElement(MarkerDefinitions$1, { defaultColor: defaultMarkerColor, rfId: rfId }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("g", null, edges.map((edge) => {
                const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source));
                const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target));
                if (!sourceIsValid || !targetIsValid) {
                    return null;
                }
                let edgeType = edge.type || 'default';
                if (!edgeTypes[edgeType]) {
                    onError?.('011', errorMessages['error011'](edgeType));
                    edgeType = 'default';
                }
                const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
                // when connection type is loose we can define all handles as sources and connect source -> source
                const targetNodeHandles = connectionMode === ConnectionMode.Strict
                    ? targetHandleBounds.target
                    : (targetHandleBounds.target ?? []).concat(targetHandleBounds.source ?? []);
                const sourceHandle = getHandle(sourceHandleBounds.source, edge.sourceHandle);
                const targetHandle = getHandle(targetNodeHandles, edge.targetHandle);
                const sourcePosition = sourceHandle?.position || Position.Bottom;
                const targetPosition = targetHandle?.position || Position.Top;
                const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));
                const isUpdatable = typeof onEdgeUpdate !== 'undefined' &&
                    (edge.updatable || (edgesUpdatable && typeof edge.updatable === 'undefined'));
                if (!sourceHandle || !targetHandle) {
                    onError?.('008', errorMessages['error008'](sourceHandle, edge));
                    return null;
                }
                const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition);
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeComponent, { key: edge.id, id: edge.id, className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])([edge.className, noPanClassName]), type: edgeType, data: edge.data, selected: !!edge.selected, animated: !!edge.animated, hidden: !!edge.hidden, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, style: edge.style, source: edge.source, target: edge.target, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerEnd: edge.markerEnd, markerStart: edge.markerStart, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, elementsSelectable: elementsSelectable, onEdgeUpdate: onEdgeUpdate, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onClick: onEdgeClick, edgeUpdaterRadius: edgeUpdaterRadius, onEdgeDoubleClick: onEdgeDoubleClick, onEdgeUpdateStart: onEdgeUpdateStart, onEdgeUpdateEnd: onEdgeUpdateEnd, rfId: rfId, ariaLabel: edge.ariaLabel, isFocusable: isFocusable, isUpdatable: isUpdatable, pathOptions: 'pathOptions' in edge ? edge.pathOptions : undefined, interactionWidth: edge.interactionWidth }));
            }))))),
        children));
};
EdgeRenderer.displayName = 'EdgeRenderer';
var EdgeRenderer$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(EdgeRenderer);

const selector$3 = (s) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;
function Viewport({ children }) {
    const transform = useStore(selector$3);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "react-flow__viewport react-flow__container", style: { transform } }, children));
}

function useOnInitHandler(onInit) {
    const rfInstance = useReactFlow();
    const isInitialized = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
            setTimeout(() => onInit(rfInstance), 1);
            isInitialized.current = true;
        }
    }, [onInit, rfInstance.viewportInitialized]);
}

const oppositePosition = {
    [Position.Left]: Position.Right,
    [Position.Right]: Position.Left,
    [Position.Top]: Position.Bottom,
    [Position.Bottom]: Position.Top,
};
const ConnectionLine = ({ nodeId, handleType, style, type = ConnectionLineType.Bezier, CustomComponent, connectionStatus, }) => {
    const { fromNode, handleId, toX, toY, connectionMode } = useStore((0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((s) => ({
        fromNode: s.nodeInternals.get(nodeId),
        handleId: s.connectionHandleId,
        toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
        toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
        connectionMode: s.connectionMode,
    }), [nodeId]), zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const fromHandleBounds = fromNode?.[internalsSymbol]?.handleBounds;
    let handleBounds = fromHandleBounds?.[handleType];
    if (connectionMode === ConnectionMode.Loose) {
        handleBounds = handleBounds ? handleBounds : fromHandleBounds?.[handleType === 'source' ? 'target' : 'source'];
    }
    if (!fromNode || !handleBounds) {
        return null;
    }
    const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
    const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode.width ?? 0) / 2;
    const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode.height ?? 0;
    const fromX = (fromNode.positionAbsolute?.x ?? 0) + fromHandleX;
    const fromY = (fromNode.positionAbsolute?.y ?? 0) + fromHandleY;
    const fromPosition = fromHandle?.position;
    const toPosition = fromPosition ? oppositePosition[fromPosition] : null;
    if (!fromPosition || !toPosition) {
        return null;
    }
    if (CustomComponent) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(CustomComponent, { connectionLineType: type, connectionLineStyle: style, fromNode: fromNode, fromHandle: fromHandle, fromX: fromX, fromY: fromY, toX: toX, toY: toY, fromPosition: fromPosition, toPosition: toPosition, connectionStatus: connectionStatus }));
    }
    let dAttr = '';
    const pathParams = {
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
    };
    if (type === ConnectionLineType.Bezier) {
        // we assume the destination position is opposite to the source position
        [dAttr] = getBezierPath(pathParams);
    }
    else if (type === ConnectionLineType.Step) {
        [dAttr] = getSmoothStepPath({
            ...pathParams,
            borderRadius: 0,
        });
    }
    else if (type === ConnectionLineType.SmoothStep) {
        [dAttr] = getSmoothStepPath(pathParams);
    }
    else if (type === ConnectionLineType.SimpleBezier) {
        [dAttr] = getSimpleBezierPath(pathParams);
    }
    else {
        dAttr = `M${fromX},${fromY} ${toX},${toY}`;
    }
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", { d: dAttr, fill: "none", className: "react-flow__connection-path", style: style });
};
ConnectionLine.displayName = 'ConnectionLine';
const selector$2 = (s) => ({
    nodeId: s.connectionNodeId,
    handleType: s.connectionHandleType,
    nodesConnectable: s.nodesConnectable,
    connectionStatus: s.connectionStatus,
    width: s.width,
    height: s.height,
});
function ConnectionLineWrapper({ containerStyle, style, type, component }) {
    const { nodeId, handleType, nodesConnectable, width, height, connectionStatus } = useStore(selector$2, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    const isValid = !!(nodeId && handleType && width && nodesConnectable);
    if (!isValid) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { style: containerStyle, width: width, height: height, className: "react-flow__edges react-flow__connectionline react-flow__container" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("g", { className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow__connection', connectionStatus]) },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(ConnectionLine, { nodeId: nodeId, handleType: handleType, style: style, type: type, CustomComponent: component, connectionStatus: connectionStatus }))));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useNodeOrEdgeTypes(nodeOrEdgeTypes, createTypes) {
    const typesKeysRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const store = useStoreApi();
    const typesParsed = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (true) {
            const typeKeys = Object.keys(nodeOrEdgeTypes);
            if ((0,zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow)(typesKeysRef.current, typeKeys)) {
                store.getState().onError?.('002', errorMessages['error002']());
            }
            typesKeysRef.current = typeKeys;
        }
        return createTypes(nodeOrEdgeTypes);
    }, [nodeOrEdgeTypes]);
    return typesParsed;
}

const GraphView = ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeUpdate, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, edgeUpdaterRadius, onEdgeUpdateStart, onEdgeUpdateEnd, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId, }) => {
    const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
    const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
    useOnInitHandler(onInit);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(FlowRenderer$1, { onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneContextMenu: onPaneContextMenu, onPaneScroll: onPaneScroll, deleteKeyCode: deleteKeyCode, selectionKeyCode: selectionKeyCode, selectionOnDrag: selectionOnDrag, selectionMode: selectionMode, onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, multiSelectionKeyCode: multiSelectionKeyCode, panActivationKeyCode: panActivationKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, elementsSelectable: elementsSelectable, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, panOnDrag: panOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, onSelectionContextMenu: onSelectionContextMenu, preventScrolling: preventScrolling, noDragClassName: noDragClassName, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, disableKeyboardA11y: disableKeyboardA11y },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Viewport, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeRenderer$1, { edgeTypes: edgeTypesWrapped, onEdgeClick: onEdgeClick, onEdgeDoubleClick: onEdgeDoubleClick, onEdgeUpdate: onEdgeUpdate, onlyRenderVisibleElements: onlyRenderVisibleElements, onEdgeContextMenu: onEdgeContextMenu, onEdgeMouseEnter: onEdgeMouseEnter, onEdgeMouseMove: onEdgeMouseMove, onEdgeMouseLeave: onEdgeMouseLeave, onEdgeUpdateStart: onEdgeUpdateStart, onEdgeUpdateEnd: onEdgeUpdateEnd, edgeUpdaterRadius: edgeUpdaterRadius, defaultMarkerColor: defaultMarkerColor, noPanClassName: noPanClassName, elevateEdgesOnSelect: !!elevateEdgesOnSelect, disableKeyboardA11y: disableKeyboardA11y, rfId: rfId },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(ConnectionLineWrapper, { style: connectionLineStyle, type: connectionLineType, component: connectionLineComponent, containerStyle: connectionLineContainerStyle })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "react-flow__edgelabel-renderer" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(NodeRenderer$1, { nodeTypes: nodeTypesWrapped, onNodeClick: onNodeClick, onNodeDoubleClick: onNodeDoubleClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, selectNodesOnDrag: selectNodesOnDrag, onlyRenderVisibleElements: onlyRenderVisibleElements, noPanClassName: noPanClassName, noDragClassName: noDragClassName, disableKeyboardA11y: disableKeyboardA11y, nodeOrigin: nodeOrigin, nodeExtent: nodeExtent, rfId: rfId }))));
};
GraphView.displayName = 'GraphView';
var GraphView$1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(GraphView);

const infiniteExtent = [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];
const initialState = {
    rfId: '1',
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    nodeInternals: new Map(),
    edges: [],
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: false,
    hasDefaultEdges: false,
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: undefined,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: infiniteExtent,
    nodeExtent: infiniteExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionNodeId: null,
    connectionHandleId: null,
    connectionHandleType: 'source',
    connectionPosition: { x: 0, y: 0 },
    connectionStatus: null,
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    paneDragging: false,
    noPanClassName: 'nopan',
    nodeOrigin: [0, 0],
    nodeDragThreshold: 0,
    snapGrid: [15, 15],
    snapToGrid: false,
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesUpdatable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    fitViewOnInit: false,
    fitViewOnInitDone: false,
    fitViewOnInitOptions: undefined,
    onSelectionChange: [],
    multiSelectionActive: false,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectOnClick: true,
    ariaLiveMessage: '',
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    connectionRadius: 20,
    onError: devWarn,
    isValidConnection: undefined,
};

const createRFStore = () => (0,zustand_traditional__WEBPACK_IMPORTED_MODULE_4__.createWithEqualityFn)((set, get) => ({
    ...initialState,
    setNodes: (nodes) => {
        const { nodeInternals, nodeOrigin, elevateNodesOnSelect } = get();
        set({ nodeInternals: createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) });
    },
    getNodes: () => {
        return Array.from(get().nodeInternals.values());
    },
    setEdges: (edges) => {
        const { defaultEdgeOptions = {} } = get();
        set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
    },
    setDefaultNodesAndEdges: (nodes, edges) => {
        const hasDefaultNodes = typeof nodes !== 'undefined';
        const hasDefaultEdges = typeof edges !== 'undefined';
        const nodeInternals = hasDefaultNodes
            ? createNodeInternals(nodes, new Map(), get().nodeOrigin, get().elevateNodesOnSelect)
            : new Map();
        const nextEdges = hasDefaultEdges ? edges : [];
        set({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
    },
    updateNodeDimensions: (updates) => {
        const { onNodesChange, nodeInternals, fitViewOnInit, fitViewOnInitDone, fitViewOnInitOptions, domNode, nodeOrigin, } = get();
        const viewportNode = domNode?.querySelector('.react-flow__viewport');
        if (!viewportNode) {
            return;
        }
        const style = window.getComputedStyle(viewportNode);
        const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
        const changes = updates.reduce((res, update) => {
            const node = nodeInternals.get(update.id);
            if (node) {
                const dimensions = getDimensions(update.nodeElement);
                const doUpdate = !!(dimensions.width &&
                    dimensions.height &&
                    (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate));
                if (doUpdate) {
                    nodeInternals.set(node.id, {
                        ...node,
                        [internalsSymbol]: {
                            ...node[internalsSymbol],
                            handleBounds: {
                                source: getHandleBounds('.source', update.nodeElement, zoom, nodeOrigin),
                                target: getHandleBounds('.target', update.nodeElement, zoom, nodeOrigin),
                            },
                        },
                        ...dimensions,
                    });
                    res.push({
                        id: node.id,
                        type: 'dimensions',
                        dimensions,
                    });
                }
            }
            return res;
        }, []);
        updateAbsoluteNodePositions(nodeInternals, nodeOrigin);
        const nextFitViewOnInitDone = fitViewOnInitDone ||
            (fitViewOnInit && !fitViewOnInitDone && fitView(get, { initial: true, ...fitViewOnInitOptions }));
        set({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone: nextFitViewOnInitDone });
        if (changes?.length > 0) {
            onNodesChange?.(changes);
        }
    },
    updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
        const { triggerNodeChanges } = get();
        const changes = nodeDragItems.map((node) => {
            const change = {
                id: node.id,
                type: 'position',
                dragging,
            };
            if (positionChanged) {
                change.positionAbsolute = node.positionAbsolute;
                change.position = node.position;
            }
            return change;
        });
        triggerNodeChanges(changes);
    },
    triggerNodeChanges: (changes) => {
        const { onNodesChange, nodeInternals, hasDefaultNodes, nodeOrigin, getNodes, elevateNodesOnSelect } = get();
        if (changes?.length) {
            if (hasDefaultNodes) {
                const nodes = applyNodeChanges(changes, getNodes());
                const nextNodeInternals = createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect);
                set({ nodeInternals: nextNodeInternals });
            }
            onNodesChange?.(changes);
        }
    },
    addSelectedNodes: (selectedNodeIds) => {
        const { multiSelectionActive, edges, getNodes } = get();
        let changedNodes;
        let changedEdges = null;
        if (multiSelectionActive) {
            changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
        }
        else {
            changedNodes = getSelectionChanges(getNodes(), selectedNodeIds);
            changedEdges = getSelectionChanges(edges, []);
        }
        updateNodesAndEdgesSelections({
            changedNodes,
            changedEdges,
            get,
            set,
        });
    },
    addSelectedEdges: (selectedEdgeIds) => {
        const { multiSelectionActive, edges, getNodes } = get();
        let changedEdges;
        let changedNodes = null;
        if (multiSelectionActive) {
            changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        }
        else {
            changedEdges = getSelectionChanges(edges, selectedEdgeIds);
            changedNodes = getSelectionChanges(getNodes(), []);
        }
        updateNodesAndEdgesSelections({
            changedNodes,
            changedEdges,
            get,
            set,
        });
    },
    unselectNodesAndEdges: ({ nodes, edges } = {}) => {
        const { edges: storeEdges, getNodes } = get();
        const nodesToUnselect = nodes ? nodes : getNodes();
        const edgesToUnselect = edges ? edges : storeEdges;
        const changedNodes = nodesToUnselect.map((n) => {
            n.selected = false;
            return createSelectionChange(n.id, false);
        });
        const changedEdges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));
        updateNodesAndEdgesSelections({
            changedNodes,
            changedEdges,
            get,
            set,
        });
    },
    setMinZoom: (minZoom) => {
        const { d3Zoom, maxZoom } = get();
        d3Zoom?.scaleExtent([minZoom, maxZoom]);
        set({ minZoom });
    },
    setMaxZoom: (maxZoom) => {
        const { d3Zoom, minZoom } = get();
        d3Zoom?.scaleExtent([minZoom, maxZoom]);
        set({ maxZoom });
    },
    setTranslateExtent: (translateExtent) => {
        get().d3Zoom?.translateExtent(translateExtent);
        set({ translateExtent });
    },
    resetSelectedElements: () => {
        const { edges, getNodes } = get();
        const nodes = getNodes();
        const nodesToUnselect = nodes
            .filter((e) => e.selected)
            .map((n) => createSelectionChange(n.id, false));
        const edgesToUnselect = edges
            .filter((e) => e.selected)
            .map((e) => createSelectionChange(e.id, false));
        updateNodesAndEdgesSelections({
            changedNodes: nodesToUnselect,
            changedEdges: edgesToUnselect,
            get,
            set,
        });
    },
    setNodeExtent: (nodeExtent) => {
        const { nodeInternals } = get();
        nodeInternals.forEach((node) => {
            node.positionAbsolute = clampPosition(node.position, nodeExtent);
        });
        set({
            nodeExtent,
            nodeInternals: new Map(nodeInternals),
        });
    },
    panBy: (delta) => {
        const { transform, width, height, d3Zoom, d3Selection, translateExtent } = get();
        if (!d3Zoom || !d3Selection || (!delta.x && !delta.y)) {
            return false;
        }
        const nextTransform = d3_zoom__WEBPACK_IMPORTED_MODULE_2__.zoomIdentity
            .translate(transform[0] + delta.x, transform[1] + delta.y)
            .scale(transform[2]);
        const extent = [
            [0, 0],
            [width, height],
        ];
        const constrainedTransform = d3Zoom?.constrain()(nextTransform, extent, translateExtent);
        d3Zoom.transform(d3Selection, constrainedTransform);
        const transformChanged = transform[0] !== constrainedTransform.x ||
            transform[1] !== constrainedTransform.y ||
            transform[2] !== constrainedTransform.k;
        return transformChanged;
    },
    cancelConnection: () => set({
        connectionNodeId: initialState.connectionNodeId,
        connectionHandleId: initialState.connectionHandleId,
        connectionHandleType: initialState.connectionHandleType,
        connectionStatus: initialState.connectionStatus,
        connectionStartHandle: initialState.connectionStartHandle,
        connectionEndHandle: initialState.connectionEndHandle,
    }),
    reset: () => set({ ...initialState }),
}), Object.is);

const ReactFlowProvider = ({ children }) => {
    const storeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    if (!storeRef.current) {
        storeRef.current = createRFStore();
    }
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Provider$1, { value: storeRef.current }, children);
};
ReactFlowProvider.displayName = 'ReactFlowProvider';

const Wrapper = ({ children }) => {
    const isWrapped = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(StoreContext);
    if (isWrapped) {
        // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, children);
    }
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ReactFlowProvider, null, children);
};
Wrapper.displayName = 'ReactFlowWrapper';

const defaultNodeTypes = {
    input: InputNode$1,
    default: DefaultNode$1,
    output: OutputNode$1,
    group: GroupNode,
};
const defaultEdgeTypes = {
    default: BezierEdge,
    straight: StraightEdge,
    step: StepEdge,
    smoothstep: SmoothStepEdge,
    simplebezier: SimpleBezierEdge,
};
const initNodeOrigin = [0, 0];
const initSnapGrid = [15, 15];
const initDefaultViewport = { x: 0, y: 0, zoom: 1 };
const wrapperStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0,
};
const ReactFlow = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes = defaultNodeTypes, edgeTypes = defaultEdgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionMode = ConnectionMode.Strict, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = 'Backspace', selectionKeyCode = 'Shift', selectionOnDrag = false, selectionMode = SelectionMode.Full, panActivationKeyCode = 'Space', multiSelectionKeyCode = isMacOs() ? 'Meta' : 'Control', zoomActivationKeyCode = isMacOs() ? 'Meta' : 'Control', snapToGrid = false, snapGrid = initSnapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag = true, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = initNodeOrigin, edgesFocusable, edgesUpdatable, elementsSelectable, defaultViewport = initDefaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = '#b1b1b7', zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, children, onEdgeUpdate, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdateStart, onEdgeUpdateEnd, edgeUpdaterRadius = 10, onNodesChange, onEdgesChange, noDragClassName = 'nodrag', noWheelClassName = 'nowheel', noPanClassName = 'nopan', fitView = false, fitViewOptions, connectOnClick = true, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect = true, elevateEdgesOnSelect = false, disableKeyboardA11y = false, autoPanOnConnect = true, autoPanOnNodeDrag = true, connectionRadius = 20, isValidConnection, onError, style, id, nodeDragThreshold, ...rest }, ref) => {
    const rfId = id || '1';
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ...rest, style: { ...style, ...wrapperStyle }, ref: ref, className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow', className]), "data-testid": "rf__wrapper", id: id },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Wrapper, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(GraphView$1, { onInit: onInit, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, onNodeClick: onNodeClick, onEdgeClick: onEdgeClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, onNodeDoubleClick: onNodeDoubleClick, nodeTypes: nodeTypes, edgeTypes: edgeTypes, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, connectionLineComponent: connectionLineComponent, connectionLineContainerStyle: connectionLineContainerStyle, selectionKeyCode: selectionKeyCode, selectionOnDrag: selectionOnDrag, selectionMode: selectionMode, deleteKeyCode: deleteKeyCode, multiSelectionKeyCode: multiSelectionKeyCode, panActivationKeyCode: panActivationKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, onlyRenderVisibleElements: onlyRenderVisibleElements, selectNodesOnDrag: selectNodesOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, preventScrolling: preventScrolling, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, panOnDrag: panOnDrag, onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneScroll: onPaneScroll, onPaneContextMenu: onPaneContextMenu, onSelectionContextMenu: onSelectionContextMenu, onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, onEdgeUpdate: onEdgeUpdate, onEdgeContextMenu: onEdgeContextMenu, onEdgeDoubleClick: onEdgeDoubleClick, onEdgeMouseEnter: onEdgeMouseEnter, onEdgeMouseMove: onEdgeMouseMove, onEdgeMouseLeave: onEdgeMouseLeave, onEdgeUpdateStart: onEdgeUpdateStart, onEdgeUpdateEnd: onEdgeUpdateEnd, edgeUpdaterRadius: edgeUpdaterRadius, defaultMarkerColor: defaultMarkerColor, noDragClassName: noDragClassName, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, elevateEdgesOnSelect: elevateEdgesOnSelect, rfId: rfId, disableKeyboardA11y: disableKeyboardA11y, nodeOrigin: nodeOrigin, nodeExtent: nodeExtent }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoreUpdater, { nodes: nodes, edges: edges, defaultNodes: defaultNodes, defaultEdges: defaultEdges, onConnect: onConnect, onConnectStart: onConnectStart, onConnectEnd: onConnectEnd, onClickConnectStart: onClickConnectStart, onClickConnectEnd: onClickConnectEnd, nodesDraggable: nodesDraggable, nodesConnectable: nodesConnectable, nodesFocusable: nodesFocusable, edgesFocusable: edgesFocusable, edgesUpdatable: edgesUpdatable, elementsSelectable: elementsSelectable, elevateNodesOnSelect: elevateNodesOnSelect, minZoom: minZoom, maxZoom: maxZoom, nodeExtent: nodeExtent, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, snapToGrid: snapToGrid, snapGrid: snapGrid, connectionMode: connectionMode, translateExtent: translateExtent, connectOnClick: connectOnClick, defaultEdgeOptions: defaultEdgeOptions, fitView: fitView, fitViewOptions: fitViewOptions, onNodesDelete: onNodesDelete, onEdgesDelete: onEdgesDelete, onNodeDragStart: onNodeDragStart, onNodeDrag: onNodeDrag, onNodeDragStop: onNodeDragStop, onSelectionDrag: onSelectionDrag, onSelectionDragStart: onSelectionDragStart, onSelectionDragStop: onSelectionDragStop, noPanClassName: noPanClassName, nodeOrigin: nodeOrigin, rfId: rfId, autoPanOnConnect: autoPanOnConnect, autoPanOnNodeDrag: autoPanOnNodeDrag, onError: onError, connectionRadius: connectionRadius, isValidConnection: isValidConnection, nodeDragThreshold: nodeDragThreshold }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Wrapper$1, { onSelectionChange: onSelectionChange }),
            children,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Attribution, { proOptions: proOptions, position: attributionPosition }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(A11yDescriptions, { rfId: rfId, disableKeyboardA11y: disableKeyboardA11y }))));
});
ReactFlow.displayName = 'ReactFlow';

const selector$1 = (s) => s.domNode?.querySelector('.react-flow__edgelabel-renderer');
function EdgeLabelRenderer({ children }) {
    const edgeLabelRenderer = useStore(selector$1);
    if (!edgeLabelRenderer) {
        return null;
    }
    return (0,react_dom__WEBPACK_IMPORTED_MODULE_3__.createPortal)(children, edgeLabelRenderer);
}

function useUpdateNodeInternals() {
    const store = useStoreApi();
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((id) => {
        const { domNode, updateNodeDimensions } = store.getState();
        const updateIds = Array.isArray(id) ? id : [id];
        const updates = updateIds.reduce((res, updateId) => {
            const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`);
            if (nodeElement) {
                res.push({ id: updateId, nodeElement, forceUpdate: true });
            }
            return res;
        }, []);
        requestAnimationFrame(() => updateNodeDimensions(updates));
    }, []);
}

const nodesSelector = (state) => state.getNodes();
function useNodes() {
    const nodes = useStore(nodesSelector, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    return nodes;
}

const edgesSelector = (state) => state.edges;
function useEdges() {
    const edges = useStore(edgesSelector, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    return edges;
}

const viewportSelector = (state) => ({
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2],
});
function useViewport() {
    const viewport = useStore(viewportSelector, zustand_shallow__WEBPACK_IMPORTED_MODULE_5__.shallow);
    return viewport;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function createUseItemsState(applyChanges) {
    return (initialItems) => {
        const [items, setItems] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialItems);
        const onItemsChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((changes) => setItems((items) => applyChanges(changes, items)), []);
        return [items, setItems, onItemsChange];
    };
}
const useNodesState = createUseItemsState(applyNodeChanges);
const useEdgesState = createUseItemsState(applyEdgeChanges);

function useOnViewportChange({ onStart, onChange, onEnd }) {
    const store = useStoreApi();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        store.setState({ onViewportChangeStart: onStart });
    }, [onStart]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        store.setState({ onViewportChange: onChange });
    }, [onChange]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        store.setState({ onViewportChangeEnd: onEnd });
    }, [onEnd]);
}

function useOnSelectionChange({ onChange }) {
    const store = useStoreApi();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const nextSelectionChangeHandlers = [...store.getState().onSelectionChange, onChange];
        store.setState({ onSelectionChange: nextSelectionChangeHandlers });
        return () => {
            const nextHandlers = store.getState().onSelectionChange.filter((fn) => fn !== onChange);
            store.setState({ onSelectionChange: nextHandlers });
        };
    }, [onChange]);
}

const selector = (options) => (s) => {
    if (s.nodeInternals.size === 0) {
        return false;
    }
    return s
        .getNodes()
        .filter((n) => (options.includeHiddenNodes ? true : !n.hidden))
        .every((n) => n[internalsSymbol]?.handleBounds !== undefined);
};
const defaultOptions = {
    includeHiddenNodes: false,
};
function useNodesInitialized(options = defaultOptions) {
    const initialized = useStore(selector(options));
    return initialized;
}




/***/ }),

/***/ "./node_modules/classcat/index.js":
/*!****************************************!*\
  !*** ./node_modules/classcat/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cc)
/* harmony export */ });
function cc(names) {
  if (typeof names === "string" || typeof names === "number") return "" + names

  let out = ""

  if (Array.isArray(names)) {
    for (let i = 0, tmp; i < names.length; i++) {
      if ((tmp = cc(names[i])) !== "") {
        out += (out && " ") + tmp
      }
    }
  } else {
    for (let k in names) {
      if (names[k]) out += (out && " ") + k
    }
  }

  return out
}


/***/ }),

/***/ "./node_modules/d3-color/src/color.js":
/*!********************************************!*\
  !*** ./node_modules/d3-color/src/color.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Color: () => (/* binding */ Color),
/* harmony export */   Rgb: () => (/* binding */ Rgb),
/* harmony export */   brighter: () => (/* binding */ brighter),
/* harmony export */   darker: () => (/* binding */ darker),
/* harmony export */   "default": () => (/* binding */ color),
/* harmony export */   hsl: () => (/* binding */ hsl),
/* harmony export */   hslConvert: () => (/* binding */ hslConvert),
/* harmony export */   rgb: () => (/* binding */ rgb),
/* harmony export */   rgbConvert: () => (/* binding */ rgbConvert)
/* harmony export */ });
/* harmony import */ var _define_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./define.js */ "./node_modules/d3-color/src/define.js");


function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
    reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
    reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
    reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
    reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
    reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

(0,_define_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHex8() {
  return this.rgb().formatHex8();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

(0,_define_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Rgb, rgb, (0,_define_js__WEBPACK_IMPORTED_MODULE_0__.extend)(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}

function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}

function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}

function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}

function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}

function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0,_define_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Hsl, hsl, (0,_define_js__WEBPACK_IMPORTED_MODULE_0__.extend)(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));

function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}

function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}


/***/ }),

/***/ "./node_modules/d3-color/src/define.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-color/src/define.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   extend: () => (/* binding */ extend)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}


/***/ }),

/***/ "./node_modules/d3-dispatch/src/dispatch.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-dispatch/src/dispatch.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var noop = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dispatch);


/***/ }),

/***/ "./node_modules/d3-drag/src/constant.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-drag/src/constant.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (x => () => x);


/***/ }),

/***/ "./node_modules/d3-drag/src/drag.js":
/*!******************************************!*\
  !*** ./node_modules/d3-drag/src/drag.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_dispatch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-dispatch */ "./node_modules/d3-dispatch/src/dispatch.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/select.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/pointer.js");
/* harmony import */ var _nodrag_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodrag.js */ "./node_modules/d3-drag/src/nodrag.js");
/* harmony import */ var _noevent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./noevent.js */ "./node_modules/d3-drag/src/noevent.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constant.js */ "./node_modules/d3-drag/src/constant.js");
/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./event.js */ "./node_modules/d3-drag/src/event.js");







// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(event, d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = (0,d3_dispatch__WEBPACK_IMPORTED_MODULE_0__["default"])("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved, _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassive)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned(event, d) {
    if (touchending || !filter.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    (0,d3_selection__WEBPACK_IMPORTED_MODULE_2__["default"])(event.view)
      .on("mousemove.drag", mousemoved, _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture)
      .on("mouseup.drag", mouseupped, _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);
    (0,_nodrag_js__WEBPACK_IMPORTED_MODULE_3__["default"])(event.view);
    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__.nopropagation)(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }

  function mousemoved(event) {
    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }

  function mouseupped(event) {
    (0,d3_selection__WEBPACK_IMPORTED_MODULE_2__["default"])(event.view).on("mousemove.drag mouseup.drag", null);
    (0,_nodrag_js__WEBPACK_IMPORTED_MODULE_3__.yesdrag)(event.view, mousemoving);
    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(event);
    gestures.mouse("end", event);
  }

  function touchstarted(event, d) {
    if (!filter.call(this, event, d)) return;
    var touches = event.changedTouches,
        c = container.call(this, event, d),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__.nopropagation)(event);
        gesture("start", event, touches[i]);
      }
    }
  }

  function touchmoved(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(event);
        gesture("drag", event, touches[i]);
      }
    }
  }

  function touchended(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0,_noevent_js__WEBPACK_IMPORTED_MODULE_1__.nopropagation)(event);
        gesture("end", event, touches[i]);
      }
    }
  }

  function beforestart(that, container, event, d, identifier, touch) {
    var dispatch = listeners.copy(),
        p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_4__["default"])(touch || event, container), dx, dy,
        s;

    if ((s = subject.call(that, new _event_js__WEBPACK_IMPORTED_MODULE_5__["default"]("beforestart", {
        sourceEvent: event,
        target: drag,
        identifier,
        active,
        x: p[0],
        y: p[1],
        dx: 0,
        dy: 0,
        dispatch
      }), d)) == null) return;

    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;

    return function gesture(type, event, touch) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[identifier] = gesture, n = active++; break;
        case "end": delete gestures[identifier], --active; // falls through
        case "drag": p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_4__["default"])(touch || event, container), n = active; break;
      }
      dispatch.call(
        type,
        that,
        new _event_js__WEBPACK_IMPORTED_MODULE_5__["default"](type, {
          sourceEvent: event,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch
        }),
        d
      );
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__["default"])(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_6__["default"])(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}


/***/ }),

/***/ "./node_modules/d3-drag/src/event.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-drag/src/event.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragEvent)
/* harmony export */ });
function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x, y, dx, dy,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    subject: {value: subject, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    identifier: {value: identifier, enumerable: true, configurable: true},
    active: {value: active, enumerable: true, configurable: true},
    x: {value: x, enumerable: true, configurable: true},
    y: {value: y, enumerable: true, configurable: true},
    dx: {value: dx, enumerable: true, configurable: true},
    dy: {value: dy, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};


/***/ }),

/***/ "./node_modules/d3-drag/src/nodrag.js":
/*!********************************************!*\
  !*** ./node_modules/d3-drag/src/nodrag.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   yesdrag: () => (/* binding */ yesdrag)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/select.js");
/* harmony import */ var _noevent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./noevent.js */ "./node_modules/d3-drag/src/noevent.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(view) {
  var root = view.document.documentElement,
      selection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(view).on("dragstart.drag", _noevent_js__WEBPACK_IMPORTED_MODULE_1__["default"], _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", _noevent_js__WEBPACK_IMPORTED_MODULE_1__["default"], _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", _noevent_js__WEBPACK_IMPORTED_MODULE_1__["default"], _noevent_js__WEBPACK_IMPORTED_MODULE_1__.nonpassivecapture);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}


/***/ }),

/***/ "./node_modules/d3-drag/src/noevent.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-drag/src/noevent.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   nonpassive: () => (/* binding */ nonpassive),
/* harmony export */   nonpassivecapture: () => (/* binding */ nonpassivecapture),
/* harmony export */   nopropagation: () => (/* binding */ nopropagation)
/* harmony export */ });
// These are typically used in conjunction with noevent to ensure that we can
// preventDefault on the event.
const nonpassive = {passive: false};
const nonpassivecapture = {capture: true, passive: false};

function nopropagation(event) {
  event.stopImmediatePropagation();
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}


/***/ }),

/***/ "./node_modules/d3-ease/src/cubic.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-ease/src/cubic.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cubicIn: () => (/* binding */ cubicIn),
/* harmony export */   cubicInOut: () => (/* binding */ cubicInOut),
/* harmony export */   cubicOut: () => (/* binding */ cubicOut)
/* harmony export */ });
function cubicIn(t) {
  return t * t * t;
}

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/basis.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-interpolate/src/basis.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basis: () => (/* binding */ basis),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/basisClosed.js":
/*!********************************************************!*\
  !*** ./node_modules/d3-interpolate/src/basisClosed.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _basis_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./basis.js */ "./node_modules/d3-interpolate/src/basis.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return (0,_basis_js__WEBPACK_IMPORTED_MODULE_0__.basis)((t - i / n) * n, v0, v1, v2, v3);
  };
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/color.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-interpolate/src/color.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ nogamma),
/* harmony export */   gamma: () => (/* binding */ gamma),
/* harmony export */   hue: () => (/* binding */ hue)
/* harmony export */ });
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.js */ "./node_modules/d3-interpolate/src/constant.js");


function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0,_constant_js__WEBPACK_IMPORTED_MODULE_0__["default"])(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : (0,_constant_js__WEBPACK_IMPORTED_MODULE_0__["default"])(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : (0,_constant_js__WEBPACK_IMPORTED_MODULE_0__["default"])(isNaN(a) ? b : a);
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/constant.js":
/*!*****************************************************!*\
  !*** ./node_modules/d3-interpolate/src/constant.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (x => () => x);


/***/ }),

/***/ "./node_modules/d3-interpolate/src/number.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-interpolate/src/number.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/rgb.js":
/*!************************************************!*\
  !*** ./node_modules/d3-interpolate/src/rgb.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   rgbBasis: () => (/* binding */ rgbBasis),
/* harmony export */   rgbBasisClosed: () => (/* binding */ rgbBasisClosed)
/* harmony export */ });
/* harmony import */ var d3_color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-color */ "./node_modules/d3-color/src/color.js");
/* harmony import */ var _basis_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./basis.js */ "./node_modules/d3-interpolate/src/basis.js");
/* harmony import */ var _basisClosed_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./basisClosed.js */ "./node_modules/d3-interpolate/src/basisClosed.js");
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color.js */ "./node_modules/d3-interpolate/src/color.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function rgbGamma(y) {
  var color = (0,_color_js__WEBPACK_IMPORTED_MODULE_0__.gamma)(y);

  function rgb(start, end) {
    var r = color((start = (0,d3_color__WEBPACK_IMPORTED_MODULE_1__.rgb)(start)).r, (end = (0,d3_color__WEBPACK_IMPORTED_MODULE_1__.rgb)(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = (0,_color_js__WEBPACK_IMPORTED_MODULE_0__["default"])(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;

  return rgb;
})(1));

function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i, color;
    for (i = 0; i < n; ++i) {
      color = (0,d3_color__WEBPACK_IMPORTED_MODULE_1__.rgb)(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function(t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(_basis_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
var rgbBasisClosed = rgbSpline(_basisClosed_js__WEBPACK_IMPORTED_MODULE_3__["default"]);


/***/ }),

/***/ "./node_modules/d3-interpolate/src/string.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-interpolate/src/string.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./number.js */ "./node_modules/d3-interpolate/src/number.js");


var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/transform/decompose.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-interpolate/src/transform/decompose.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   identity: () => (/* binding */ identity)
/* harmony export */ });
var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/transform/index.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-interpolate/src/transform/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interpolateTransformCss: () => (/* binding */ interpolateTransformCss),
/* harmony export */   interpolateTransformSvg: () => (/* binding */ interpolateTransformSvg)
/* harmony export */ });
/* harmony import */ var _number_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../number.js */ "./node_modules/d3-interpolate/src/number.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parse.js */ "./node_modules/d3-interpolate/src/transform/parse.js");



function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(xa, xb)}, {i: i - 2, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(xa, xb)}, {i: i - 2, x: (0,_number_js__WEBPACK_IMPORTED_MODULE_0__["default"])(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(_parse_js__WEBPACK_IMPORTED_MODULE_1__.parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(_parse_js__WEBPACK_IMPORTED_MODULE_1__.parseSvg, ", ", ")", ")");


/***/ }),

/***/ "./node_modules/d3-interpolate/src/transform/parse.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-interpolate/src/transform/parse.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseCss: () => (/* binding */ parseCss),
/* harmony export */   parseSvg: () => (/* binding */ parseSvg)
/* harmony export */ });
/* harmony import */ var _decompose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./decompose.js */ "./node_modules/d3-interpolate/src/transform/decompose.js");


var svgNode;

/* eslint-disable no-undef */
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? _decompose_js__WEBPACK_IMPORTED_MODULE_0__.identity : (0,_decompose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(m.a, m.b, m.c, m.d, m.e, m.f);
}

function parseSvg(value) {
  if (value == null) return _decompose_js__WEBPACK_IMPORTED_MODULE_0__.identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return _decompose_js__WEBPACK_IMPORTED_MODULE_0__.identity;
  value = value.matrix;
  return (0,_decompose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value.a, value.b, value.c, value.d, value.e, value.f);
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/zoom.js":
/*!*************************************************!*\
  !*** ./node_modules/d3-interpolate/src/zoom.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function zoomRho(rho, rho2, rho4) {

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      }
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      }
    }

    i.duration = S * 1000 * rho / Math.SQRT2;

    return i;
  }

  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };

  return zoom;
})(Math.SQRT2, 2, 4));


/***/ }),

/***/ "./node_modules/d3-selection/src/array.js":
/*!************************************************!*\
  !*** ./node_modules/d3-selection/src/array.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ array)
/* harmony export */ });
// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/constant.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-selection/src/constant.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return function() {
    return x;
  };
}


/***/ }),

/***/ "./node_modules/d3-selection/src/creator.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-selection/src/creator.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./namespace.js */ "./node_modules/d3-selection/src/namespace.js");
/* harmony import */ var _namespaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./namespaces.js */ "./node_modules/d3-selection/src/namespaces.js");



function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === _namespaces_js__WEBPACK_IMPORTED_MODULE_0__.xhtml && document.documentElement.namespaceURI === _namespaces_js__WEBPACK_IMPORTED_MODULE_0__.xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var fullname = (0,_namespace_js__WEBPACK_IMPORTED_MODULE_1__["default"])(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/matcher.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-selection/src/matcher.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   childMatcher: () => (/* binding */ childMatcher),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}



/***/ }),

/***/ "./node_modules/d3-selection/src/namespace.js":
/*!****************************************************!*\
  !*** ./node_modules/d3-selection/src/namespace.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./namespaces.js */ "./node_modules/d3-selection/src/namespaces.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return _namespaces_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProperty(prefix) ? {space: _namespaces_js__WEBPACK_IMPORTED_MODULE_0__["default"][prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}


/***/ }),

/***/ "./node_modules/d3-selection/src/namespaces.js":
/*!*****************************************************!*\
  !*** ./node_modules/d3-selection/src/namespaces.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   xhtml: () => (/* binding */ xhtml)
/* harmony export */ });
var xhtml = "http://www.w3.org/1999/xhtml";

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
});


/***/ }),

/***/ "./node_modules/d3-selection/src/pointer.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-selection/src/pointer.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sourceEvent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sourceEvent.js */ "./node_modules/d3-selection/src/sourceEvent.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event, node) {
  event = (0,_sourceEvent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}


/***/ }),

/***/ "./node_modules/d3-selection/src/select.js":
/*!*************************************************!*\
  !*** ./node_modules/d3-selection/src/select.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _selection_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selection/index.js */ "./node_modules/d3-selection/src/selection/index.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return typeof selector === "string"
      ? new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__.Selection([[document.querySelector(selector)]], [document.documentElement])
      : new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__.Selection([[selector]], _selection_index_js__WEBPACK_IMPORTED_MODULE_0__.root);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/append.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/append.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../creator.js */ "./node_modules/d3-selection/src/creator.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var create = typeof name === "function" ? name : (0,_creator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/attr.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/attr.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../namespace.js */ "./node_modules/d3-selection/src/namespace.js");


function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var fullname = (0,_namespace_js__WEBPACK_IMPORTED_MODULE_0__["default"])(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/call.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/call.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/classed.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/classed.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/clone.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/clone.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/data.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/data.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");
/* harmony import */ var _enter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enter.js */ "./node_modules/d3-selection/src/selection/enter.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constant.js */ "./node_modules/d3-selection/src/constant.js");




function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new _enter_js__WEBPACK_IMPORTED_MODULE_0__.EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new _enter_js__WEBPACK_IMPORTED_MODULE_0__.EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new _index_js__WEBPACK_IMPORTED_MODULE_2__.Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
  return typeof data === "object" && "length" in data
    ? data // Array, TypedArray, NodeList, array-like
    : Array.from(data); // Map, Set, iterable, string, or anything else
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/datum.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/datum.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/dispatch.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/dispatch.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _window_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../window.js */ "./node_modules/d3-selection/src/window.js");


function dispatchEvent(node, type, params) {
  var window = (0,_window_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/each.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/each.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/empty.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/empty.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return !this.node();
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/enter.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/enter.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EnterNode: () => (/* binding */ EnterNode),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sparse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sparse.js */ "./node_modules/d3-selection/src/selection/sparse.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(this._enter || this._groups.map(_sparse_js__WEBPACK_IMPORTED_MODULE_1__["default"]), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/exit.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/exit.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sparse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sparse.js */ "./node_modules/d3-selection/src/selection/sparse.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(this._exit || this._groups.map(_sparse_js__WEBPACK_IMPORTED_MODULE_1__["default"]), this._parents);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/filter.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/filter.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matcher.js */ "./node_modules/d3-selection/src/matcher.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  if (typeof match !== "function") match = (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__["default"])(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_1__.Selection(subgroups, this._parents);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/html.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/html.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Selection: () => (/* binding */ Selection),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   root: () => (/* binding */ root)
/* harmony export */ });
/* harmony import */ var _select_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./select.js */ "./node_modules/d3-selection/src/selection/select.js");
/* harmony import */ var _selectAll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectAll.js */ "./node_modules/d3-selection/src/selection/selectAll.js");
/* harmony import */ var _selectChild_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectChild.js */ "./node_modules/d3-selection/src/selection/selectChild.js");
/* harmony import */ var _selectChildren_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectChildren.js */ "./node_modules/d3-selection/src/selection/selectChildren.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filter.js */ "./node_modules/d3-selection/src/selection/filter.js");
/* harmony import */ var _data_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data.js */ "./node_modules/d3-selection/src/selection/data.js");
/* harmony import */ var _enter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./enter.js */ "./node_modules/d3-selection/src/selection/enter.js");
/* harmony import */ var _exit_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./exit.js */ "./node_modules/d3-selection/src/selection/exit.js");
/* harmony import */ var _join_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./join.js */ "./node_modules/d3-selection/src/selection/join.js");
/* harmony import */ var _merge_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./merge.js */ "./node_modules/d3-selection/src/selection/merge.js");
/* harmony import */ var _order_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./order.js */ "./node_modules/d3-selection/src/selection/order.js");
/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sort.js */ "./node_modules/d3-selection/src/selection/sort.js");
/* harmony import */ var _call_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./call.js */ "./node_modules/d3-selection/src/selection/call.js");
/* harmony import */ var _nodes_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./nodes.js */ "./node_modules/d3-selection/src/selection/nodes.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./node.js */ "./node_modules/d3-selection/src/selection/node.js");
/* harmony import */ var _size_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./size.js */ "./node_modules/d3-selection/src/selection/size.js");
/* harmony import */ var _empty_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./empty.js */ "./node_modules/d3-selection/src/selection/empty.js");
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./each.js */ "./node_modules/d3-selection/src/selection/each.js");
/* harmony import */ var _attr_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./attr.js */ "./node_modules/d3-selection/src/selection/attr.js");
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./style.js */ "./node_modules/d3-selection/src/selection/style.js");
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./property.js */ "./node_modules/d3-selection/src/selection/property.js");
/* harmony import */ var _classed_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./classed.js */ "./node_modules/d3-selection/src/selection/classed.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./text.js */ "./node_modules/d3-selection/src/selection/text.js");
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./html.js */ "./node_modules/d3-selection/src/selection/html.js");
/* harmony import */ var _raise_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./raise.js */ "./node_modules/d3-selection/src/selection/raise.js");
/* harmony import */ var _lower_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./lower.js */ "./node_modules/d3-selection/src/selection/lower.js");
/* harmony import */ var _append_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./append.js */ "./node_modules/d3-selection/src/selection/append.js");
/* harmony import */ var _insert_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./insert.js */ "./node_modules/d3-selection/src/selection/insert.js");
/* harmony import */ var _remove_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./remove.js */ "./node_modules/d3-selection/src/selection/remove.js");
/* harmony import */ var _clone_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./clone.js */ "./node_modules/d3-selection/src/selection/clone.js");
/* harmony import */ var _datum_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./datum.js */ "./node_modules/d3-selection/src/selection/datum.js");
/* harmony import */ var _on_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./on.js */ "./node_modules/d3-selection/src/selection/on.js");
/* harmony import */ var _dispatch_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./dispatch.js */ "./node_modules/d3-selection/src/selection/dispatch.js");
/* harmony import */ var _iterator_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./iterator.js */ "./node_modules/d3-selection/src/selection/iterator.js");



































var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  selectAll: _selectAll_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  selectChild: _selectChild_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  selectChildren: _selectChildren_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  filter: _filter_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  data: _data_js__WEBPACK_IMPORTED_MODULE_5__["default"],
  enter: _enter_js__WEBPACK_IMPORTED_MODULE_6__["default"],
  exit: _exit_js__WEBPACK_IMPORTED_MODULE_7__["default"],
  join: _join_js__WEBPACK_IMPORTED_MODULE_8__["default"],
  merge: _merge_js__WEBPACK_IMPORTED_MODULE_9__["default"],
  selection: selection_selection,
  order: _order_js__WEBPACK_IMPORTED_MODULE_10__["default"],
  sort: _sort_js__WEBPACK_IMPORTED_MODULE_11__["default"],
  call: _call_js__WEBPACK_IMPORTED_MODULE_12__["default"],
  nodes: _nodes_js__WEBPACK_IMPORTED_MODULE_13__["default"],
  node: _node_js__WEBPACK_IMPORTED_MODULE_14__["default"],
  size: _size_js__WEBPACK_IMPORTED_MODULE_15__["default"],
  empty: _empty_js__WEBPACK_IMPORTED_MODULE_16__["default"],
  each: _each_js__WEBPACK_IMPORTED_MODULE_17__["default"],
  attr: _attr_js__WEBPACK_IMPORTED_MODULE_18__["default"],
  style: _style_js__WEBPACK_IMPORTED_MODULE_19__["default"],
  property: _property_js__WEBPACK_IMPORTED_MODULE_20__["default"],
  classed: _classed_js__WEBPACK_IMPORTED_MODULE_21__["default"],
  text: _text_js__WEBPACK_IMPORTED_MODULE_22__["default"],
  html: _html_js__WEBPACK_IMPORTED_MODULE_23__["default"],
  raise: _raise_js__WEBPACK_IMPORTED_MODULE_24__["default"],
  lower: _lower_js__WEBPACK_IMPORTED_MODULE_25__["default"],
  append: _append_js__WEBPACK_IMPORTED_MODULE_26__["default"],
  insert: _insert_js__WEBPACK_IMPORTED_MODULE_27__["default"],
  remove: _remove_js__WEBPACK_IMPORTED_MODULE_28__["default"],
  clone: _clone_js__WEBPACK_IMPORTED_MODULE_29__["default"],
  datum: _datum_js__WEBPACK_IMPORTED_MODULE_30__["default"],
  on: _on_js__WEBPACK_IMPORTED_MODULE_31__["default"],
  dispatch: _dispatch_js__WEBPACK_IMPORTED_MODULE_32__["default"],
  [Symbol.iterator]: _iterator_js__WEBPACK_IMPORTED_MODULE_33__["default"]
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (selection);


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/insert.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/insert.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../creator.js */ "./node_modules/d3-selection/src/creator.js");
/* harmony import */ var _selector_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../selector.js */ "./node_modules/d3-selection/src/selector.js");



function constantNull() {
  return null;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, before) {
  var create = typeof name === "function" ? name : (0,_creator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(name),
      select = before == null ? constantNull : typeof before === "function" ? before : (0,_selector_js__WEBPACK_IMPORTED_MODULE_1__["default"])(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/iterator.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/iterator.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function* __WEBPACK_DEFAULT_EXPORT__() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/join.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/join.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/lower.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/lower.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.each(lower);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/merge.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/merge.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context) {
  var selection = context.selection ? context.selection() : context;

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(merges, this._parents);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/node.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/node.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/nodes.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/nodes.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return Array.from(this);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/on.js":
/*!*******************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/on.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/order.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/order.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/property.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/property.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/raise.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/raise.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.each(raise);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/remove.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/remove.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.each(remove);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/select.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/select.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");
/* harmony import */ var _selector_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../selector.js */ "./node_modules/d3-selection/src/selector.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {
  if (typeof select !== "function") select = (0,_selector_js__WEBPACK_IMPORTED_MODULE_0__["default"])(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_1__.Selection(subgroups, this._parents);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/selectAll.js":
/*!**************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/selectAll.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../array.js */ "./node_modules/d3-selection/src/array.js");
/* harmony import */ var _selectorAll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../selectorAll.js */ "./node_modules/d3-selection/src/selectorAll.js");




function arrayAll(select) {
  return function() {
    return (0,_array_js__WEBPACK_IMPORTED_MODULE_0__["default"])(select.apply(this, arguments));
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = (0,_selectorAll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_2__.Selection(subgroups, parents);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/selectChild.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/selectChild.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matcher.js */ "./node_modules/d3-selection/src/matcher.js");


var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__.childMatcher)(match)));
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/selectChildren.js":
/*!*******************************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/selectChildren.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../matcher.js */ "./node_modules/d3-selection/src/matcher.js");


var filter = Array.prototype.filter;

function children() {
  return Array.from(this.children);
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__.childMatcher)(match)));
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/size.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/size.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/sort.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/sort.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-selection/src/selection/index.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/sparse.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/sparse.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(update) {
  return new Array(update.length);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/style.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/style.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   styleValue: () => (/* binding */ styleValue)
/* harmony export */ });
/* harmony import */ var _window_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../window.js */ "./node_modules/d3-selection/src/window.js");


function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || (0,_window_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).getComputedStyle(node, null).getPropertyValue(name);
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selection/text.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-selection/src/selection/text.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selector.js":
/*!***************************************************!*\
  !*** ./node_modules/d3-selection/src/selector.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function none() {}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}


/***/ }),

/***/ "./node_modules/d3-selection/src/selectorAll.js":
/*!******************************************************!*\
  !*** ./node_modules/d3-selection/src/selectorAll.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function empty() {
  return [];
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}


/***/ }),

/***/ "./node_modules/d3-selection/src/sourceEvent.js":
/*!******************************************************!*\
  !*** ./node_modules/d3-selection/src/sourceEvent.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}


/***/ }),

/***/ "./node_modules/d3-selection/src/window.js":
/*!*************************************************!*\
  !*** ./node_modules/d3-selection/src/window.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}


/***/ }),

/***/ "./node_modules/d3-timer/src/timeout.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-timer/src/timeout.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _timer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timer.js */ "./node_modules/d3-timer/src/timer.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback, delay, time) {
  var t = new _timer_js__WEBPACK_IMPORTED_MODULE_0__.Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(elapsed => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}


/***/ }),

/***/ "./node_modules/d3-timer/src/timer.js":
/*!********************************************!*\
  !*** ./node_modules/d3-timer/src/timer.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Timer: () => (/* binding */ Timer),
/* harmony export */   now: () => (/* binding */ now),
/* harmony export */   timer: () => (/* binding */ timer),
/* harmony export */   timerFlush: () => (/* binding */ timerFlush)
/* harmony export */ });
var frame = 0, // is an animation frame pending?
    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}


/***/ }),

/***/ "./node_modules/d3-transition/src/active.js":
/*!**************************************************!*\
  !*** ./node_modules/d3-transition/src/active.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _transition_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transition/index.js */ "./node_modules/d3-transition/src/transition/index.js");
/* harmony import */ var _transition_schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./transition/schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");



var root = [null];

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).state > _transition_schedule_js__WEBPACK_IMPORTED_MODULE_0__.SCHEDULED && schedule.name === name) {
        return new _transition_index_js__WEBPACK_IMPORTED_MODULE_1__.Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}


/***/ }),

/***/ "./node_modules/d3-transition/src/index.js":
/*!*************************************************!*\
  !*** ./node_modules/d3-transition/src/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   active: () => (/* reexport safe */ _active_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   interrupt: () => (/* reexport safe */ _interrupt_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   transition: () => (/* reexport safe */ _transition_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _selection_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selection/index.js */ "./node_modules/d3-transition/src/selection/index.js");
/* harmony import */ var _transition_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transition/index.js */ "./node_modules/d3-transition/src/transition/index.js");
/* harmony import */ var _active_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./active.js */ "./node_modules/d3-transition/src/active.js");
/* harmony import */ var _interrupt_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interrupt.js */ "./node_modules/d3-transition/src/interrupt.js");






/***/ }),

/***/ "./node_modules/d3-transition/src/interrupt.js":
/*!*****************************************************!*\
  !*** ./node_modules/d3-transition/src/interrupt.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _transition_schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./transition/schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > _transition_schedule_js__WEBPACK_IMPORTED_MODULE_0__.STARTING && schedule.state < _transition_schedule_js__WEBPACK_IMPORTED_MODULE_0__.ENDING;
    schedule.state = _transition_schedule_js__WEBPACK_IMPORTED_MODULE_0__.ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}


/***/ }),

/***/ "./node_modules/d3-transition/src/selection/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-transition/src/selection/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/selection/index.js");
/* harmony import */ var _interrupt_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interrupt.js */ "./node_modules/d3-transition/src/selection/interrupt.js");
/* harmony import */ var _transition_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transition.js */ "./node_modules/d3-transition/src/selection/transition.js");




d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.interrupt = _interrupt_js__WEBPACK_IMPORTED_MODULE_1__["default"];
d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.transition = _transition_js__WEBPACK_IMPORTED_MODULE_2__["default"];


/***/ }),

/***/ "./node_modules/d3-transition/src/selection/interrupt.js":
/*!***************************************************************!*\
  !*** ./node_modules/d3-transition/src/selection/interrupt.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _interrupt_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../interrupt.js */ "./node_modules/d3-transition/src/interrupt.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  return this.each(function() {
    (0,_interrupt_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, name);
  });
}


/***/ }),

/***/ "./node_modules/d3-transition/src/selection/transition.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-transition/src/selection/transition.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _transition_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../transition/index.js */ "./node_modules/d3-transition/src/transition/index.js");
/* harmony import */ var _transition_schedule_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../transition/schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");
/* harmony import */ var d3_ease__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-ease */ "./node_modules/d3-ease/src/cubic.js");
/* harmony import */ var d3_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-timer */ "./node_modules/d3-timer/src/timer.js");





var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: d3_ease__WEBPACK_IMPORTED_MODULE_0__.cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id} not found`);
    }
  }
  return timing;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var id,
      timing;

  if (name instanceof _transition_index_js__WEBPACK_IMPORTED_MODULE_1__.Transition) {
    id = name._id, name = name._name;
  } else {
    id = (0,_transition_index_js__WEBPACK_IMPORTED_MODULE_1__.newId)(), (timing = defaultTiming).time = (0,d3_timer__WEBPACK_IMPORTED_MODULE_2__.now)(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        (0,_transition_schedule_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new _transition_index_js__WEBPACK_IMPORTED_MODULE_1__.Transition(groups, this._parents, name, id);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/attr.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/attr.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_interpolate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-interpolate */ "./node_modules/d3-interpolate/src/transform/index.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/namespace.js");
/* harmony import */ var _tween_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tween.js */ "./node_modules/d3-transition/src/transition/tween.js");
/* harmony import */ var _interpolate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpolate.js */ "./node_modules/d3-transition/src/transition/interpolate.js");





function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var fullname = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(name), i = fullname === "transform" ? d3_interpolate__WEBPACK_IMPORTED_MODULE_1__.interpolateTransformSvg : _interpolate_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, (0,_tween_js__WEBPACK_IMPORTED_MODULE_3__.tweenValue)(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/attrTween.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/attrTween.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/namespace.js");


function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/delay.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/delay.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


function delayFunction(id, value) {
  return function() {
    (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.init)(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.init)(this, id).delay = value;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.get)(this.node(), id).delay;
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/duration.js":
/*!***************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/duration.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


function durationFunction(id, value) {
  return function() {
    (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id).duration = value;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.get)(this.node(), id).duration;
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/ease.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/ease.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id).ease = value;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.get)(this.node(), id).ease;
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/easeVarying.js":
/*!******************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/easeVarying.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


function easeVarying(id, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error;
    (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id).ease = v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  if (typeof value !== "function") throw new Error;
  return this.each(easeVarying(this._id, value));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/end.js":
/*!**********************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/end.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });

    // The selection was empty, resolve end immediately
    if (size === 0) resolve();
  });
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/filter.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/filter.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/matcher.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-transition/src/transition/index.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  if (typeof match !== "function") match = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_1__.Transition(subgroups, this._parents, this._name, this._id);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/index.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transition: () => (/* binding */ Transition),
/* harmony export */   "default": () => (/* binding */ transition),
/* harmony export */   newId: () => (/* binding */ newId)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/selection/index.js");
/* harmony import */ var _attr_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./attr.js */ "./node_modules/d3-transition/src/transition/attr.js");
/* harmony import */ var _attrTween_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./attrTween.js */ "./node_modules/d3-transition/src/transition/attrTween.js");
/* harmony import */ var _delay_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./delay.js */ "./node_modules/d3-transition/src/transition/delay.js");
/* harmony import */ var _duration_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./duration.js */ "./node_modules/d3-transition/src/transition/duration.js");
/* harmony import */ var _ease_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./ease.js */ "./node_modules/d3-transition/src/transition/ease.js");
/* harmony import */ var _easeVarying_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./easeVarying.js */ "./node_modules/d3-transition/src/transition/easeVarying.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filter.js */ "./node_modules/d3-transition/src/transition/filter.js");
/* harmony import */ var _merge_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./merge.js */ "./node_modules/d3-transition/src/transition/merge.js");
/* harmony import */ var _on_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./on.js */ "./node_modules/d3-transition/src/transition/on.js");
/* harmony import */ var _remove_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./remove.js */ "./node_modules/d3-transition/src/transition/remove.js");
/* harmony import */ var _select_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./select.js */ "./node_modules/d3-transition/src/transition/select.js");
/* harmony import */ var _selectAll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectAll.js */ "./node_modules/d3-transition/src/transition/selectAll.js");
/* harmony import */ var _selection_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./selection.js */ "./node_modules/d3-transition/src/transition/selection.js");
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./style.js */ "./node_modules/d3-transition/src/transition/style.js");
/* harmony import */ var _styleTween_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./styleTween.js */ "./node_modules/d3-transition/src/transition/styleTween.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./text.js */ "./node_modules/d3-transition/src/transition/text.js");
/* harmony import */ var _textTween_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./textTween.js */ "./node_modules/d3-transition/src/transition/textTween.js");
/* harmony import */ var _transition_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transition.js */ "./node_modules/d3-transition/src/transition/transition.js");
/* harmony import */ var _tween_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tween.js */ "./node_modules/d3-transition/src/transition/tween.js");
/* harmony import */ var _end_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./end.js */ "./node_modules/d3-transition/src/transition/end.js");






















var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"].prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: _select_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  selectAll: _selectAll_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: _filter_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  merge: _merge_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  selection: _selection_js__WEBPACK_IMPORTED_MODULE_5__["default"],
  transition: _transition_js__WEBPACK_IMPORTED_MODULE_6__["default"],
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: _on_js__WEBPACK_IMPORTED_MODULE_7__["default"],
  attr: _attr_js__WEBPACK_IMPORTED_MODULE_8__["default"],
  attrTween: _attrTween_js__WEBPACK_IMPORTED_MODULE_9__["default"],
  style: _style_js__WEBPACK_IMPORTED_MODULE_10__["default"],
  styleTween: _styleTween_js__WEBPACK_IMPORTED_MODULE_11__["default"],
  text: _text_js__WEBPACK_IMPORTED_MODULE_12__["default"],
  textTween: _textTween_js__WEBPACK_IMPORTED_MODULE_13__["default"],
  remove: _remove_js__WEBPACK_IMPORTED_MODULE_14__["default"],
  tween: _tween_js__WEBPACK_IMPORTED_MODULE_15__["default"],
  delay: _delay_js__WEBPACK_IMPORTED_MODULE_16__["default"],
  duration: _duration_js__WEBPACK_IMPORTED_MODULE_17__["default"],
  ease: _ease_js__WEBPACK_IMPORTED_MODULE_18__["default"],
  easeVarying: _easeVarying_js__WEBPACK_IMPORTED_MODULE_19__["default"],
  end: _end_js__WEBPACK_IMPORTED_MODULE_20__["default"],
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/interpolate.js":
/*!******************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/interpolate.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-color */ "./node_modules/d3-color/src/color.js");
/* harmony import */ var d3_interpolate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-interpolate */ "./node_modules/d3-interpolate/src/number.js");
/* harmony import */ var d3_interpolate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-interpolate */ "./node_modules/d3-interpolate/src/rgb.js");
/* harmony import */ var d3_interpolate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! d3-interpolate */ "./node_modules/d3-interpolate/src/string.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(a, b) {
  var c;
  return (typeof b === "number" ? d3_interpolate__WEBPACK_IMPORTED_MODULE_0__["default"]
      : b instanceof d3_color__WEBPACK_IMPORTED_MODULE_1__["default"] ? d3_interpolate__WEBPACK_IMPORTED_MODULE_2__["default"]
      : (c = (0,d3_color__WEBPACK_IMPORTED_MODULE_1__["default"])(b)) ? (b = c, d3_interpolate__WEBPACK_IMPORTED_MODULE_2__["default"])
      : d3_interpolate__WEBPACK_IMPORTED_MODULE_3__["default"])(a, b);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/merge.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/merge.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-transition/src/transition/index.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Transition(merges, this._parents, this._name, this._id);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/on.js":
/*!*********************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/on.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? _schedule_js__WEBPACK_IMPORTED_MODULE_0__.init : _schedule_js__WEBPACK_IMPORTED_MODULE_0__.set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.get)(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/remove.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/remove.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.on("end.remove", removeFunction(this._id));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/schedule.js":
/*!***************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/schedule.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CREATED: () => (/* binding */ CREATED),
/* harmony export */   ENDED: () => (/* binding */ ENDED),
/* harmony export */   ENDING: () => (/* binding */ ENDING),
/* harmony export */   RUNNING: () => (/* binding */ RUNNING),
/* harmony export */   SCHEDULED: () => (/* binding */ SCHEDULED),
/* harmony export */   STARTED: () => (/* binding */ STARTED),
/* harmony export */   STARTING: () => (/* binding */ STARTING),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   set: () => (/* binding */ set)
/* harmony export */ });
/* harmony import */ var d3_dispatch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-dispatch */ "./node_modules/d3-dispatch/src/dispatch.js");
/* harmony import */ var d3_timer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-timer */ "./node_modules/d3-timer/src/timer.js");
/* harmony import */ var d3_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-timer */ "./node_modules/d3-timer/src/timeout.js");



var emptyOn = (0,d3_dispatch__WEBPACK_IMPORTED_MODULE_0__["default"])("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = (0,d3_timer__WEBPACK_IMPORTED_MODULE_1__.timer)(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return (0,d3_timer__WEBPACK_IMPORTED_MODULE_2__["default"])(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    (0,d3_timer__WEBPACK_IMPORTED_MODULE_2__["default"])(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/select.js":
/*!*************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/select.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/selector.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-transition/src/transition/index.js");
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__["default"])(subgroup[i], name, id, i, subgroup, (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__.get)(node, id));
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_2__.Transition(subgroups, this._parents, name, id);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/selectAll.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/selectAll.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/selectorAll.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-transition/src/transition/index.js");
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"])(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__.get)(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__["default"])(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_2__.Transition(subgroups, parents, name, id);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/selection.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/selection.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/selection/index.js");


var Selection = d3_selection__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.constructor;

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return new Selection(this._groups, this._parents);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/style.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/style.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_interpolate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3-interpolate */ "./node_modules/d3-interpolate/src/transform/index.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/selection/style.js");
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");
/* harmony import */ var _tween_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tween.js */ "./node_modules/d3-transition/src/transition/tween.js");
/* harmony import */ var _interpolate_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interpolate.js */ "./node_modules/d3-transition/src/transition/interpolate.js");






function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__.styleValue)(this, name),
        string1 = (this.style.removeProperty(name), (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__.styleValue)(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__.styleValue)(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__.styleValue)(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__.styleValue)(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__.set)(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value, priority) {
  var i = (name += "") === "transform" ? d3_interpolate__WEBPACK_IMPORTED_MODULE_2__.interpolateTransformCss : _interpolate_js__WEBPACK_IMPORTED_MODULE_3__["default"];
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction(name, i, (0,_tween_js__WEBPACK_IMPORTED_MODULE_4__.tweenValue)(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/styleTween.js":
/*!*****************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/styleTween.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/text.js":
/*!***********************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/text.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tween_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tween.js */ "./node_modules/d3-transition/src/transition/tween.js");


function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction((0,_tween_js__WEBPACK_IMPORTED_MODULE_0__.tweenValue)(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/textTween.js":
/*!****************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/textTween.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/transition.js":
/*!*****************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/transition.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/d3-transition/src/transition/index.js");
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var name = this._name,
      id0 = this._id,
      id1 = (0,_index_js__WEBPACK_IMPORTED_MODULE_0__.newId)();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__.get)(node, id0);
        (0,_schedule_js__WEBPACK_IMPORTED_MODULE_1__["default"])(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_0__.Transition(groups, this._parents, name, id1);
}


/***/ }),

/***/ "./node_modules/d3-transition/src/transition/tween.js":
/*!************************************************************!*\
  !*** ./node_modules/d3-transition/src/transition/tween.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   tweenValue: () => (/* binding */ tweenValue)
/* harmony export */ });
/* harmony import */ var _schedule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.js */ "./node_modules/d3-transition/src/transition/schedule.js");


function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.get)(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.set)(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return (0,_schedule_js__WEBPACK_IMPORTED_MODULE_0__.get)(node, id).value[name];
  };
}


/***/ }),

/***/ "./node_modules/d3-zoom/src/constant.js":
/*!**********************************************!*\
  !*** ./node_modules/d3-zoom/src/constant.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (x => () => x);


/***/ }),

/***/ "./node_modules/d3-zoom/src/event.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-zoom/src/event.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ZoomEvent)
/* harmony export */ });
function ZoomEvent(type, {
  sourceEvent,
  target,
  transform,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    transform: {value: transform, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}


/***/ }),

/***/ "./node_modules/d3-zoom/src/index.js":
/*!*******************************************!*\
  !*** ./node_modules/d3-zoom/src/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZoomTransform: () => (/* reexport safe */ _transform_js__WEBPACK_IMPORTED_MODULE_1__.Transform),
/* harmony export */   zoom: () => (/* reexport safe */ _zoom_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   zoomIdentity: () => (/* reexport safe */ _transform_js__WEBPACK_IMPORTED_MODULE_1__.identity),
/* harmony export */   zoomTransform: () => (/* reexport safe */ _transform_js__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _zoom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./zoom.js */ "./node_modules/d3-zoom/src/zoom.js");
/* harmony import */ var _transform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transform.js */ "./node_modules/d3-zoom/src/transform.js");




/***/ }),

/***/ "./node_modules/d3-zoom/src/noevent.js":
/*!*********************************************!*\
  !*** ./node_modules/d3-zoom/src/noevent.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   nopropagation: () => (/* binding */ nopropagation)
/* harmony export */ });
function nopropagation(event) {
  event.stopImmediatePropagation();
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}


/***/ }),

/***/ "./node_modules/d3-zoom/src/transform.js":
/*!***********************************************!*\
  !*** ./node_modules/d3-zoom/src/transform.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transform: () => (/* binding */ Transform),
/* harmony export */   "default": () => (/* binding */ transform),
/* harmony export */   identity: () => (/* binding */ identity)
/* harmony export */ });
function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

var identity = new Transform(1, 0, 0);

transform.prototype = Transform.prototype;

function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity;
  return node.__zoom;
}


/***/ }),

/***/ "./node_modules/d3-zoom/src/zoom.js":
/*!******************************************!*\
  !*** ./node_modules/d3-zoom/src/zoom.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var d3_dispatch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! d3-dispatch */ "./node_modules/d3-dispatch/src/dispatch.js");
/* harmony import */ var d3_drag__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! d3-drag */ "./node_modules/d3-drag/src/nodrag.js");
/* harmony import */ var d3_interpolate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! d3-interpolate */ "./node_modules/d3-interpolate/src/zoom.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/select.js");
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! d3-selection */ "./node_modules/d3-selection/src/pointer.js");
/* harmony import */ var d3_transition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-transition */ "./node_modules/d3-transition/src/index.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant.js */ "./node_modules/d3-zoom/src/constant.js");
/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event.js */ "./node_modules/d3-zoom/src/event.js");
/* harmony import */ var _transform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transform.js */ "./node_modules/d3-zoom/src/transform.js");
/* harmony import */ var _noevent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./noevent.js */ "./node_modules/d3-zoom/src/noevent.js");










// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}

function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || _transform_js__WEBPACK_IMPORTED_MODULE_3__.identity;
}

function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = d3_interpolate__WEBPACK_IMPORTED_MODULE_5__["default"],
      listeners = (0,d3_dispatch__WEBPACK_IMPORTED_MODULE_6__["default"])("start", "zoom", "end"),
      touchstarting,
      touchfirst,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0,
      tapDistance = 10;

  function zoom(selection) {
    selection
        .property("__zoom", defaultTransform)
        .on("wheel.zoom", wheeled, {passive: false})
        .on("mousedown.zoom", mousedowned)
        .on("dblclick.zoom", dblclicked)
      .filter(touchable)
        .on("touchstart.zoom", touchstarted)
        .on("touchmove.zoom", touchmoved)
        .on("touchend.zoom touchcancel.zoom", touchended)
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments)
          .event(event)
          .start()
          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
          .end();
      });
    }
  };

  zoom.scaleBy = function(selection, k, p, event) {
    zoom.scaleTo(selection, function() {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };

  zoom.scaleTo = function(selection, k, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };

  zoom.translateBy = function(selection, x, y, event) {
    zoom.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };

  zoom.translateTo = function(selection, x, y, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(_transform_js__WEBPACK_IMPORTED_MODULE_3__.identity.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new _transform_js__WEBPACK_IMPORTED_MODULE_3__.Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new _transform_js__WEBPACK_IMPORTED_MODULE_3__.Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point, event) {
    transition
        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
        .tween("zoom", function() {
          var that = this,
              args = arguments,
              g = gesture(that, args).event(event),
              e = extent.apply(that, args),
              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
              a = that.__zoom,
              b = typeof transform === "function" ? transform.apply(that, args) : transform,
              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
          return function(t) {
            if (t === 1) t = b; // Avoid rounding error on end.
            else { var l = i(t), k = w / l[2]; t = new _transform_js__WEBPACK_IMPORTED_MODULE_3__.Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
            g.zoom(null, t);
          };
        });
  }

  function gesture(that, args, clean) {
    return (!clean && that.__zooming) || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = (0,d3_selection__WEBPACK_IMPORTED_MODULE_7__["default"])(this.that).datum();
      listeners.call(
        type,
        this.that,
        new _event_js__WEBPACK_IMPORTED_MODULE_2__["default"](type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };

  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(event);

    // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    }

    // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return;

    // Otherwise, capture the mouse point and location at the start.
    else {
      g.mouse = [p, t.invert(p)];
      (0,d3_transition__WEBPACK_IMPORTED_MODULE_0__.interrupt)(this);
      g.start();
    }

    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var currentTarget = event.currentTarget,
        g = gesture(this, args, true).event(event),
        v = (0,d3_selection__WEBPACK_IMPORTED_MODULE_7__["default"])(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(event, currentTarget),
        x0 = event.clientX,
        y0 = event.clientY;

    (0,d3_drag__WEBPACK_IMPORTED_MODULE_9__["default"])(event.view);
    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__.nopropagation)(event);
    g.mouse = [p, this.__zoom.invert(p)];
    (0,d3_transition__WEBPACK_IMPORTED_MODULE_0__.interrupt)(this);
    g.start();

    function mousemoved(event) {
      (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(event);
      if (!g.moved) {
        var dx = event.clientX - x0, dy = event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event)
       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped(event) {
      v.on("mousemove.zoom mouseup.zoom", null);
      (0,d3_drag__WEBPACK_IMPORTED_MODULE_9__.yesdrag)(event.view, g.moved);
      (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(event);
      g.event(event).end();
    }
  }

  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(event.changedTouches ? event.changedTouches[0] : event, this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(event);
    if (duration > 0) (0,d3_selection__WEBPACK_IMPORTED_MODULE_7__["default"])(this).transition().duration(duration).call(schedule, t1, p0, event);
    else (0,d3_selection__WEBPACK_IMPORTED_MODULE_7__["default"])(this).call(zoom.transform, t1, p0, event);
  }

  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches,
        n = touches.length,
        g = gesture(this, args, event.changedTouches.length === n).event(event),
        started, i, t, p;

    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__.nopropagation)(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
      (0,d3_transition__WEBPACK_IMPORTED_MODULE_0__.interrupt)(this);
      g.start();
    }
  }

  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t, p, l;

    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1],
          p1 = g.touch1[0], l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    }
    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t;

    (0,_noevent_js__WEBPACK_IMPORTED_MODULE_4__.nopropagation)(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (g.taps === 2) {
        t = (0,d3_selection__WEBPACK_IMPORTED_MODULE_8__["default"])(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = (0,d3_selection__WEBPACK_IMPORTED_MODULE_7__["default"])(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }

  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__["default"])(+_), zoom) : wheelDelta;
  };

  zoom.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__["default"])(!!_), zoom) : filter;
  };

  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__["default"])(!!_), zoom) : touchable;
  };

  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__["default"])([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };

  return zoom;
}


/***/ }),

/***/ "./node_modules/memize/dist/index.js":
/*!*******************************************!*\
  !*** ./node_modules/memize/dist/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memize)
/* harmony export */ });
/**
 * Memize options object.
 *
 * @typedef MemizeOptions
 *
 * @property {number} [maxSize] Maximum size of the cache.
 */

/**
 * Internal cache entry.
 *
 * @typedef MemizeCacheNode
 *
 * @property {?MemizeCacheNode|undefined} [prev] Previous node.
 * @property {?MemizeCacheNode|undefined} [next] Next node.
 * @property {Array<*>}                   args   Function arguments for cache
 *                                               entry.
 * @property {*}                          val    Function result.
 */

/**
 * Properties of the enhanced function for controlling cache.
 *
 * @typedef MemizeMemoizedFunction
 *
 * @property {()=>void} clear Clear the cache.
 */

/**
 * Accepts a function to be memoized, and returns a new memoized function, with
 * optional options.
 *
 * @template {(...args: any[]) => any} F
 *
 * @param {F}             fn        Function to memoize.
 * @param {MemizeOptions} [options] Options object.
 *
 * @return {((...args: Parameters<F>) => ReturnType<F>) & MemizeMemoizedFunction} Memoized function.
 */
function memize(fn, options) {
	var size = 0;

	/** @type {?MemizeCacheNode|undefined} */
	var head;

	/** @type {?MemizeCacheNode|undefined} */
	var tail;

	options = options || {};

	function memoized(/* ...args */) {
		var node = head,
			len = arguments.length,
			args,
			i;

		searchCache: while (node) {
			// Perform a shallow equality test to confirm that whether the node
			// under test is a candidate for the arguments passed. Two arrays
			// are shallowly equal if their length matches and each entry is
			// strictly equal between the two sets. Avoid abstracting to a
			// function which could incur an arguments leaking deoptimization.

			// Check whether node arguments match arguments length
			if (node.args.length !== arguments.length) {
				node = node.next;
				continue;
			}

			// Check whether node arguments match arguments values
			for (i = 0; i < len; i++) {
				if (node.args[i] !== arguments[i]) {
					node = node.next;
					continue searchCache;
				}
			}

			// At this point we can assume we've found a match

			// Surface matched node to head if not already
			if (node !== head) {
				// As tail, shift to previous. Must only shift if not also
				// head, since if both head and tail, there is no previous.
				if (node === tail) {
					tail = node.prev;
				}

				// Adjust siblings to point to each other. If node was tail,
				// this also handles new tail's empty `next` assignment.
				/** @type {MemizeCacheNode} */ (node.prev).next = node.next;
				if (node.next) {
					node.next.prev = node.prev;
				}

				node.next = head;
				node.prev = null;
				/** @type {MemizeCacheNode} */ (head).prev = node;
				head = node;
			}

			// Return immediately
			return node.val;
		}

		// No cached value found. Continue to insertion phase:

		// Create a copy of arguments (avoid leaking deoptimization)
		args = new Array(len);
		for (i = 0; i < len; i++) {
			args[i] = arguments[i];
		}

		node = {
			args: args,

			// Generate the result from original function
			val: fn.apply(null, args),
		};

		// Don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// Shift existing head down list
		if (head) {
			head.prev = node;
			node.next = head;
		} else {
			// If no head, follows that there's no tail (at initial or reset)
			tail = node;
		}

		// Trim tail if we're reached max size and are pending cache insertion
		if (size === /** @type {MemizeOptions} */ (options).maxSize) {
			tail = /** @type {MemizeCacheNode} */ (tail).prev;
			/** @type {MemizeCacheNode} */ (tail).next = null;
		} else {
			size++;
		}

		head = node;

		return node.val;
	}

	memoized.clear = function () {
		head = null;
		tail = null;
		size = 0;
	};

	// Ignore reason: There's not a clear solution to create an intersection of
	// the function with additional properties, where the goal is to retain the
	// function signature of the incoming argument and add control properties
	// on the return value.

	// @ts-ignore
	return memoized;
}




/***/ }),

/***/ "./node_modules/tslib/tslib.es6.mjs":
/*!******************************************!*\
  !*** ./node_modules/tslib/tslib.es6.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
      }
      catch (e) {
          fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ }),

/***/ "./node_modules/zustand/esm/shallow.mjs":
/*!**********************************************!*\
  !*** ./node_modules/zustand/esm/shallow.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shallow),
/* harmony export */   shallow: () => (/* binding */ shallow$1)
/* harmony export */ });
function shallow$1(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size)
      return false;
    for (const [key, value] of objA) {
      if (!Object.is(value, objB.get(key))) {
        return false;
      }
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size)
      return false;
    for (const value of objA) {
      if (!objB.has(value)) {
        return false;
      }
    }
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (const keyA of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, keyA) || !Object.is(objA[keyA], objB[keyA])) {
      return false;
    }
  }
  return true;
}

var shallow = (objA, objB) => {
  if (( false ? 0 : void 0) !== "production") {
    console.warn(
      "[DEPRECATED] Default export is deprecated. Instead use `import { shallow } from 'zustand/shallow'`."
    );
  }
  return shallow$1(objA, objB);
};




/***/ }),

/***/ "./node_modules/zustand/esm/traditional.mjs":
/*!**************************************************!*\
  !*** ./node_modules/zustand/esm/traditional.mjs ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWithEqualityFn: () => (/* binding */ createWithEqualityFn),
/* harmony export */   useStoreWithEqualityFn: () => (/* binding */ useStoreWithEqualityFn)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var use_sync_external_store_shim_with_selector_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! use-sync-external-store/shim/with-selector.js */ "./node_modules/use-sync-external-store/shim/with-selector.js");
/* harmony import */ var zustand_vanilla__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! zustand/vanilla */ "./node_modules/zustand/esm/vanilla.mjs");




const { useDebugValue } = react__WEBPACK_IMPORTED_MODULE_0__;
const { useSyncExternalStoreWithSelector } = use_sync_external_store_shim_with_selector_js__WEBPACK_IMPORTED_MODULE_1__;
const identity = (arg) => arg;
function useStoreWithEqualityFn(api, selector = identity, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createWithEqualityFnImpl = (createState, defaultEqualityFn) => {
  const api = (0,zustand_vanilla__WEBPACK_IMPORTED_MODULE_2__.createStore)(createState);
  const useBoundStoreWithEqualityFn = (selector, equalityFn = defaultEqualityFn) => useStoreWithEqualityFn(api, selector, equalityFn);
  Object.assign(useBoundStoreWithEqualityFn, api);
  return useBoundStoreWithEqualityFn;
};
const createWithEqualityFn = (createState, defaultEqualityFn) => createState ? createWithEqualityFnImpl(createState, defaultEqualityFn) : createWithEqualityFnImpl;




/***/ }),

/***/ "./node_modules/zustand/esm/vanilla.mjs":
/*!**********************************************!*\
  !*** ./node_modules/zustand/esm/vanilla.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStore: () => (/* binding */ createStore),
/* harmony export */   "default": () => (/* binding */ vanilla)
/* harmony export */ });
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if (( false ? 0 : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var vanilla = (createState) => {
  if (( false ? 0 : void 0) !== "production") {
    console.warn(
      "[DEPRECATED] Default export is deprecated. Instead use import { createStore } from 'zustand/vanilla'."
    );
  }
  return createStore(createState);
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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************************!*\
  !*** ./src/assets/jsx/workflow-editor/editor.jsx ***!
  \***************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ "./src/assets/jsx/workflow-editor/components/index.jsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/assets/jsx/workflow-editor/constants.jsx");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./store */ "./src/assets/jsx/workflow-editor/store.jsx");
/* harmony import */ var _demoData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./demoData */ "./src/assets/jsx/workflow-editor/demoData.jsx");
/* harmony import */ var _css_editor_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./css/editor.css */ "./src/assets/jsx/workflow-editor/css/editor.css");
/* harmony import */ var reactflow_dist_style_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! reactflow/dist/style.css */ "./node_modules/reactflow/dist/style.css");








(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.dispatch)(_store__WEBPACK_IMPORTED_MODULE_4__.store).setNodes(_demoData__WEBPACK_IMPORTED_MODULE_5__.nodes);
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.dispatch)(_store__WEBPACK_IMPORTED_MODULE_4__.store).setEdges(_demoData__WEBPACK_IMPORTED_MODULE_5__.edges);
(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createRoot)(document.getElementById(_constants__WEBPACK_IMPORTED_MODULE_1__.HTML_ELEMENT_ID)).render( /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.StrictMode, null, /*#__PURE__*/React.createElement(_components__WEBPACK_IMPORTED_MODULE_0__.WorkflowEditorLayout, null)));
})();

/******/ })()
;
//# sourceMappingURL=workflow-editor.js.map