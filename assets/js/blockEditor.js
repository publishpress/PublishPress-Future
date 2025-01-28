/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/api-fetch/build-module/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _middlewares_nonce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./middlewares/nonce */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/nonce.js");
/* harmony import */ var _middlewares_root_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middlewares/root-url */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/root-url.js");
/* harmony import */ var _middlewares_preloading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./middlewares/preloading */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/preloading.js");
/* harmony import */ var _middlewares_fetch_all_middleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./middlewares/fetch-all-middleware */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/fetch-all-middleware.js");
/* harmony import */ var _middlewares_namespace_endpoint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./middlewares/namespace-endpoint */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/namespace-endpoint.js");
/* harmony import */ var _middlewares_http_v1__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./middlewares/http-v1 */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/http-v1.js");
/* harmony import */ var _middlewares_user_locale__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./middlewares/user-locale */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/user-locale.js");
/* harmony import */ var _middlewares_media_upload__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./middlewares/media-upload */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/media-upload.js");
/* harmony import */ var _middlewares_theme_preview__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./middlewares/theme-preview */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/theme-preview.js");
/* harmony import */ var _utils_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/response */ "./node_modules/@wordpress/api-fetch/build-module/utils/response.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */











/**
 * Default set of header values which should be sent with every request unless
 * explicitly provided through apiFetch options.
 *
 * @type {Record<string, string>}
 */
const DEFAULT_HEADERS = {
  // The backend uses the Accept header as a condition for considering an
  // incoming request as a REST request.
  //
  // See: https://core.trac.wordpress.org/ticket/44534
  Accept: 'application/json, */*;q=0.1'
};

/**
 * Default set of fetch option values which should be sent with every request
 * unless explicitly provided through apiFetch options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  credentials: 'include'
};

/** @typedef {import('./types').APIFetchMiddleware} APIFetchMiddleware */
/** @typedef {import('./types').APIFetchOptions} APIFetchOptions */

/**
 * @type {import('./types').APIFetchMiddleware[]}
 */
const middlewares = [_middlewares_user_locale__WEBPACK_IMPORTED_MODULE_7__["default"], _middlewares_namespace_endpoint__WEBPACK_IMPORTED_MODULE_5__["default"], _middlewares_http_v1__WEBPACK_IMPORTED_MODULE_6__["default"], _middlewares_fetch_all_middleware__WEBPACK_IMPORTED_MODULE_4__["default"]];

/**
 * Register a middleware
 *
 * @param {import('./types').APIFetchMiddleware} middleware
 */
function registerMiddleware(middleware) {
  middlewares.unshift(middleware);
}

/**
 * Checks the status of a response, throwing the Response as an error if
 * it is outside the 200 range.
 *
 * @param {Response} response
 * @return {Response} The response if the status is in the 200 range.
 */
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw response;
};

/** @typedef {(options: import('./types').APIFetchOptions) => Promise<any>} FetchHandler*/

/**
 * @type {FetchHandler}
 */
const defaultFetchHandler = nextOptions => {
  const {
    url,
    path,
    data,
    parse = true,
    ...remainingOptions
  } = nextOptions;
  let {
    body,
    headers
  } = nextOptions;

  // Merge explicitly-provided headers with default values.
  headers = {
    ...DEFAULT_HEADERS,
    ...headers
  };

  // The `data` property is a shorthand for sending a JSON body.
  if (data) {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }
  const responsePromise = window.fetch(
  // Fall back to explicitly passing `window.location` which is the behavior if `undefined` is passed.
  url || path || window.location.href, {
    ...DEFAULT_OPTIONS,
    ...remainingOptions,
    body,
    headers
  });
  return responsePromise.then(value => Promise.resolve(value).then(checkStatus).catch(response => (0,_utils_response__WEBPACK_IMPORTED_MODULE_10__.parseAndThrowError)(response, parse)).then(response => (0,_utils_response__WEBPACK_IMPORTED_MODULE_10__.parseResponseAndNormalizeError)(response, parse)), err => {
    // Re-throw AbortError for the users to handle it themselves.
    if (err && err.name === 'AbortError') {
      throw err;
    }

    // Otherwise, there is most likely no network connection.
    // Unfortunately the message might depend on the browser.
    throw {
      code: 'fetch_error',
      message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('You are probably offline.')
    };
  });
};

/** @type {FetchHandler} */
let fetchHandler = defaultFetchHandler;

/**
 * Defines a custom fetch handler for making the requests that will override
 * the default one using window.fetch
 *
 * @param {FetchHandler} newFetchHandler The new fetch handler
 */
function setFetchHandler(newFetchHandler) {
  fetchHandler = newFetchHandler;
}

/**
 * @template T
 * @param {import('./types').APIFetchOptions} options
 * @return {Promise<T>} A promise representing the request processed via the registered middlewares.
 */
function apiFetch(options) {
  // creates a nested function chain that calls all middlewares and finally the `fetchHandler`,
  // converting `middlewares = [ m1, m2, m3 ]` into:
  // ```
  // opts1 => m1( opts1, opts2 => m2( opts2, opts3 => m3( opts3, fetchHandler ) ) );
  // ```
  const enhancedHandler = middlewares.reduceRight(( /** @type {FetchHandler} */next, middleware) => {
    return workingOptions => middleware(workingOptions, next);
  }, fetchHandler);
  return enhancedHandler(options).catch(error => {
    if (error.code !== 'rest_cookie_invalid_nonce') {
      return Promise.reject(error);
    }

    // If the nonce is invalid, refresh it and try again.
    return window
    // @ts-ignore
    .fetch(apiFetch.nonceEndpoint).then(checkStatus).then(data => data.text()).then(text => {
      // @ts-ignore
      apiFetch.nonceMiddleware.nonce = text;
      return apiFetch(options);
    });
  });
}
apiFetch.use = registerMiddleware;
apiFetch.setFetchHandler = setFetchHandler;
apiFetch.createNonceMiddleware = _middlewares_nonce__WEBPACK_IMPORTED_MODULE_1__["default"];
apiFetch.createPreloadingMiddleware = _middlewares_preloading__WEBPACK_IMPORTED_MODULE_3__["default"];
apiFetch.createRootURLMiddleware = _middlewares_root_url__WEBPACK_IMPORTED_MODULE_2__["default"];
apiFetch.fetchAllMiddleware = _middlewares_fetch_all_middleware__WEBPACK_IMPORTED_MODULE_4__["default"];
apiFetch.mediaUploadMiddleware = _middlewares_media_upload__WEBPACK_IMPORTED_MODULE_8__["default"];
apiFetch.createThemePreviewMiddleware = _middlewares_theme_preview__WEBPACK_IMPORTED_MODULE_9__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apiFetch);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/fetch-all-middleware.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/fetch-all-middleware.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! .. */ "./node_modules/@wordpress/api-fetch/build-module/index.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


/**
 * Apply query arguments to both URL and Path, whichever is present.
 *
 * @param {import('../types').APIFetchOptions} props
 * @param {Record<string, string | number>}    queryArgs
 * @return {import('../types').APIFetchOptions} The request with the modified query args
 */
const modifyQuery = ({
  path,
  url,
  ...options
}, queryArgs) => ({
  ...options,
  url: url && (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(url, queryArgs),
  path: path && (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(path, queryArgs)
});

/**
 * Duplicates parsing functionality from apiFetch.
 *
 * @param {Response} response
 * @return {Promise<any>} Parsed response json.
 */
const parseResponse = response => response.json ? response.json() : Promise.reject(response);

/**
 * @param {string | null} linkHeader
 * @return {{ next?: string }} The parsed link header.
 */
const parseLinkHeader = linkHeader => {
  if (!linkHeader) {
    return {};
  }
  const match = linkHeader.match(/<([^>]+)>; rel="next"/);
  return match ? {
    next: match[1]
  } : {};
};

/**
 * @param {Response} response
 * @return {string | undefined} The next page URL.
 */
const getNextPageUrl = response => {
  const {
    next
  } = parseLinkHeader(response.headers.get('link'));
  return next;
};

/**
 * @param {import('../types').APIFetchOptions} options
 * @return {boolean} True if the request contains an unbounded query.
 */
const requestContainsUnboundedQuery = options => {
  const pathIsUnbounded = !!options.path && options.path.indexOf('per_page=-1') !== -1;
  const urlIsUnbounded = !!options.url && options.url.indexOf('per_page=-1') !== -1;
  return pathIsUnbounded || urlIsUnbounded;
};

/**
 * The REST API enforces an upper limit on the per_page option. To handle large
 * collections, apiFetch consumers can pass `per_page=-1`; this middleware will
 * then recursively assemble a full response array from all available pages.
 *
 * @type {import('../types').APIFetchMiddleware}
 */
const fetchAllMiddleware = async (options, next) => {
  if (options.parse === false) {
    // If a consumer has opted out of parsing, do not apply middleware.
    return next(options);
  }
  if (!requestContainsUnboundedQuery(options)) {
    // If neither url nor path is requesting all items, do not apply middleware.
    return next(options);
  }

  // Retrieve requested page of results.
  const response = await (0,___WEBPACK_IMPORTED_MODULE_1__["default"])({
    ...modifyQuery(options, {
      per_page: 100
    }),
    // Ensure headers are returned for page 1.
    parse: false
  });
  const results = await parseResponse(response);
  if (!Array.isArray(results)) {
    // We have no reliable way of merging non-array results.
    return results;
  }
  let nextPage = getNextPageUrl(response);
  if (!nextPage) {
    // There are no further pages to request.
    return results;
  }

  // Iteratively fetch all remaining pages until no "next" header is found.
  let mergedResults = /** @type {any[]} */[].concat(results);
  while (nextPage) {
    const nextResponse = await (0,___WEBPACK_IMPORTED_MODULE_1__["default"])({
      ...options,
      // Ensure the URL for the next page is used instead of any provided path.
      path: undefined,
      url: nextPage,
      // Ensure we still get headers so we can identify the next page.
      parse: false
    });
    const nextResults = await parseResponse(nextResponse);
    mergedResults = mergedResults.concat(nextResults);
    nextPage = getNextPageUrl(nextResponse);
  }
  return mergedResults;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchAllMiddleware);
//# sourceMappingURL=fetch-all-middleware.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/http-v1.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/http-v1.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Set of HTTP methods which are eligible to be overridden.
 *
 * @type {Set<string>}
 */
const OVERRIDE_METHODS = new Set(['PATCH', 'PUT', 'DELETE']);

/**
 * Default request method.
 *
 * "A request has an associated method (a method). Unless stated otherwise it
 * is `GET`."
 *
 * @see  https://fetch.spec.whatwg.org/#requests
 *
 * @type {string}
 */
const DEFAULT_METHOD = 'GET';

/**
 * API Fetch middleware which overrides the request method for HTTP v1
 * compatibility leveraging the REST API X-HTTP-Method-Override header.
 *
 * @type {import('../types').APIFetchMiddleware}
 */
const httpV1Middleware = (options, next) => {
  const {
    method = DEFAULT_METHOD
  } = options;
  if (OVERRIDE_METHODS.has(method.toUpperCase())) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        'X-HTTP-Method-Override': method,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    };
  }
  return next(options);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (httpV1Middleware);
//# sourceMappingURL=http-v1.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/media-upload.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/media-upload.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_response__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/response */ "./node_modules/@wordpress/api-fetch/build-module/utils/response.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


/**
 * @param {import('../types').APIFetchOptions} options
 * @return {boolean} True if the request is for media upload.
 */
function isMediaUploadRequest(options) {
  const isCreateMethod = !!options.method && options.method === 'POST';
  const isMediaEndpoint = !!options.path && options.path.indexOf('/wp/v2/media') !== -1 || !!options.url && options.url.indexOf('/wp/v2/media') !== -1;
  return isMediaEndpoint && isCreateMethod;
}

/**
 * Middleware handling media upload failures and retries.
 *
 * @type {import('../types').APIFetchMiddleware}
 */
const mediaUploadMiddleware = (options, next) => {
  if (!isMediaUploadRequest(options)) {
    return next(options);
  }
  let retries = 0;
  const maxRetries = 5;

  /**
   * @param {string} attachmentId
   * @return {Promise<any>} Processed post response.
   */
  const postProcess = attachmentId => {
    retries++;
    return next({
      path: `/wp/v2/media/${attachmentId}/post-process`,
      method: 'POST',
      data: {
        action: 'create-image-subsizes'
      },
      parse: false
    }).catch(() => {
      if (retries < maxRetries) {
        return postProcess(attachmentId);
      }
      next({
        path: `/wp/v2/media/${attachmentId}?force=true`,
        method: 'DELETE'
      });
      return Promise.reject();
    });
  };
  return next({
    ...options,
    parse: false
  }).catch(response => {
    const attachmentId = response.headers.get('x-wp-upload-attachment-id');
    if (response.status >= 500 && response.status < 600 && attachmentId) {
      return postProcess(attachmentId).catch(() => {
        if (options.parse !== false) {
          return Promise.reject({
            code: 'post_process',
            message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Media upload failed. If this is a photo or a large image, please scale it down and try again.')
          });
        }
        return Promise.reject(response);
      });
    }
    return (0,_utils_response__WEBPACK_IMPORTED_MODULE_1__.parseAndThrowError)(response, options.parse);
  }).then(response => (0,_utils_response__WEBPACK_IMPORTED_MODULE_1__.parseResponseAndNormalizeError)(response, options.parse));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mediaUploadMiddleware);
//# sourceMappingURL=media-upload.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/namespace-endpoint.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/namespace-endpoint.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @type {import('../types').APIFetchMiddleware}
 */
const namespaceAndEndpointMiddleware = (options, next) => {
  let path = options.path;
  let namespaceTrimmed, endpointTrimmed;
  if (typeof options.namespace === 'string' && typeof options.endpoint === 'string') {
    namespaceTrimmed = options.namespace.replace(/^\/|\/$/g, '');
    endpointTrimmed = options.endpoint.replace(/^\//, '');
    if (endpointTrimmed) {
      path = namespaceTrimmed + '/' + endpointTrimmed;
    } else {
      path = namespaceTrimmed;
    }
  }
  delete options.namespace;
  delete options.endpoint;
  return next({
    ...options,
    path
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (namespaceAndEndpointMiddleware);
//# sourceMappingURL=namespace-endpoint.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/nonce.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/nonce.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @param {string} nonce
 * @return {import('../types').APIFetchMiddleware & { nonce: string }} A middleware to enhance a request with a nonce.
 */
function createNonceMiddleware(nonce) {
  /**
   * @type {import('../types').APIFetchMiddleware & { nonce: string }}
   */
  const middleware = (options, next) => {
    const {
      headers = {}
    } = options;

    // If an 'X-WP-Nonce' header (or any case-insensitive variation
    // thereof) was specified, no need to add a nonce header.
    for (const headerName in headers) {
      if (headerName.toLowerCase() === 'x-wp-nonce' && headers[headerName] === middleware.nonce) {
        return next(options);
      }
    }
    return next({
      ...options,
      headers: {
        ...headers,
        'X-WP-Nonce': middleware.nonce
      }
    });
  };
  middleware.nonce = nonce;
  return middleware;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createNonceMiddleware);
//# sourceMappingURL=nonce.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/preloading.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/preloading.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * @param {Record<string, any>} preloadedData
 * @return {import('../types').APIFetchMiddleware} Preloading middleware.
 */
function createPreloadingMiddleware(preloadedData) {
  const cache = Object.fromEntries(Object.entries(preloadedData).map(([path, data]) => [(0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.normalizePath)(path), data]));
  return (options, next) => {
    const {
      parse = true
    } = options;
    /** @type {string | void} */
    let rawPath = options.path;
    if (!rawPath && options.url) {
      const {
        rest_route: pathFromQuery,
        ...queryArgs
      } = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.getQueryArgs)(options.url);
      if (typeof pathFromQuery === 'string') {
        rawPath = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(pathFromQuery, queryArgs);
      }
    }
    if (typeof rawPath !== 'string') {
      return next(options);
    }
    const method = options.method || 'GET';
    const path = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.normalizePath)(rawPath);
    if ('GET' === method && cache[path]) {
      const cacheData = cache[path];

      // Unsetting the cache key ensures that the data is only used a single time.
      delete cache[path];
      return prepareResponse(cacheData, !!parse);
    } else if ('OPTIONS' === method && cache[method] && cache[method][path]) {
      const cacheData = cache[method][path];

      // Unsetting the cache key ensures that the data is only used a single time.
      delete cache[method][path];
      return prepareResponse(cacheData, !!parse);
    }
    return next(options);
  };
}

/**
 * This is a helper function that sends a success response.
 *
 * @param {Record<string, any>} responseData
 * @param {boolean}             parse
 * @return {Promise<any>} Promise with the response.
 */
function prepareResponse(responseData, parse) {
  return Promise.resolve(parse ? responseData.body : new window.Response(JSON.stringify(responseData.body), {
    status: 200,
    statusText: 'OK',
    headers: responseData.headers
  }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createPreloadingMiddleware);
//# sourceMappingURL=preloading.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/root-url.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/root-url.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespace_endpoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./namespace-endpoint */ "./node_modules/@wordpress/api-fetch/build-module/middlewares/namespace-endpoint.js");
/**
 * Internal dependencies
 */


/**
 * @param {string} rootURL
 * @return {import('../types').APIFetchMiddleware} Root URL middleware.
 */
const createRootURLMiddleware = rootURL => (options, next) => {
  return (0,_namespace_endpoint__WEBPACK_IMPORTED_MODULE_0__["default"])(options, optionsWithPath => {
    let url = optionsWithPath.url;
    let path = optionsWithPath.path;
    let apiRoot;
    if (typeof path === 'string') {
      apiRoot = rootURL;
      if (-1 !== rootURL.indexOf('?')) {
        path = path.replace('?', '&');
      }
      path = path.replace(/^\//, '');

      // API root may already include query parameter prefix if site is
      // configured to use plain permalinks.
      if ('string' === typeof apiRoot && -1 !== apiRoot.indexOf('?')) {
        path = path.replace('?', '&');
      }
      url = apiRoot + path;
    }
    return next({
      ...optionsWithPath,
      url
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createRootURLMiddleware);
//# sourceMappingURL=root-url.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/theme-preview.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/theme-preview.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * This appends a `wp_theme_preview` parameter to the REST API request URL if
 * the admin URL contains a `theme` GET parameter.
 *
 * If the REST API request URL has contained the `wp_theme_preview` parameter as `''`,
 * then bypass this middleware.
 *
 * @param {Record<string, any>} themePath
 * @return {import('../types').APIFetchMiddleware} Preloading middleware.
 */
const createThemePreviewMiddleware = themePath => (options, next) => {
  if (typeof options.url === 'string') {
    const wpThemePreview = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.getQueryArg)(options.url, 'wp_theme_preview');
    if (wpThemePreview === undefined) {
      options.url = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(options.url, {
        wp_theme_preview: themePath
      });
    } else if (wpThemePreview === '') {
      options.url = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.removeQueryArgs)(options.url, 'wp_theme_preview');
    }
  }
  if (typeof options.path === 'string') {
    const wpThemePreview = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.getQueryArg)(options.path, 'wp_theme_preview');
    if (wpThemePreview === undefined) {
      options.path = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(options.path, {
        wp_theme_preview: themePath
      });
    } else if (wpThemePreview === '') {
      options.path = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.removeQueryArgs)(options.path, 'wp_theme_preview');
    }
  }
  return next(options);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createThemePreviewMiddleware);
//# sourceMappingURL=theme-preview.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/middlewares/user-locale.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/middlewares/user-locale.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * @type {import('../types').APIFetchMiddleware}
 */
const userLocaleMiddleware = (options, next) => {
  if (typeof options.url === 'string' && !(0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.hasQueryArg)(options.url, '_locale')) {
    options.url = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(options.url, {
      _locale: 'user'
    });
  }
  if (typeof options.path === 'string' && !(0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.hasQueryArg)(options.path, '_locale')) {
    options.path = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(options.path, {
      _locale: 'user'
    });
  }
  return next(options);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (userLocaleMiddleware);
//# sourceMappingURL=user-locale.js.map

/***/ }),

/***/ "./node_modules/@wordpress/api-fetch/build-module/utils/response.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/api-fetch/build-module/utils/response.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseAndThrowError: () => (/* binding */ parseAndThrowError),
/* harmony export */   parseResponseAndNormalizeError: () => (/* binding */ parseResponseAndNormalizeError)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * Parses the apiFetch response.
 *
 * @param {Response} response
 * @param {boolean}  shouldParseResponse
 *
 * @return {Promise<any> | null | Response} Parsed response.
 */
const parseResponse = (response, shouldParseResponse = true) => {
  if (shouldParseResponse) {
    if (response.status === 204) {
      return null;
    }
    return response.json ? response.json() : Promise.reject(response);
  }
  return response;
};

/**
 * Calls the `json` function on the Response, throwing an error if the response
 * doesn't have a json function or if parsing the json itself fails.
 *
 * @param {Response} response
 * @return {Promise<any>} Parsed response.
 */
const parseJsonAndNormalizeError = response => {
  const invalidJsonError = {
    code: 'invalid_json',
    message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The response is not a valid JSON response.')
  };
  if (!response || !response.json) {
    throw invalidJsonError;
  }
  return response.json().catch(() => {
    throw invalidJsonError;
  });
};

/**
 * Parses the apiFetch response properly and normalize response errors.
 *
 * @param {Response} response
 * @param {boolean}  shouldParseResponse
 *
 * @return {Promise<any>} Parsed response.
 */
const parseResponseAndNormalizeError = (response, shouldParseResponse = true) => {
  return Promise.resolve(parseResponse(response, shouldParseResponse)).catch(res => parseAndThrowError(res, shouldParseResponse));
};

/**
 * Parses a response, throwing an error if parsing the response fails.
 *
 * @param {Response} response
 * @param {boolean}  shouldParseResponse
 * @return {Promise<any>} Parsed response.
 */
function parseAndThrowError(response, shouldParseResponse = true) {
  if (!shouldParseResponse) {
    throw response;
  }
  return parseJsonAndNormalizeError(response).then(error => {
    const unknownError = {
      code: 'unknown_error',
      message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('An unknown error occurred.')
    };
    throw error || unknownError;
  });
}
//# sourceMappingURL=response.js.map

/***/ }),

/***/ "./node_modules/@wordpress/data-controls/build-module/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/data-controls/build-module/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __unstableAwaitPromise: () => (/* binding */ __unstableAwaitPromise),
/* harmony export */   apiFetch: () => (/* binding */ apiFetch),
/* harmony export */   controls: () => (/* binding */ controls),
/* harmony export */   dispatch: () => (/* binding */ dispatch),
/* harmony export */   select: () => (/* binding */ select),
/* harmony export */   syncSelect: () => (/* binding */ syncSelect)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "./node_modules/@wordpress/api-fetch/build-module/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/deprecated */ "./node_modules/@wordpress/deprecated/build-module/index.js");
/**
 * WordPress dependencies
 */



/**
 * Dispatches a control action for triggering an api fetch call.
 *
 * @param {Object} request Arguments for the fetch request.
 *
 * @example
 * ```js
 * import { apiFetch } from '@wordpress/data-controls';
 *
 * // Action generator using apiFetch
 * export function* myAction() {
 * 	const path = '/v2/my-api/items';
 * 	const items = yield apiFetch( { path } );
 * 	// do something with the items.
 * }
 * ```
 *
 * @return {Object} The control descriptor.
 */
function apiFetch(request) {
  return {
    type: 'API_FETCH',
    request
  };
}

/**
 * Control for resolving a selector in a registered data store.
 * Alias for the `resolveSelect` built-in control in the `@wordpress/data` package.
 *
 * @param storeNameOrDescriptor The store object or identifier.
 * @param selectorName          The selector name.
 * @param args                  Arguments passed without change to the `@wordpress/data` control.
 */
function select(storeNameOrDescriptor, selectorName, ...args) {
  (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__["default"])('`select` control in `@wordpress/data-controls`', {
    since: '5.7',
    alternative: 'built-in `resolveSelect` control in `@wordpress/data`'
  });
  return _wordpress_data__WEBPACK_IMPORTED_MODULE_1__.controls.resolveSelect(storeNameOrDescriptor, selectorName, ...args);
}

/**
 * Control for calling a selector in a registered data store.
 * Alias for the `select` built-in control in the `@wordpress/data` package.
 *
 * @param storeNameOrDescriptor The store object or identifier.
 * @param selectorName          The selector name.
 * @param args                  Arguments passed without change to the `@wordpress/data` control.
 */
function syncSelect(storeNameOrDescriptor, selectorName, ...args) {
  (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__["default"])('`syncSelect` control in `@wordpress/data-controls`', {
    since: '5.7',
    alternative: 'built-in `select` control in `@wordpress/data`'
  });
  return _wordpress_data__WEBPACK_IMPORTED_MODULE_1__.controls.select(storeNameOrDescriptor, selectorName, ...args);
}

/**
 * Control for dispatching an action in a registered data store.
 * Alias for the `dispatch` control in the `@wordpress/data` package.
 *
 * @param storeNameOrDescriptor The store object or identifier.
 * @param actionName            The action name.
 * @param args                  Arguments passed without change to the `@wordpress/data` control.
 */
function dispatch(storeNameOrDescriptor, actionName, ...args) {
  (0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__["default"])('`dispatch` control in `@wordpress/data-controls`', {
    since: '5.7',
    alternative: 'built-in `dispatch` control in `@wordpress/data`'
  });
  return _wordpress_data__WEBPACK_IMPORTED_MODULE_1__.controls.dispatch(storeNameOrDescriptor, actionName, ...args);
}

/**
 * Dispatches a control action for awaiting on a promise to be resolved.
 *
 * @param {Object} promise Promise to wait for.
 *
 * @example
 * ```js
 * import { __unstableAwaitPromise } from '@wordpress/data-controls';
 *
 * // Action generator using apiFetch
 * export function* myAction() {
 * 	const promise = getItemsAsync();
 * 	const items = yield __unstableAwaitPromise( promise );
 * 	// do something with the items.
 * }
 * ```
 *
 * @return {Object} The control descriptor.
 */
const __unstableAwaitPromise = function (promise) {
  return {
    type: 'AWAIT_PROMISE',
    promise
  };
};

/**
 * The default export is what you use to register the controls with your custom
 * store.
 *
 * @example
 * ```js
 * // WordPress dependencies
 * import { controls } from '@wordpress/data-controls';
 * import { registerStore } from '@wordpress/data';
 *
 * // Internal dependencies
 * import reducer from './reducer';
 * import * as selectors from './selectors';
 * import * as actions from './actions';
 * import * as resolvers from './resolvers';
 *
 * registerStore( 'my-custom-store', {
 * reducer,
 * controls,
 * actions,
 * selectors,
 * resolvers,
 * } );
 * ```
 * @return {Object} An object for registering the default controls with the
 * store.
 */
const controls = {
  AWAIT_PROMISE: ({
    promise
  }) => promise,
  API_FETCH({
    request
  }) {
    return (0,_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__["default"])(request);
  }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/deprecated/build-module/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/deprecated/build-module/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ deprecated),
/* harmony export */   logged: () => (/* binding */ logged)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
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

/***/ "./assets/jsx/components/ButtonsPanel.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/ButtonsPanel.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ButtonsPanel: () => (/* binding */ ButtonsPanel)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var ButtonsPanel = function ButtonsPanel(props) {
  return /*#__PURE__*/React.createElement("div", null, props.children);
};

/***/ }),

