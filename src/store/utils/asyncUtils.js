import axios from 'axios';

// Default timeout for API requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} - The wrapped promise
 */
export const withTimeout = (promise, ms = DEFAULT_TIMEOUT) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    )
  ]);
};

/**
 * Creates an axios request with timeout and cancellation support
 * @param {Object} config - Axios request config
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Object} - Object containing the request promise and cancel function
 */
export const createRequest = (config, timeout = DEFAULT_TIMEOUT) => {
  const source = axios.CancelToken.source();
  
  const request = withTimeout(
    axios({
      ...config,
      cancelToken: source.token,
      withCredentials: true,
    }),
    timeout
  );

  return {
    request,
    cancel: (message = 'Request canceled') => source.cancel(message)
  };
};

/**
 * Creates a standard error handler for async thunks
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message if none is provided
 * @returns {string} - The error message
 */
export const handleAsyncError = (error, defaultMessage = 'An error occurred') => {
  if (axios.isCancel(error)) {
    return 'Request was canceled';
  }
  
  if (error.response) {
    // Server responded with a status code outside 2xx
    return error.response.data?.message || error.response.statusText || defaultMessage;
  } else if (error.request) {
    // Request was made but no response received
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request
    return error.message || defaultMessage;
  }
};

/**
 * Creates a reducer for async thunks
 * @param {Object} thunk - The async thunk
 * @param {string} key - The key for the loading state
 * @returns {Object} - Reducer object with pending/fulfilled/rejected handlers
 */
export const createAsyncReducer = (thunk, key) => ({
  [thunk.pending]: (state) => {
    state.loadingStates = state.loadingStates || {};
    state.loadingStates[key] = true;
    state.error = null;
  },
  [thunk.fulfilled]: (state, action) => {
    state.loadingStates = state.loadingStates || {};
    state.loadingStates[key] = false;
    state.error = null;
    state.lastUpdated = new Date().toISOString();
  },
  [thunk.rejected]: (state, action) => {
    state.loadingStates = state.loadingStates || {};
    state.loadingStates[key] = false;
    state.error = {
      message: action.payload || action.error?.message || 'An error occurred',
      action: key,
      timestamp: new Date().toISOString()
    };
  }
});

/**
 * Creates a matcher for a specific async thunk
 * @param {Object} thunk - The async thunk
 * @param {string} key - The key for the loading state
 * @returns {Function} - A matcher function for the thunk
 */
export const createThunkMatcher = (thunk, key) => (action) => {
  if (action.type.startsWith(thunk.typePrefix)) {
    const reducer = createAsyncReducer(thunk, key);
    
    if (action.type.endsWith('/pending')) {
      return reducer[thunk.pending.type];
    }
    if (action.type.endsWith('/fulfilled')) {
      return reducer[thunk.fulfilled.type];
    }
    if (action.type.endsWith('/rejected')) {
      return reducer[thunk.rejected.type];
    }
  }
  return undefined;
};