/***/ "./assets/jsx/components/CheckboxControl.jsx":
/*!***************************************************!*\
  !*** ./assets/jsx/components/CheckboxControl.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CheckboxControl: () => (/* binding */ CheckboxControl)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _workflow_editor_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../workflow-editor/utils */ "./assets/jsx/workflow-editor/utils.jsx");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/*
 * Copyright (c) 2025, Ramble Ventures
 */



var CheckboxControl = function CheckboxControl(props) {
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(props.checked || false),
    _useState2 = _slicedToArray(_useState, 2),
    checked = _useState2[0],
    setChecked = _useState2[1];
  var description;
  if (props.unescapedDescription) {
    // If using this option, the HTML has to be escaped before injected into the JS interface.
    description = /*#__PURE__*/React.createElement("p", {
      className: "description",
      dangerouslySetInnerHTML: {
        __html: (0,_workflow_editor_utils__WEBPACK_IMPORTED_MODULE_2__.stripTags)(props.description)
      }
    });
  } else {
    description = /*#__PURE__*/React.createElement("p", {
      className: "description"
    }, props.description);
  }
  var onChange = function onChange(value) {
    setChecked(value);
    if (props.onChange) {
      props.onChange(value);
    }
  };
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
    label: props.label,
    name: props.name,
    id: props.name,
    className: props.className,
    checked: checked || false,
    onChange: onChange
  }), description);
};

/***/ }),

/***/ "./assets/jsx/components/DateOffsetPreview.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/DateOffsetPreview.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateOffsetPreview: () => (/* binding */ DateOffsetPreview),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



var _wp = wp,
  apiFetch = _wp.apiFetch;
__webpack_require__(/*! ./css/dateOffsetPreview.css */ "./assets/jsx/components/css/dateOffsetPreview.css");
var DateOffsetPreview = function DateOffsetPreview(_ref) {
  var offset = _ref.offset,
    label = _ref.label,
    labelDatePreview = _ref.labelDatePreview,
    labelOffsetPreview = _ref.labelOffsetPreview,
    setValidationErrorCallback = _ref.setValidationErrorCallback,
    setHasPendingValidationCallback = _ref.setHasPendingValidationCallback,
    setHasValidDataCallback = _ref.setHasValidDataCallback,
    _ref$compactView = _ref.compactView,
    compactView = _ref$compactView === void 0 ? false : _ref$compactView;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    offsetPreview = _useState2[0],
    setOffsetPreview = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(),
    _useState4 = _slicedToArray(_useState3, 2),
    currentTime = _useState4[0],
    setCurrentTime = _useState4[1];
  var apiRequestControllerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(new AbortController());
  var validateDateOffset = function validateDateOffset() {
    if (offset) {
      var controller = apiRequestControllerRef.current;
      if (controller) {
        controller.abort();
      }
      apiRequestControllerRef.current = new AbortController();
      var signal = apiRequestControllerRef.current.signal;
      setHasPendingValidationCallback(true);
      apiFetch({
        path: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.addQueryArgs)("publishpress-future/v1/settings/validate-expire-offset"),
        method: 'POST',
        data: {
          offset: offset
        },
        signal: signal
      }).then(function (result) {
        setHasPendingValidationCallback(false);
        setHasValidDataCallback(result.isValid);
        setValidationErrorCallback(result.message);
        if (result.isValid) {
          setOffsetPreview(result.calculatedTime);
          setCurrentTime(result.currentTime);
        } else {
          setOffsetPreview('');
        }
      }).catch(function (error) {
        if (error.name === 'AbortError') {
          return;
        }
        setHasPendingValidationCallback(false);
        setHasValidDataCallback(false);
        setValidationErrorCallback(error.message);
        setOffsetPreview('');
      });
    }
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    validateDateOffset();
  }, [offset]);
  var compactClass = compactView ? ' compact' : '';
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, offset && /*#__PURE__*/React.createElement("div", {
    className: 'publishpress-future-date-preview' + compactClass
  }, /*#__PURE__*/React.createElement("h4", null, label), /*#__PURE__*/React.createElement("div", {
    className: "publishpress-future-date-preview-body"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "publishpress-future-date-preview-label"
  }, labelDatePreview, ": "), /*#__PURE__*/React.createElement("span", {
    className: "publishpress-future-date-preview-value"
  }, currentTime)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "publishpress-future-date-preview-label"
  }, labelOffsetPreview, ": "), /*#__PURE__*/React.createElement("span", {
    className: "publishpress-future-date-preview-value"
  }, offsetPreview)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateOffsetPreview);

/***/ }),

/***/ "./assets/jsx/components/DateTimePicker.jsx":
/*!**************************************************!*\
  !*** ./assets/jsx/components/DateTimePicker.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateTimePicker: () => (/* binding */ DateTimePicker)
/* harmony export */ });
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../time */ "./assets/jsx/time.jsx");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);


var DateTimePicker = function DateTimePicker(_ref) {
  var currentDate = _ref.currentDate,
    onChange = _ref.onChange,
    is12Hour = _ref.is12Hour,
    startOfWeek = _ref.startOfWeek;
  if (typeof currentDate === 'number') {
    currentDate = (0,_time__WEBPACK_IMPORTED_MODULE_0__.normalizeUnixTimeToMilliseconds)(currentDate);
  }
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.DateTimePicker, {
    currentDate: currentDate,
    onChange: onChange,
    __nextRemoveHelpButton: true,
    is12Hour: is12Hour,
    startOfWeek: startOfWeek
  });
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanel.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanel.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanel: () => (/* binding */ FutureActionPanel)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./assets/jsx/utils.jsx");
/* harmony import */ var _ToggleCalendarDatePicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ToggleCalendarDatePicker */ "./assets/jsx/components/ToggleCalendarDatePicker.jsx");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _FutureActionPanelAfterActionField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FutureActionPanelAfterActionField */ "./assets/jsx/components/FutureActionPanelAfterActionField.jsx");
/* harmony import */ var _FutureActionPanelTop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FutureActionPanelTop */ "./assets/jsx/components/FutureActionPanelTop.jsx");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }






var _wp$components = wp.components,
  PanelRow = _wp$components.PanelRow,
  CheckboxControl = _wp$components.CheckboxControl,
  SelectControl = _wp$components.SelectControl,
  FormTokenField = _wp$components.FormTokenField,
  Spinner = _wp$components.Spinner,
  BaseControl = _wp$components.BaseControl;
var _wp$element = wp.element,
  Fragment = _wp$element.Fragment,
  useEffect = _wp$element.useEffect,
  useState = _wp$element.useState;
var decodeEntities = wp.htmlEntities.decodeEntities;
var addQueryArgs = wp.url.addQueryArgs;
var _wp$data = wp.data,
  useSelect = _wp$data.useSelect,
  useDispatch = _wp$data.useDispatch;
var _wp = wp,
  apiFetch = _wp.apiFetch;
var FutureActionPanel = function FutureActionPanel(props) {
  var _useSelect = useSelect(function (select) {
      return {
        action: select(props.storeName).getAction(),
        date: select(props.storeName).getDate(),
        enabled: select(props.storeName).getEnabled(),
        terms: select(props.storeName).getTerms(),
        taxonomy: select(props.storeName).getTaxonomy(),
        taxonomyName: select(props.storeName).getTaxonomyName(),
        termsListByName: select(props.storeName).getTermsListByName(),
        termsListById: select(props.storeName).getTermsListById(),
        isFetchingTerms: select(props.storeName).getIsFetchingTerms(),
        calendarIsVisible: select(props.storeName).getCalendarIsVisible(),
        hasValidData: select(props.storeName).getHasValidData(),
        newStatus: select(props.storeName).getNewStatus()
      };
    }),
    action = _useSelect.action,
    date = _useSelect.date,
    enabled = _useSelect.enabled,
    terms = _useSelect.terms,
    taxonomy = _useSelect.taxonomy,
    taxonomyName = _useSelect.taxonomyName,
    termsListByName = _useSelect.termsListByName,
    termsListById = _useSelect.termsListById,
    isFetchingTerms = _useSelect.isFetchingTerms,
    calendarIsVisible = _useSelect.calendarIsVisible,
    hasValidData = _useSelect.hasValidData,
    newStatus = _useSelect.newStatus;
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    validationError = _useState2[0],
    setValidationError = _useState2[1];
  var _useDispatch = useDispatch(props.storeName),
    setAction = _useDispatch.setAction,
    setDate = _useDispatch.setDate,
    setEnabled = _useDispatch.setEnabled,
    setTerms = _useDispatch.setTerms,
    setTaxonomy = _useDispatch.setTaxonomy,
    setTermsListByName = _useDispatch.setTermsListByName,
    setTermsListById = _useDispatch.setTermsListById,
    setTaxonomyName = _useDispatch.setTaxonomyName,
    setIsFetchingTerms = _useDispatch.setIsFetchingTerms,
    setCalendarIsVisible = _useDispatch.setCalendarIsVisible,
    setHasValidData = _useDispatch.setHasValidData,
    setNewStatus = _useDispatch.setNewStatus;
  var mapTermsListById = function mapTermsListById(terms) {
    if (_typeof(terms) !== 'object' || terms === null) {
      return {};
    }
    return terms.map(function (term) {
      return termsListById[term];
    });
  };
  var insertTerm = function insertTerm(term) {
    termsListByName[term] = {
      id: term,
      count: 0,
      description: "",
      link: "",
      name: term,
      slug: term,
      taxonomy: taxonomy
    };
    termsListById[term] = term;
    setTermsListByName(termsListByName);
    setTermsListById(termsListById);
    setTerms([].concat(_toConsumableArray(terms), [term]));
  };
  var mapTermsListByName = function mapTermsListByName(terms) {
    if (_typeof(terms) !== 'object' || terms === null) {
      return {};
    }
    return terms.map(function (term) {
      if (termsListByName[term]) {
        return termsListByName[term].id;
      }
      insertTerm(term);
      return term;
    });
  };
  var callOnChangeData = function callOnChangeData(attribute, value) {
    if (typeof props.onChangeData === 'function') {
      props.onChangeData(attribute, value);
    }
  };
  var handleEnabledChange = function handleEnabledChange(isChecked) {
    setEnabled(isChecked);
    if (isChecked) {
      setAction(props.action);
      setDate(props.date);
      setNewStatus(props.newStatus);
      setTerms(props.terms);
      setTaxonomy(props.taxonomy);
      fetchTerms();
    }
    callOnChangeData('enabled', isChecked);
  };
  var handleActionChange = function handleActionChange(value) {
    setAction(value);
    callOnChangeData('action', value);
  };
  var handleNewStatusChange = function handleNewStatusChange(value) {
    setNewStatus(value);
    callOnChangeData('newStatus', value);
  };
  var handleDateChange = function handleDateChange(value) {
    setDate(value);
    callOnChangeData('date', value);
  };
  var handleTermsChange = function handleTermsChange(value) {
    value = mapTermsListByName(value);
    setTerms(value);
    callOnChangeData('terms', value);
  };
  var fetchTerms = function fetchTerms() {
    var termsListByName = {};
    var termsListById = {};
    if (!taxonomy) {
      return;
    }
    setIsFetchingTerms(true);
    apiFetch({
      path: addQueryArgs("publishpress-future/v1/terms/".concat(taxonomy))
    }).then(function (result) {
      result.terms.forEach(function (term) {
        termsListByName[decodeEntities(term.name)] = term;
        termsListById[term.id] = decodeEntities(term.name);
      });
      setTermsListByName(termsListByName);
      setTermsListById(termsListById);
      setTaxonomyName(decodeEntities(result.taxonomyName));
      setIsFetchingTerms(false);
    });
  };
  var storeCalendarIsVisibleOnStorage = function storeCalendarIsVisibleOnStorage(value) {
    localStorage.setItem('FUTURE_ACTION_CALENDAR_IS_VISIBLE_' + props.context, value ? '1' : '0');
  };
  var getCalendarIsVisibleFromStorage = function getCalendarIsVisibleFromStorage() {
    return localStorage.getItem('FUTURE_ACTION_CALENDAR_IS_VISIBLE_' + props.context);
  };
  useEffect(function () {
    if (props.autoEnableAndHideCheckbox) {
      setEnabled(true);
    } else {
      setEnabled(props.enabled);
    }
    setAction(props.action);
    setNewStatus(props.newStatus);
    setDate(props.date);
    setTerms(props.terms);
    setTaxonomy(props.taxonomy);
    if (getCalendarIsVisibleFromStorage() === null) {
      setCalendarIsVisible(props.calendarIsVisible);
    } else {
      setCalendarIsVisible(getCalendarIsVisibleFromStorage() === '1' && !props.hideCalendarByDefault);
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
  useEffect(function () {
    storeCalendarIsVisibleOnStorage(calendarIsVisible);
  }, [calendarIsVisible]);
  useEffect(function () {
    if (hasValidData && props.onDataIsValid) {
      props.onDataIsValid();
    }
    if (!hasValidData && props.onDataIsInvalid) {
      props.onDataIsInvalid();
    }
  }, [hasValidData]);
  var selectedTerms = [];
  if (terms && terms.length > 0 && termsListById) {
    selectedTerms = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.compact)(mapTermsListById(terms));
    if (typeof selectedTerms === 'string') {
      selectedTerms = [];
    }
  }
  var termsListByNameKeys = [];
  if (_typeof(termsListByName) === 'object' && termsListByName !== null) {
    termsListByNameKeys = Object.keys(termsListByName);
  }
  var panelClass = calendarIsVisible ? 'future-action-panel' : 'future-action-panel hidden-calendar';
  var contentPanelClass = calendarIsVisible ? 'future-action-panel-content' : 'future-action-panel-content hidden-calendar';
  var datePanelClass = calendarIsVisible ? 'future-action-date-panel' : 'future-action-date-panel hidden-calendar';
  var is24hour;
  if (props.timeFormat === 'inherited') {
    is24hour = !props.is12Hour;
  } else {
    is24hour = props.timeFormat === '24h';
  }
  var replaceCurlyBracketsWithLink = function replaceCurlyBracketsWithLink(string, href, target) {
    var parts = string.split('{');
    var result = [];
    result.push(parts.shift());
    var _iterator = _createForOfIteratorHelper(parts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var part = _step.value;
        var _part$split = part.split('}'),
          _part$split2 = _slicedToArray(_part$split, 2),
          before = _part$split2[0],
          after = _part$split2[1];
        result.push( /*#__PURE__*/React.createElement("a", {
          href: href,
          target: target,
          key: href
        }, before));
        result.push(after);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return result;
  };

  // Remove items from actions list if related to taxonomies and there is no taxonmoy for the post type
  var actionsSelectOptions = props.actionsSelectOptions;
  if (!props.taxonomy) {
    actionsSelectOptions = props.actionsSelectOptions.filter(function (item) {
      return ['category', 'category-add', 'category-remove', 'category-remove-all'].indexOf(item.value) === -1;
    });
  }
  var HelpText = replaceCurlyBracketsWithLink(props.strings.timezoneSettingsHelp, '/wp-admin/options-general.php#timezone_string', '_blank');
  var displayTaxonomyField = String(action).includes('category') && action !== 'category-remove-all';
  var termsFieldLabel = taxonomyName;
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
  var validateData = function validateData() {
    var valid = true;
    if (!enabled) {
      setValidationError('');
      return true;
    }
    if (!action) {
      setValidationError(props.strings.errorActionRequired);
      valid = false;
    }
    if (!date) {
      setValidationError(props.strings.errorDateRequired);
      valid = false;
    }

    // Check if the date is in the past
    if (date && new Date(date) < new Date()) {
      setValidationError(props.strings.errorDateInPast);
      valid = false;
    }
    var isTermRequired = ['category', 'category-add', 'category-remove'].includes(action);
    var noTermIsSelected = terms.length === 0 || terms.length === 1 && (terms[0] === '' || terms[0] === '0');
    if (isTermRequired && noTermIsSelected) {
      setValidationError(props.strings.errorTermsRequired);
      valid = false;
    }
    if (valid) {
      setValidationError('');
    }
    return valid;
  };
  useEffect(function () {
    if (!enabled) {
      setHasValidData(true);
      setValidationError('');
      return;
    }
    setHasValidData(validateData());
  }, [action, date, enabled, terms, taxonomy]);

  // This adds a 'cancel' class to the input when the user clicks on the
  // field to prevent the form from being submitted. This is a workaround
  // for the issue on the quick-edit form where the form is submitted when
  // the user presses the 'Enter' key trying to add a term to the field.
  var forceIgnoreAutoSubmitOnEnter = function forceIgnoreAutoSubmitOnEnter(e) {
    jQuery(e.target).addClass('cancel');
  };
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SlotFillProvider, null, /*#__PURE__*/React.createElement("div", {
    className: panelClass
  }, props.autoEnableAndHideCheckbox && /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_enabled',
    value: 1
  }), props.showTitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      marginBottom: '10px'
    }
  }, props.strings.panelTitle), /*#__PURE__*/React.createElement(_FutureActionPanelTop__WEBPACK_IMPORTED_MODULE_5__.FutureActionPanelTop.Slot, {
    fillProps: {
      storeName: props.storeName
    }
  }), !props.autoEnableAndHideCheckbox && /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement(CheckboxControl, {
    label: props.strings.enablePostExpiration,
    checked: enabled || false,
    onChange: handleEnabledChange,
    className: "future-action-enable-checkbox"
  })), enabled && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(PanelRow, {
    className: contentPanelClass + ' future-action-full-width'
  }, /*#__PURE__*/React.createElement(SelectControl, {
    label: props.strings.action,
    value: action,
    options: actionsSelectOptions,
    onChange: handleActionChange,
    className: "future-action-select-action"
  })), /*#__PURE__*/React.createElement(_FutureActionPanelAfterActionField__WEBPACK_IMPORTED_MODULE_4__.FutureActionPanelAfterActionField.Slot, {
    fillProps: {
      storeName: props.storeName
    }
  }), action === 'change-status' && /*#__PURE__*/React.createElement(PanelRow, {
    className: "new-status"
  }, /*#__PURE__*/React.createElement(SelectControl, {
    label: props.strings.newStatus,
    options: props.statusesSelectOptions,
    value: newStatus,
    onChange: handleNewStatusChange,
    className: "future-action-select-new-status"
  })), displayTaxonomyField && (isFetchingTerms && /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement(BaseControl, {
    label: taxonomyName
  }, "".concat(props.strings.loading, " (").concat(taxonomyName, ")"), /*#__PURE__*/React.createElement(Spinner, null))) || !taxonomy && /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement(BaseControl, {
    label: taxonomyName,
    className: "future-action-warning"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "dashicons dashicons-warning"
  }), " ", props.strings.noTaxonomyFound))) || termsListByNameKeys.length === 0 && /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement(BaseControl, {
    label: taxonomyName,
    className: "future-action-warning"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "dashicons dashicons-warning"
  }), " ", props.strings.noTermsFound))) || /*#__PURE__*/React.createElement(PanelRow, {
    className: "future-action-full-width"
  }, /*#__PURE__*/React.createElement(BaseControl, null, /*#__PURE__*/React.createElement(FormTokenField, {
    label: termsFieldLabel,
    value: selectedTerms,
    suggestions: termsListByNameKeys,
    onChange: handleTermsChange,
    placeholder: props.strings.addTermsPlaceholder,
    className: "future-action-terms",
    maxSuggestions: 1000,
    onFocus: forceIgnoreAutoSubmitOnEnter,
    __experimentalExpandOnFocus: true,
    __experimentalAutoSelectFirstMatch: true
  })))), /*#__PURE__*/React.createElement(PanelRow, {
    className: datePanelClass
  }, /*#__PURE__*/React.createElement(_ToggleCalendarDatePicker__WEBPACK_IMPORTED_MODULE_1__.ToggleCalendarDatePicker, {
    currentDate: date,
    onChangeDate: handleDateChange,
    onToggleCalendar: function onToggleCalendar() {
      return setCalendarIsVisible(!calendarIsVisible);
    },
    is12Hour: !is24hour,
    startOfWeek: props.startOfWeek,
    isExpanded: calendarIsVisible,
    strings: props.strings
  })), /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement("div", {
    className: "future-action-help-text"
  }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("span", {
    className: "dashicons dashicons-info"
  }), " ", HelpText)), !hasValidData && /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement(BaseControl, {
    className: "notice notice-error"
  }, /*#__PURE__*/React.createElement("div", null, validationError))))), /*#__PURE__*/React.createElement(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_2__.PluginArea, {
    scope: "publishpress-future"
  }));
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelAfterActionField.jsx":
/*!*********************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelAfterActionField.jsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelAfterActionField: () => (/* binding */ FutureActionPanelAfterActionField),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var FutureActionPanelAfterActionField = function FutureActionPanelAfterActionField(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Fill, {
    name: "FutureActionPanelAfterActionField"
  }, children);
};
var FutureActionPanelAfterActionFieldSlot = function FutureActionPanelAfterActionFieldSlot(props) {
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Slot, _extends({
    name: "FutureActionPanelAfterActionField"
  }, props));
};
FutureActionPanelAfterActionField.Slot = FutureActionPanelAfterActionFieldSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FutureActionPanelAfterActionField);

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelBlockEditor.jsx":
/*!****************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelBlockEditor.jsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelBlockEditor: () => (/* binding */ FutureActionPanelBlockEditor)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _css_block_editor_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css/block-editor.css */ "./assets/jsx/components/css/block-editor.css");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


var FutureActionPanelBlockEditor = function FutureActionPanelBlockEditor(props) {
  var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;
  var _wp$data = wp.data,
    useDispatch = _wp$data.useDispatch,
    select = _wp$data.select;
  var _useDispatch = useDispatch('core/editor'),
    editPost = _useDispatch.editPost;
  var editPostAttribute = function editPostAttribute(newAttribute) {
    var attribute = {
      publishpress_future_action: {}
    };

    // For each property on newAttribute, set the value on attribute
    for (var _i = 0, _Object$entries = Object.entries(newAttribute); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        name = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      attribute.publishpress_future_action[name] = value;
    }
    editPost(attribute);
  };
  var onChangeData = function onChangeData(attribute, value) {
    var store = select(props.storeName);
    var newAttribute = {
      'enabled': store.getEnabled()
    };
    if (newAttribute.enabled) {
      newAttribute['action'] = store.getAction();
      newAttribute['newStatus'] = store.getNewStatus();
      newAttribute['date'] = store.getDate();
      newAttribute['terms'] = store.getTerms();
      newAttribute['taxonomy'] = store.getTaxonomy();
      newAttribute['extraData'] = store.getExtraData();
    }
    editPostAttribute(newAttribute);
  };
  var data = select('core/editor').getEditedPostAttribute('publishpress_future_action');
  var _useDispatch2 = useDispatch('core/editor'),
    lockPostSaving = _useDispatch2.lockPostSaving,
    unlockPostSaving = _useDispatch2.unlockPostSaving;
  var onDataIsValid = function onDataIsValid() {
    unlockPostSaving('future-action');
  };
  var onDataIsInvalid = function onDataIsInvalid() {
    lockPostSaving('future-action');
  };
  return /*#__PURE__*/React.createElement(PluginDocumentSettingPanel, {
    name: 'publishpress-future-action-panel',
    title: props.strings.panelTitle,
    initialOpen: props.postTypeDefaultConfig.autoEnable,
    className: 'post-expirator-panel'
  }, /*#__PURE__*/React.createElement("div", {
    id: "publishpress-future-block-editor"
  }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.FutureActionPanel, {
    context: 'block-editor',
    postType: props.postType,
    isCleanNewPost: props.isCleanNewPost,
    actionsSelectOptions: props.actionsSelectOptions,
    statusesSelectOptions: props.statusesSelectOptions,
    enabled: data.enabled,
    calendarIsVisible: true,
    action: data.action,
    newStatus: data.newStatus,
    date: data.date,
    terms: data.terms,
    taxonomy: data.taxonomy,
    taxonomyName: props.taxonomyName,
    onChangeData: onChangeData,
    is12Hour: props.is12Hour,
    timeFormat: props.timeFormat,
    startOfWeek: props.startOfWeek,
    storeName: props.storeName,
    strings: props.strings,
    onDataIsValid: onDataIsValid,
    hideCalendarByDefault: props.hideCalendarByDefault,
    showTitle: false,
    onDataIsInvalid: onDataIsInvalid
  })));
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelBulkEdit.jsx":
/*!*************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelBulkEdit.jsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelBulkEdit: () => (/* binding */ FutureActionPanelBulkEdit)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./assets/jsx/utils.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


var FutureActionPanelBulkEdit = function FutureActionPanelBulkEdit(props) {
  var _wp$data = wp.data,
    useSelect = _wp$data.useSelect,
    useDispatch = _wp$data.useDispatch,
    select = _wp$data.select;
  var useEffect = wp.element.useEffect;
  var onChangeData = function onChangeData(attribute, value) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getElementByName)('future_action_bulk_enabled').value = select(props.storeName).getEnabled() ? 1 : 0;
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getElementByName)('future_action_bulk_action').value = select(props.storeName).getAction();
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getElementByName)('future_action_bulk_new_status').value = select(props.storeName).getNewStatus();
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getElementByName)('future_action_bulk_date').value = select(props.storeName).getDate();
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getElementByName)('future_action_bulk_terms').value = select(props.storeName).getTerms().join(',');
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getElementByName)('future_action_bulk_taxonomy').value = select(props.storeName).getTaxonomy();
  };
  var date = useSelect(function (select) {
    return select(props.storeName).getDate();
  }, []);
  var enabled = useSelect(function (select) {
    return select(props.storeName).getEnabled();
  }, []);
  var action = useSelect(function (select) {
    return select(props.storeName).getAction();
  }, []);
  var newStatus = useSelect(function (select) {
    return select(props.storeName).getNewStatus();
  }, []);
  var terms = useSelect(function (select) {
    return select(props.storeName).getTerms();
  }, []);
  var taxonomy = useSelect(function (select) {
    return select(props.storeName).getTaxonomy();
  }, []);
  var changeAction = useSelect(function (select) {
    return select(props.storeName).getChangeAction();
  }, []);
  var hasValidData = useSelect(function (select) {
    return select(props.storeName).getHasValidData();
  }, []);
  var _useDispatch = useDispatch(props.storeName),
    setChangeAction = _useDispatch.setChangeAction;
  var termsString = terms;
  if (_typeof(terms) === 'object') {
    termsString = terms.join(',');
  }
  var handleStrategyChange = function handleStrategyChange(value) {
    setChangeAction(value);
  };
  var options = [{
    value: 'no-change',
    label: props.strings.noChange
  }, {
    value: 'change-add',
    label: props.strings.changeAdd
  }, {
    value: 'add-only',
    label: props.strings.addOnly
  }, {
    value: 'change-only',
    label: props.strings.changeOnly
  }, {
    value: 'remove-only',
    label: props.strings.removeOnly
  }];
  var optionsToDisplayPanel = ['change-add', 'add-only', 'change-only'];
  useEffect(function () {
    // We are not using onDataIsValid and onDataIsInvalid because we need to enable/disable the button
    // also based on the changeAction value.
    if (hasValidData || changeAction === 'no-change') {
      jQuery('#bulk_edit').prop('disabled', false);
    } else {
      jQuery('#bulk_edit').prop('disabled', true);
    }
  }, [hasValidData, changeAction]);
  return /*#__PURE__*/React.createElement("div", {
    className: 'post-expirator-panel'
  }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    label: props.strings.futureActionUpdate,
    name: 'future_action_bulk_change_action',
    value: changeAction,
    options: options,
    onChange: handleStrategyChange
  }), optionsToDisplayPanel.includes(changeAction) && /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.FutureActionPanel, {
    context: 'bulk-edit',
    autoEnableAndHideCheckbox: true,
    postType: props.postType,
    isCleanNewPost: props.isNewPost,
    actionsSelectOptions: props.actionsSelectOptions,
    statusesSelectOptions: props.statusesSelectOptions,
    enabled: true,
    calendarIsVisible: false,
    action: action,
    newStatus: newStatus,
    date: date,
    terms: terms,
    taxonomy: taxonomy,
    taxonomyName: props.taxonomyName,
    onChangeData: onChangeData,
    is12Hour: props.is12Hour,
    timeFormat: props.timeFormat,
    startOfWeek: props.startOfWeek,
    storeName: props.storeName,
    hideCalendarByDefault: props.hideCalendarByDefault,
    showTitle: false,
    strings: props.strings
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_enabled',
    value: enabled ? 1 : 0
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_action',
    value: action
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_new_status',
    value: newStatus
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_date',
    value: date
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_terms',
    value: termsString
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_taxonomy',
    value: taxonomy
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_bulk_view',
    value: "bulk-edit"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: '_future_action_nonce',
    value: props.nonce
  }));
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelClassicEditor.jsx":
/*!******************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelClassicEditor.jsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelClassicEditor: () => (/* binding */ FutureActionPanelClassicEditor)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);



var FutureActionPanelClassicEditor = function FutureActionPanelClassicEditor(props) {
  var browserTimezoneOffset = new Date().getTimezoneOffset();
  var getElementByName = function getElementByName(name) {
    return document.getElementsByName(name)[0];
  };
  var onChangeData = function onChangeData(attribute, value) {
    var store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(props.storeName);
    getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
    getElementByName('future_action_action').value = store.getAction();
    getElementByName('future_action_new_status').value = store.getNewStatus();
    getElementByName('future_action_date').value = store.getDate();
    getElementByName('future_action_terms').value = store.getTerms().join(',');
    getElementByName('future_action_taxonomy').value = store.getTaxonomy();
  };
  var getTermsFromElementByName = function getTermsFromElementByName(name) {
    var element = getElementByName(name);
    if (!element) {
      return [];
    }
    var terms = element.value.split(',');
    if (terms.length === 1 && terms[0] === '') {
      terms = [];
    }
    return terms.map(function (term) {
      return parseInt(term);
    });
  };
  var getElementValueByName = function getElementValueByName(name) {
    var element = getElementByName(name);
    if (!element) {
      return '';
    }
    return element.value;
  };
  var data = {
    enabled: getElementValueByName('future_action_enabled') === '1',
    action: getElementValueByName('future_action_action'),
    newStatus: getElementValueByName('future_action_new_status'),
    date: getElementValueByName('future_action_date'),
    terms: getTermsFromElementByName('future_action_terms'),
    taxonomy: getElementValueByName('future_action_taxonomy')
  };
  var onDataIsValid = function onDataIsValid() {
    jQuery('#publish').prop('disabled', false);
  };
  var onDataIsInvalid = function onDataIsInvalid() {
    jQuery('#publish').prop('disabled', true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'post-expirator-panel'
  }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.FutureActionPanel, {
    context: 'classic-editor',
    postType: props.postType,
    isCleanNewPost: props.isNewPost,
    actionsSelectOptions: props.actionsSelectOptions,
    statusesSelectOptions: props.statusesSelectOptions,
    enabled: data.enabled,
    calendarIsVisible: true,
    action: data.action,
    newStatus: data.newStatus,
    date: data.date,
    terms: data.terms,
    taxonomy: data.taxonomy,
    taxonomyName: props.taxonomyName,
    onChangeData: onChangeData,
    is12Hour: props.is12Hour,
    timeFormat: props.timeFormat,
    startOfWeek: props.startOfWeek,
    storeName: props.storeName,
    strings: props.strings,
    onDataIsValid: onDataIsValid,
    hideCalendarByDefault: props.hideCalendarByDefault,
    showTitle: false,
    onDataIsInvalid: onDataIsInvalid
  }));
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelQuickEdit.jsx":
/*!**************************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelQuickEdit.jsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelQuickEdit: () => (/* binding */ FutureActionPanelQuickEdit)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }



var FutureActionPanelQuickEdit = function FutureActionPanelQuickEdit(props) {
  var onChangeData = function onChangeData(attribute, value) {};
  var date = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getDate();
  }, []);
  var enabled = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getEnabled();
  }, []);
  var action = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getAction();
  }, []);
  var terms = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getTerms();
  }, []);
  var taxonomy = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getTaxonomy();
  }, []);
  var hasValidData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getHasValidData();
  }, []);
  var newStatus = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    return select(props.storeName).getNewStatus();
  }, []);
  var termsString = terms;
  if (_typeof(terms) === 'object') {
    termsString = terms.join(',');
  }
  var onDataIsValid = function onDataIsValid() {
    jQuery('.button-primary.save').prop('disabled', false);
  };
  var onDataIsInvalid = function onDataIsInvalid() {
    jQuery('.button-primary.save').prop('disabled', true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'post-expirator-panel'
  }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.FutureActionPanel, {
    context: 'quick-edit',
    postType: props.postType,
    isCleanNewPost: props.isNewPost,
    actionsSelectOptions: props.actionsSelectOptions,
    statusesSelectOptions: props.statusesSelectOptions,
    enabled: enabled,
    calendarIsVisible: false,
    action: action,
    newStatus: newStatus,
    date: date,
    terms: terms,
    taxonomy: taxonomy,
    taxonomyName: props.taxonomyName,
    onChangeData: onChangeData,
    is12Hour: props.is12Hour,
    timeFormat: props.timeFormat,
    startOfWeek: props.startOfWeek,
    storeName: props.storeName,
    strings: props.strings,
    onDataIsValid: onDataIsValid,
    hideCalendarByDefault: props.hideCalendarByDefault,
    showTitle: true,
    onDataIsInvalid: onDataIsInvalid
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_enabled',
    value: enabled ? 1 : 0
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_action',
    value: action ? action : ''
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_new_status',
    value: newStatus ? newStatus : ''
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_date',
    value: date ? date : ''
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_terms',
    value: termsString ? termsString : ''
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_taxonomy',
    value: taxonomy ? taxonomy : ''
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: 'future_action_view',
    value: "quick-edit"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: '_future_action_nonce',
    value: props.nonce
  }));
};

/***/ }),

/***/ "./assets/jsx/components/FutureActionPanelTop.jsx":
/*!********************************************************!*\
  !*** ./assets/jsx/components/FutureActionPanelTop.jsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FutureActionPanelTop: () => (/* binding */ FutureActionPanelTop),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var FutureActionPanelTop = function FutureActionPanelTop(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Fill, {
    name: "FutureActionPanelTop"
  }, children);
};
var FutureActionPanelTopSlot = function FutureActionPanelTopSlot(props) {
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Slot, _extends({
    name: "FutureActionPanelTop"
  }, props));
};
FutureActionPanelTop.Slot = FutureActionPanelTopSlot;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FutureActionPanelTop);

/***/ }),

/***/ "./assets/jsx/components/NonceControl.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/NonceControl.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NonceControl: () => (/* binding */ NonceControl)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var NonceControl = function NonceControl(props) {
  if (!props.name) {
    props.name = '_wpnonce';
  }
  if (!props.referrer) {
    props.referrer = true;
  }
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: props.name,
    id: props.name,
    value: props.nonce
  }), props.referrer && /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_wp_http_referer",
    value: props.referrer
  }));
};

/***/ }),

/***/ "./assets/jsx/components/PostTypeSettingsPanel.jsx":
/*!*********************************************************!*\
  !*** ./assets/jsx/components/PostTypeSettingsPanel.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostTypeSettingsPanel: () => (/* binding */ PostTypeSettingsPanel)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _DateOffsetPreview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DateOffsetPreview */ "./assets/jsx/components/DateOffsetPreview.jsx");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/*
 * Copyright (c) 2025, Ramble Ventures
 */






var _wp = wp,
  apiFetch = _wp.apiFetch;
var PanelRow = wp.components.PanelRow;
var PostTypeSettingsPanel = function PostTypeSettingsPanel(props) {
  var originalExpireTypeList = props.expireTypeList[props.postType];
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.taxonomy),
    _useState2 = _slicedToArray(_useState, 2),
    postTypeTaxonomy = _useState2[0],
    setPostTypeTaxonomy = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    termOptions = _useState4[0],
    setTermOptions = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    termsSelectIsLoading = _useState6[0],
    setTermsSelectIsLoading = _useState6[1];
  var _useState7 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]),
    _useState8 = _slicedToArray(_useState7, 2),
    selectedTerms = _useState8[0],
    setSelectedTerms = _useState8[1];
  var _useState9 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.howToExpire),
    _useState10 = _slicedToArray(_useState9, 2),
    settingHowToExpire = _useState10[0],
    setSettingHowToExpire = _useState10[1];
  var _useState11 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.active),
    _useState12 = _slicedToArray(_useState11, 2),
    isActive = _useState12[0],
    setIsActive = _useState12[1];
  var _useState13 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.defaultExpireOffset),
    _useState14 = _slicedToArray(_useState13, 2),
    expireOffset = _useState14[0],
    setExpireOffset = _useState14[1];
  var _useState15 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.emailNotification),
    _useState16 = _slicedToArray(_useState15, 2),
    emailNotification = _useState16[0],
    setEmailNotification = _useState16[1];
  var _useState17 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.autoEnabled),
    _useState18 = _slicedToArray(_useState17, 2),
    isAutoEnabled = _useState18[0],
    setIsAutoEnabled = _useState18[1];
  var _useState19 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(true),
    _useState20 = _slicedToArray(_useState19, 2),
    hasValidData = _useState20[0],
    setHasValidData = _useState20[1];
  var _useState21 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
    _useState22 = _slicedToArray(_useState21, 2),
    validationError = _useState22[0],
    setValidationError = _useState22[1];
  var _useState23 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
    _useState24 = _slicedToArray(_useState23, 2),
    taxonomyLabel = _useState24[0],
    setTaxonomyLabel = _useState24[1];
  var _useState25 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(originalExpireTypeList),
    _useState26 = _slicedToArray(_useState25, 2),
    howToExpireList = _useState26[0],
    setHowToExpireList = _useState26[1];
  var _useState27 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(props.settings.newStatus),
    _useState28 = _slicedToArray(_useState27, 2),
    newStatus = _useState28[0],
    setNewStatus = _useState28[1];
  var _useState29 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false),
    _useState30 = _slicedToArray(_useState29, 2),
    hasPendingValidation = _useState30[0],
    setHasPendingValidation = _useState30[1];
  var offset = expireOffset ? expireOffset : props.settings.globalDefaultExpireOffset;
  var taxonomyRelatedActions = ['category', 'category-add', 'category-remove', 'category-remove-all'];
  var onChangeTaxonomy = function onChangeTaxonomy(value) {
    setPostTypeTaxonomy(value);
  };
  var onChangeTerms = function onChangeTerms(value) {
    setSelectedTerms(value);
  };
  var onChangeHowToExpire = function onChangeHowToExpire(value) {
    setSettingHowToExpire(value);
  };
  var onChangeActive = function onChangeActive(value) {
    setIsActive(value);
  };
  var onChangeExpireOffset = function onChangeExpireOffset(value) {
    setExpireOffset(value);
  };
  var onChangeEmailNotification = function onChangeEmailNotification(value) {
    setEmailNotification(value);
  };
  var onChangeAutoEnabled = function onChangeAutoEnabled(value) {
    setIsAutoEnabled(value);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    // Remove items from expireTypeList if related to taxonomies and there is no taxonmoy for the post type
    if (props.taxonomiesList.length === 0) {
      var newExpireTypeList = [];
      newExpireTypeList = howToExpireList.filter(function (item) {
        return taxonomyRelatedActions.indexOf(item.value) === -1;
      });
      setHowToExpireList(newExpireTypeList);
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (!postTypeTaxonomy || !props.taxonomiesList) {
      return;
    }
    setTermsSelectIsLoading(true);
    apiFetch({
      path: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_2__.addQueryArgs)("publishpress-future/v1/terms/".concat(postTypeTaxonomy))
    }).then(function (result) {
      var options = [];
      var settingsTermsOptions = null;
      var option;
      result.terms.forEach(function (term) {
        option = {
          value: term.id,
          label: term.name
        };
        options.push(option);
        if (postTypeTaxonomy === props.settings.taxonomy && props.settings.terms.includes(term.id)) {
          if (settingsTermsOptions === null) {
            settingsTermsOptions = [];
          }
          settingsTermsOptions.push(option.label);
        }
      });
      setTermOptions(options);
      setSelectedTerms(settingsTermsOptions);
      setTermsSelectIsLoading(false);
    });
    props.taxonomiesList.forEach(function (taxonomy) {
      if (taxonomy.value === postTypeTaxonomy) {
        setTaxonomyLabel(taxonomy.label);
      }
    });
  }, [postTypeTaxonomy]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (!taxonomyLabel) {
      return;
    }

    // Update the list of actions replacing the taxonomy name.
    var newExpireTypeList = [];
    originalExpireTypeList.forEach(function (expireType) {
      var label = expireType.label;
      if (taxonomyRelatedActions.indexOf(expireType.value) !== -1) {
        label = label.replace('%s', taxonomyLabel.toLowerCase());
      }
      newExpireTypeList.push({
        value: expireType.value,
        label: label
      });
    });
    setHowToExpireList(newExpireTypeList);
  }, [taxonomyLabel]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (hasValidData && props.onDataIsValid) {
      props.onDataIsValid(props.postType);
    }
    if (!hasValidData && props.onDataIsInvalid) {
      props.onDataIsInvalid(props.postType);
    }
  }, [hasValidData]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (hasPendingValidation && props.onValidationStarted) {
      props.onValidationStarted(props.postType);
    }
    if (!hasPendingValidation && props.onValidationFinished) {
      props.onValidationFinished(props.postType);
    }
  }, [hasPendingValidation]);
  var termOptionsLabels = termOptions.map(function (term) {
    return term.label;
  });
  var settingsRows = [/*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingRow, {
    label: props.text.fieldActive,
    key: 'expirationdate_activemeta-' + props.postType
  }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
    name: 'expirationdate_activemeta-' + props.postType,
    checked: isActive || false,
    label: props.text.fieldActiveLabel,
    onChange: onChangeActive
  }))];
  if (isActive) {
    settingsRows.push( /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingRow, {
      label: props.text.fieldAutoEnable,
      key: 'expirationdate_autoenable-' + props.postType
    }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
      name: 'expirationdate_autoenable-' + props.postType,
      checked: isAutoEnabled || false,
      label: props.text.fieldAutoEnableLabel,
      onChange: onChangeAutoEnabled
    })));
    settingsRows.push( /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingRow, {
      label: props.text.fieldTaxonomy,
      key: 'expirationdate_taxonomy-' + props.postType
    }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
      name: 'expirationdate_taxonomy-' + props.postType,
      options: props.taxonomiesList,
      selected: postTypeTaxonomy,
      noItemFoundMessage: props.text.noItemsfound,
      description: props.text.fieldTaxonomyDescription,
      data: props.postType,
      onChange: onChangeTaxonomy
    })));
    settingsRows.push( /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingRow, {
      label: props.text.fieldHowToExpire,
      key: 'expirationdate_expiretype-' + props.postType
    }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
      name: 'expirationdate_expiretype-' + props.postType,
      className: 'pe-howtoexpire',
      options: howToExpireList,
      description: props.text.fieldHowToExpireDescription,
      selected: settingHowToExpire,
      onChange: onChangeHowToExpire
    }), settingHowToExpire === 'change-status' && /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
      name: 'expirationdate_newstatus-' + props.postType,
      options: props.statusesList,
      selected: newStatus,
      onChange: setNewStatus
    }), props.taxonomiesList.length > 0 && ['category', 'category-add', 'category-remove'].indexOf(settingHowToExpire) > -1 && /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.TokensControl, {
      label: props.text.fieldTerm,
      name: 'expirationdate_terms-' + props.postType,
      options: termOptionsLabels,
      value: selectedTerms,
      isLoading: termsSelectIsLoading,
      onChange: onChangeTerms,
      description: props.text.fieldTermDescription,
      maxSuggestions: 1000,
      expandOnFocus: true,
      autoSelectFirstMatch: true
    })));
    settingsRows.push( /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingRow, {
      label: props.text.fieldDefaultDateTimeOffset,
      key: 'expired-custom-date-' + props.postType
    }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.TextControl, {
      name: 'expired-custom-date-' + props.postType,
      value: expireOffset,
      loading: hasPendingValidation,
      placeholder: props.settings.globalDefaultExpireOffset,
      description: props.text.fieldDefaultDateTimeOffsetDescription,
      unescapedDescription: true,
      onChange: onChangeExpireOffset
    }), /*#__PURE__*/React.createElement(_DateOffsetPreview__WEBPACK_IMPORTED_MODULE_4__["default"], {
      offset: offset,
      label: props.text.datePreview,
      labelDatePreview: props.text.datePreviewCurrent,
      labelOffsetPreview: props.text.datePreviewComputed,
      setValidationErrorCallback: setValidationError,
      setHasPendingValidationCallback: setHasPendingValidation,
      setHasValidDataCallback: setHasValidData
    })));
    settingsRows.push( /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingRow, {
      label: props.text.fieldWhoToNotify,
      key: 'expirationdate_emailnotification-' + props.postType
    }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.TextControl, {
      name: 'expirationdate_emailnotification-' + props.postType,
      className: "large-text",
      value: emailNotification,
      description: props.text.fieldWhoToNotifyDescription,
      onChange: onChangeEmailNotification
    })));
  }
  settingsRows = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.applyFilters)('expirationdate_settings_posttype', settingsRows, props, isActive, _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState);
  var fieldSetClassNames = props.isVisible ? 'pe-settings-fieldset' : 'pe-settings-fieldset hidden';
  return /*#__PURE__*/React.createElement("div", {
    className: fieldSetClassNames
  }, /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.SettingsTable, {
    bodyChildren: settingsRows
  }), !hasValidData && /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement("div", {
    className: "publishpress-future-notice publishpress-future-notice-error"
  }, /*#__PURE__*/React.createElement("strong", null, props.text.error, ":"), " ", validationError)));
};

/***/ }),

/***/ "./assets/jsx/components/PostTypesSettingsPanels.jsx":
/*!***********************************************************!*\
  !*** ./assets/jsx/components/PostTypesSettingsPanels.jsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostTypesSettingsPanels: () => (/* binding */ PostTypesSettingsPanels)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/*
 * Copyright (c) 2025, Ramble Ventures
 */



var PostTypesSettingsPanels = function PostTypesSettingsPanels(props) {
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(Object.keys(props.settings)[0]),
    _useState2 = _slicedToArray(_useState, 2),
    currentTab = _useState2[0],
    setCurrentTab = _useState2[1];
  var panels = [];
  for (var _i = 0, _Object$entries = Object.entries(props.settings); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      postType = _Object$entries$_i[0],
      postTypeSettings = _Object$entries$_i[1];
    panels.push( /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_0__.PostTypeSettingsPanel, {
      legend: postTypeSettings.label,
      text: props.text,
      postType: postType,
      settings: postTypeSettings,
      expireTypeList: props.expireTypeList,
      taxonomiesList: props.taxonomiesList[postType],
      statusesList: props.statusesList[postType],
      key: "".concat(postType, "-panel"),
      onDataIsValid: props.onDataIsValid,
      onDataIsInvalid: props.onDataIsInvalid,
      onValidationStarted: props.onValidationStarted,
      onValidationFinished: props.onValidationFinished,
      isVisible: currentTab === postType
    }));
  }
  var onSelectTab = function onSelectTab(event) {
    event.preventDefault();
    setCurrentTab(event.target.hash.replace('#', '').replace('-panel', ''));
  };
  var tabs = [];
  var selected = false;
  for (var _i2 = 0, _Object$entries2 = Object.entries(props.settings); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      _postType = _Object$entries2$_i[0],
      _postTypeSettings = _Object$entries2$_i[1];
    selected = currentTab === _postType;
    tabs.push( /*#__PURE__*/React.createElement("a", {
      href: "#".concat(_postType, "-panel"),
      className: "nav-tab " + (selected ? 'nav-tab-active' : ''),
      key: "".concat(_postType, "-tab"),
      onClick: onSelectTab
    }, _postTypeSettings.label));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
    className: "nav-tab-wrapper"
  }, tabs), panels);
};

/***/ }),

/***/ "./assets/jsx/components/SelectControl.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/SelectControl.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectControl: () => (/* binding */ SelectControl)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/*
 * Copyright (c) 2025, Ramble Ventures
 */


var SelectControl = function SelectControl(props) {
  var onChange = function onChange(value) {
    props.onChange(value);
  };
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, props.options.length === 0 && /*#__PURE__*/React.createElement("div", null, props.noItemFoundMessage), props.options.length > 0 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
    label: props.label,
    name: props.name,
    id: props.name,
    className: props.className,
    value: props.selected,
    onChange: onChange,
    "data-data": props.data,
    options: props.options
  }), props.children, /*#__PURE__*/React.createElement("p", {
    className: "description"
  }, props.description));
};

/***/ }),

/***/ "./assets/jsx/components/SettingRow.jsx":
/*!**********************************************!*\
  !*** ./assets/jsx/components/SettingRow.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingRow: () => (/* binding */ SettingRow)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var SettingRow = function SettingRow(props) {
  return /*#__PURE__*/React.createElement("tr", {
    valign: "top"
  }, /*#__PURE__*/React.createElement("th", {
    scope: "row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: ""
  }, props.label)), /*#__PURE__*/React.createElement("td", null, props.children));
};

/***/ }),

/***/ "./assets/jsx/components/SettingsFieldset.jsx":
/*!****************************************************!*\
  !*** ./assets/jsx/components/SettingsFieldset.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsFieldset: () => (/* binding */ SettingsFieldset)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var SettingsFieldset = function SettingsFieldset(props) {
  return /*#__PURE__*/React.createElement("fieldset", {
    className: props.className
  }, /*#__PURE__*/React.createElement("legend", null, props.legend), props.children);
};

/***/ }),

/***/ "./assets/jsx/components/SettingsForm.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/SettingsForm.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsForm: () => (/* binding */ SettingsForm)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var SettingsForm = function SettingsForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    method: "post"
  }, props.children);
};

/***/ }),

/***/ "./assets/jsx/components/SettingsSection.jsx":
/*!***************************************************!*\
  !*** ./assets/jsx/components/SettingsSection.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsSection: () => (/* binding */ SettingsSection)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var SettingsSection = function SettingsSection(props) {
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/React.createElement("h2", null, props.title), /*#__PURE__*/React.createElement("p", null, props.description), props.children);
};

/***/ }),

/***/ "./assets/jsx/components/SettingsTable.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/SettingsTable.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsTable: () => (/* binding */ SettingsTable)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var SettingsTable = function SettingsTable(props) {
  return /*#__PURE__*/React.createElement("table", {
    className: "form-table"
  }, /*#__PURE__*/React.createElement("tbody", null, props.bodyChildren));
};

/***/ }),

/***/ "./assets/jsx/components/Spinner.jsx":
/*!*******************************************!*\
  !*** ./assets/jsx/components/Spinner.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Spinner: () => (/* binding */ Spinner)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */
var Spinner = function Spinner(props) {
  return /*#__PURE__*/React.createElement("span", {
    className: "publishpress-future-spinner"
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null));
};

/***/ }),

/***/ "./assets/jsx/components/SubmitButton.jsx":
/*!************************************************!*\
  !*** ./assets/jsx/components/SubmitButton.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SubmitButton: () => (/* binding */ SubmitButton)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var SubmitButton = function SubmitButton(props) {
  return /*#__PURE__*/React.createElement("input", {
    type: "submit",
    name: props.name,
    value: props.text,
    disabled: props.disabled,
    className: "button-primary"
  });
};

/***/ }),

/***/ "./assets/jsx/components/TextControl.jsx":
/*!***********************************************!*\
  !*** ./assets/jsx/components/TextControl.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextControl: () => (/* binding */ TextControl)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _workflow_editor_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../workflow-editor/utils */ "./assets/jsx/workflow-editor/utils.jsx");
/*
 * Copyright (c) 2025, Ramble Ventures
 */




var TextControl = function TextControl(props) {
  var description;
  if (props.unescapedDescription) {
    // If using this option, the HTML has to be escaped before injected into the JS interface.
    description = /*#__PURE__*/React.createElement("p", {
      className: "description",
      dangerouslySetInnerHTML: {
        __html: (0,_workflow_editor_utils__WEBPACK_IMPORTED_MODULE_3__.stripTags)(props.description)
      }
    });
  } else {
    description = /*#__PURE__*/React.createElement("p", {
      className: "description"
    }, props.description);
  }
  var onChange = function onChange(value) {
    if (props.onChange) {
      props.onChange(value);
    }
  };
  var className = props.className ? props.className : '';
  if (props.loading) {
    className += ' publishpress-future-loading publishpress-future-loading-input';
  }
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    type: "text",
    label: props.label,
    name: props.name,
    id: props.name,
    className: props.className,
    value: props.value,
    placeholder: props.placeholder,
    onChange: onChange
  }), props.loading && /*#__PURE__*/React.createElement(___WEBPACK_IMPORTED_MODULE_2__.Spinner, null), description));
};

/***/ }),

/***/ "./assets/jsx/components/ToggleArrowButton.jsx":
/*!*****************************************************!*\
  !*** ./assets/jsx/components/ToggleArrowButton.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToggleArrowButton: () => (/* binding */ ToggleArrowButton)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);

var ToggleArrowButton = function ToggleArrowButton(props) {
  var onClick = function onClick() {
    if (props.onClick) {
      props.onClick();
    }
  };
  var iconExpanded = props.iconExpanded ? props.iconExpanded : 'arrow-up-alt2';
  var iconCollapsed = props.iconCollapsed ? props.iconCollapsed : 'arrow-down-alt2';
  var icon = props.isExpanded ? iconExpanded : iconCollapsed;
  var title = props.isExpanded ? props.titleExpanded : props.titleCollapsed;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
    isSmall: true,
    title: title,
    icon: icon,
    onClick: onClick,
    className: props.className
  });
};

/***/ }),

/***/ "./assets/jsx/components/ToggleCalendarDatePicker.jsx":
/*!************************************************************!*\
  !*** ./assets/jsx/components/ToggleCalendarDatePicker.jsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToggleCalendarDatePicker: () => (/* binding */ ToggleCalendarDatePicker)
/* harmony export */ });
/* harmony import */ var _ToggleArrowButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ToggleArrowButton */ "./assets/jsx/components/ToggleArrowButton.jsx");
/* harmony import */ var _DateTimePicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DateTimePicker */ "./assets/jsx/components/DateTimePicker.jsx");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);



var ToggleCalendarDatePicker = function ToggleCalendarDatePicker(_ref) {
  var isExpanded = _ref.isExpanded,
    strings = _ref.strings,
    onToggleCalendar = _ref.onToggleCalendar,
    currentDate = _ref.currentDate,
    onChangeDate = _ref.onChangeDate,
    is12Hour = _ref.is12Hour,
    startOfWeek = _ref.startOfWeek;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    // Move the element of the toggle button to between the time and date elements.
    var toggleButtonElement = document.querySelector('.future-action-calendar-toggle');
    if (!toggleButtonElement) {
      return;
    }
    var dateTimeElement = toggleButtonElement.nextElementSibling;
    if (!dateTimeElement) {
      return;
    }
    var timeElement = dateTimeElement.querySelector('.components-datetime__time');
    if (!timeElement) {
      return;
    }
    var dateElement = timeElement.nextSibling;
    if (!dateElement) {
      return;
    }
    dateTimeElement.insertBefore(toggleButtonElement, dateElement);
  });
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, /*#__PURE__*/React.createElement(_ToggleArrowButton__WEBPACK_IMPORTED_MODULE_0__.ToggleArrowButton, {
    className: "future-action-calendar-toggle",
    isExpanded: isExpanded,
    iconExpanded: "arrow-up-alt2",
    iconCollapsed: "calendar",
    titleExpanded: strings.hideCalendar,
    titleCollapsed: strings.showCalendar,
    onClick: onToggleCalendar
  }), /*#__PURE__*/React.createElement(_DateTimePicker__WEBPACK_IMPORTED_MODULE_1__.DateTimePicker, {
    currentDate: currentDate,
    onChange: onChangeDate,
    __nextRemoveHelpButton: true,
    is12Hour: is12Hour,
    startOfWeek: startOfWeek
  }));
};

/***/ }),

/***/ "./assets/jsx/components/TokensControl.jsx":
/*!*************************************************!*\
  !*** ./assets/jsx/components/TokensControl.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokensControl: () => (/* binding */ TokensControl)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _workflow_editor_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../workflow-editor/utils */ "./assets/jsx/workflow-editor/utils.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/*
 * Copyright (c) 2025, Ramble Ventures
 */



var TokensControl = function TokensControl(props) {
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    stringValue = _useState2[0],
    setStringValue = _useState2[1];
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (props.value) {
      setStringValue(props.value.join(','));
    }
  }, [props.value]);
  var description;
  if (props.description) {
    if (props.unescapedDescription) {
      // If using this option, the HTML has to be escaped before injected into the JS interface.
      description = /*#__PURE__*/React.createElement("p", {
        className: "description",
        dangerouslySetInnerHTML: {
          __html: (0,_workflow_editor_utils__WEBPACK_IMPORTED_MODULE_2__.stripTags)(props.description)
        }
      });
    } else {
      description = /*#__PURE__*/React.createElement("p", {
        className: "description"
      }, props.description);
    }
  }
  var onChange = function onChange(value) {
    if (props.onChange) {
      props.onChange(value);
    }
    if (_typeof(value) === 'object') {
      setStringValue(value.join(','));
    } else {
      setStringValue('');
    }
  };
  var value = props.value ? props.value : [];
  return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FormTokenField, {
    label: props.label,
    value: value,
    suggestions: props.options,
    onChange: onChange,
    maxSuggestions: props.maxSuggestions,
    className: "publishpres-future-token-field",
    __experimentalExpandOnFocus: props.expandOnFocus,
    __experimentalAutoSelectFirstMatch: props.autoSelectFirstMatch
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: props.name,
    value: stringValue
  }), description);
};

/***/ }),

/***/ "./assets/jsx/components/TrueFalseControl.jsx":
/*!****************************************************!*\
  !*** ./assets/jsx/components/TrueFalseControl.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TrueFalseControl: () => (/* binding */ TrueFalseControl)
/* harmony export */ });
/*
 * Copyright (c) 2025, Ramble Ventures
 */

var TrueFalseControl = function TrueFalseControl(props) {
  var Fragment = wp.element.Fragment;
  var onChange = function onChange(e) {
    if (props.onChange) {
      props.onChange(e.target.value === props.trueValue && jQuery(e.target).is(':checked'));
      // Check only the true radio... using the field name? or directly the ID
    }
  };
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: props.name,
    id: props.name + '-true',
    value: props.trueValue,
    defaultChecked: props.selected,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: props.name + '-true'
  }, props.trueLabel), "\xA0\xA0", /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: props.name,
    defaultChecked: !props.selected,
    id: props.name + '-false',
    value: props.falseValue,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: props.name + '-false'
  }, props.falseLabel), /*#__PURE__*/React.createElement("p", {
    className: "description"
  }, props.description));
};

/***/ }),

/***/ "./assets/jsx/components/index.jsx":
/*!*****************************************!*\
  !*** ./assets/jsx/components/index.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ButtonsPanel: () => (/* reexport safe */ _ButtonsPanel__WEBPACK_IMPORTED_MODULE_0__.ButtonsPanel),
/* harmony export */   CheckboxControl: () => (/* reexport safe */ _CheckboxControl__WEBPACK_IMPORTED_MODULE_14__.CheckboxControl),
/* harmony export */   DateOffsetPreview: () => (/* reexport safe */ _DateOffsetPreview__WEBPACK_IMPORTED_MODULE_21__.DateOffsetPreview),
/* harmony export */   FutureActionPanel: () => (/* reexport safe */ _FutureActionPanel__WEBPACK_IMPORTED_MODULE_1__.FutureActionPanel),
/* harmony export */   FutureActionPanelBlockEditor: () => (/* reexport safe */ _FutureActionPanelBlockEditor__WEBPACK_IMPORTED_MODULE_2__.FutureActionPanelBlockEditor),
/* harmony export */   FutureActionPanelBulkEdit: () => (/* reexport safe */ _FutureActionPanelBulkEdit__WEBPACK_IMPORTED_MODULE_5__.FutureActionPanelBulkEdit),
/* harmony export */   FutureActionPanelClassicEditor: () => (/* reexport safe */ _FutureActionPanelClassicEditor__WEBPACK_IMPORTED_MODULE_3__.FutureActionPanelClassicEditor),
/* harmony export */   FutureActionPanelQuickEdit: () => (/* reexport safe */ _FutureActionPanelQuickEdit__WEBPACK_IMPORTED_MODULE_4__.FutureActionPanelQuickEdit),
/* harmony export */   NonceControl: () => (/* reexport safe */ _NonceControl__WEBPACK_IMPORTED_MODULE_18__.NonceControl),
/* harmony export */   PostTypeSettingsPanel: () => (/* reexport safe */ _PostTypeSettingsPanel__WEBPACK_IMPORTED_MODULE_6__.PostTypeSettingsPanel),
/* harmony export */   PostTypesSettingsPanels: () => (/* reexport safe */ _PostTypesSettingsPanels__WEBPACK_IMPORTED_MODULE_7__.PostTypesSettingsPanels),
/* harmony export */   SelectControl: () => (/* reexport safe */ _SelectControl__WEBPACK_IMPORTED_MODULE_15__.SelectControl),
/* harmony export */   SettingRow: () => (/* reexport safe */ _SettingRow__WEBPACK_IMPORTED_MODULE_8__.SettingRow),
/* harmony export */   SettingsFieldset: () => (/* reexport safe */ _SettingsFieldset__WEBPACK_IMPORTED_MODULE_9__.SettingsFieldset),
/* harmony export */   SettingsForm: () => (/* reexport safe */ _SettingsForm__WEBPACK_IMPORTED_MODULE_10__.SettingsForm),
/* harmony export */   SettingsSection: () => (/* reexport safe */ _SettingsSection__WEBPACK_IMPORTED_MODULE_11__.SettingsSection),
/* harmony export */   SettingsTable: () => (/* reexport safe */ _SettingsTable__WEBPACK_IMPORTED_MODULE_12__.SettingsTable),
/* harmony export */   Spinner: () => (/* reexport safe */ _Spinner__WEBPACK_IMPORTED_MODULE_20__.Spinner),
/* harmony export */   SubmitButton: () => (/* reexport safe */ _SubmitButton__WEBPACK_IMPORTED_MODULE_13__.SubmitButton),
/* harmony export */   TextControl: () => (/* reexport safe */ _TextControl__WEBPACK_IMPORTED_MODULE_16__.TextControl),
/* harmony export */   TokensControl: () => (/* reexport safe */ _TokensControl__WEBPACK_IMPORTED_MODULE_17__.TokensControl),
/* harmony export */   TrueFalseControl: () => (/* reexport safe */ _TrueFalseControl__WEBPACK_IMPORTED_MODULE_19__.TrueFalseControl)
/* harmony export */ });
/* harmony import */ var _ButtonsPanel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ButtonsPanel */ "./assets/jsx/components/ButtonsPanel.jsx");
/* harmony import */ var _FutureActionPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FutureActionPanel */ "./assets/jsx/components/FutureActionPanel.jsx");
/* harmony import */ var _FutureActionPanelBlockEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FutureActionPanelBlockEditor */ "./assets/jsx/components/FutureActionPanelBlockEditor.jsx");
/* harmony import */ var _FutureActionPanelClassicEditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FutureActionPanelClassicEditor */ "./assets/jsx/components/FutureActionPanelClassicEditor.jsx");
/* harmony import */ var _FutureActionPanelQuickEdit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FutureActionPanelQuickEdit */ "./assets/jsx/components/FutureActionPanelQuickEdit.jsx");
/* harmony import */ var _FutureActionPanelBulkEdit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FutureActionPanelBulkEdit */ "./assets/jsx/components/FutureActionPanelBulkEdit.jsx");
/* harmony import */ var _PostTypeSettingsPanel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PostTypeSettingsPanel */ "./assets/jsx/components/PostTypeSettingsPanel.jsx");
/* harmony import */ var _PostTypesSettingsPanels__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PostTypesSettingsPanels */ "./assets/jsx/components/PostTypesSettingsPanels.jsx");
/* harmony import */ var _SettingRow__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SettingRow */ "./assets/jsx/components/SettingRow.jsx");
/* harmony import */ var _SettingsFieldset__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SettingsFieldset */ "./assets/jsx/components/SettingsFieldset.jsx");
/* harmony import */ var _SettingsForm__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SettingsForm */ "./assets/jsx/components/SettingsForm.jsx");
/* harmony import */ var _SettingsSection__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./SettingsSection */ "./assets/jsx/components/SettingsSection.jsx");
/* harmony import */ var _SettingsTable__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SettingsTable */ "./assets/jsx/components/SettingsTable.jsx");
/* harmony import */ var _SubmitButton__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./SubmitButton */ "./assets/jsx/components/SubmitButton.jsx");
/* harmony import */ var _CheckboxControl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./CheckboxControl */ "./assets/jsx/components/CheckboxControl.jsx");
/* harmony import */ var _SelectControl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./SelectControl */ "./assets/jsx/components/SelectControl.jsx");
/* harmony import */ var _TextControl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./TextControl */ "./assets/jsx/components/TextControl.jsx");
/* harmony import */ var _TokensControl__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./TokensControl */ "./assets/jsx/components/TokensControl.jsx");
/* harmony import */ var _NonceControl__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./NonceControl */ "./assets/jsx/components/NonceControl.jsx");
/* harmony import */ var _TrueFalseControl__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./TrueFalseControl */ "./assets/jsx/components/TrueFalseControl.jsx");
/* harmony import */ var _Spinner__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./Spinner */ "./assets/jsx/components/Spinner.jsx");
/* harmony import */ var _DateOffsetPreview__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./DateOffsetPreview */ "./assets/jsx/components/DateOffsetPreview.jsx");























/***/ }),

/***/ "./assets/jsx/data.jsx":
/*!*****************************!*\
  !*** ./assets/jsx/data.jsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStore: () => (/* binding */ createStore)
/* harmony export */ });
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time */ "./assets/jsx/time.jsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./assets/jsx/utils.jsx");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var createStore = function createStore(props) {
  if (props.defaultState.terms && typeof props.defaultState.terms === 'string') {
    props.defaultState.terms = props.defaultState.terms.split(',').map(function (term) {
      return parseInt(term);
    });
  }
  var defaultState = {
    postId: props.defaultState.postId ? props.defaultState.postId : 0,
    action: props.defaultState.action,
    date: props.defaultState.date ? props.defaultState.date : (0,_time__WEBPACK_IMPORTED_MODULE_0__.getCurrentTimeAsTimestamp)(),
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
    extraData: props.defaultState.extraData ? props.defaultState.extraData : {}
  };
  var store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.createReduxStore)(props.name, {
    reducer: function reducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      switch (action.type) {
        case 'SET_POST_ID':
          return _objectSpread(_objectSpread({}, state), {}, {
            postId: action.postId
          });
        case 'SET_ACTION':
          return _objectSpread(_objectSpread({}, state), {}, {
            action: action.action
          });
        case 'SET_NEW_STATUS':
          return _objectSpread(_objectSpread({}, state), {}, {
            newStatus: action.newStatus
          });
        case 'SET_DATE':
          // Make sure the date is a number, if it is a string with only numbers
          if (typeof action.date !== 'number' && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isNumber)(action.date)) {
            action.date = parseInt(action.date);
          }

          // If string, convert to unix time
          if (typeof action.date === 'string') {
            action.date = new Date(action.date).getTime();
          }

          // Make sure the time is always in seconds
          action.date = (0,_time__WEBPACK_IMPORTED_MODULE_0__.normalizeUnixTimeToSeconds)(action.date);

          // Convert to formated string format, considering it is in the site's timezone
          action.date = (0,_time__WEBPACK_IMPORTED_MODULE_0__.formatUnixTimeToTimestamp)(action.date);
          return _objectSpread(_objectSpread({}, state), {}, {
            date: action.date
          });
        case 'SET_ENABLED':
          return _objectSpread(_objectSpread({}, state), {}, {
            enabled: action.enabled
          });
        case 'SET_TERMS':
          return _objectSpread(_objectSpread({}, state), {}, {
            terms: action.terms
          });
        case 'SET_TAXONOMY':
          return _objectSpread(_objectSpread({}, state), {}, {
            taxonomy: action.taxonomy
          });
        case 'SET_TERMS_LIST_BY_NAME':
          return _objectSpread(_objectSpread({}, state), {}, {
            termsListByName: action.termsListByName
          });
        case 'SET_TERMS_LIST_BY_ID':
          return _objectSpread(_objectSpread({}, state), {}, {
            termsListById: action.termsListById
          });
        case 'SET_TAXONOMY_NAME':
          return _objectSpread(_objectSpread({}, state), {}, {
            taxonomyName: action.taxonomyName
          });
        case 'SET_CHANGE_ACTION':
          return _objectSpread(_objectSpread({}, state), {}, {
            changeAction: action.changeAction
          });
        case 'SET_CALENDAR_IS_VISIBLE':
          return _objectSpread(_objectSpread({}, state), {}, {
            calendarIsVisible: action.calendarIsVisible
          });
        case 'SET_HAS_VALID_DATA':
          return _objectSpread(_objectSpread({}, state), {}, {
            hasValidData: action.hasValidData
          });
        case 'SET_EXTRA_DATA':
          return _objectSpread(_objectSpread({}, state), {}, {
            extraData: _objectSpread({}, action.extraData)
          });
        case 'SET_EXTRA_DATA_BY_NAME':
          var extraData = _objectSpread(_objectSpread({}, state.extraData), {}, _defineProperty({}, action.name, action.value));
          return _objectSpread(_objectSpread({}, state), {}, {
            extraData: _objectSpread({}, extraData)
          });
      }
      return state;
    },
    actions: {
      setPostId: function setPostId(postId) {
        return {
          type: 'SET_POST_ID',
          postId: postId
        };
      },
      setAction: function setAction(action) {
        return {
          type: 'SET_ACTION',
          action: action
        };
      },
      setNewStatus: function setNewStatus(newStatus) {
        return {
          type: 'SET_NEW_STATUS',
          newStatus: newStatus
        };
      },
      setDate: function setDate(date) {
        return {
          type: 'SET_DATE',
          date: date
        };
      },
      setEnabled: function setEnabled(enabled) {
        return {
          type: 'SET_ENABLED',
          enabled: enabled
        };
      },
      setTerms: function setTerms(terms) {
        return {
          type: 'SET_TERMS',
          terms: terms
        };
      },
      setTaxonomy: function setTaxonomy(taxonomy) {
        return {
          type: 'SET_TAXONOMY',
          taxonomy: taxonomy
        };
      },
      setTermsListByName: function setTermsListByName(termsListByName) {
        return {
          type: 'SET_TERMS_LIST_BY_NAME',
          termsListByName: termsListByName
        };
      },
      setTermsListById: function setTermsListById(termsListById) {
        return {
          type: 'SET_TERMS_LIST_BY_ID',
          termsListById: termsListById
        };
      },
      setTaxonomyName: function setTaxonomyName(taxonomyName) {
        return {
          type: 'SET_TAXONOMY_NAME',
          taxonomyName: taxonomyName
        };
      },
      setIsFetchingTerms: function setIsFetchingTerms(isFetchingTerms) {
        return {
          type: 'SET_IS_FETCHING_TERMS',
          isFetchingTerms: isFetchingTerms
        };
      },
      setChangeAction: function setChangeAction(changeAction) {
        return {
          type: 'SET_CHANGE_ACTION',
          changeAction: changeAction
        };
      },
      setCalendarIsVisible: function setCalendarIsVisible(calendarIsVisible) {
        return {
          type: 'SET_CALENDAR_IS_VISIBLE',
          calendarIsVisible: calendarIsVisible
        };
      },
      setHasValidData: function setHasValidData(hasValidData) {
        return {
          type: 'SET_HAS_VALID_DATA',
          hasValidData: hasValidData
        };
      },
      setExtraData: function setExtraData(extraData) {
        return {
          type: 'SET_EXTRA_DATA',
          extraData: extraData
        };
      },
      setExtraDataByName: function setExtraDataByName(name, value) {
        return {
          type: 'SET_EXTRA_DATA_BY_NAME',
          name: name,
          value: value
        };
      }
    },
    selectors: {
      getPostId: function getPostId(state) {
        return state.postId;
      },
      getAction: function getAction(state) {
        return state.action;
      },
      getNewStatus: function getNewStatus(state) {
        return state.newStatus;
      },
      getDate: function getDate(state) {
        return state.date;
      },
      getEnabled: function getEnabled(state) {
        return state.enabled;
      },
      getTerms: function getTerms(state) {
        return state.terms;
      },
      getTaxonomy: function getTaxonomy(state) {
        return state.taxonomy;
      },
      getTermsListByName: function getTermsListByName(state) {
        return state.termsListByName;
      },
      getTermsListById: function getTermsListById(state) {
        return state.termsListById;
      },
      getTaxonomyName: function getTaxonomyName(state) {
        return state.taxonomyName;
      },
      getIsFetchingTerms: function getIsFetchingTerms(state) {
        return state.isFetchingTerms;
      },
      getChangeAction: function getChangeAction(state) {
        return state.changeAction;
      },
      getCalendarIsVisible: function getCalendarIsVisible(state) {
        return state.calendarIsVisible;
      },
      getHasValidData: function getHasValidData(state) {
        return state.hasValidData;
      },
      getExtraData: function getExtraData(state) {
        return state.extraData;
      },
      getExtraDataByName: function getExtraDataByName(state, name) {
        return state.extraData[name] || null;
      }
    }
  });
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.register)(store);
  return store;
};

/***/ }),

/***/ "./assets/jsx/time.jsx":
/*!*****************************!*\
  !*** ./assets/jsx/time.jsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatTimestampToUnixTime: () => (/* binding */ formatTimestampToUnixTime),
/* harmony export */   formatUnixTimeToTimestamp: () => (/* binding */ formatUnixTimeToTimestamp),
/* harmony export */   getCurrentTimeAsTimestamp: () => (/* binding */ getCurrentTimeAsTimestamp),
/* harmony export */   getCurrentTimeInSeconds: () => (/* binding */ getCurrentTimeInSeconds),
/* harmony export */   normalizeUnixTimeToMilliseconds: () => (/* binding */ normalizeUnixTimeToMilliseconds),
/* harmony export */   normalizeUnixTimeToSeconds: () => (/* binding */ normalizeUnixTimeToSeconds),
/* harmony export */   timeIsInSeconds: () => (/* binding */ timeIsInSeconds)
/* harmony export */ });
var getCurrentTimeInSeconds = function getCurrentTimeInSeconds() {
  return normalizeUnixTimeToSeconds(new Date().getTime());
};
var getCurrentTimeAsTimestamp = function getCurrentTimeAsTimestamp() {
  return formatUnixTimeToTimestamp(getCurrentTimeInSeconds());
};
var formatUnixTimeToTimestamp = function formatUnixTimeToTimestamp(unixTimestamp) {
  var date = new Date(normalizeUnixTimeToSeconds(unixTimestamp));
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  var day = ("0" + date.getDate()).slice(-2);
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  var seconds = ("0" + date.getSeconds()).slice(-2);
  return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
};
var formatTimestampToUnixTime = function formatTimestampToUnixTime(time) {
  var date = new Date(time);
  return normalizeUnixTimeToSeconds(date.getTime());
};
var timeIsInSeconds = function timeIsInSeconds(time) {
  return parseInt(time).toString().length <= 10;
};
var normalizeUnixTimeToSeconds = function normalizeUnixTimeToSeconds(time) {
  time = parseInt(time);
  return timeIsInSeconds() ? time : time / 1000;
};
var normalizeUnixTimeToMilliseconds = function normalizeUnixTimeToMilliseconds(time) {
  time = parseInt(time);
  return timeIsInSeconds() ? time * 1000 : time;
};

/***/ }),

/***/ "./assets/jsx/utils.jsx":
/*!******************************!*\
  !*** ./assets/jsx/utils.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compact: () => (/* binding */ compact),
/* harmony export */   debugLogFactory: () => (/* binding */ debugLogFactory),
/* harmony export */   getActionSettingsFromColumnData: () => (/* binding */ getActionSettingsFromColumnData),
/* harmony export */   getElementByName: () => (/* binding */ getElementByName),
/* harmony export */   getFieldByName: () => (/* binding */ getFieldByName),
/* harmony export */   getFieldValueByName: () => (/* binding */ getFieldValueByName),
/* harmony export */   getFieldValueByNameAsArrayOfInt: () => (/* binding */ getFieldValueByNameAsArrayOfInt),
/* harmony export */   getFieldValueByNameAsBool: () => (/* binding */ getFieldValueByNameAsBool),
/* harmony export */   isGutenbergEnabled: () => (/* binding */ isGutenbergEnabled),
/* harmony export */   isNumber: () => (/* binding */ isNumber)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var compact = function compact(array) {
  if (!array) {
    return [];
  }
  if (!Array.isArray(array) && _typeof(array) === 'object') {
    array = Object.values(array);
  }
  return array.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
};
var debugLogFactory = function debugLogFactory(config) {
  return function (description) {
    if (console && config.isDebugEnabled) {
      var _console;
      for (var _len = arguments.length, message = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }
      (_console = console).debug.apply(_console, ['[Future]', description].concat(message));
    }
  };
};
var isGutenbergEnabled = function isGutenbergEnabled() {
  return document.body.classList.contains('block-editor-page');
};
var getElementByName = function getElementByName(name) {
  return document.getElementsByName(name)[0];
};
var getFieldByName = function getFieldByName(name, postId) {
  return document.querySelector("#the-list tr#post-".concat(postId, " .column-expirationdate input#future_action_").concat(name, "-").concat(postId));
};
var getFieldValueByName = function getFieldValueByName(name, postId) {
  var field = getFieldByName(name, postId);
  if (!field) {
    return null;
  }
  return field.value;
};
var getFieldValueByNameAsArrayOfInt = function getFieldValueByNameAsArrayOfInt(name, postId) {
  var field = getFieldByName(name, postId);
  if (!field || !field.value) {
    return [];
  }
  if (typeof field.value === 'number') {
    field.value = field.value.toString();
  }
  return field.value.split(',').map(function (term) {
    return parseInt(term);
  });
};
var getFieldValueByNameAsBool = function getFieldValueByNameAsBool(name, postId) {
  var field = getFieldByName(name, postId);
  if (!field) {
    return false;
  }
  return field.value === '1' || field.value === 'true';
};
var getActionSettingsFromColumnData = function getActionSettingsFromColumnData(postId) {
  var columnData = document.querySelector("#post-expire-column-".concat(postId));
  if (!columnData) {
    return {};
  }
  return {
    enabled: columnData.dataset.actionEnabled === '1',
    action: columnData.dataset.actionType,
    date: columnData.dataset.actionDate,
    dateUnix: columnData.dataset.actionDateUnix,
    taxonomy: columnData.dataset.actionTaxonomy,
    terms: columnData.dataset.actionTerms,
    newStatus: columnData.dataset.actionNewStatus
  };
};

/**
 * This function is used to determine if a value is a number, including strings.
 *
 * @param {*} value
 * @returns
 */
var isNumber = function isNumber(value) {
  return !isNaN(value);
};

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/editor-store/constants.jsx":
/*!**************************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/editor-store/constants.jsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME)
/* harmony export */ });
var STORE_NAME = 'publishpress-future/workflow-editor';

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/editor-store/index.jsx":
/*!**********************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/editor-store/index.jsx ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   store: () => (/* binding */ store),
/* harmony export */   storeConfig: () => (/* binding */ storeConfig)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../constants */ "./assets/jsx/workflow-editor/constants.jsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./assets/jsx/workflow-editor/components/editor-store/constants.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * WordPress dependencies
 */


/*
 * Internal dependencies
 */


var isPro = futureWorkflowEditor.isPro || false;
var storeConfig = {
  activeFeatures: [],
  currentInserterTab: _constants__WEBPACK_IMPORTED_MODULE_1__.INSERTER_TAB_TRIGGERS,
  triggerCategories: [],
  triggerNodes: [],
  actionCategories: [],
  actionNodes: [],
  advancedCategories: [],
  advancedNodes: [],
  activeSidebarName: null,
  hoveredItem: null,
  panelBodyStates: {},
  isPro: isPro,
  currentConditionalQuery: null
};
var store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(_constants__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME, {
  reducer: function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : storeConfig;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var newActiveSidebarName;
    switch (action.type) {
      case "SET_ACTIVE_FEATURES":
        // Update local storage for persisted features
        action.payload.forEach(function (feature) {
          if (persistentFeatures.includes(feature)) {
            setPersistedFeatureValue(feature, true);
          }
        });

        // Close the sidebar when the inserter is enabled
        newActiveSidebarName = action.payload.includes(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_INSERTER) ? null : state.activeSidebarName;
        if (newActiveSidebarName === null) {
          (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("core/interface").disableComplementaryArea(_constants__WEBPACK_IMPORTED_MODULE_1__.SLOT_SCOPE_WORKFLOW_EDITOR);
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          activeFeatures: action.payload,
          activeSidebarName: newActiveSidebarName
        });
      case "TOGGLE_FEATURE":
        var feature = action.payload;
        var activeFeatures = _toConsumableArray(state.activeFeatures);
        if (activeFeatures.includes(feature)) {
          activeFeatures = activeFeatures.filter(function (f) {
            return f !== feature;
          });
        } else {
          activeFeatures.push(feature);
        }

        // Update local storage for persisted features
        persistentFeatures.forEach(function (feature) {
          if (activeFeatures.includes(feature)) {
            setPersistedFeatureValue(feature, true);
          } else {
            setPersistedFeatureValue(feature, false);
          }
        });

        // Close the sidebar when the inserter is enabled
        newActiveSidebarName = activeFeatures.includes(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_INSERTER) ? null : state.activeSidebarName;
        if (newActiveSidebarName === null) {
          (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("core/interface").disableComplementaryArea(_constants__WEBPACK_IMPORTED_MODULE_1__.SLOT_SCOPE_WORKFLOW_EDITOR);
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          activeFeatures: activeFeatures,
          activeSidebarName: newActiveSidebarName
        });
      case "ENABLE_FEATURE":
        var featureToEnable = action.payload;

        // Update local storage for persisted features
        if (persistentFeatures.includes(featureToEnable)) {
          setPersistedFeatureValue(featureToEnable, true);
        }
        var newActiveFeatures = [].concat(_toConsumableArray(state.activeFeatures), [featureToEnable]);

        // Close the sidebar when the inserter is enabled
        newActiveSidebarName = newActiveFeatures.includes(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_INSERTER) ? null : state.activeSidebarName;
        if (newActiveSidebarName === null) {
          (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("core/interface").disableComplementaryArea(_constants__WEBPACK_IMPORTED_MODULE_1__.SLOT_SCOPE_WORKFLOW_EDITOR);
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          activeFeatures: newActiveFeatures,
          activeSidebarName: newActiveSidebarName
        });
      case "DISABLE_FEATURE":
        var featureToDisable = action.payload;

        // Update local storage for persisted features
        if (persistentFeatures.includes(featureToDisable)) {
          setPersistedFeatureValue(featureToDisable, false);
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          activeFeatures: state.activeFeatures.filter(function (f) {
            return f !== featureToDisable;
          })
        });
      case "SET_CURRENT_INSERTER_TAB":
        return _objectSpread(_objectSpread({}, state), {}, {
          currentInserterTab: action.payload
        });
      case "SET_TRIGGER_CATEGORIES":
        return _objectSpread(_objectSpread({}, state), {}, {
          triggerCategories: action.payload
        });
      case "SET_TRIGGER_NODES":
        return _objectSpread(_objectSpread({}, state), {}, {
          triggerNodes: action.payload
        });
      case "SET_ACTION_CATEGORIES":
        return _objectSpread(_objectSpread({}, state), {}, {
          actionCategories: action.payload
        });
      case "SET_ACTION_NODES":
        return _objectSpread(_objectSpread({}, state), {}, {
          actionNodes: action.payload
        });
      case "SET_ADVANCED_CATEGORIES":
        return _objectSpread(_objectSpread({}, state), {}, {
          advancedCategories: action.payload
        });
      case "SET_ADVANCED_NODES":
        return _objectSpread(_objectSpread({}, state), {}, {
          advancedNodes: action.payload
        });
      case "CLOSE_GENERAL_SIDEBAR":
        return _objectSpread(_objectSpread({}, state), {}, {
          activeSidebarName: null
        });
      case "OPEN_GENERAL_SIDEBAR":
        return _objectSpread(_objectSpread({}, state), {}, {
          activeSidebarName: action.payload,
          // Close the inserter when opening a sidebar
          activeFeatures: state.activeFeatures.filter(function (f) {
            return f !== _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_INSERTER;
          })
        });
      case "SET_HOVERED_ITEM":
        return _objectSpread(_objectSpread({}, state), {}, {
          hoveredItem: action.payload
        });
      case "SET_PANEL_BODY_STATE":
        var newState = _objectSpread(_objectSpread({}, state), {}, {
          panelBodyStates: _objectSpread(_objectSpread({}, state.panelBodyStates), {}, _defineProperty({}, action.payload.panel, action.payload.state))
        });
        setPersistedPanelBodyState(action.payload.panel, action.payload.state);
        return newState;
      case "SET_CURRENT_CONDITIONAL_QUERY":
        return _objectSpread(_objectSpread({}, state), {}, {
          currentConditionalQuery: action.payload
        });
    }
    return state;
  },
  actions: {
    setActiveFeatures: function setActiveFeatures(activeFeatures) {
      return {
        type: "SET_ACTIVE_FEATURES",
        payload: activeFeatures
      };
    },
    toggleFeature: function toggleFeature(feature) {
      return {
        type: "TOGGLE_FEATURE",
        payload: feature
      };
    },
    disableFeature: function disableFeature(feature) {
      return {
        type: "DISABLE_FEATURE",
        payload: feature
      };
    },
    enableFeature: function enableFeature(feature) {
      return {
        type: "ENABLE_FEATURE",
        payload: feature
      };
    },
    setCurrentInserterTab: function setCurrentInserterTab(tab) {
      return {
        type: "SET_CURRENT_INSERTER_TAB",
        payload: tab
      };
    },
    setTriggerCategories: function setTriggerCategories(categories) {
      return {
        type: "SET_TRIGGER_CATEGORIES",
        payload: categories
      };
    },
    setTriggerNodes: function setTriggerNodes(nodes) {
      return {
        type: "SET_TRIGGER_NODES",
        payload: nodes
      };
    },
    setActionCategories: function setActionCategories(categories) {
      return {
        type: "SET_ACTION_CATEGORIES",
        payload: categories
      };
    },
    setActionNodes: function setActionNodes(nodes) {
      return {
        type: "SET_ACTION_NODES",
        payload: nodes
      };
    },
    setAdvancedCategories: function setAdvancedCategories(categories) {
      return {
        type: "SET_ADVANCED_CATEGORIES",
        payload: categories
      };
    },
    setAdvancedNodes: function setAdvancedNodes(nodes) {
      return {
        type: "SET_ADVANCED_NODES",
        payload: nodes
      };
    },
    closeGeneralSidebar: function closeGeneralSidebar() {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("core/interface").disableComplementaryArea(_constants__WEBPACK_IMPORTED_MODULE_1__.SLOT_SCOPE_WORKFLOW_EDITOR);
      return {
        type: "CLOSE_GENERAL_SIDEBAR",
        payload: null
      };
    },
    openGeneralSidebar: function openGeneralSidebar(sidebar) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("core/interface").enableComplementaryArea(_constants__WEBPACK_IMPORTED_MODULE_1__.SLOT_SCOPE_WORKFLOW_EDITOR, sidebar);
      return {
        type: "OPEN_GENERAL_SIDEBAR",
        payload: sidebar
      };
    },
    openInserter: function openInserter() {
      return {
        type: "ENABLE_FEATURE",
        payload: _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_INSERTER
      };
    },
    closeInserter: function closeInserter() {
      return {
        type: "DISABLE_FEATURE",
        payload: _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_INSERTER
      };
    },
    setHoveredItem: function setHoveredItem(item) {
      return {
        type: "SET_HOVERED_ITEM",
        payload: item
      };
    },
    setPanelBodyState: function setPanelBodyState(panel, state) {
      return {
        type: "SET_PANEL_BODY_STATE",
        payload: {
          panel: panel,
          state: state
        }
      };
    },
    setCurrentConditionalQuery: function setCurrentConditionalQuery(query) {
      return {
        type: "SET_CURRENT_CONDITIONAL_QUERY",
        payload: query
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
    getCurrentInserterTab: function getCurrentInserterTab(state) {
      return state.currentInserterTab;
    },
    getTriggerCategories: function getTriggerCategories(state) {
      return state.triggerCategories;
    },
    getTriggerNodes: function getTriggerNodes(state) {
      return state.triggerNodes;
    },
    getActionCategories: function getActionCategories(state) {
      return state.actionCategories;
    },
    getActionNodes: function getActionNodes(state) {
      return state.actionNodes;
    },
    getAdvancedCategories: function getAdvancedCategories(state) {
      return state.advancedCategories;
    },
    getAdvancedNodes: function getAdvancedNodes(state) {
      return state.advancedNodes;
    },
    getHoveredItem: function getHoveredItem(state) {
      return state.hoveredItem;
    },
    getPanelBodyState: function getPanelBodyState(state, panel) {
      return state.panelBodyStates[panel];
    },
    getAllNodes: function getAllNodes(state) {
      return state.triggerNodes.concat(state.actionNodes, state.advancedNodes);
    },
    getNodeTypeByName: function getNodeTypeByName(state, nodeName) {
      var allNodes = state.triggerNodes.concat(state.actionNodes, state.advancedNodes);
      return allNodes.find(function (n) {
        return n.name === nodeName;
      }) || {};
    },
    isRayDebugInstalled: function isRayDebugInstalled(state) {
      return state.advancedNodes.some(function (node) {
        return node.name === "advanced/ray.debug";
      });
    },
    isPro: function isPro(state) {
      return state.isPro;
    },
    getCurrentConditionalQuery: function getCurrentConditionalQuery(state) {
      return state.currentConditionalQuery;
    }
  }
});
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);

// Persisted editor features
var LOCAL_SETTINGS_KEY = "FUTURE_PRO_WORKFLOW_PREFERENCES_" + futureWorkflowEditor.currentUserId;
var persistentFeatures = [_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_FULLSCREEN_MODE, _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_DEVELOPER_MODE, _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_WELCOME_GUIDE, _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_ADVANCED_SETTINGS, _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_MINI_MAP, _constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_CONTROLS];
var initLocalPreferences = function initLocalPreferences() {
  var localSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (localSettings === null) {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify({
      persistentFeatures: {},
      panelBodyStates: {}
    }));
  }
};
initLocalPreferences();
var getLocalPreferences = function getLocalPreferences() {
  return JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY));
};
var setLocalPreferences = function setLocalPreferences(settings) {
  localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
};
var getPersistedFeatureValue = function getPersistedFeatureValue(feature) {
  var _localSettings$persis;
  var localSettings = getLocalPreferences();
  return (_localSettings$persis = localSettings.persistentFeatures) === null || _localSettings$persis === void 0 ? void 0 : _localSettings$persis[feature];
};
var setPersistedFeatureValue = function setPersistedFeatureValue(feature, value) {
  var localSettings = getLocalPreferences();
  if (!localSettings.persistentFeatures) {
    localSettings.persistentFeatures = {};
  }
  localSettings.persistentFeatures[feature] = value;
  setLocalPreferences(localSettings);
};
var getPersistedPanelBodyState = function getPersistedPanelBodyState() {
  var localSettings = getLocalPreferences();
  return localSettings.panelBodyStates || {};
};
var setPersistedPanelBodyState = function setPersistedPanelBodyState(panel, state) {
  var localSettings = getLocalPreferences();
  if (!localSettings.panelBodyStates) {
    localSettings.panelBodyStates = {};
  }
  localSettings.panelBodyStates[panel] = state;
  setLocalPreferences(localSettings);
};

// Enable fullscreen mode by default
var isFullscreenModeEnabled = getPersistedFeatureValue(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_FULLSCREEN_MODE);
if (isFullscreenModeEnabled === null || isFullscreenModeEnabled === undefined) {
  setPersistedFeatureValue(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_FULLSCREEN_MODE, true);
}

// Enable the welcome guide by default
var isWelcomeGuideEnabled = getPersistedFeatureValue(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_WELCOME_GUIDE);
if (isWelcomeGuideEnabled === null || isWelcomeGuideEnabled === undefined) {
  setPersistedFeatureValue(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_WELCOME_GUIDE, true);
}

// Enable controls by default
var isControlsFeatureEnabled = getPersistedFeatureValue(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_CONTROLS);
if (isControlsFeatureEnabled === null || isControlsFeatureEnabled === undefined) {
  setPersistedFeatureValue(_constants__WEBPACK_IMPORTED_MODULE_1__.FEATURE_CONTROLS, true);
}

// Update the store with the persisted features
persistentFeatures.forEach(function (feature) {
  if (getPersistedFeatureValue(feature)) {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(store).enableFeature(feature);
  } else {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(store).disableFeature(feature);
  }
});

// Update the store with the persisted panel body states
var panelBodyStates = getPersistedPanelBodyState();
if (panelBodyStates) {
  Object.keys(panelBodyStates).forEach(function (panel) {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(store).setPanelBodyState(panel, panelBodyStates[panel]);
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/workflow-store/actions.jsx":
/*!**************************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/workflow-store/actions.jsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addDataType: () => (/* binding */ addDataType),
/* harmony export */   addNode: () => (/* binding */ addNode),
/* harmony export */   addNodeError: () => (/* binding */ addNodeError),
/* harmony export */   deleteWorkflow: () => (/* binding */ deleteWorkflow),
/* harmony export */   fetchTaxonomyTerms: () => (/* binding */ fetchTaxonomyTerms),
/* harmony export */   incrementBaseSlugCounts: () => (/* binding */ incrementBaseSlugCounts),
/* harmony export */   publishWorkflow: () => (/* binding */ publishWorkflow),
/* harmony export */   removeEdge: () => (/* binding */ removeEdge),
/* harmony export */   removeNode: () => (/* binding */ removeNode),
/* harmony export */   removeNodeError: () => (/* binding */ removeNodeError),
/* harmony export */   removePlaceholderNodes: () => (/* binding */ removePlaceholderNodes),
/* harmony export */   resetNodeErrors: () => (/* binding */ resetNodeErrors),
/* harmony export */   saveAsCurrentStatus: () => (/* binding */ saveAsCurrentStatus),
/* harmony export */   saveAsDraft: () => (/* binding */ saveAsDraft),
/* harmony export */   setDataTypes: () => (/* binding */ setDataTypes),
/* harmony export */   setDraggingFromHandle: () => (/* binding */ setDraggingFromHandle),
/* harmony export */   setEdges: () => (/* binding */ setEdges),
/* harmony export */   setEditedWorkflowAttribute: () => (/* binding */ setEditedWorkflowAttribute),
/* harmony export */   setFlow: () => (/* binding */ setFlow),
/* harmony export */   setGlobalVariable: () => (/* binding */ setGlobalVariable),
/* harmony export */   setInitialViewport: () => (/* binding */ setInitialViewport),
/* harmony export */   setIsConnectingNodes: () => (/* binding */ setIsConnectingNodes),
/* harmony export */   setNodes: () => (/* binding */ setNodes),
/* harmony export */   setPostType: () => (/* binding */ setPostType),
/* harmony export */   setSelectedEdges: () => (/* binding */ setSelectedEdges),
/* harmony export */   setSelectedNodes: () => (/* binding */ setSelectedNodes),
/* harmony export */   setupEditor: () => (/* binding */ setupEditor),
/* harmony export */   switchToDraft: () => (/* binding */ switchToDraft),
/* harmony export */   unselectAll: () => (/* binding */ unselectAll),
/* harmony export */   updateBaseSlugCounts: () => (/* binding */ updateBaseSlugCounts),
/* harmony export */   updateNode: () => (/* binding */ updateNode)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data-controls */ "./node_modules/@wordpress/data-controls/build-module/index.js");
/* harmony import */ var _name__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./name */ "./assets/jsx/workflow-editor/components/workflow-store/name.jsx");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
var _marked = /*#__PURE__*/_regeneratorRuntime().mark(setupEditor),
  _marked2 = /*#__PURE__*/_regeneratorRuntime().mark(saveAsDraft),
  _marked3 = /*#__PURE__*/_regeneratorRuntime().mark(saveAsCurrentStatus),
  _marked4 = /*#__PURE__*/_regeneratorRuntime().mark(publishWorkflow),
  _marked5 = /*#__PURE__*/_regeneratorRuntime().mark(switchToDraft),
  _marked6 = /*#__PURE__*/_regeneratorRuntime().mark(deleteWorkflow),
  _marked7 = /*#__PURE__*/_regeneratorRuntime().mark(fetchTaxonomyTerms);




var _window$futureWorkflo = window.futureWorkflowEditor,
  apiUrl = _window$futureWorkflo.apiUrl,
  nonce = _window$futureWorkflo.nonce;
var editableAttributes = ['title', 'description', 'flow', 'status', 'debugRayShowQueries', 'debugRayShowEmails', 'debugRayShowWordPressErrors', 'debugRayShowCurrentRunningStep'];
function setupEditor(workflowId) {
  var workflow, _workflow;
  return _regeneratorRuntime().wrap(function setupEditor$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return {
          type: 'LOAD_WORKFLOW_START'
        };
      case 2:
        workflowId = parseInt(workflowId, 10);
        if (!(workflowId == 0)) {
          _context.next = 19;
          break;
        }
        _context.next = 6;
        return {
          type: 'CREATE_WORKFLOW_START'
        };
      case 6:
        _context.prev = 6;
        _context.next = 9;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows"),
          method: 'POST',
          headers: {
            'X-WP-Nonce': nonce
          }
        });
      case 9:
        workflow = _context.sent;
        _context.next = 12;
        return {
          type: 'CREATE_WORKFLOW_SUCCESS',
          payload: workflow
        };
      case 12:
        _context.next = 19;
        break;
      case 14:
        _context.prev = 14;
        _context.t0 = _context["catch"](6);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to create a new workflow. Please try again.', 'post-expirator'));
        // TODO: Show error message
        _context.next = 19;
        return {
          type: 'CREATE_WORKFLOW_FAILURE'
        };
      case 19:
        if (!(workflowId > 0)) {
          _context.next = 33;
          break;
        }
        _context.prev = 20;
        _context.next = 23;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows/").concat(workflowId),
          headers: {
            'X-WP-Nonce': nonce
          }
        });
      case 23:
        _workflow = _context.sent;
        _context.next = 26;
        return {
          type: 'LOAD_WORKFLOW_SUCCESS',
          payload: _workflow
        };
      case 26:
        _context.next = 33;
        break;
      case 28:
        _context.prev = 28;
        _context.t1 = _context["catch"](20);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to load the workflow. Please try again.', 'post-expirator'));
        _context.next = 33;
        return {
          type: 'LOAD_WORKFLOW_FAILURE'
        };
      case 33:
      case "end":
        return _context.stop();
    }
  }, _marked, null, [[6, 14], [20, 28]]);
}
;
function addWorkflowIdToUrl(workflowId) {
  window.history.pushState({}, '', "?page=future_workflow_editor&workflow=".concat(parseInt(workflowId)));
}

// FIXME: This is not working as expected. The state we get from the store is not updated if the
// inspector is open or was not closed after the changes.
function saveAsDraft() {
  var wasNewWorkflow, editedWorkflow, workflowToSave, newWorkflow;
  return _regeneratorRuntime().wrap(function saveAsDraft$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        _context2.next = 2;
        return {
          type: 'SAVE_AS_DRAFT_START'
        };
      case 2:
        _context2.prev = 2;
        _context2.next = 5;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).isNewWorkflow();
      case 5:
        wasNewWorkflow = _context2.sent;
        _context2.next = 8;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).getWorkflow();
      case 8:
        editedWorkflow = _context2.sent;
        workflowToSave = _objectSpread(_objectSpread({}, editedWorkflow), {}, {
          status: 'draft'
        });
        _context2.next = 12;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows/").concat(parseInt(editedWorkflow.id)),
          method: 'PUT',
          headers: {
            'X-WP-Nonce': nonce
          },
          body: JSON.stringify(workflowToSave)
        });
      case 12:
        newWorkflow = _context2.sent;
        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
          addWorkflowIdToUrl(newWorkflow.id);
        }
        _context2.next = 16;
        return {
          type: 'SAVE_AS_DRAFT_SUCCESS',
          payload: newWorkflow
        };
      case 16:
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Workflow saved as draft.', 'post-expirator'), {
          type: 'snackbar',
          isDismissible: true
        });
        _context2.next = 24;
        break;
      case 19:
        _context2.prev = 19;
        _context2.t0 = _context2["catch"](2);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to save workflow. Please, try again.', 'post-expirator'));
        _context2.next = 24;
        return {
          type: 'SAVE_AS_DRAFT_FAILURE'
        };
      case 24:
      case "end":
        return _context2.stop();
    }
  }, _marked2, null, [[2, 19]]);
}
function saveAsCurrentStatus() {
  var editedWorkflow, wasNewWorkflow, _editedWorkflow, workflowToSave, newWorkflow;
  return _regeneratorRuntime().wrap(function saveAsCurrentStatus$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        _context3.next = 2;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).getWorkflow();
      case 2:
        editedWorkflow = _context3.sent;
        if (!(editedWorkflow.status === 'auto-draft')) {
          _context3.next = 7;
          break;
        }
        _context3.next = 6;
        return saveAsDraft();
      case 6:
        return _context3.abrupt("return");
      case 7:
        _context3.next = 9;
        return {
          type: 'SAVE_AS_CURRENT_STATUS_START'
        };
      case 9:
        _context3.prev = 9;
        _context3.next = 12;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).isNewWorkflow();
      case 12:
        wasNewWorkflow = _context3.sent;
        _context3.next = 15;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).getWorkflow();
      case 15:
        _editedWorkflow = _context3.sent;
        workflowToSave = _objectSpread({}, _editedWorkflow);
        _context3.next = 19;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows/").concat(parseInt(_editedWorkflow.id)),
          method: 'PUT',
          headers: {
            'X-WP-Nonce': nonce
          },
          body: JSON.stringify(workflowToSave)
        });
      case 19:
        newWorkflow = _context3.sent;
        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
          addWorkflowIdToUrl(newWorkflow.id);
        }
        _context3.next = 23;
        return {
          type: 'SAVE_AS_CURRENT_STATUS_SUCCESS',
          payload: newWorkflow
        };
      case 23:
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Workflow saved.', 'post-expirator'), {
          type: 'snackbar',
          isDismissible: true
        });
        _context3.next = 31;
        break;
      case 26:
        _context3.prev = 26;
        _context3.t0 = _context3["catch"](9);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to save workflow. Please, try again.', 'post-expirator'));
        _context3.next = 31;
        return {
          type: 'SAVE_AS_CURRENT_STATUS_FAILURE'
        };
      case 31:
      case "end":
        return _context3.stop();
    }
  }, _marked3, null, [[9, 26]]);
}
function publishWorkflow() {
  var wasNewWorkflow, editedWorkflow, workflowToSave, newWorkflow;
  return _regeneratorRuntime().wrap(function publishWorkflow$(_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        _context4.next = 2;
        return {
          type: 'PUBLISH_WORKFLOW_START'
        };
      case 2:
        _context4.prev = 2;
        _context4.next = 5;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).isNewWorkflow();
      case 5:
        wasNewWorkflow = _context4.sent;
        _context4.next = 8;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).getWorkflow();
      case 8:
        editedWorkflow = _context4.sent;
        workflowToSave = _objectSpread(_objectSpread({}, editedWorkflow), {}, {
          status: 'publish'
        });
        _context4.next = 12;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows/").concat(parseInt(editedWorkflow.id)),
          method: 'PUT',
          headers: {
            'X-WP-Nonce': nonce
          },
          body: JSON.stringify(workflowToSave)
        });
      case 12:
        newWorkflow = _context4.sent;
        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
          addWorkflowIdToUrl(newWorkflow.id);
        }
        _context4.next = 16;
        return {
          type: 'PUBLISH_WORKFLOW_SUCCESS',
          payload: newWorkflow
        };
      case 16:
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Workflow published.', 'post-expirator'), {
          type: 'snackbar',
          isDismissible: true
        });
        _context4.next = 24;
        break;
      case 19:
        _context4.prev = 19;
        _context4.t0 = _context4["catch"](2);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to publish the workflow. Please, try again.', 'post-expirator'));
        _context4.next = 24;
        return {
          type: 'PUBLISH_WORKFLOW_FAILURE'
        };
      case 24:
      case "end":
        return _context4.stop();
    }
  }, _marked4, null, [[2, 19]]);
}
function switchToDraft() {
  var wasNewWorkflow, editedWorkflow, workflowToSave, newWorkflow;
  return _regeneratorRuntime().wrap(function switchToDraft$(_context5) {
    while (1) switch (_context5.prev = _context5.next) {
      case 0:
        _context5.next = 2;
        return {
          type: 'SWITCH_TO_DRAFT_START'
        };
      case 2:
        _context5.prev = 2;
        _context5.next = 5;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).isNewWorkflow();
      case 5:
        wasNewWorkflow = _context5.sent;
        _context5.next = 8;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).getWorkflow();
      case 8:
        editedWorkflow = _context5.sent;
        workflowToSave = _objectSpread(_objectSpread({}, editedWorkflow), {}, {
          status: 'draft'
        });
        _context5.next = 12;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows/").concat(parseInt(editedWorkflow.id)),
          method: 'PUT',
          headers: {
            'X-WP-Nonce': nonce
          },
          body: JSON.stringify(workflowToSave)
        });
      case 12:
        newWorkflow = _context5.sent;
        // Add the workflow id to the url, keeping current state in the history
        if (wasNewWorkflow) {
          addWorkflowIdToUrl(newWorkflow.id);
        }
        _context5.next = 16;
        return {
          type: 'SWITCH_TO_DRAFT_SUCCESS',
          payload: newWorkflow
        };
      case 16:
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Workflow switched to draft.', 'post-expirator'), {
          type: 'snackbar',
          isDismissible: true
        });
        _context5.next = 24;
        break;
      case 19:
        _context5.prev = 19;
        _context5.t0 = _context5["catch"](2);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to switch workflow to draft. Please, try again.', 'post-expirator'));
        _context5.next = 24;
        return {
          type: 'SWITCH_TO_DRAFT_FAILURE'
        };
      case 24:
      case "end":
        return _context5.stop();
    }
  }, _marked5, null, [[2, 19]]);
}
var setFlow = function setFlow(flow) {
  return {
    type: 'SET_FLOW',
    payload: flow
  };
};
var setPostType = function setPostType(postType) {
  return {
    type: 'SET_POST_TYPE',
    payload: postType
  };
};
var setNodes = function setNodes(nodes) {
  return {
    type: 'SET_NODES',
    payload: nodes
  };
};
var setEdges = function setEdges(edges) {
  return {
    type: 'SET_EDGES',
    payload: edges
  };
};
var setInitialViewport = function setInitialViewport(viewport) {
  return {
    type: 'SET_INITIAL_VIEWPORT',
    payload: viewport
  };
};
var setSelectedNodes = function setSelectedNodes(nodes) {
  return {
    type: 'SET_SELECTED_NODES',
    payload: nodes
  };
};
var unselectAll = function unselectAll() {
  return {
    type: 'UNSELECT_ALL'
  };
};
var setSelectedEdges = function setSelectedEdges(edges) {
  return {
    type: 'SET_SELECTED_EDGES',
    payload: edges
  };
};
var setEditedWorkflowAttribute = function setEditedWorkflowAttribute(key, value) {
  if (!editableAttributes.includes(key)) {
    throw new Error("The workflow attribute \"".concat(key, "\" is not editable."));
  }
  return {
    type: 'SET_EDITED_WORKFLOW_ATTRIBUTE',
    payload: {
      key: key,
      value: value
    }
  };
};
function deleteWorkflow() {
  var editedWorkflow, newWorkflow;
  return _regeneratorRuntime().wrap(function deleteWorkflow$(_context6) {
    while (1) switch (_context6.prev = _context6.next) {
      case 0:
        _context6.next = 2;
        return {
          type: 'DELETE_WORKFLOW_START'
        };
      case 2:
        _context6.next = 4;
        return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_name__WEBPACK_IMPORTED_MODULE_2__.STORE_NAME).getWorkflow();
      case 4:
        editedWorkflow = _context6.sent;
        _context6.prev = 5;
        _context6.next = 8;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/workflows/").concat(parseInt(editedWorkflow.id)),
          method: 'DELETE',
          headers: {
            'X-WP-Nonce': nonce
          }
        });
      case 8:
        newWorkflow = _context6.sent;
        _context6.next = 11;
        return {
          type: 'DELETE_WORKFLOW_SUCCESS',
          payload: newWorkflow
        };
      case 11:
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Workflow deleted. Redirecting...', 'post-expirator'), {
          type: 'snackbar',
          isDismissible: true
        });

        // Redirect to the workflow list
        window.location.href = "edit.php?post_type=ppfuture_workflow";
        _context6.next = 20;
        break;
      case 15:
        _context6.prev = 15;
        _context6.t0 = _context6["catch"](5);
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices').createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unable to delete the workflow. Please, try again.', 'post-expirator'));
        _context6.next = 20;
        return {
          type: 'DELETE_WORKFLOW_FAILURE'
        };
      case 20:
      case "end":
        return _context6.stop();
    }
  }, _marked6, null, [[5, 15]]);
}
function updateNode(node) {
  return {
    type: 'UPDATE_NODE',
    payload: node
  };
}
function setDataTypes(dataTypes) {
  return {
    type: 'SET_DATA_TYPES',
    payload: dataTypes
  };
}
function addDataType(dataType) {
  return {
    type: 'ADD_DATA_TYPE',
    payload: dataType
  };
}
function setGlobalVariable(globalVariable) {
  return {
    type: 'SET_GLOBAL_VARIABLE',
    payload: globalVariable
  };
}
function fetchTaxonomyTerms(taxonomy) {
  var result;
  return _regeneratorRuntime().wrap(function fetchTaxonomyTerms$(_context7) {
    while (1) switch (_context7.prev = _context7.next) {
      case 0:
        _context7.next = 2;
        return {
          type: 'FETCH_TAXONOMY_TERMS_START'
        };
      case 2:
        _context7.prev = 2;
        _context7.next = 5;
        return (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.apiFetch)({
          path: "".concat(apiUrl, "/terms/").concat(taxonomy),
          headers: {
            'X-WP-Nonce': nonce
          }
        });
      case 5:
        result = _context7.sent;
        _context7.next = 8;
        return {
          type: 'FETCH_TAXONOMY_TERMS_SUCCESS',
          payload: {
            taxonomy: taxonomy,
            result: result
          }
        };
      case 8:
        _context7.next = 14;
        break;
      case 10:
        _context7.prev = 10;
        _context7.t0 = _context7["catch"](2);
        _context7.next = 14;
        return {
          type: 'FETCH_TAXONOMY_TERMS_FAILURE'
        };
      case 14:
      case "end":
        return _context7.stop();
    }
  }, _marked7, null, [[2, 10]]);
}
function incrementBaseSlugCounts(baseSlug) {
  return {
    type: 'INCREMENT_BASE_SLUG_COUNTS',
    payload: baseSlug
  };
}
function updateBaseSlugCounts(nodeSlug) {
  return {
    type: 'UPDATE_BASE_SLUG_COUNTS',
    payload: nodeSlug
  };
}
function addNodeError(nodeId, error, message) {
  var details = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  return {
    type: 'ADD_NODE_ERROR',
    payload: {
      nodeId: nodeId,
      error: error,
      message: message,
      details: details
    }
  };
}
function removeNodeError(nodeId, error) {
  return {
    type: 'REMOVE_NODE_ERROR',
    payload: {
      nodeId: nodeId,
      error: error
    }
  };
}
function resetNodeErrors(nodeId) {
  return {
    type: 'RESET_NODE_ERRORS',
    payload: nodeId
  };
}
function removeNode(nodeId) {
  return {
    type: 'REMOVE_NODE',
    payload: nodeId
  };
}
function removeEdge(edgeId) {
  return {
    type: 'REMOVE_EDGE',
    payload: edgeId
  };
}
function addNode(node) {
  return {
    type: 'ADD_NODE',
    payload: node
  };
}
function removePlaceholderNodes() {
  return {
    type: 'REMOVE_PLACEHOLDER_NODES'
  };
}
function setDraggingFromHandle(_ref) {
  var sourceId = _ref.sourceId,
    handleId = _ref.handleId,
    handleType = _ref.handleType;
  return {
    type: 'SET_DRAGGING_FROM_HANDLE',
    payload: {
      sourceId: sourceId,
      handleId: handleId,
      handleType: handleType
    }
  };
}
function setIsConnectingNodes(isConnecting) {
  return {
    type: 'SET_IS_CONNECTING_NODES',
    payload: isConnecting
  };
}

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/workflow-store/controls.jsx":
/*!***************************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/workflow-store/controls.jsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data-controls */ "./node_modules/@wordpress/data-controls/build-module/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var controls = _objectSpread({}, _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.controls);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (controls);

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/workflow-store/index.jsx":
/*!************************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/workflow-store/index.jsx ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   store: () => (/* binding */ store)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _name__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./name */ "./assets/jsx/workflow-editor/components/workflow-store/name.jsx");
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reducer */ "./assets/jsx/workflow-editor/components/workflow-store/reducer.jsx");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectors */ "./assets/jsx/workflow-editor/components/workflow-store/selectors.jsx");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions */ "./assets/jsx/workflow-editor/components/workflow-store/actions.jsx");
/* harmony import */ var _controls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./controls */ "./assets/jsx/workflow-editor/components/workflow-store/controls.jsx");
/*
 * WordPress dependencies
 */


/*
 * Internal dependencies
 */





var store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(_name__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME, {
  reducer: _reducer__WEBPACK_IMPORTED_MODULE_2__["default"],
  actions: _actions__WEBPACK_IMPORTED_MODULE_4__,
  selectors: _selectors__WEBPACK_IMPORTED_MODULE_3__,
  controls: _controls__WEBPACK_IMPORTED_MODULE_5__["default"]
});
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/workflow-store/name.jsx":
/*!***********************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/workflow-store/name.jsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME)
/* harmony export */ });
var STORE_NAME = 'publishpress-future/workflow';

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/workflow-store/reducer.jsx":
/*!**************************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/workflow-store/reducer.jsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_STATE: () => (/* binding */ DEFAULT_STATE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   reducer: () => (/* binding */ reducer)
/* harmony export */ });
/* harmony import */ var reactflow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactflow */ "./node_modules/@reactflow/core/dist/esm/index.mjs");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../constants */ "./assets/jsx/workflow-editor/constants.jsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils */ "./assets/jsx/workflow-editor/utils.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var DEFAULT_STATE = {
  postType: _constants__WEBPACK_IMPORTED_MODULE_0__.POST_TYPE,
  isLoadingWorkflow: false,
  isCreatingWorkflow: false,
  isSavingWorkflow: false,
  isNewWorkflow: true,
  isDeletingWorkflow: false,
  isAutosavingWorkflow: false,
  isEditedWorkflowEmpty: true,
  isCurrentWorkflowPublished: false,
  workflow: {
    id: 0,
    title: '',
    description: '',
    flow: {
      nodes: [],
      edges: [],
      viewport: {
        x: 0,
        y: 0,
        zoom: 2
      }
    },
    status: 'auto-draft',
    debugRayShowQueries: false,
    debugRayShowEmails: false,
    debugRayShowWordPressErrors: false,
    debugRayShowCurrentRunningStep: false
  },
  editedWorkflowAttributes: {},
  initialViewport: {
    x: 0,
    y: 0,
    zoom: 2
  },
  selectedNodes: [],
  selectedEdges: [],
  dataTypes: [],
  globalVariables: [],
  isFetchingTaxonomyTerms: false,
  taxonomyTerms: {},
  baseSlugCounts: {},
  nodeErrors: {},
  draggingFromHandle: {
    sourceId: null,
    handleId: null,
    handleType: null
  },
  isConnectingNodes: false
};
var loadWorkflowStart = function loadWorkflowStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isLoadingWorkflow: true
  });
};

// Update the markerEnd for each edge
var normalizeMarkerEnd = function normalizeMarkerEnd(payload) {
  return payload.map(function (edge) {
    if (edge.type !== 'genericEdge') {
      return edge;
    }
    return _objectSpread(_objectSpread({}, edge), {}, {
      markerEnd: {
        type: reactflow__WEBPACK_IMPORTED_MODULE_2__.MarkerType.ArrowClosed
      }
    });
  });
};
var removeBrokenConnections = function removeBrokenConnections(nodes, edges) {
  return edges.filter(function (edge) {
    var sourceNode = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getNodeById)(edge.source, nodes);
    var targetNode = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getNodeById)(edge.target, nodes);
    if (!sourceNode || !targetNode) {
      return false;
    }
    return true;
  });
};
function _setInitialStateForGlobalVariables(state) {
  var workflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  state = setGlobalVariable(state, {
    payload: {
      name: 'site',
      label: 'Site',
      type: 'site',
      runtimeOnly: true,
      description: 'The current site.'
    }
  });
  state = setGlobalVariable(state, {
    payload: {
      name: 'workflow',
      label: 'Workflow',
      type: 'workflow',
      runtimeOnly: false,
      description: 'The current workflow.'
    }
  });
  state = setGlobalVariable(state, {
    payload: {
      name: 'user',
      label: 'Activating user',
      type: 'user',
      runtimeOnly: true,
      description: 'The current user.'
    }
  });
  state = setGlobalVariable(state, {
    payload: {
      name: 'trigger',
      label: 'Activating trigger',
      type: 'node',
      runtimeOnly: true,
      description: 'The node that activated the workflow.'
    }
  });
  state = setGlobalVariable(state, {
    payload: {
      name: 'trace',
      label: 'Execution trace',
      type: 'array',
      runtimeOnly: true,
      description: 'The trace of the execution of the workflow.'
    }
  });
  state = setGlobalVariable(state, {
    payload: {
      name: 'execution_id',
      label: 'Execution ID',
      type: 'string',
      runtimeOnly: true,
      description: 'The unique identifier for the execution of the workflow.'
    }
  });
  return state;
}
var loadWorkflowSuccess = function loadWorkflowSuccess(state, action) {
  var _payload$flow, _payload$flow2, _payload$flow3;
  var payload = action.payload;
  var nodes = ((_payload$flow = payload.flow) === null || _payload$flow === void 0 ? void 0 : _payload$flow.nodes) || [];
  var edges = ((_payload$flow2 = payload.flow) === null || _payload$flow2 === void 0 ? void 0 : _payload$flow2.edges) || [];
  var initialViewport = ((_payload$flow3 = payload.flow) === null || _payload$flow3 === void 0 ? void 0 : _payload$flow3.viewport) || DEFAULT_STATE.viewport;
  nodes.map(function (node) {
    var _node$data;
    var slug = node === null || node === void 0 || (_node$data = node.data) === null || _node$data === void 0 ? void 0 : _node$data.slug;
    if (!slug) {
      return;
    }
    state = updateBaseSlugCounts(state, {
      payload: slug
    });
  });
  if (!nodes.length) {
    nodes = [(0,_utils__WEBPACK_IMPORTED_MODULE_1__.newTriggerPlaceholderNode)()];
  }
  edges = normalizeMarkerEnd(edges);
  edges = removeBrokenConnections(nodes, edges);
  state = _setInitialStateForGlobalVariables(state, payload);
  unselectAll(state);
  return _objectSpread(_objectSpread({}, state), {}, {
    isLoadingWorkflow: false,
    workflow: _objectSpread(_objectSpread({}, payload), {}, {
      flow: _objectSpread(_objectSpread({}, payload.flow), {}, {
        nodes: nodes,
        edges: edges
      })
    }),
    editedWorkflowAttributes: {},
    isNewWorkflow: payload.status === 'auto-draft',
    initialViewport: initialViewport,
    isEditedWorkflowEmpty: edges.length === 0 && nodes.length === 0,
    isCurrentWorkflowPublished: payload.status === 'publish'
  });
};
var loadWorkflowFailure = function loadWorkflowFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isLoadingWorkflow: false
  });
};
var createWorkflowStart = function createWorkflowStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isCreatingWorkflow: true,
    isLoadingWorkflow: true
  });
};
var createWorkflowSuccess = function createWorkflowSuccess(state, action) {
  var payload = action.payload;
  var nodes = [(0,_utils__WEBPACK_IMPORTED_MODULE_1__.newTriggerPlaceholderNode)()];
  state = _setInitialStateForGlobalVariables(state, {});
  return _objectSpread(_objectSpread({}, state), {}, {
    isCreatingWorkflow: false,
    isLoadingWorkflow: false,
    workflow: _objectSpread(_objectSpread({}, payload), {}, {
      flow: _objectSpread(_objectSpread({}, payload.flow), {}, {
        nodes: nodes
      })
    }),
    editedWorkflowAttributes: {},
    isNewWorkflow: payload.status === 'auto-draft',
    isEditedWorkflowEmpty: state.workflow.flow.edges.length === 0 && state.workflow.flow.nodes.length === 0,
    isCurrentWorkflowPublished: payload.status === 'publish'
  });
};
var createWorkflowFailure = function createWorkflowFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isCreatingWorkflow: false,
    isLoadingWorkflow: false
  });
};
var saveAsDraftStart = function saveAsDraftStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: true
  });
};
var saveAsDraftSuccess = function saveAsDraftSuccess(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false,
    workflow: payload,
    editedWorkflowAttributes: {},
    isNewWorkflow: payload.status === 'auto-draft',
    isEditedWorkflowEmpty: state.workflow.flow.edges.length === 0 && state.workflow.flow.nodes.length === 0,
    isCurrentWorkflowPublished: payload.status === 'publish'
  });
};
var saveAsDraftFailure = function saveAsDraftFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false
  });
};
var switchToDraftStart = function switchToDraftStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: true
  });
};
var switchToDraftSuccess = function switchToDraftSuccess(state, action) {
  var payload = action.payload;
  var newWorkflow = _objectSpread(_objectSpread({}, state.workflow), {}, {
    status: payload.status
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false,
    workflow: newWorkflow,
    isNewWorkflow: false,
    isEditedWorkflowEmpty: state.workflow.flow.edges.length === 0 && state.workflow.flow.nodes.length === 0,
    isCurrentWorkflowPublished: newWorkflow.status === 'publish',
    editedWorkflowAttributes: {}
  });
};
var switchToDraftFailure = function switchToDraftFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false
  });
};
var saveAsCurrentStatusStart = function saveAsCurrentStatusStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: true
  });
};
var saveAsCurrentStatusSuccess = function saveAsCurrentStatusSuccess(state, action) {
  var payload = action.payload;
  var newWorkflow = _objectSpread(_objectSpread({}, state.workflow), payload);
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false,
    workflow: newWorkflow,
    isNewWorkflow: false,
    isEditedWorkflowEmpty: state.workflow.flow.edges.length === 0 && state.workflow.flow.nodes.length === 0,
    isCurrentWorkflowPublished: state.workflow.status === 'publish',
    editedWorkflowAttributes: {}
  });
};
var saveAsCurrentStatusFailure = function saveAsCurrentStatusFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false
  });
};
var publishWorkflowStart = function publishWorkflowStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: true
  });
};
var publishWorkflowSuccess = function publishWorkflowSuccess(state, action) {
  var payload = action.payload;
  var newWorkflow = _objectSpread(_objectSpread({}, state.workflow), {}, {
    status: payload.status
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false,
    workflow: newWorkflow,
    isNewWorkflow: false,
    isEditedWorkflowEmpty: state.workflow.flow.edges.length === 0 && state.workflow.flow.nodes.length === 0,
    isCurrentWorkflowPublished: newWorkflow.status === 'publish',
    editedWorkflowAttributes: {}
  });
};
var publishWorkflowFailure = function publishWorkflowFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isSavingWorkflow: false
  });
};
var setEditedWorkflowAttribute = function setEditedWorkflowAttribute(state, action) {
  var _action$payload = action.payload,
    key = _action$payload.key,
    value = _action$payload.value;
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, _defineProperty({}, key, value)),
    editedWorkflowAttributes: _objectSpread(_objectSpread({}, state.editedWorkflowAttributes), {}, _defineProperty({}, key, value)),
    isEditedWorkflowEmpty: Object.keys(state.editedWorkflowAttributes).length === 0
  });
};
var setPostType = function setPostType(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    postType: payload
  });
};
var setNodes = function setNodes(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, {
      flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
        nodes: payload
      })
    })
  });
};
var addNode = function addNode(state, action) {
  var payload = action.payload;
  var newNodes = [].concat(_toConsumableArray(state.workflow.flow.nodes), [payload]);
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, {
      flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
        nodes: newNodes
      })
    })
  });
};
var setEdges = function setEdges(state, action) {
  var payload = action.payload;
  var updatedEdges = normalizeMarkerEnd(payload);
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, {
      flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
        edges: updatedEdges
      })
    })
  });
};
var setInitialViewport = function setInitialViewport(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    initialViewport: payload
  });
};
var setSelectedNodes = function setSelectedNodes(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    selectedNodes: payload
  });
};
var setSelectedEdges = function setSelectedEdges(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    selectedEdges: payload
  });
};
var unselectAll = function unselectAll(state, action) {
  setTimeout(function () {
    return jQuery('.react-flow__pane').trigger('click');
  }, 200);
  return _objectSpread(_objectSpread({}, state), {}, {
    selectedNodes: [],
    selectedEdges: []
  });
};
var deleteWorkflowStart = function deleteWorkflowStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isDeletingWorkflow: true
  });
};
var deleteWorkflowSuccess = function deleteWorkflowSuccess(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isDeletingWorkflow: false
  });
};
var deleteWorkflowFailure = function deleteWorkflowFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isDeletingWorkflow: false
  });
};
var updateNode = function updateNode(state, action) {
  var payload = action.payload;

  // Update the settings of the node with the given ID
  var updatedNodes = state.workflow.flow.nodes.map(function (node) {
    if (node.id === payload.id) {
      return _objectSpread(_objectSpread(_objectSpread({}, node), payload), {}, {
        data: _objectSpread(_objectSpread(_objectSpread({}, node.data), payload.data), {}, {
          settings: _objectSpread(_objectSpread({}, node.data.settings), payload.data.settings)
        })
      });
    }
    return node;
  });
  var newWorkflow = _objectSpread(_objectSpread({}, state.workflow), {}, {
    flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
      nodes: updatedNodes
    })
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: newWorkflow,
    editedWorkflowAttributes: _objectSpread(_objectSpread({}, state.editedWorkflowAttributes), {}, {
      flow: _objectSpread(_objectSpread({}, state.editedWorkflowAttributes.flow), {}, {
        nodes: updatedNodes
      })
    })
  });
};
var setDataTypes = function setDataTypes(state, action) {
  var payload = action.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    dataTypes: payload
  });
};
var addDataType = function addDataType(state, action) {
  var payload = action.payload.payload;
  return _objectSpread(_objectSpread({}, state), {}, {
    dataTypes: [].concat(_toConsumableArray(state.dataTypes), [payload])
  });
};
var setGlobalVariable = function setGlobalVariable(state, action) {
  var _action$payload2 = action.payload,
    name = _action$payload2.name,
    label = _action$payload2.label,
    type = _action$payload2.type,
    value = _action$payload2.value,
    runtimeOnly = _action$payload2.runtimeOnly,
    description = _action$payload2.description;
  var globalVariables = _objectSpread({}, state.globalVariables);
  globalVariables[name] = {
    name: name,
    type: type,
    value: value,
    label: label,
    runtimeOnly: runtimeOnly,
    description: description
  };
  return _objectSpread(_objectSpread({}, state), {}, {
    globalVariables: globalVariables
  });
};
var fetchTaxonomyTermsStart = function fetchTaxonomyTermsStart(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isFetchingTaxonomyTerms: true
  });
};
var fetchTaxonomyTermsSuccess = function fetchTaxonomyTermsSuccess(state, action) {
  var _result$terms;
  var _action$payload3 = action.payload,
    taxonomy = _action$payload3.taxonomy,
    result = _action$payload3.result;
  var terms = (result === null || result === void 0 || (_result$terms = result.terms) === null || _result$terms === void 0 ? void 0 : _result$terms.map(function (term) {
    return {
      value: term.id,
      label: term.name
    };
  })) || [];
  var newTaxonomyTerms = _objectSpread(_objectSpread({}, state.taxonomyTerms), {}, _defineProperty({}, taxonomy, terms));
  return _objectSpread(_objectSpread({}, state), {}, {
    isFetchingTaxonomyTerms: false,
    taxonomyTerms: newTaxonomyTerms
  });
};
var fetchTaxonomyTermsFailure = function fetchTaxonomyTermsFailure(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isFetchingTaxonomyTerms: false
  });
};
var incrementBaseSlugCounts = function incrementBaseSlugCounts(state, action) {
  var payload = action.payload;
  var newBaseSlugCounts = _objectSpread(_objectSpread({}, state.baseSlugCounts), {}, _defineProperty({}, payload, (state.baseSlugCounts[payload] || 0) + 1));
  return _objectSpread(_objectSpread({}, state), {}, {
    baseSlugCounts: newBaseSlugCounts
  });
};
var extractSlugParts = function extractSlugParts(slug) {
  if (!slug) {
    return {};
  }

  // The payload is a string with the format "baseSlug<count>"
  var matches = slug.match(/([a-zA-Z0-9]+)(\d+)$/);
  if (!matches) {
    return {};
  }
  return {
    baseSlug: matches[1],
    count: parseInt(matches[2])
  };
};
var calculateBaseSlugCount = function calculateBaseSlugCount(state, slug) {
  var slugParts = extractSlugParts(slug);
  var currentBaseSlugCount = state.baseSlugCounts[slugParts === null || slugParts === void 0 ? void 0 : slugParts.baseSlug] || 0;
  var baseSlugCount = (slugParts === null || slugParts === void 0 ? void 0 : slugParts.count) || 0;
  if (isNaN(baseSlugCount)) {
    return currentBaseSlugCount;
  }
  if (baseSlugCount > currentBaseSlugCount) {
    return baseSlugCount;
  }
  return currentBaseSlugCount;
};
var updateBaseSlugCounts = function updateBaseSlugCounts(state, action) {
  var payload = action.payload;
  var slugParts = extractSlugParts(payload);
  var baseSlugCount = calculateBaseSlugCount(state, payload);
  var baseSlug = slugParts === null || slugParts === void 0 ? void 0 : slugParts.baseSlug;
  if (!baseSlug) {
    return state;
  }
  if (!baseSlugCount) {
    return state;
  }
  return _objectSpread(_objectSpread({}, state), {}, {
    baseSlugCounts: _objectSpread(_objectSpread({}, state.baseSlugCounts), {}, _defineProperty({}, baseSlug, baseSlugCount))
  });
};
var addNodeError = function addNodeError(state, action) {
  var payload = action.payload;
  var theNodeErrors = state.nodeErrors[payload.nodeId] || {};
  theNodeErrors[payload.error] = {
    error: payload.error,
    message: payload.message,
    details: payload === null || payload === void 0 ? void 0 : payload.details
  };
  var nodeErrors = _objectSpread(_objectSpread({}, state.nodeErrors), {}, _defineProperty({}, payload.nodeId, theNodeErrors));
  return _objectSpread(_objectSpread({}, state), {}, {
    nodeErrors: nodeErrors
  });
};
var removeNodeError = function removeNodeError(state, action) {
  var payload = action.payload;
  var newErrors = _objectSpread({}, state.nodeErrors);
  if (!newErrors[payload.nodeId]) {
    return state;
  }
  delete newErrors[payload.nodeId][payload.error];
  return _objectSpread(_objectSpread({}, state), {}, {
    nodeErrors: newErrors
  });
};
var resetNodeErrors = function resetNodeErrors(state, action) {
  var payload = action.payload;
  var newErrors = _objectSpread({}, state.nodeErrors);
  delete newErrors[payload];
  return _objectSpread(_objectSpread({}, state), {}, {
    nodeErrors: newErrors
  });
};
var removeNode = function removeNode(state, action) {
  var payload = action.payload;

  // Remove the edges that are connected to the node
  var newEdges = state.workflow.flow.edges.filter(function (edge) {
    return edge.source !== payload && edge.target !== payload;
  });
  var newNodes = state.workflow.flow.nodes.filter(function (node) {
    return node.id !== payload;
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, {
      flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
        nodes: newNodes,
        edges: newEdges
      })
    }),
    selectedNodes: [],
    selectedEdges: []
  });
};
var removeEdge = function removeEdge(state, action) {
  var payload = action.payload;
  var newEdges = state.workflow.flow.edges.filter(function (edge) {
    return edge.id !== payload;
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, {
      flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
        edges: newEdges
      })
    }),
    selectedNodes: [],
    selectedEdges: []
  });
};
var removePlaceholderNodes = function removePlaceholderNodes(state, action) {
  var newNodes = state.workflow.flow.nodes.filter(function (node) {
    return node.data.elementaryType !== _constants__WEBPACK_IMPORTED_MODULE_0__.NODE_TYPE_PLACEHOLDER;
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    workflow: _objectSpread(_objectSpread({}, state.workflow), {}, {
      flow: _objectSpread(_objectSpread({}, state.workflow.flow), {}, {
        nodes: newNodes
      })
    })
  });
};
var setDraggingFromHandle = function setDraggingFromHandle(state, action) {
  var _action$payload4 = action.payload,
    sourceId = _action$payload4.sourceId,
    handleId = _action$payload4.handleId,
    handleType = _action$payload4.handleType;
  return _objectSpread(_objectSpread({}, state), {}, {
    draggingFromHandle: {
      sourceId: sourceId,
      handleId: handleId,
      handleType: handleType
    }
  });
};
var setIsConnectingNodes = function setIsConnectingNodes(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    isConnectingNodes: action.payload
  });
};
var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case 'CREATE_WORKFLOW_START':
      return createWorkflowStart(state, action);
    case 'CREATE_WORKFLOW_SUCCESS':
      return createWorkflowSuccess(state, action);
    case 'CREATE_WORKFLOW_FAILURE':
      return createWorkflowFailure(state, action);
    case 'LOAD_WORKFLOW_START':
      return loadWorkflowStart(state, action);
    case 'LOAD_WORKFLOW_SUCCESS':
      return loadWorkflowSuccess(state, action);
    case 'LOAD_WORKFLOW_FAILURE':
      return loadWorkflowFailure(state, action);
    case 'SAVE_AS_DRAFT_START':
      return saveAsDraftStart(state, action);
    case 'SAVE_AS_DRAFT_SUCCESS':
      return saveAsDraftSuccess(state, action);
    case 'SAVE_AS_DRAFT_FAILURE':
      return saveAsDraftFailure(state, action);
    case 'SWITCH_TO_DRAFT_START':
      return switchToDraftStart(state, action);
    case 'SWITCH_TO_DRAFT_SUCCESS':
      return switchToDraftSuccess(state, action);
    case 'SWITCH_TO_DRAFT_FAILURE':
      return switchToDraftFailure(state, action);
    case 'SAVE_AS_CURRENT_STATUS_START':
      return saveAsCurrentStatusStart(state, action);
    case 'SAVE_AS_CURRENT_STATUS_SUCCESS':
      return saveAsCurrentStatusSuccess(state, action);
    case 'SAVE_AS_CURRENT_STATUS_FAILURE':
      return saveAsCurrentStatusFailure(state, action);
    case 'PUBLISH_WORKFLOW_START':
      return publishWorkflowStart(state, action);
    case 'PUBLISH_WORKFLOW_SUCCESS':
      return publishWorkflowSuccess(state, action);
    case 'PUBLISH_WORKFLOW_FAILURE':
      return publishWorkflowFailure(state, action);
    case 'SET_EDITED_WORKFLOW_ATTRIBUTE':
      return setEditedWorkflowAttribute(state, action);
    case 'SET_POST_TYPE':
      return setPostType(state, action);
    case 'SET_NODES':
      return setNodes(state, action);
    case 'ADD_NODE':
      return addNode(state, action);
    case 'SET_EDGES':
      return setEdges(state, action);
    case 'ADD_EDGE':
      return addEdge(state, action);
    case 'SET_INITIAL_VIEWPORT':
      return setInitialViewport(state, action);
    case 'SET_SELECTED_NODES':
      return setSelectedNodes(state, action);
    case 'SET_SELECTED_EDGES':
      return setSelectedEdges(state, action);
    case 'UNSELECT_ALL':
      return unselectAll(state, action);
    case 'DELETE_WORKFLOW_START':
      return deleteWorkflowStart(state, action);
    case 'DELETE_WORKFLOW_SUCCESS':
      return deleteWorkflowSuccess(state, action);
    case 'DELETE_WORKFLOW_FAILURE':
      return deleteWorkflowFailure(state, action);
    case 'UPDATE_NODE':
      return updateNode(state, action);
    case 'SET_DATA_TYPES':
      return setDataTypes(state, action);
    case 'ADD_DATA_TYPE':
      return addDataType(state, action);
    case 'SET_GLOBAL_VARIABLE':
      return setGlobalVariable(state, action);
    case 'FETCH_TAXONOMY_TERMS_START':
      return fetchTaxonomyTermsStart(state, action);
    case 'FETCH_TAXONOMY_TERMS_SUCCESS':
      return fetchTaxonomyTermsSuccess(state, action);
    case 'FETCH_TAXONOMY_TERMS_FAILURE':
      return fetchTaxonomyTermsFailure(state, action);
    case 'INCREMENT_BASE_SLUG_COUNTS':
      return incrementBaseSlugCounts(state, action);
    case 'UPDATE_BASE_SLUG_COUNTS':
      return updateBaseSlugCounts(state, action);
    case 'ADD_NODE_ERROR':
      return addNodeError(state, action);
    case 'REMOVE_NODE_ERROR':
      return removeNodeError(state, action);
    case 'RESET_NODE_ERRORS':
      return resetNodeErrors(state, action);
    case 'REMOVE_NODE':
      return removeNode(state, action);
    case 'REMOVE_EDGE':
      return removeEdge(state, action);
    case 'REMOVE_PLACEHOLDER_NODES':
      return removePlaceholderNodes(state, action);
    case 'SET_DRAGGING_FROM_HANDLE':
      return setDraggingFromHandle(state, action);
    case 'SET_IS_CONNECTING_NODES':
      return setIsConnectingNodes(state, action);
  }
  return state;
};
function addWorkflowIdToUrl(workflowId) {
  window.history.pushState({}, '', "?page=future_workflow_editor&workflow=".concat(parseInt(workflowId)));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer);

/***/ }),

/***/ "./assets/jsx/workflow-editor/components/workflow-store/selectors.jsx":
/*!****************************************************************************!*\
  !*** ./assets/jsx/workflow-editor/components/workflow-store/selectors.jsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBaseSlugCounts: () => (/* binding */ getBaseSlugCounts),
/* harmony export */   getDataTypeByName: () => (/* binding */ getDataTypeByName),
/* harmony export */   getDataTypes: () => (/* binding */ getDataTypes),
/* harmony export */   getDraggingFromHandle: () => (/* binding */ getDraggingFromHandle),
/* harmony export */   getEdgeById: () => (/* binding */ getEdgeById),
/* harmony export */   getEdges: () => (/* binding */ getEdges),
/* harmony export */   getEditedWorkflowAttribute: () => (/* binding */ getEditedWorkflowAttribute),
/* harmony export */   getEditedWorkflowAttributes: () => (/* binding */ getEditedWorkflowAttributes),
/* harmony export */   getGlobalVariable: () => (/* binding */ getGlobalVariable),
/* harmony export */   getGlobalVariables: () => (/* binding */ getGlobalVariables),
/* harmony export */   getInitialViewport: () => (/* binding */ getInitialViewport),
/* harmony export */   getNodeById: () => (/* binding */ getNodeById),
/* harmony export */   getNodeErrors: () => (/* binding */ getNodeErrors),
/* harmony export */   getNodes: () => (/* binding */ getNodes),
/* harmony export */   getPostType: () => (/* binding */ getPostType),
/* harmony export */   getRayDebugShowEmails: () => (/* binding */ getRayDebugShowEmails),
/* harmony export */   getRayDebugShowQueries: () => (/* binding */ getRayDebugShowQueries),
/* harmony export */   getRayDebugShowWordPressErrors: () => (/* binding */ getRayDebugShowWordPressErrors),
/* harmony export */   getSelectedEdges: () => (/* binding */ getSelectedEdges),
/* harmony export */   getSelectedEdgesCount: () => (/* binding */ getSelectedEdgesCount),
/* harmony export */   getSelectedElementsCount: () => (/* binding */ getSelectedElementsCount),
/* harmony export */   getSelectedNodes: () => (/* binding */ getSelectedNodes),
/* harmony export */   getSelectedNodesCount: () => (/* binding */ getSelectedNodesCount),
/* harmony export */   getTaxonomyTerms: () => (/* binding */ getTaxonomyTerms),
/* harmony export */   getWorkflow: () => (/* binding */ getWorkflow),
/* harmony export */   getWorkflowStatus: () => (/* binding */ getWorkflowStatus),
/* harmony export */   hasSelectedEdges: () => (/* binding */ hasSelectedEdges),
/* harmony export */   hasSelectedNodes: () => (/* binding */ hasSelectedNodes),
/* harmony export */   isAutosavingWorkflow: () => (/* binding */ isAutosavingWorkflow),
/* harmony export */   isConnectingNodes: () => (/* binding */ isConnectingNodes),
/* harmony export */   isCreatingWorkflow: () => (/* binding */ isCreatingWorkflow),
/* harmony export */   isCurrentWorkflowPublished: () => (/* binding */ isCurrentWorkflowPublished),
/* harmony export */   isDeletingWorkflow: () => (/* binding */ isDeletingWorkflow),
/* harmony export */   isEditedWorkflowDirty: () => (/* binding */ isEditedWorkflowDirty),
/* harmony export */   isEditedWorkflowSaveable: () => (/* binding */ isEditedWorkflowSaveable),
/* harmony export */   isLoadingWorkflow: () => (/* binding */ isLoadingWorkflow),
/* harmony export */   isNewWorkflow: () => (/* binding */ isNewWorkflow),
/* harmony export */   isPublishedWorkflow: () => (/* binding */ isPublishedWorkflow),
/* harmony export */   isSavingWorkflow: () => (/* binding */ isSavingWorkflow)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./assets/jsx/workflow-editor/utils.jsx");

var getPostType = function getPostType(state) {
  return state.postType;
};
var getNodes = function getNodes(state) {
  return state.workflow.flow.nodes;
};
var getEdges = function getEdges(state) {
  return state.workflow.flow.edges;
};
var getNodeById = function getNodeById(state, id) {
  return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getNodeById)(id, state.workflow.flow.nodes);
};
var getEdgeById = function getEdgeById(state, id) {
  return state.workflow.flow.edges.find(function (edge) {
    return edge.id === id;
  });
};
var getSelectedNodes = function getSelectedNodes(state) {
  return state.selectedNodes;
};
var getSelectedEdges = function getSelectedEdges(state) {
  return state.selectedEdges;
};
var hasSelectedNodes = function hasSelectedNodes(state) {
  return state.selectedNodes.length > 0;
};
var hasSelectedEdges = function hasSelectedEdges(state) {
  return state.selectedEdges.length > 0;
};
var getWorkflowStatus = function getWorkflowStatus(state) {
  return state.workflow.status;
};
var getWorkflow = function getWorkflow(state) {
  return state.workflow;
};
var getEditedWorkflowAttributes = function getEditedWorkflowAttributes(state) {
  return state.editedWorkflowAttributes;
};
var getEditedWorkflowAttribute = function getEditedWorkflowAttribute(state, key) {
  var attributes = state.workflow;
  if (!attributes.hasOwnProperty(key)) {
    return state.workflow[key];
  }
  return state.workflow[key];
};
var isLoadingWorkflow = function isLoadingWorkflow(state) {
  return !!state.isLoadingWorkflow;
};
var isCreatingWorkflow = function isCreatingWorkflow(state) {
  return !!state.isCreatingWorkflow;
};
var isEditedWorkflowDirty = function isEditedWorkflowDirty(state) {
  return Object.keys(state.editedWorkflowAttributes).length > 0;
};
var isNewWorkflow = function isNewWorkflow(state) {
  return !!state.isNewWorkflow;
};
var getInitialViewport = function getInitialViewport(state) {
  return state.initialViewport;
};
var isSavingWorkflow = function isSavingWorkflow(state) {
  return !!state.isSavingWorkflow;
};
var isPublishedWorkflow = function isPublishedWorkflow(state) {
  return state.workflow.status === 'publish';
};
var isDeletingWorkflow = function isDeletingWorkflow(state) {
  return !!state.isDeletingWorkflow;
};
var isAutosavingWorkflow = function isAutosavingWorkflow(state) {
  return !!state.isAutosavingWorkflow;
};
var isEditedWorkflowSaveable = function isEditedWorkflowSaveable(state) {
  var title;
  if (state.editedWorkflowAttributes.hasOwnProperty('title')) {
    title = state.editedWorkflowAttributes.title;
  } else {
    title = state.workflow.title;
  }
  return Object.keys(state.editedWorkflowAttributes).length > 0 && !state.isSavingWorkflow && !state.isAutosavingWorkflow && String(title).trim() !== '';
};
var isCurrentWorkflowPublished = function isCurrentWorkflowPublished(state) {
  return state.isCurrentWorkflowPublished;
};
var getSelectedElementsCount = function getSelectedElementsCount(state) {
  return state.selectedNodes.length + state.selectedEdges.length;
};
var getSelectedNodesCount = function getSelectedNodesCount(state) {
  return state.selectedNodes.length;
};
var getSelectedEdgesCount = function getSelectedEdgesCount(state) {
  return state.selectedEdges.length;
};
var getDataTypes = function getDataTypes(state) {
  return state.dataTypes;
};
var getDataTypeByName = function getDataTypeByName(state, name) {
  return state.dataTypes.find(function (dataType) {
    return dataType.name === name;
  });
};
function getGlobalVariables(state) {
  return state.globalVariables;
}
function getGlobalVariable(state, name) {
  return state.globalVariables.find(function (variable) {
    return variable.name === name;
  });
}
function getTaxonomyTerms(state, taxnomy) {
  return state.taxonomyTerms[taxnomy] || [];
}
function getBaseSlugCounts(state) {
  return state.baseSlugCounts;
}
function getNodeErrors(state, nodeId) {
  return state.nodeErrors[nodeId] || [];
}
function getDraggingFromHandle(state) {
  return state.draggingFromHandle;
}
function isConnectingNodes(state) {
  return !!state.isConnectingNodes;
}
function getRayDebugShowQueries(state) {
  return state.rayDebug.showQueries;
}
function getRayDebugShowEmails(state) {
  return state.rayDebug.showEmails;
}
function getRayDebugShowWordPressErrors(state) {
  return state.rayDebug.showWordPressErrors;
}

/***/ }),

/***/ "./assets/jsx/workflow-editor/constants.jsx":
/*!**************************************************!*\
  !*** ./assets/jsx/workflow-editor/constants.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EVENT_DROP_NODE: () => (/* binding */ EVENT_DROP_NODE),
/* harmony export */   FEATURE_ADVANCED_SETTINGS: () => (/* binding */ FEATURE_ADVANCED_SETTINGS),
/* harmony export */   FEATURE_CONTROLS: () => (/* binding */ FEATURE_CONTROLS),
/* harmony export */   FEATURE_DEVELOPER_MODE: () => (/* binding */ FEATURE_DEVELOPER_MODE),
/* harmony export */   FEATURE_FULLSCREEN_MODE: () => (/* binding */ FEATURE_FULLSCREEN_MODE),
/* harmony export */   FEATURE_INSERTER: () => (/* binding */ FEATURE_INSERTER),
/* harmony export */   FEATURE_MINI_MAP: () => (/* binding */ FEATURE_MINI_MAP),
/* harmony export */   FEATURE_MOST_USED_NODES: () => (/* binding */ FEATURE_MOST_USED_NODES),
/* harmony export */   FEATURE_REDUCED_UI: () => (/* binding */ FEATURE_REDUCED_UI),
/* harmony export */   FEATURE_SHOW_ICON_LABELS: () => (/* binding */ FEATURE_SHOW_ICON_LABELS),
/* harmony export */   FEATURE_WELCOME_GUIDE: () => (/* binding */ FEATURE_WELCOME_GUIDE),
/* harmony export */   HANDLE_TYPE_SOURCE: () => (/* binding */ HANDLE_TYPE_SOURCE),
/* harmony export */   HANDLE_TYPE_TARGET: () => (/* binding */ HANDLE_TYPE_TARGET),
/* harmony export */   HTML_ELEMENT_ID: () => (/* binding */ HTML_ELEMENT_ID),
/* harmony export */   INSERTER_TAB_ACTIONS: () => (/* binding */ INSERTER_TAB_ACTIONS),
/* harmony export */   INSERTER_TAB_ADVANCED: () => (/* binding */ INSERTER_TAB_ADVANCED),
/* harmony export */   INSERTER_TAB_TRIGGERS: () => (/* binding */ INSERTER_TAB_TRIGGERS),
/* harmony export */   NODE_TYPE_ACTION: () => (/* binding */ NODE_TYPE_ACTION),
/* harmony export */   NODE_TYPE_ADVANCED: () => (/* binding */ NODE_TYPE_ADVANCED),
/* harmony export */   NODE_TYPE_PLACEHOLDER: () => (/* binding */ NODE_TYPE_PLACEHOLDER),
/* harmony export */   NODE_TYPE_TRIGGER: () => (/* binding */ NODE_TYPE_TRIGGER),
/* harmony export */   POST_TYPE: () => (/* binding */ POST_TYPE),
/* harmony export */   SLOT_SCOPE_WORKFLOW_EDITOR: () => (/* binding */ SLOT_SCOPE_WORKFLOW_EDITOR)
/* harmony export */ });
var POST_TYPE = 'ppfuture_workflow';
var HTML_ELEMENT_ID = 'future-workflow-editor';
var FEATURE_FULLSCREEN_MODE = 'fullscreenMode';
var FEATURE_REDUCED_UI = 'reducedUI';
var FEATURE_SHOW_ICON_LABELS = 'showIconLabels';
var FEATURE_INSERTER = 'inserter';
var FEATURE_MOST_USED_NODES = 'mostUsedNodes';
var FEATURE_DEVELOPER_MODE = 'developerMode';
var FEATURE_WELCOME_GUIDE = 'welcomeGuide';
var FEATURE_ADVANCED_SETTINGS = 'advancedSettings';
var FEATURE_MINI_MAP = 'miniMap';
var FEATURE_CONTROLS = 'controls';
var INSERTER_TAB_TRIGGERS = 'triggers';
var INSERTER_TAB_ACTIONS = 'actions';
var INSERTER_TAB_ADVANCED = 'advanced';
var SLOT_SCOPE_WORKFLOW_EDITOR = 'publishpress-future/edit-workflow';
var EVENT_DROP_NODE = 'application/future-workflow-editor-node';
var NODE_TYPE_TRIGGER = 'trigger';
var NODE_TYPE_ACTION = 'action';
var NODE_TYPE_ADVANCED = 'advanced';
var NODE_TYPE_PLACEHOLDER = 'placeholder';
var HANDLE_TYPE_TARGET = 'target';
var HANDLE_TYPE_SOURCE = 'source';

/***/ }),

/***/ "./assets/jsx/workflow-editor/utils.jsx":
/*!**********************************************!*\
  !*** ./assets/jsx/workflow-editor/utils.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBodyClass: () => (/* binding */ addBodyClass),
/* harmony export */   addBodyClasses: () => (/* binding */ addBodyClasses),
/* harmony export */   createNewNode: () => (/* binding */ createNewNode),
/* harmony export */   filterVariableOptionsByDataType: () => (/* binding */ filterVariableOptionsByDataType),
/* harmony export */   getExpandedVariablesList: () => (/* binding */ getExpandedVariablesList),
/* harmony export */   getGlobalVariablesExpanded: () => (/* binding */ getGlobalVariablesExpanded),
/* harmony export */   getId: () => (/* binding */ getId),
/* harmony export */   getNodeById: () => (/* binding */ getNodeById),
/* harmony export */   getNodeIncomers: () => (/* binding */ getNodeIncomers),
/* harmony export */   getNodeIncomersRecursively: () => (/* binding */ getNodeIncomersRecursively),
/* harmony export */   getNodeInputVariables: () => (/* binding */ getNodeInputVariables),
/* harmony export */   getNodeInputs: () => (/* binding */ getNodeInputs),
/* harmony export */   getNodeMenuDefaultClassName: () => (/* binding */ getNodeMenuDefaultClassName),
/* harmony export */   getNodeOutgoers: () => (/* binding */ getNodeOutgoers),
/* harmony export */   incrementAndGetNodeSlug: () => (/* binding */ incrementAndGetNodeSlug),
/* harmony export */   isAppleOS: () => (/* binding */ isAppleOS),
/* harmony export */   isValidDataType: () => (/* binding */ isValidDataType),
/* harmony export */   mapNodeInputs: () => (/* binding */ mapNodeInputs),
/* harmony export */   newTriggerPlaceholderNode: () => (/* binding */ newTriggerPlaceholderNode),
/* harmony export */   nodeHasIncomers: () => (/* binding */ nodeHasIncomers),
/* harmony export */   nodeHasInput: () => (/* binding */ nodeHasInput),
/* harmony export */   nodeHasOutgoers: () => (/* binding */ nodeHasOutgoers),
/* harmony export */   nodeHasOutput: () => (/* binding */ nodeHasOutput),
/* harmony export */   removeBodyClass: () => (/* binding */ removeBodyClass),
/* harmony export */   removeBodyClasses: () => (/* binding */ removeBodyClasses),
/* harmony export */   stripTags: () => (/* binding */ stripTags),
/* harmony export */   updateFlowInEditedWorkflow: () => (/* binding */ updateFlowInEditedWorkflow)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_workflow_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/workflow-store */ "./assets/jsx/workflow-editor/components/workflow-store/index.jsx");
/* harmony import */ var _components_editor_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/editor-store */ "./assets/jsx/workflow-editor/components/editor-store/index.jsx");
/* harmony import */ var reactflow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! reactflow */ "./node_modules/@reactflow/core/dist/esm/index.mjs");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./assets/jsx/workflow-editor/constants.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






var VARIABLE_SOURCE_NODE_INPUT = 'node-input';
var VARIABLE_SOURCE_GLOBAL = 'global';
function addBodyClass(className) {
  if (document.body.classList.contains(className)) return;
  document.body.classList.add(className);
}
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

/**
 * Returns the block's default menu item classname from its name.
 *
 * @param {string} blockName The block name.
 *
 * @return {string} The block's default menu item class.
 */
function getNodeMenuDefaultClassName(blockName) {
  // Generated HTML classes for blocks follow the `editor-block-list-item-{name}` nomenclature.
  // Blocks provided by WordPress drop the prefixes 'core/' or 'core-' (historically used in 'core-embed/').
  var className = "editor-block-list-item-" + blockName.replace(/\//, "-").replace(/^core-/, "");
  return (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.applyFilters)("future-pro.getNodeMenuDefaultClassName", className, blockName);
}

/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window window object by default; used for DI testing.
 *
 * @return {boolean} True if MacOS; false otherwise.
 */
function isAppleOS() {
  var _window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var platform = _window.navigator.platform;
  return platform.indexOf("Mac") !== -1 || ["iPad", "iPhone"].includes(platform);
}
function getNodeIncomers(node) {
  var nodes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getNodes();
  var edges = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getEdges();
  if (!node) return [];
  return (0,reactflow__WEBPACK_IMPORTED_MODULE_5__.getIncomers)(node, nodes, edges);
}
function getNodeIncomersRecursively(node) {
  var incomers = getNodeIncomers(node);
  if (!incomers.length) {
    return [];
  }
  var allIncomers = incomers;
  incomers.forEach(function (incomer) {
    var incomerIncomers = getNodeIncomersRecursively(incomer);
    allIncomers = allIncomers.concat(incomerIncomers);
  });
  return allIncomers;
}
function nodeHasIncomers(node) {
  var incomers = getNodeIncomers(node);
  var nodeHasIncomers = (incomers === null || incomers === void 0 ? void 0 : incomers.length) > 0;
  return nodeHasIncomers;
}
function getNodeOutgoers(node) {
  var nodes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getNodes();
  var edges = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getEdges();
  if (!node) return [];
  return (0,reactflow__WEBPACK_IMPORTED_MODULE_5__.getOutgoers)(node, nodes, edges);
}
function nodeHasOutgoers(node) {
  var outgoers = getNodeOutgoers(node);
  var nodeHasOutgoers = (outgoers === null || outgoers === void 0 ? void 0 : outgoers.length) > 0;
  return nodeHasOutgoers;
}
function nodeHasInput(node) {
  var _node$data, _incomers$filter;
  var nodeType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_editor_store__WEBPACK_IMPORTED_MODULE_3__.store).getNodeTypeByName(node === null || node === void 0 || (_node$data = node.data) === null || _node$data === void 0 ? void 0 : _node$data.name);
  var incomers = getNodeIncomers(node);
  var nodeHasIncomers = (incomers === null || incomers === void 0 ? void 0 : incomers.length) > 0;
  var nodeHasInput = nodeHasIncomers && ((_incomers$filter = incomers.filter(function (incomer) {
    var _nodeType$outputSchem;
    return (nodeType === null || nodeType === void 0 || (_nodeType$outputSchem = nodeType.outputSchema) === null || _nodeType$outputSchem === void 0 ? void 0 : _nodeType$outputSchem.length) > 0;
  })) === null || _incomers$filter === void 0 ? void 0 : _incomers$filter.length) > 0;
  return nodeHasInput;
}
function nodeHasOutput(node) {
  var _node$data2, _nodeType$outputSchem2;
  var nodeType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_editor_store__WEBPACK_IMPORTED_MODULE_3__.store).getNodeTypeByName(node === null || node === void 0 || (_node$data2 = node.data) === null || _node$data2 === void 0 ? void 0 : _node$data2.name);
  var nodeHasOutput = (nodeType === null || nodeType === void 0 || (_nodeType$outputSchem2 = nodeType.outputSchema) === null || _nodeType$outputSchem2 === void 0 ? void 0 : _nodeType$outputSchem2.length) > 0;
  return nodeHasOutput;
}
function getNodeInputs(node) {
  var _node$data3;
  var nodeType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_editor_store__WEBPACK_IMPORTED_MODULE_3__.store).getNodeTypeByName(node === null || node === void 0 || (_node$data3 = node.data) === null || _node$data3 === void 0 ? void 0 : _node$data3.name);
  var incomers = getNodeIncomers(node);
  var nodeHasIncomers = (incomers === null || incomers === void 0 ? void 0 : incomers.length) > 0;
  var getDataTypeByName = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getDataTypeByName;
  if (!nodeHasIncomers) {
    return [];
  }
  var nodeInputs = [];
  incomers.forEach(function (incomer) {
    var _nodeType$outputSchem3;
    if (!(nodeType !== null && nodeType !== void 0 && (_nodeType$outputSchem3 = nodeType.outputSchema) !== null && _nodeType$outputSchem3 !== void 0 && _nodeType$outputSchem3.length)) {
      return;
    }
    nodeType === null || nodeType === void 0 || nodeType.outputSchema.forEach(function (schemaItem) {
      var dataType = getDataTypeByName(schemaItem.type);

      // If input, look for the previous node inputs to bypass as this node's input
      if (schemaItem.type === 'input') {
        var previousNodeInputs = getNodeInputs(incomer);
        nodeInputs = nodeInputs.concat(previousNodeInputs);
      } else {
        nodeInputs.push({
          incomerId: incomer.id,
          name: schemaItem.name,
          type: schemaItem.type,
          label: schemaItem.label,
          description: schemaItem.description,
          dataType: dataType
        });
      }
    });
  });

  // Make sure we don't have repeated inputs, #712
  nodeInputs = nodeInputs.filter(function (input, index, self) {
    return index === self.findIndex(function (t) {
      return t.name === input.name && t.type === input.type;
    });
  });
  return nodeInputs;
}
function getNodeInputVariables(node) {
  var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var addInputPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var nodeInputs = getNodeInputs(node);
  var variables = [];
  if (types.length) {
    variables = nodeInputs.filter(function (input) {
      return types.includes(input.type);
    });
  } else {
    variables = nodeInputs;
  }
  variables = variables.map(function (variable) {
    var variableName = addInputPrefix ? 'input.' + variable.name : variable.name;
    return {
      name: variableName,
      type: variable.type,
      label: variable.label,
      source: VARIABLE_SOURCE_NODE_INPUT
    };
  });
  return variables;
}
function getGlobalVariablesExpanded(globalVariables) {
  var globalVariablesExpanded = [];
  Object.keys(globalVariables).forEach(function (variableName) {
    var variable = globalVariables[variableName];
    globalVariablesExpanded.push({
      name: variableName,
      type: variable.type,
      label: variable.label,
      source: VARIABLE_SOURCE_GLOBAL,
      description: variable.description
    });
  });

  // Add "global." prefix to all global variables
  globalVariablesExpanded.forEach(function (variable) {
    variable.name = 'global.' + variable.name;
  });
  return globalVariablesExpanded;
}
function mapNodeInputs(node) {
  var getNodeTypeByName = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_editor_store__WEBPACK_IMPORTED_MODULE_3__.store).getNodeTypeByName;
  var previousNodes = getNodeIncomers(node);
  var mappedInput = [];
  previousNodes.forEach(function (previousNode) {
    var _previousNode$data, _nodeType$outputSchem4;
    var nodeType = getNodeTypeByName((_previousNode$data = previousNode.data) === null || _previousNode$data === void 0 ? void 0 : _previousNode$data.name);
    if (!(nodeType !== null && nodeType !== void 0 && (_nodeType$outputSchem4 = nodeType.outputSchema) !== null && _nodeType$outputSchem4 !== void 0 && _nodeType$outputSchem4.length)) {
      return;
    }
    nodeType.outputSchema.forEach(function (outputItem) {
      if (outputItem.type === "input") {
        // Get the previous node outputs to bypass to this node as input
        var previousNodeInputs = mapNodeInputs(previousNode);
        previousNodeInputs.map(function (inputItem) {
          mappedInput.push(_objectSpread(_objectSpread({}, inputItem), {}, {
            name: "".concat(inputItem.name),
            type: inputItem.type,
            nodeLabel: nodeType.label
          }));
        });
      } else {
        mappedInput.push(_objectSpread(_objectSpread({}, outputItem), {}, {
          name: "".concat(previousNode.data.slug, ".").concat(outputItem.name),
          type: outputItem.type,
          nodeLabel: nodeType.label
        }));
      }
    });
  });

  // Remove duplicated inputs
  var uniqueMappedInputs = mappedInput.filter(function (input, index, self) {
    return index === self.findIndex(function (t) {
      return t.name === input.name;
    });
  } // eslint-disable-line
  );

  // Sort inputs by name
  uniqueMappedInputs.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return uniqueMappedInputs;
}
function getExpandedVariablesList(node, globalVariables) {
  var variablesList = getVariablesList(node, globalVariables);
  var expandedList = [];
  variablesList.forEach(function (variable) {
    expandedList.push(expandVariable(variable));
  });
  return expandedList;
}
function getVariablesList(node, globalVariables) {
  var mappedNodeInputs = mapNodeInputs(node);
  var globalVariablesToList = getGlobalVariablesExpanded(globalVariables);
  return [].concat(_toConsumableArray(mappedNodeInputs), _toConsumableArray(globalVariablesToList));
}
function convertVariableToOptions(variable) {
  return {
    name: variable.name,
    label: variable.label,
    children: [],
    type: variable.type,
    itemsType: variable === null || variable === void 0 ? void 0 : variable.itemsType,
    description: variable === null || variable === void 0 ? void 0 : variable.description
  };
}
function getVariableProperties(variable) {
  var _dataType$propertiesS;
  var getDataTypeByName = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getDataTypeByName;
  var dataType = getDataTypeByName(variable.type);
  if (!(dataType !== null && dataType !== void 0 && (_dataType$propertiesS = dataType.propertiesSchema) !== null && _dataType$propertiesS !== void 0 && _dataType$propertiesS.length)) {
    return [];
  }
  var properties = dataType.propertiesSchema.map(function (property) {
    var propertyData = {
      name: variable.name + '.' + property.name,
      label: property.label,
      type: property === null || property === void 0 ? void 0 : property.type,
      itemsType: property === null || property === void 0 ? void 0 : property.itemsType,
      description: property === null || property === void 0 ? void 0 : property.description,
      children: []
    };
    if (dataType.type === 'object') {
      propertyData.children = getVariableProperties(propertyData);
    }
    return propertyData;
  });
  return properties;
}
function expandVariable(variable) {
  var getDataTypeByName = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getDataTypeByName;
  var dataType = getDataTypeByName(variable.type);
  var option = convertVariableToOptions(variable);

  // If the variable is an object, add its properties as children
  if (dataType.type === 'object') {
    option.children = getVariableProperties(variable);
  }
  return option;
}
function isValidDataType(dataType, expectedDataTypes) {
  var hasValidDataType = true;
  if (expectedDataTypes !== null && expectedDataTypes !== void 0 && expectedDataTypes.length) {
    hasValidDataType = expectedDataTypes.includes(dataType === null || dataType === void 0 ? void 0 : dataType.type);
    if ((dataType === null || dataType === void 0 ? void 0 : dataType.type) === 'object' && !hasValidDataType) {
      hasValidDataType = expectedDataTypes.includes(dataType === null || dataType === void 0 ? void 0 : dataType.objectType);
    }
  }
  return hasValidDataType;
}
function filterVariableOptionsByDataType(variables, expectedDataTypes) {
  var getDataTypeByName = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getDataTypeByName;
  var filteredVariables = [];
  variables.forEach(function (variable) {
    var dataType = getDataTypeByName(variable.type);
    var itemsType = variable === null || variable === void 0 ? void 0 : variable.itemsType;
    var variableHasValidDataType = isValidDataType(dataType, expectedDataTypes);
    if (variable.type === 'array' && itemsType && !variableHasValidDataType) {
      var expectedItemsDataTypes = expectedDataTypes.map(function (type) {
        if (type.startsWith('array:')) {
          return type.replace('array:', '');
        }
        return null;
      });
      var itemsDataType = getDataTypeByName(itemsType);
      variableHasValidDataType = isValidDataType(itemsDataType, expectedItemsDataTypes);
    }
    var validVariable = null;
    var validChildren = [];

    // Desn't include the variable properties if the variable itself is invalid
    if (dataType.type === 'object') {
      var properties = dataType.propertiesSchema;

      // Ignore the properties if the variable itself is valid.
      properties.forEach(function (property) {
        var propertyDataType = getDataTypeByName(property.type);
        var propertyHasValidDataType = isValidDataType(propertyDataType, expectedDataTypes);
        if (propertyHasValidDataType) {
          validChildren.push({
            id: variable.id + '.' + property.name,
            name: variable.name + ' -> ' + property.label
          });
        }
      });
      validVariable = {
        id: variable.name,
        name: variable.label,
        children: validChildren,
        type: variable.type
      };
      if (variableHasValidDataType) {
        filteredVariables.push(validVariable);
      } else if (validChildren.length) {
        filteredVariables = filteredVariables.concat(validChildren);
      }
    } else {
      if (variableHasValidDataType) {
        filteredVariables.push({
          id: variable.name,
          name: variable.label,
          children: [],
          type: variable.type
        });
      }
    }
  });
  return filteredVariables;
}
var getId = function getId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "node";
  // We are subtracting the current date from the date 2024-01-01,
  // and using a 32 base number to get a smaller number
  var currentTimestamp = new Date().getTime();
  var pastTimestamp = new Date('2024-01-01 00:00:00').getTime();
  var UID = (currentTimestamp - pastTimestamp).toString(32);
  return "".concat(prefix, "_").concat(UID);
};
function incrementAndGetNodeSlug(nodeItem) {
  var nodeType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_editor_store__WEBPACK_IMPORTED_MODULE_3__.store).getNodeTypeByName(nodeItem.name);
  var baseSlugCounts = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getBaseSlugCounts();
  var baseSlug = nodeType.baseSlug;
  if (!baseSlug) {
    baseSlug = "node";
  }
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).incrementBaseSlugCounts(baseSlug);
  var count = baseSlugCounts[baseSlug] || 0;
  return "".concat(baseSlug).concat(count + 1);
}
;
function createNewNode(_ref) {
  var _item$baseSlug;
  var item = _ref.item,
    position = _ref.position,
    reactFlowInstance = _ref.reactFlowInstance;
  var slug = incrementAndGetNodeSlug(item);
  var nodes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getNodes();
  var idPrefix = (_item$baseSlug = item.baseSlug) !== null && _item$baseSlug !== void 0 ? _item$baseSlug : "node";
  var newNode = {
    id: getId(idPrefix),
    type: item.type,
    position: position,
    data: {
      name: item.name,
      elementaryType: item.elementaryType,
      version: item.version,
      slug: slug,
      settings: {}
    }
  };

  // Add default settings values if specified in the node type settings schema.
  if (item.settingsSchema) {
    item.settingsSchema.forEach(function (panel) {
      panel.fields.forEach(function (field) {
        if (field.default === undefined) {
          return;
        }
        newNode.data.settings[field.name] = field.default;
      });
    });
  }
  nodes = nodes.filter(function (node) {
    return node.data.elementaryType !== _constants__WEBPACK_IMPORTED_MODULE_4__.NODE_TYPE_PLACEHOLDER;
  });
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).setNodes(nodes.concat(newNode));
  updateFlowInEditedWorkflow(reactFlowInstance);
  return newNode;
}
function updateFlowInEditedWorkflow(reactFlowInstance) {
  // We need to delay the update of the flow to avoid missing the changes.
  setTimeout(function () {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).setEditedWorkflowAttribute("flow", reactFlowInstance.toObject());
  }, 400);
}
var newTriggerPlaceholderNode = function newTriggerPlaceholderNode() {
  return {
    id: getId("triggerPlaceholder"),
    type: 'triggerPlaceholder',
    position: {
      x: 0,
      y: 0
    },
    data: {
      name: 'placeholder/trigger',
      elementaryType: _constants__WEBPACK_IMPORTED_MODULE_4__.NODE_TYPE_PLACEHOLDER,
      version: 1,
      slug: 'triggerPlaceholder1'
    }
  };
};
function getNodeById(id) {
  var nodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!nodes) {
    nodes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_components_workflow_store__WEBPACK_IMPORTED_MODULE_2__.store).getNodes();
  }
  return nodes.find(function (node) {
    return node.id === id;
  });
}
function stripTags(string) {
  return string.replace(/<[^>]*>?/gm, '');
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/block-editor.css":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/block-editor.css ***!
  \************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.future-action-enable-checkbox {
    width: 100% !important;
}
`, "",{"version":3,"sources":["webpack://./assets/jsx/components/css/block-editor.css"],"names":[],"mappings":"AAAA;IACI,sBAAsB;AAC1B","sourcesContent":[".future-action-enable-checkbox {\n    width: 100% !important;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/dateOffsetPreview.css":
/*!*****************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/dateOffsetPreview.css ***!
  \*****************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.publishpress-future-date-preview .publishpress-future-date-preview-value {
    font-family: monospace;
    background-color: #e7e7e7;
    padding: 4px 6px;
    display: inline-block;
    min-width: 140px;
    min-height: 20px;
}

.publishpress-future-date-preview.compact .publishpress-future-date-preview-label {
    display: block;
}

.publishpress-future-date-preview.compact {
    margin-bottom: 8px;
}

.publishpress-future-date-preview.compact h4 {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: calc(8px);
    padding: 0px;
    flex-shrink: 0;
    margin-right: 12px;
    max-width: 75%;
    margin-top: 0;
}

.publishpress-future-notice.publishpress-future-notice-error {
    color: #dc3232;
}
`, "",{"version":3,"sources":["webpack://./assets/jsx/components/css/dateOffsetPreview.css"],"names":[],"mappings":"AAAA;IACI,sBAAsB;IACtB,yBAAyB;IACzB,gBAAgB;IAChB,qBAAqB;IACrB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,yBAAyB;IACzB,qBAAqB;IACrB,wBAAwB;IACxB,YAAY;IACZ,cAAc;IACd,kBAAkB;IAClB,cAAc;IACd,aAAa;AACjB;;AAEA;IACI,cAAc;AAClB","sourcesContent":[".publishpress-future-date-preview .publishpress-future-date-preview-value {\n    font-family: monospace;\n    background-color: #e7e7e7;\n    padding: 4px 6px;\n    display: inline-block;\n    min-width: 140px;\n    min-height: 20px;\n}\n\n.publishpress-future-date-preview.compact .publishpress-future-date-preview-label {\n    display: block;\n}\n\n.publishpress-future-date-preview.compact {\n    margin-bottom: 8px;\n}\n\n.publishpress-future-date-preview.compact h4 {\n    font-size: 11px;\n    font-weight: 500;\n    line-height: 1.4;\n    text-transform: uppercase;\n    display: inline-block;\n    margin-bottom: calc(8px);\n    padding: 0px;\n    flex-shrink: 0;\n    margin-right: 12px;\n    max-width: 75%;\n    margin-top: 0;\n}\n\n.publishpress-future-notice.publishpress-future-notice-error {\n    color: #dc3232;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



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

/***/ "./assets/jsx/components/css/block-editor.css":
/*!****************************************************!*\
  !*** ./assets/jsx/components/css/block-editor.css ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_block_editor_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js!./block-editor.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/block-editor.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_block_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_block_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_block_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_block_editor_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./assets/jsx/components/css/dateOffsetPreview.css":
/*!*********************************************************!*\
  !*** ./assets/jsx/components/css/dateOffsetPreview.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js!./dateOffsetPreview.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./assets/jsx/components/css/dateOffsetPreview.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_dateOffsetPreview_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



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



if (false) {} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js");
}


/***/ }),

/***/ "./node_modules/use-sync-external-store/shim/with-selector.js":
/*!********************************************************************!*\
  !*** ./node_modules/use-sync-external-store/shim/with-selector.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (false) {} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim/with-selector.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js");
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDOM;

/***/ }),

/***/ "@wordpress/components":
/*!********************************!*\
  !*** external "wp.components" ***!
  \********************************/
/***/ ((module) => {

module.exports = wp.components;

/***/ }),

/***/ "@wordpress/data":
/*!**************************!*\
  !*** external "wp.data" ***!
  \**************************/
/***/ ((module) => {

module.exports = wp.data;

/***/ }),

/***/ "@wordpress/element":
/*!*****************************!*\
  !*** external "wp.element" ***!
  \*****************************/
/***/ ((module) => {

module.exports = wp.element;

/***/ }),

/***/ "@wordpress/hooks":
/*!***************************!*\
  !*** external "wp.hooks" ***!
  \***************************/
/***/ ((module) => {

module.exports = wp.hooks;

/***/ }),

/***/ "@wordpress/i18n":
/*!**************************!*\
  !*** external "wp.i18n" ***!
  \**************************/
/***/ ((module) => {

module.exports = wp.i18n;

/***/ }),

/***/ "@wordpress/plugins":
/*!*****************************!*\
  !*** external "wp.plugins" ***!
  \*****************************/
/***/ ((module) => {

module.exports = wp.plugins;

/***/ }),

/***/ "@wordpress/url":
/*!*************************!*\
  !*** external "wp.url" ***!
  \*************************/
/***/ ((module) => {

module.exports = wp.url;

/***/ }),

/***/ "./node_modules/@reactflow/core/dist/esm/index.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/@reactflow/core/dist/esm/index.mjs ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
/* harmony export */   reconnectEdge: () => (/* binding */ reconnectEdge),
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
        centerX = center.x ?? defaultCenterX;
        centerY = center.y ?? defaultCenterY;
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
const reconnectEdge = (oldEdge, newConnection, edges, options = { shouldReplaceId: true }) => {
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
/**
 *
 * @deprecated Use `reconnectEdge` instead.
 */
const updateEdge = (oldEdge, newConnection, edges, options = { shouldReplaceId: true }) => {
    console.warn('[DEPRECATED] `updateEdge` is deprecated. Instead use `reconnectEdge` https://reactflow.dev/api-reference/utils/reconnect-edge');
    return reconnectEdge(oldEdge, newConnection, edges, options);
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

function handlePointerDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, edgeUpdaterType, onReconnectEnd, }) {
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
            onReconnectEnd?.(event);
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
    selectedEdges: s.edges.filter((e) => e.selected).map((e) => ({ ...e })),
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
    const parentId = node.parentNode || node.parentId;
    if (!parentId) {
        return result;
    }
    const parentNode = nodeInternals.get(parentId);
    const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);
    return calculateXYZPosition(parentNode, nodeInternals, {
        x: (result.x ?? 0) + parentNodePosition.x,
        y: (result.y ?? 0) + parentNodePosition.y,
        z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0,
    }, nodeOrigin);
}
function updateAbsoluteNodePositions(nodeInternals, nodeOrigin, parentNodes) {
    nodeInternals.forEach((node) => {
        const parentId = node.parentNode || node.parentId;
        if (parentId && !nodeInternals.has(parentId)) {
            throw new Error(`Parent node ${parentId} not found`);
        }
        if (parentId || parentNodes?.[node.id]) {
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
        const parentId = node.parentNode || node.parentId;
        if (parentId) {
            parentNodes[parentId] = true;
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
            const parentId = node.parentNode || node.parentId;
            const parentHit = !nodeIds.includes(node.id) && parentId && res.find((n) => n.id === parentId);
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
                    // macos and win set ctrlKey=true for pinch gesture on a trackpad
                    if (event.ctrlKey && zoomOnPinch) {
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
                    if (!isMacOs() && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
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
                    // we still want to enable pinch zooming even if preventScrolling is set to false
                    const invalidEvent = !preventScrolling && event.type === 'wheel' && !event.ctrlKey;
                    if (invalidEvent || isWrappedWithClass(event, noWheelClassName)) {
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
                if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && event.type === 'mousedown') {
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
    const parentId = updateItem.parentNode || updateItem.parentId;
    const parent = res.find((e) => e.id === parentId);
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
    const parentId = node.parentNode || node.parentId;
    if (!parentId) {
        return false;
    }
    const parentNode = nodeInternals.get(parentId);
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
        (!n.parentNode || n.parentId || !isParentSelected(n, nodeInternals)) &&
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
        parentNode: n.parentNode || n.parentId,
        parentId: n.parentNode || n.parentId,
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
    const parentId = node.parentNode || node.parentId;
    if (node.extent === 'parent' && !node.expandParent) {
        if (parentId && node.width && node.height) {
            const parent = nodeInternals.get(parentId);
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
    else if (node.extent && parentId && node.extent !== 'parent') {
        const parent = nodeInternals.get(parentId);
        const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
        currentExtent = [
            [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
            [node.extent[1][0] + parentX, node.extent[1][1] + parentY],
        ];
    }
    let parentPosition = { x: 0, y: 0 };
    if (parentId) {
        const parentNode = nodeInternals.get(parentId);
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
    const abortDrag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
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
                    abortDrag.current = false;
                    const pointerPos = getPointerPosition(event);
                    lastPos.current = pointerPos;
                    containerBounds.current = domNode?.getBoundingClientRect() || null;
                    mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
                })
                    .on('drag', (event) => {
                    const pointerPos = getPointerPosition(event);
                    const { autoPanOnNodeDrag, nodeDragThreshold } = store.getState();
                    if (event.sourceEvent.type === 'touchmove' && event.sourceEvent.touches.length > 1) {
                        abortDrag.current = true;
                    }
                    if (abortDrag.current) {
                        return;
                    }
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
                    if (!dragStarted.current || abortDrag.current) {
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
        const prevNodeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
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
            if (disableKeyboardA11y) {
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
            else if (isDraggable && selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
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
                if (prevNodeRef.current) {
                    resizeObserver?.unobserve(prevNodeRef.current);
                    prevNodeRef.current = null;
                }
            };
        }, []);
        (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
            if (nodeRef.current && !hidden) {
                const currNode = nodeRef.current;
                if (!initialized || !hasHandleBounds || prevNodeRef.current !== currNode) {
                    // At this point we always want to make sure that the node gets re-measured / re-initialized.
                    // We need to unobserve it first in case it is still observed
                    if (prevNodeRef.current) {
                        resizeObserver?.unobserve(prevNodeRef.current);
                    }
                    resizeObserver?.observe(currNode);
                    prevNodeRef.current = currNode;
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
    const EdgeWrapper = ({ id, className, type, data, onClick, onEdgeDoubleClick, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, hidden, sourceHandleId, targetHandleId, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, markerEnd, markerStart, rfId, ariaLabel, isFocusable, isReconnectable, pathOptions, interactionWidth, disableKeyboardA11y, }) => {
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
            onReconnectStart?.(event, edge, handleType);
            const _onReconnectEnd = (evt) => {
                setUpdating(false);
                onReconnectEnd?.(evt, edge, handleType);
            };
            const onConnectEdge = (connection) => onReconnect?.(edge, connection);
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
                onReconnectEnd: _onReconnectEnd,
            });
        };
        const onEdgeUpdaterSourceMouseDown = (event) => handleEdgeUpdater(event, true);
        const onEdgeUpdaterTargetMouseDown = (event) => handleEdgeUpdater(event, false);
        const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
        const onEdgeUpdaterMouseOut = () => setUpdateHover(false);
        const inactive = !elementsSelectable && !onClick;
        const onKeyDown = (event) => {
            if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && elementsSelectable) {
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
            isReconnectable && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
                (isReconnectable === 'source' || isReconnectable === true) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: reconnectRadius, onMouseDown: onEdgeUpdaterSourceMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "source" })),
                (isReconnectable === 'target' || isReconnectable === true) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: reconnectRadius, onMouseDown: onEdgeUpdaterTargetMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "target" }))))));
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
const EdgeRenderer = ({ defaultMarkerColor, onlyRenderVisibleElements, elevateEdgesOnSelect, rfId, edgeTypes, noPanClassName, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeClick, onEdgeDoubleClick, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, children, disableKeyboardA11y, }) => {
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
                const edgeReconnectable = edge.reconnectable || edge.updatable;
                const isReconnectable = typeof onReconnect !== 'undefined' &&
                    (edgeReconnectable || (edgesUpdatable && typeof edgeReconnectable === 'undefined'));
                if (!sourceHandle || !targetHandle) {
                    onError?.('008', errorMessages['error008'](sourceHandle, edge));
                    return null;
                }
                const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition);
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeComponent, { key: edge.id, id: edge.id, className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])([edge.className, noPanClassName]), type: edgeType, data: edge.data, selected: !!edge.selected, animated: !!edge.animated, hidden: !!edge.hidden, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, style: edge.style, source: edge.source, target: edge.target, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerEnd: edge.markerEnd, markerStart: edge.markerStart, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, elementsSelectable: elementsSelectable, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onClick: onEdgeClick, onEdgeDoubleClick: onEdgeDoubleClick, onReconnect: onReconnect, onReconnectStart: onReconnectStart, onReconnectEnd: onReconnectEnd, reconnectRadius: reconnectRadius, rfId: rfId, ariaLabel: edge.ariaLabel, isFocusable: isFocusable, isReconnectable: isReconnectable, pathOptions: 'pathOptions' in edge ? edge.pathOptions : undefined, interactionWidth: edge.interactionWidth, disableKeyboardA11y: disableKeyboardA11y }));
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

const GraphView = ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId, }) => {
    const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
    const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
    useOnInitHandler(onInit);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(FlowRenderer$1, { onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneContextMenu: onPaneContextMenu, onPaneScroll: onPaneScroll, deleteKeyCode: deleteKeyCode, selectionKeyCode: selectionKeyCode, selectionOnDrag: selectionOnDrag, selectionMode: selectionMode, onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, multiSelectionKeyCode: multiSelectionKeyCode, panActivationKeyCode: panActivationKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, elementsSelectable: elementsSelectable, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, panOnDrag: panOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, onSelectionContextMenu: onSelectionContextMenu, preventScrolling: preventScrolling, noDragClassName: noDragClassName, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, disableKeyboardA11y: disableKeyboardA11y },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Viewport, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(EdgeRenderer$1, { edgeTypes: edgeTypesWrapped, onEdgeClick: onEdgeClick, onEdgeDoubleClick: onEdgeDoubleClick, onlyRenderVisibleElements: onlyRenderVisibleElements, onEdgeContextMenu: onEdgeContextMenu, onEdgeMouseEnter: onEdgeMouseEnter, onEdgeMouseMove: onEdgeMouseMove, onEdgeMouseLeave: onEdgeMouseLeave, onReconnect: onReconnect, onReconnectStart: onReconnectStart, onReconnectEnd: onReconnectEnd, reconnectRadius: reconnectRadius, defaultMarkerColor: defaultMarkerColor, noPanClassName: noPanClassName, elevateEdgesOnSelect: !!elevateEdgesOnSelect, disableKeyboardA11y: disableKeyboardA11y, rfId: rfId },
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
            if (node?.hidden) {
                nodeInternals.set(node.id, {
                    ...node,
                    [internalsSymbol]: {
                        ...node[internalsSymbol],
                        // we need to reset the handle bounds when the node is hidden
                        // in order to force a new observation when the node is shown again
                        handleBounds: undefined,
                    },
                });
            }
            else if (node) {
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
const ReactFlow = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes = defaultNodeTypes, edgeTypes = defaultEdgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionMode = ConnectionMode.Strict, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = 'Backspace', selectionKeyCode = 'Shift', selectionOnDrag = false, selectionMode = SelectionMode.Full, panActivationKeyCode = 'Space', multiSelectionKeyCode = isMacOs() ? 'Meta' : 'Control', zoomActivationKeyCode = isMacOs() ? 'Meta' : 'Control', snapToGrid = false, snapGrid = initSnapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag = true, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = initNodeOrigin, edgesFocusable, edgesUpdatable, elementsSelectable, defaultViewport = initDefaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = '#b1b1b7', zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, children, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius = 10, edgeUpdaterRadius = 10, onNodesChange, onEdgesChange, noDragClassName = 'nodrag', noWheelClassName = 'nowheel', noPanClassName = 'nopan', fitView = false, fitViewOptions, connectOnClick = true, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect = true, elevateEdgesOnSelect = false, disableKeyboardA11y = false, autoPanOnConnect = true, autoPanOnNodeDrag = true, connectionRadius = 20, isValidConnection, onError, style, id, nodeDragThreshold, ...rest }, ref) => {
    const rfId = id || '1';
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ...rest, style: { ...style, ...wrapperStyle }, ref: ref, className: (0,classcat__WEBPACK_IMPORTED_MODULE_1__["default"])(['react-flow', className]), "data-testid": "rf__wrapper", id: id },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Wrapper, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(GraphView$1, { onInit: onInit, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, onNodeClick: onNodeClick, onEdgeClick: onEdgeClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, onNodeDoubleClick: onNodeDoubleClick, nodeTypes: nodeTypes, edgeTypes: edgeTypes, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, connectionLineComponent: connectionLineComponent, connectionLineContainerStyle: connectionLineContainerStyle, selectionKeyCode: selectionKeyCode, selectionOnDrag: selectionOnDrag, selectionMode: selectionMode, deleteKeyCode: deleteKeyCode, multiSelectionKeyCode: multiSelectionKeyCode, panActivationKeyCode: panActivationKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, onlyRenderVisibleElements: onlyRenderVisibleElements, selectNodesOnDrag: selectNodesOnDrag, defaultViewport: defaultViewport, translateExtent: translateExtent, minZoom: minZoom, maxZoom: maxZoom, preventScrolling: preventScrolling, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, panOnDrag: panOnDrag, onPaneClick: onPaneClick, onPaneMouseEnter: onPaneMouseEnter, onPaneMouseMove: onPaneMouseMove, onPaneMouseLeave: onPaneMouseLeave, onPaneScroll: onPaneScroll, onPaneContextMenu: onPaneContextMenu, onSelectionContextMenu: onSelectionContextMenu, onSelectionStart: onSelectionStart, onSelectionEnd: onSelectionEnd, onEdgeContextMenu: onEdgeContextMenu, onEdgeDoubleClick: onEdgeDoubleClick, onEdgeMouseEnter: onEdgeMouseEnter, onEdgeMouseMove: onEdgeMouseMove, onEdgeMouseLeave: onEdgeMouseLeave, onReconnect: onReconnect ?? onEdgeUpdate, onReconnectStart: onReconnectStart ?? onEdgeUpdateStart, onReconnectEnd: onReconnectEnd ?? onEdgeUpdateEnd, reconnectRadius: reconnectRadius ?? edgeUpdaterRadius, defaultMarkerColor: defaultMarkerColor, noDragClassName: noDragClassName, noWheelClassName: noWheelClassName, noPanClassName: noPanClassName, elevateEdgesOnSelect: elevateEdgesOnSelect, rfId: rfId, disableKeyboardA11y: disableKeyboardA11y, nodeOrigin: nodeOrigin, nodeExtent: nodeExtent }),
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

/***/ "./node_modules/zustand/esm/shallow.mjs":
/*!**********************************************!*\
  !*** ./node_modules/zustand/esm/shallow.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
    if (objA.size !== objB.size) return false;
    for (const [key, value] of objA) {
      if (!Object.is(value, objB.get(key))) {
        return false;
      }
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./assets/jsx/block-editor.jsx ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./assets/jsx/data.jsx");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components */ "./assets/jsx/components/index.jsx");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);





var _window$publishpressF = window.publishpressFutureBlockEditorConfig,
  actionsSelectOptions = _window$publishpressF.actionsSelectOptions,
  is12Hour = _window$publishpressF.is12Hour,
  timeFormat = _window$publishpressF.timeFormat,
  startOfWeek = _window$publishpressF.startOfWeek,
  strings = _window$publishpressF.strings,
  taxonomyName = _window$publishpressF.taxonomyName,
  postTypeDefaultConfig = _window$publishpressF.postTypeDefaultConfig,
  defaultDate = _window$publishpressF.defaultDate,
  statusesSelectOptions = _window$publishpressF.statusesSelectOptions,
  hideCalendarByDefault = _window$publishpressF.hideCalendarByDefault;
var storeName = 'publishpress-future/future-action';
var BlockEditorFutureActionPlugin = function BlockEditorFutureActionPlugin() {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {
    (0,_data__WEBPACK_IMPORTED_MODULE_0__.createStore)({
      name: storeName,
      defaultState: {
        postId: publishpressFutureBlockEditorConfig.postId,
        autoEnable: postTypeDefaultConfig.autoEnable,
        action: postTypeDefaultConfig.expireType,
        newStatus: postTypeDefaultConfig.newStatus,
        date: defaultDate,
        taxonomy: postTypeDefaultConfig.taxonomy,
        terms: postTypeDefaultConfig.terms
      }
    });
  }, []);
  return /*#__PURE__*/React.createElement(_components__WEBPACK_IMPORTED_MODULE_1__.FutureActionPanelBlockEditor, {
    postType: (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('core/editor').getCurrentPostType(),
    isCleanNewPost: (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('core/editor').isCleanNewPost(),
    actionsSelectOptions: actionsSelectOptions,
    statusesSelectOptions: statusesSelectOptions,
    is12Hour: is12Hour,
    timeFormat: timeFormat,
    startOfWeek: startOfWeek,
    storeName: storeName,
    strings: strings,
    taxonomyName: taxonomyName,
    postTypeDefaultConfig: postTypeDefaultConfig,
    hideCalendarByDefault: hideCalendarByDefault
  });
};
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_3__.registerPlugin)('publishpress-future-action', {
  render: BlockEditorFutureActionPlugin
});
})();

/******/ })()
;
//# sourceMappingURL=blockEditor.js.map